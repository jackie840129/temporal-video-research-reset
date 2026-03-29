param(
  [string]$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
)

$ErrorActionPreference = "Stop"

$siteData = Join-Path $Root "site\data.js"
$readingList = Join-Path $Root "reading-list.md"
$output = Join-Path $Root "paper-library\manifest\paper-manifest.json"

if (-not (Test-Path $siteData)) {
  throw "Missing source file: $siteData"
}

$text = Get-Content $siteData -Raw
$paperPattern = '\{ id: "(?<id>[^"]+)", tier: "(?<tier>[^"]+)", year: (?<year>\d+), venue: "(?<venue>[^"]+)", title: "(?<title>[^"]+)", category: "(?<category>[^"]+)", focus: "(?<focus>[^"]+)", why: "(?<why>[^"]+)", link: "(?<link>[^"]+)", anchor: (?<anchor>true|false) \}'
$papers = @()

foreach ($match in [regex]::Matches($text, $paperPattern)) {
  $papers += [pscustomobject]@{
    id = $match.Groups["id"].Value
    title = $match.Groups["title"].Value
    venue = $match.Groups["venue"].Value
    year = [int]$match.Groups["year"].Value
    tier = $match.Groups["tier"].Value
    category = $match.Groups["category"].Value
    focus = $match.Groups["focus"].Value
    why = $match.Groups["why"].Value
    link = $match.Groups["link"].Value
    anchor = [bool]::Parse($match.Groups["anchor"].Value)
  }
}

$rankById = @{}
if (Test-Path $readingList) {
  $lines = Get-Content $readingList
  foreach ($line in $lines) {
    if ($line -match '^\s*(\d+)\.\s+`(?<title>[^`]+)`\s+\((?<venue>[^)]+)\)') {
      $rank = [int]$Matches[1]
      $title = $Matches["title"]
      foreach ($paper in $papers) {
        if ($paper.title.StartsWith($title)) {
          $rankById[$paper.id] = $rank
        }
      }
    }
  }
}

foreach ($paper in $papers) {
  if (-not $rankById.ContainsKey($paper.id)) {
    $rankById[$paper.id] = ($rankById.Count + 1)
  }
  $paper | Add-Member -NotePropertyName rank -NotePropertyValue $rankById[$paper.id]
  $paper | Add-Member -NotePropertyName pdf_file -NotePropertyValue ("pdfs/{0}.pdf" -f $paper.id)
  $paper | Add-Member -NotePropertyName summary_file -NotePropertyValue ("summaries/{0}.md" -f $paper.id)
  $paper | Add-Member -NotePropertyName figure_dir -NotePropertyValue ("figures/{0}" -f $paper.id)
  $paper | Add-Member -NotePropertyName download_status -NotePropertyValue "pending"
}

$manifest = [ordered]@{
  schema_version = 1
  generated_at = (Get-Date).ToString("s")
  topic_focus = "Temporal hallucination in video understanding"
  source_files = @("site/data.js", "reading-list.md", "sources.md")
  papers = $papers | Sort-Object rank
}

$manifest | ConvertTo-Json -Depth 8 | Set-Content -Encoding UTF8 $output
Write-Host "Manifest written to $output"
