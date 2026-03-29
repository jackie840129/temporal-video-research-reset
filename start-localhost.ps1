param(
  [int]$Port = 8124
)

$ErrorActionPreference = "Stop"

$siteRoot = Join-Path $PSScriptRoot "site"
$projectRoot = $PSScriptRoot
$recordsRoot = Join-Path $projectRoot "records"

if (-not (Test-Path $siteRoot)) {
  Write-Error "Site folder not found: $siteRoot"
  exit 1
}

$contentTypes = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".ico"  = "image/x-icon"
  ".png"  = "image/png"
  ".pdf"  = "application/pdf"
}

$recordMap = @{
  "/api/records/paper-records" = "paper-records.json"
  "/api/records/paper-inbox"   = "paper-inbox.json"
  "/api/records/topic-focus"   = "topic-focus.json"
  "/api/records/update-log"    = "update-log.json"
}

function Write-Utf8Text {
  param([string]$Path, [string]$Text)
  [System.IO.File]::WriteAllText($Path, $Text, [System.Text.Encoding]::UTF8)
}

function Read-Utf8Text {
  param([string]$Path)
  [System.IO.File]::ReadAllText($Path, [System.Text.Encoding]::UTF8)
}

function ConvertTo-Bytes {
  param($Value)
  [System.Text.Encoding]::UTF8.GetBytes(($Value | ConvertTo-Json -Depth 12))
}

function Send-HttpResponse {
  param(
    [Parameter(Mandatory = $true)]$Client,
    [int]$StatusCode,
    [string]$StatusText,
    [byte[]]$Body,
    [string]$ContentType = "text/plain; charset=utf-8"
  )

  $stream = $Client.GetStream()
  $header = @(
    "HTTP/1.1 $StatusCode $StatusText",
    "Content-Type: $ContentType",
    "Content-Length: $($Body.Length)",
    "Access-Control-Allow-Origin: *",
    "Access-Control-Allow-Headers: Content-Type",
    "Access-Control-Allow-Methods: GET, POST, OPTIONS",
    "Cache-Control: no-store, no-cache, must-revalidate, max-age=0",
    "Pragma: no-cache",
    "Expires: 0",
    "Connection: close",
    "",
    ""
  ) -join "`r`n"

  $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
  $stream.Write($headerBytes, 0, $headerBytes.Length)
  if ($Body.Length -gt 0) {
    $stream.Write($Body, 0, $Body.Length)
  }
  $stream.Flush()
  $stream.Dispose()
  $Client.Close()
}

function Read-HttpRequest {
  param($Client)

  $Client.ReceiveTimeout = 5000
  $stream = $Client.GetStream()
  $buffer = New-Object byte[] 8192
  $builder = New-Object System.Text.StringBuilder

  while ($true) {
    $read = $stream.Read($buffer, 0, $buffer.Length)
    if ($read -le 0) { break }
    $chunk = [System.Text.Encoding]::ASCII.GetString($buffer, 0, $read)
    [void]$builder.Append($chunk)
    if ($builder.ToString().Contains("`r`n`r`n")) { break }
  }

  $raw = $builder.ToString()
  if ([string]::IsNullOrWhiteSpace($raw)) {
    return $null
  }

  $parts = $raw -split "`r`n`r`n", 2
  $headerText = $parts[0]
  $bodyText = if ($parts.Length -gt 1) { $parts[1] } else { "" }
  $lines = $headerText -split "`r`n"
  if (-not $lines.Length) { return $null }

  $requestLine = $lines[0].Split(" ")
  $method = if ($requestLine.Length -gt 0) { $requestLine[0].ToUpperInvariant() } else { "GET" }
  $path = if ($requestLine.Length -gt 1) { $requestLine[1] } else { "/" }
  $cleanPath = $path.Split("?")[0]
  $headers = @{}

  foreach ($line in $lines[1..($lines.Length - 1)]) {
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    $idx = $line.IndexOf(":")
    if ($idx -gt 0) {
      $name = $line.Substring(0, $idx).Trim().ToLowerInvariant()
      $value = $line.Substring($idx + 1).Trim()
      $headers[$name] = $value
    }
  }

  $contentLength = 0
  if ($headers.ContainsKey("content-length")) {
    [void][int]::TryParse($headers["content-length"], [ref]$contentLength)
  }

  if ($contentLength -gt $bodyText.Length) {
    $remaining = $contentLength - $bodyText.Length
    $bodyBuffer = New-Object byte[] $remaining
    $bodyRead = $stream.Read($bodyBuffer, 0, $remaining)
    if ($bodyRead -gt 0) {
      $bodyText += [System.Text.Encoding]::UTF8.GetString($bodyBuffer, 0, $bodyRead)
    }
  }

  return @{
    method = $method
    path = $cleanPath
    headers = $headers
    body = $bodyText
  }
}

$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Parse("127.0.0.1"), $Port)

try {
  $listener.Start()
} catch {
  Write-Error "Failed to start listener on http://127.0.0.1:$Port/"
  exit 1
}

Write-Host "Temporal Video Research Navigator"
Write-Host "Serving $siteRoot"
Write-Host "API root http://127.0.0.1:$Port/api/"
Write-Host "Open http://127.0.0.1:$Port/ in your browser"
Write-Host "Press Ctrl+C to stop"

while ($true) {
  try {
    $client = $listener.AcceptTcpClient()
    $request = Read-HttpRequest -Client $client
    if ($null -eq $request) {
      $client.Close()
      continue
    }

    if ($request.method -eq "OPTIONS") {
      Send-HttpResponse -Client $client -StatusCode 204 -StatusText "No Content" -Body ([byte[]]::new(0))
      continue
    }

    if ($request.path -eq "/api/health") {
      Send-HttpResponse -Client $client -StatusCode 200 -StatusText "OK" -Body (ConvertTo-Bytes @{
        ok = $true
        site_root = $siteRoot
        records_root = $recordsRoot
        timestamp = (Get-Date).ToString("s")
      }) -ContentType "application/json; charset=utf-8"
      continue
    }

    if ($recordMap.ContainsKey($request.path)) {
      $targetPath = Join-Path $recordsRoot $recordMap[$request.path]
      if ($request.method -eq "GET") {
        $bytes = [System.Text.Encoding]::UTF8.GetBytes((Read-Utf8Text -Path $targetPath))
        Send-HttpResponse -Client $client -StatusCode 200 -StatusText "OK" -Body $bytes -ContentType "application/json; charset=utf-8"
        continue
      }

      if ($request.method -eq "POST") {
        try {
          $null = $request.body | ConvertFrom-Json
          Write-Utf8Text -Path $targetPath -Text $request.body
          Send-HttpResponse -Client $client -StatusCode 200 -StatusText "OK" -Body (ConvertTo-Bytes @{
            ok = $true
            path = $recordMap[$request.path]
            updated_at = (Get-Date).ToString("s")
          }) -ContentType "application/json; charset=utf-8"
        } catch {
          Send-HttpResponse -Client $client -StatusCode 400 -StatusText "Bad Request" -Body (ConvertTo-Bytes @{
            ok = $false
            error = "Invalid JSON body"
          }) -ContentType "application/json; charset=utf-8"
        }
        continue
      }

      Send-HttpResponse -Client $client -StatusCode 405 -StatusText "Method Not Allowed" -Body (ConvertTo-Bytes @{
        ok = $false
        error = "Method not allowed"
      }) -ContentType "application/json; charset=utf-8"
      continue
    }

    $path = $request.path
    if ($path -eq "/") {
      $path = "/index.html"
    }

    $safePath = $path.TrimStart("/").Replace("/", [System.IO.Path]::DirectorySeparatorChar)
    $baseRoot = $siteRoot
    if ($path.StartsWith("/paper-library/", [System.StringComparison]::OrdinalIgnoreCase)) {
      $baseRoot = $projectRoot
    }

    $fullPath = [System.IO.Path]::GetFullPath((Join-Path $baseRoot $safePath))
    $baseFullPath = [System.IO.Path]::GetFullPath($baseRoot)
    if (-not $fullPath.StartsWith($baseFullPath, [System.StringComparison]::OrdinalIgnoreCase)) {
      $bytes = [System.Text.Encoding]::UTF8.GetBytes("Forbidden")
      Send-HttpResponse -Client $client -StatusCode 403 -StatusText "Forbidden" -Body $bytes
      continue
    }

    if ((Test-Path $fullPath) -and -not (Get-Item $fullPath).PSIsContainer) {
      $extension = [System.IO.Path]::GetExtension($fullPath).ToLowerInvariant()
      $contentType = if ($contentTypes.ContainsKey($extension)) { $contentTypes[$extension] } else { "application/octet-stream" }
      $bytes = [System.IO.File]::ReadAllBytes($fullPath)
      Send-HttpResponse -Client $client -StatusCode 200 -StatusText "OK" -Body $bytes -ContentType $contentType
    } else {
      $bytes = [System.Text.Encoding]::UTF8.GetBytes("Not Found")
      Send-HttpResponse -Client $client -StatusCode 404 -StatusText "Not Found" -Body $bytes
    }
  } catch {
    Write-Warning $_.Exception.Message
  }
}
