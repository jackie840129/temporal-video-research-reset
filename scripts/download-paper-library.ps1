param(
  [string]$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path,
  [switch]$WhatIf
)

$ErrorActionPreference = "Stop"

$projectRoot = $Root
$paperLibrary = Join-Path $projectRoot "paper-library"
$manifestPath = Join-Path $paperLibrary "manifest\paper-manifest.json"
$pdfDir = Join-Path $paperLibrary "pdfs"
$logDir = Join-Path $paperLibrary "logs"
$manualDir = Join-Path $paperLibrary "manual"
$reportPath = Join-Path $logDir "download-report.json"
$missingPath = Join-Path $logDir "missing-pdfs.txt"

function Ensure-Directory {
  param([string]$Path)
  if (-not (Test-Path $Path)) {
    New-Item -ItemType Directory -Path $Path | Out-Null
  }
}

function Invoke-PageRequest {
  param([string]$Url)
  $headers = @{ "User-Agent" = "Mozilla/5.0" }
  return Invoke-WebRequest -Uri $Url -Headers $headers
}

function Download-PdfFile {
  param(
    [string]$Url,
    [string]$OutFile
  )
  $headers = @{ "User-Agent" = "Mozilla/5.0" }
  return Invoke-WebRequest -Uri $Url -Headers $headers -OutFile $OutFile
}

function Resolve-PdfUrlFromPage {
  param([string]$PageUrl)
  try {
    $response = Invoke-PageRequest -Url $PageUrl
    $matches = [regex]::Matches($response.Content, 'href="(?<href>[^"]+\.pdf[^"]*)"')
    foreach ($match in $matches) {
      $href = $match.Groups["href"].Value
      if ($href -match '\.pdf($|\?)') {
        if ($href.StartsWith("http")) { return $href }
        if ($href.StartsWith("/")) {
          $base = ([uri]$PageUrl).GetLeftPart("Authority")
          return "$base$href"
        }
      }
    }
  }
  catch {
    return $null
  }
  return $null
}

function Resolve-PdfTarget {
  param([string]$SourceUrl)
  if ($SourceUrl -match '^https://arxiv\.org/abs/(?<id>[^?#/]+)') {
    return "https://arxiv.org/pdf/$($Matches.id).pdf"
  }
  if ($SourceUrl -match '^https://openreview\.net/forum\?id=(?<id>[^&#]+)') {
    return "https://openreview.net/pdf?id=$($Matches.id)"
  }
  if ($SourceUrl -match '^https://openaccess\.thecvf\.com/content/.+?/html/.+?_paper\.html$') {
    return ($SourceUrl -replace '/html/', '/papers/' -replace '\.html$', '.pdf')
  }
  return $null
}

function Format-MissingLine {
  param(
    [string]$Id,
    [string]$Title,
    [string]$Status,
    [string]$Note
  )
  return "{0}`t{1}`t{2}`t{3}" -f $Id, $Status, $Title, $Note
}

Ensure-Directory $pdfDir
Ensure-Directory $logDir
Ensure-Directory $manualDir

if (-not (Test-Path $manifestPath)) {
  throw "Manifest not found: $manifestPath"
}

$manifest = Get-Content $manifestPath -Raw | ConvertFrom-Json
$results = @()
$missing = New-Object System.Collections.Generic.List[object]

foreach ($paper in $manifest.papers) {
  $pdfFile = Join-Path $paperLibrary $paper.pdf_file
  $resolvedUrl = Resolve-PdfTarget -SourceUrl $paper.link
  $status = "missing"
  $note = ""

  if (Test-Path $pdfFile) {
    $status = "present"
    $note = "already on disk"
  }
  elseif ($null -eq $resolvedUrl) {
    $status = "manual"
    $note = "could not resolve a PDF URL from the source page"
    $missing.Add([pscustomobject]@{ id = $paper.id; title = $paper.title; status = $status; note = $note })
  }
  elseif ($WhatIf) {
    $status = "preview"
    $note = $resolvedUrl
  }
  else {
    try {
      Download-PdfFile -Url $resolvedUrl -OutFile $pdfFile
      $status = "downloaded"
      $note = $resolvedUrl
    }
    catch {
      $status = "failed"
      $note = $_.Exception.Message
      $missing.Add([pscustomobject]@{ id = $paper.id; title = $paper.title; status = $status; note = $note })
    }
  }

  $results += [pscustomobject]@{
    id = $paper.id
    title = $paper.title
    status = $status
    note = $note
    pdf_file = $paper.pdf_file
    pdf_url = $resolvedUrl
  }
}

$report = [pscustomobject]@{
  generated_at = (Get-Date).ToString("s")
  root = $projectRoot
  papers = $results
}

$report | ConvertTo-Json -Depth 6 | Set-Content -Encoding UTF8 $reportPath
$missingLines = @($missing | ForEach-Object { Format-MissingLine -Id $_.id -Title $_.title -Status $_.status -Note $_.note })
Set-Content -Encoding UTF8 -Path $missingPath -Value $missingLines

Write-Host "Download report written to $reportPath"
Write-Host "Missing list written to $missingPath"
