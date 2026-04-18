param(
  [string]$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
)

$ErrorActionPreference = "Stop"

$manifestPath = Join-Path $Root "paper-library\manifest\paper-manifest.json"
$insightsPath = Join-Path $Root "site\paper-insights.json"
$figureRoot = Join-Path $Root "site\assets\paper-figures"

function Get-JsonFile {
  param([string]$Path)
  if (-not (Test-Path $Path)) { return $null }
  return Get-Content $Path -Raw | ConvertFrom-Json
}

function Get-CategoryProblem {
  param([string]$Category)
  switch ($Category) {
    "evaluation" { return "Current evaluation often overstates temporal ability or hides the exact failure mode." }
    "grounding" { return "Models may answer what happened but still fail to localize when it happened." }
    "frame_selection" { return "The core bottleneck may be which frames the model sees, not only how many frames it can afford." }
    "longvideo" { return "Long videos create memory and compression bottlenecks even when the right evidence is already known." }
    "reasoning" { return "Compositional temporal reasoning is often weak even when benchmark scores improve." }
    "ordering" { return "Models still confuse event order, transitions, and time-sensitive relationships." }
    default { return "Temporal understanding remains hard to measure and easy to shortcut." }
  }
}

function Get-CategoryMethod {
  param($Paper)
  switch ($Paper.category) {
    "evaluation" { return "Frames the paper around benchmark design, failure diagnosis, or robustness measurement rather than only raw score gain." }
    "grounding" { return "Focuses on time binding, timestamp prediction, grounding, or span verification." }
    "frame_selection" { return "Focuses on adaptive sampling, keyframe retrieval, redundancy control, or budget-aware evidence coverage." }
    "longvideo" { return "Focuses on memory, compression, or long-context handling for video evidence." }
    "reasoning" { return "Focuses on explicit structure, evidence chains, or multi-step temporal reasoning." }
    "ordering" { return "Focuses on sequence sensitivity, temporal alignment, or order-aware representation learning." }
    default { return "Focuses on temporal video understanding with a task setup matched to its main claim." }
  }
}

function Get-CategoryWhy {
  param($Paper)
  switch ($Paper.category) {
    "evaluation" { return "Useful for separating real temporal understanding from benchmark-specific shortcuts or hallucination-shaped errors." }
    "grounding" { return "Useful when the key question is whether the model can ground a temporal claim in the right moment." }
    "frame_selection" { return "Useful when the practical question is which sparse evidence a small or budget-limited model should actually see." }
    "longvideo" { return "Useful for testing whether failure comes from memory or compression limits rather than weak reasoning alone." }
    "reasoning" { return "Useful for checking whether the model can maintain grounded multi-step temporal reasoning." }
    "ordering" { return "Useful for studying temporal hallucination as order confusion, transition error, or unsupported sequence claims." }
    default { return "Useful for mapping where temporal hallucination and temporal understanding start to diverge." }
  }
}

function Get-KeyPoints {
  param($Paper)
  return @(
    "Main focus: $($Paper.focus).",
    "Category: $($Paper.category) with $($Paper.venue) $($Paper.year) context.",
    "Best used as a $($Paper.tier)-tier reference for $($Paper.why.ToLowerInvariant())"
  )
}

function Get-NextActions {
  param($Paper)
  switch ($Paper.category) {
    "evaluation" { return @("Check which failure mode is actually exposed.", "Compare with one method paper to see whether the gain is real.", "Use it to refine your evaluation criteria.") }
    "grounding" { return @("Check whether the model grounds the answer in the right moment.", "Compare first-pass accuracy versus consistency.", "Ask what evidence would falsify the claim.") }
    "frame_selection" { return @("Check how the selector balances relevance versus coverage.", "Compare against uniform sampling at the same frame budget.", "Ask whether the method is query-guided, diversity-guided, or both.") }
    "longvideo" { return @("Check whether memory or compression is the real bottleneck.", "Compare dense context against compressed context.", "Use it to refine long-video systems assumptions.") }
    "reasoning" { return @("Check whether the reasoning chain is grounded.", "Compare with a benchmark paper to avoid score-only reading.", "Ask whether the structure actually improves faithfulness.") }
    "ordering" { return @("Check the exact temporal relation the paper tries to fix.", "Compare with a benchmark exposing order confusion.", "Ask whether the method improves temporal faithfulness or only answer style.") }
    default { return @("Identify the main claim.", "Find the likely failure mode.", "Compare it against one benchmark and one method paper.") }
  }
}

$manifest = Get-JsonFile -Path $manifestPath
if ($null -eq $manifest) {
  throw "Manifest not found: $manifestPath"
}

$existing = Get-JsonFile -Path $insightsPath
$existingMap = @{}
if ($existing -and $existing.papers) {
  foreach ($item in $existing.papers) {
    $existingMap[$item.id] = $item
  }
}

$papers = foreach ($paper in $manifest.papers) {
  $figurePath = "./assets/paper-figures/$($paper.id)/preview.png"
  $hasFigure = Test-Path (Join-Path $figureRoot "$($paper.id)\preview.png")
  if ($existingMap.ContainsKey($paper.id)) {
    $base = $existingMap[$paper.id]
    [pscustomobject]@{
      id = $paper.id
      title = $paper.title
      venue = $paper.venue
      year = $paper.year
      quick_takeaway = if ($base.quick_takeaway) { $base.quick_takeaway } else { $paper.why }
      problem = if ($base.problem) { $base.problem } else { Get-CategoryProblem -Category $paper.category }
      method_or_setup = if ($base.method_or_setup) { $base.method_or_setup } else { Get-CategoryMethod -Paper $paper }
      why_it_matters = if ($base.why_it_matters) { $base.why_it_matters } else { Get-CategoryWhy -Paper $paper }
      key_points = if ($base.key_points -and $base.key_points.Count -gt 0) { @($base.key_points) } else { Get-KeyPoints -Paper $paper }
      next_after_summary = if ($base.next_after_summary -and $base.next_after_summary.Count -gt 0) { @($base.next_after_summary) } else { Get-NextActions -Paper $paper }
      figure = if ($hasFigure) { $figurePath } elseif ($base.figure) { $base.figure } else { "" }
      figure_caption = if ($hasFigure) { "Paper first-page preview for quick scanning." } elseif ($base.figure_caption) { $base.figure_caption } else { "" }
    }
  } else {
    [pscustomobject]@{
      id = $paper.id
      title = $paper.title
      venue = $paper.venue
      year = $paper.year
      quick_takeaway = $paper.why
      problem = Get-CategoryProblem -Category $paper.category
      method_or_setup = Get-CategoryMethod -Paper $paper
      why_it_matters = Get-CategoryWhy -Paper $paper
      key_points = Get-KeyPoints -Paper $paper
      next_after_summary = Get-NextActions -Paper $paper
      figure = if ($hasFigure) { $figurePath } else { "" }
      figure_caption = if ($hasFigure) { "Paper first-page preview for quick scanning." } else { "" }
    }
  }
}

$output = [pscustomobject]@{
  schema_version = 1
  generated_at = (Get-Date).ToString("s")
  topic_focus = "Temporal hallucination in video understanding"
  papers = @($papers)
}

$output | ConvertTo-Json -Depth 8 | Set-Content -Encoding UTF8 $insightsPath
Write-Host "Paper insights written to $insightsPath"
