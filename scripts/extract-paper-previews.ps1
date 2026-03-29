param(
  [string]$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path,
  [string]$PdfToPpm = "",
  [string]$PdfInfo = "",
  [int]$Page = 1
)

$ErrorActionPreference = "Stop"

$manifestPath = Join-Path $Root "paper-library\manifest\paper-manifest.json"
$pdfRoot = Join-Path $Root "paper-library\pdfs"
$outRoot = Join-Path $Root "site\assets\paper-figures"
$previewManifestPath = Join-Path $outRoot "manifest.json"

if (-not $PdfToPpm) {
  $cmd = Get-Command pdftoppm.exe -ErrorAction SilentlyContinue
  if ($cmd) {
    $PdfToPpm = $cmd.Source
  }
}

if (-not $PdfToPpm) {
  $fallback = Get-ChildItem "$env:USERPROFILE\tools\poppler" -Recurse -Filter pdftoppm.exe -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($fallback) {
    $PdfToPpm = $fallback.FullName
  }
}

if (-not $PdfInfo) {
  $infoCmd = Get-Command pdfinfo.exe -ErrorAction SilentlyContinue
  if ($infoCmd) {
    $PdfInfo = $infoCmd.Source
  }
}

if (-not $PdfInfo) {
  $infoFallback = Get-ChildItem "$env:USERPROFILE\tools\poppler" -Recurse -Filter pdfinfo.exe -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($infoFallback) {
    $PdfInfo = $infoFallback.FullName
  }
}

if (-not (Test-Path $PdfInfo)) {
  $siblingPdfInfo = Join-Path (Split-Path $PdfToPpm -Parent) "pdfinfo.exe"
  if (Test-Path $siblingPdfInfo) {
    $PdfInfo = $siblingPdfInfo
  }
}

if (-not (Test-Path $PdfToPpm)) {
  throw "pdftoppm.exe not found. Pass -PdfToPpm explicitly or install Poppler."
}

if (-not (Test-Path $PdfInfo)) {
  throw "pdfinfo.exe not found. Pass -PdfInfo explicitly or install Poppler."
}

if (-not (Test-Path $manifestPath)) {
  throw "Manifest not found: $manifestPath"
}

New-Item -ItemType Directory -Force -Path $outRoot | Out-Null

$manifest = Get-Content $manifestPath -Raw | ConvertFrom-Json
$previewManifest = @{}

foreach ($paper in $manifest.papers) {
  $pdfPath = Join-Path $pdfRoot "$($paper.id).pdf"
  if (-not (Test-Path $pdfPath)) {
    continue
  }
  $paperOutDir = Join-Path $outRoot $paper.id
  New-Item -ItemType Directory -Force -Path $paperOutDir | Out-Null
  Get-ChildItem -Path $paperOutDir -Filter "preview*.png" -ErrorAction SilentlyContinue | Remove-Item -Force

  $quotedPdfInfo = '"' + $PdfInfo + '"'
  $quotedPdfPath = '"' + $pdfPath + '"'
  $pdfInfoText = (cmd.exe /c "$quotedPdfInfo $quotedPdfPath 2>&1") | Out-String
  $match = [regex]::Match($pdfInfoText, "Pages:\s+(?<count>\d+)")
  if (-not $match.Success) {
    throw "Could not determine page count for $pdfPath"
  }

  $pageCount = [int]$match.Groups["count"].Value
  foreach ($pageNumber in $Page..$pageCount) {
    $outputName = if ($pageNumber -eq 1) { "preview" } else { "preview-$pageNumber" }
    $outputBase = Join-Path $paperOutDir $outputName
    & $PdfToPpm -png -f $pageNumber -l $pageNumber -singlefile $pdfPath $outputBase | Out-Null
  }
  $previewManifest[$paper.id] = @{
    page_count = $pageCount
    first_page = $Page
  }
}

$previewManifest | ConvertTo-Json -Depth 4 | Set-Content -Encoding UTF8 $previewManifestPath
Write-Host "Preview images written to $outRoot"
