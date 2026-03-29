$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$manifestPath = Join-Path $root "paper-library\manifest\paper-manifest.json"
$insightsPath = Join-Path $root "site\paper-insights.json"
$outputPath = Join-Path $root "site\paper-lessons.json"
$summariesDir = Join-Path $root "paper-library\summaries"

$manifest = Get-Content $manifestPath -Raw | ConvertFrom-Json
$insightsRaw = Get-Content $insightsPath -Raw | ConvertFrom-Json
$insightMap = @{}
foreach ($item in $insightsRaw.papers) {
  $insightMap[$item.id] = $item
}

function Clean-Text {
  param([string]$Text)
  if ([string]::IsNullOrWhiteSpace($Text)) { return "" }
  $value = $Text -replace "`r", ""
  $value = $value.Trim()
  $value = [regex]::Replace($value, "\n{2,}", "`n")
  $value = [regex]::Replace($value, "[ \t]{2,}", " ")
  return $value.Trim()
}

function To-One-Line {
  param([string]$Text)
  $value = Clean-Text $Text
  if (-not $value) { return "" }
  return ([regex]::Replace($value, "\s*\n\s*", " ")).Trim()
}

function Split-Bullets {
  param([string]$Text)
  $value = Clean-Text $Text
  if (-not $value) { return @() }
  $items = @()
  foreach ($line in ($value -split "`n")) {
    if ($line -match '^\s*-\s+(.*)$') {
      $items += (To-One-Line $Matches[1])
    }
  }
  return @($items | Where-Object { $_ })
}

function Parse-SummaryFile {
  param([string]$Path)
  $lines = Get-Content $Path
  $meta = @{}
  $sections = @{}
  $sectionNotes = @{}
  $currentH2 = ""
  $currentH3 = ""
  $title = ""
  foreach ($line in $lines) {
    if ($line -match '^#\s+(.+)$') {
      $title = $Matches[1].Trim()
      $currentH2 = ""
      $currentH3 = ""
      continue
    }
    if ($line -match '^-\s+([^:]+):\s*(.*)$' -and -not $currentH2) {
      $meta[$Matches[1].Trim()] = $Matches[2].Trim()
      continue
    }
    if ($line -match '^##\s+(.+)$') {
      $currentH2 = $Matches[1].Trim()
      $currentH3 = ""
      if (-not $sections.ContainsKey($currentH2)) {
        $sections[$currentH2] = New-Object System.Collections.Generic.List[string]
      }
      continue
    }
    if ($line -match '^###\s+(.+)$') {
      $currentH3 = $Matches[1].Trim()
      if (-not $sectionNotes.ContainsKey($currentH3)) {
        $sectionNotes[$currentH3] = New-Object System.Collections.Generic.List[string]
      }
      continue
    }
    if ($currentH3) {
      $sectionNotes[$currentH3].Add($line)
    } elseif ($currentH2) {
      $sections[$currentH2].Add($line)
    }
  }

  $normalizedSections = @{}
  foreach ($key in $sections.Keys) {
    $normalizedSections[$key] = Clean-Text (($sections[$key] -join "`n"))
  }
  $normalizedNotes = @{}
  foreach ($key in $sectionNotes.Keys) {
    $normalizedNotes[$key] = Clean-Text (($sectionNotes[$key] -join "`n"))
  }

  return @{
    title = $title
    meta = $meta
    sections = $normalizedSections
    notes = $normalizedNotes
  }
}

function Category-Core-Insight {
  param($Paper)
  switch ($Paper.category) {
    "evaluation" { return "Read this paper as a benchmark-design lesson: before trusting any score gain, ask whether the benchmark really forces temporal evidence instead of static shortcuts or language priors." }
    "localization" { return "The core insight is that understanding is incomplete until the answer is anchored to the right time span; fluent language is not enough." }
    "longvideo" { return "The real lesson is that many long-video failures begin before reasoning: if the system cannot find or keep the right evidence, stronger reasoning will not rescue it." }
    "causal" { return "This paper matters because it treats temporal reasoning as a structured relation problem instead of hoping a large model will infer event dependencies implicitly." }
    "ordering" { return "The paper sharpens an important point: many apparent reasoning failures are actually failures to represent order, transition, or duration in a stable way." }
    default { return "The useful takeaway is not only the final score but the way the paper turns a vague temporal ability into a concrete and testable research claim." }
  }
}

function Category-Reader-Value {
  param($Paper)
  switch ($Paper.category) {
    "evaluation" { return "Use this paper to calibrate what should count as a real temporal improvement before you read stronger method papers." }
    "localization" { return "Use this paper to sharpen your taste for temporal grounding: not just whether the answer sounds right, but whether it is tied to the correct span." }
    "longvideo" { return "This paper helps you separate the long-video pipeline into search, compression, memory, and reasoning, which makes later papers easier to place." }
    "causal" { return "This paper is useful when you want to distinguish event-relation understanding from generic video-language fluency." }
    "ordering" { return "This paper helps you separate order confusion from broader reasoning failure, which is valuable when analyzing temporal hallucination." }
    default { return "This paper gives you a cleaner mental model for the specific temporal problem the authors want to isolate." }
  }
}

function Category-Method-Lens {
  param($Paper)
  switch ($Paper.category) {
    "evaluation" { return "For benchmark papers, ask which shortcuts are blocked and which temporal evidence is made unavoidable." }
    "localization" { return "For localization papers, watch how the model binds text, video segments, and time boundaries together." }
    "longvideo" { return "For long-video papers, focus first on the evidence pipeline: scanning, retrieval, compression, and memory." }
    "causal" { return "For causal and compositional papers, track how the method preserves event relations, states, or evidence chains." }
    "ordering" { return "For ordering papers, check whether sequence, transition, and duration are represented explicitly or only implied." }
    default { return "Identify the exact temporal bottleneck the design is supposed to fix before getting lost in implementation detail." }
  }
}

function Category-Experiment-Lens {
  param($Paper)
  switch ($Paper.category) {
    "evaluation" { return "The key question is not leaderboard position but whether the benchmark exposes the intended temporal failure mode." }
    "localization" { return "The most important result is whether the answer lands on the right temporal span instead of merely sounding more complete." }
    "longvideo" { return "Ask whether the gain comes from better evidence search and retention or simply from more context budget." }
    "causal" { return "Check whether the experiments really show better relation understanding rather than a broad gain from extra supervision." }
    "ordering" { return "Read the result tables through sequence-sensitive cases: if order and transition cases do not improve, temporal reasoning is still weak." }
    default { return "Use the experiments to test the paper's main claim directly, not to admire a large collection of secondary gains." }
  }
}

function Category-Thinking-Points {
  param($Paper, [string]$Unresolved)
  $items = @(
    "If the authors' central assumption were removed, how much of the conclusion would still survive?",
    "Which layer of temporal understanding is this paper really improving: perception, search, grounding, or reasoning?"
  )
  if ($Unresolved) {
    $items += "The paper itself still leaves this unresolved: $Unresolved"
  }
  switch ($Paper.category) {
    "evaluation" { $items += "Would improvement here transfer to more open-ended video reasoning, or is it tightly coupled to the benchmark design?" }
    "localization" { $items += "If localization becomes more accurate, does answer faithfulness improve too, or only the metric?" }
    "longvideo" { $items += "If evidence search fails, is there any realistic way for downstream reasoning to recover?" }
    "causal" { $items += "Is the structural design helping the model reason better, or mainly making the supervision easier to learn?" }
    "ordering" { $items += "When the model fails on order-sensitive cases, is the failure visual, conceptual, or both?" }
  }
  return $items
}

function New-ComparisonMap {
  param($Papers)
  $map = @{}
  $groups = $Papers | Group-Object category
  foreach ($group in $groups) {
    $ordered = $group.Group | Sort-Object @{ Expression = { [int]$_.rank } }, @{ Expression = { [int]$_.year } }
    for ($i = 0; $i -lt $ordered.Count; $i++) {
      $paper = $ordered[$i]
      $neighbor = if ($ordered.Count -gt 1) {
        if ($i -lt ($ordered.Count - 1)) { $ordered[$i + 1] } else { $ordered[0] }
      } else {
        $null
      }
      $map[$paper.id] = $neighbor
    }
  }
  return $map
}

$comparisonMap = New-ComparisonMap $manifest.papers
$lessonPapers = New-Object System.Collections.Generic.List[object]

foreach ($paper in ($manifest.papers | Sort-Object @{ Expression = { [int]$_.rank } }, @{ Expression = { $_.title } })) {
  $insight = $insightMap[$paper.id]
  $summary = Parse-SummaryFile (Join-Path $summariesDir ([System.IO.Path]::GetFileName($paper.summary_file)))
  $oneLine = To-One-Line ($summary.sections["One-line takeaway"])
  if (-not $oneLine) { $oneLine = To-One-Line $insight.quick_takeaway }
  $problem = To-One-Line ($summary.sections["What problem it claims to solve"])
  if (-not $problem) { $problem = To-One-Line $insight.problem }
  $readingHighlights = Split-Bullets ($summary.sections["Reading highlights"])
  $abstract = To-One-Line ($summary.notes["Abstract"])
  $introduction = To-One-Line ($summary.notes["Introduction"])
  $method = To-One-Line ($summary.notes["Method"])
  if (-not $method) { $method = To-One-Line $insight.method_or_setup }
  $experiments = To-One-Line ($summary.notes["Experiments"])
  $limitations = To-One-Line ($summary.notes["Limitations"])
  $figures = Split-Bullets ($summary.sections["Figures to inspect"])
  $whyMatters = To-One-Line ($summary.sections["Why it matters for temporal hallucination"])
  if (-not $whyMatters) { $whyMatters = To-One-Line $insight.why_it_matters }
  $unresolved = To-One-Line ($summary.sections["What still feels unresolved"])
  $nextAction = To-One-Line ($summary.sections["Next action"])
  $comparison = $comparisonMap[$paper.id]

  $comparisonSummary = if ($comparison) {
    "$($comparison.title) is the natural comparison paper because it lives in the same cluster but frames the temporal bottleneck a little differently."
  } else {
    "Compare this paper with another work in the same cluster to see how different authors define the temporal bottleneck."
  }

  $coreClaim = if ($abstract) {
    "The paper's main claim is this: $abstract"
  } elseif ($oneLine) {
    "The main claim is this: $oneLine"
  } else {
    "The paper wants you to accept a cleaner definition of the temporal problem, not just remember a score."
  }

  $methodSetup = if ($method) {
    $method
  } elseif ($insight.method_or_setup) {
    To-One-Line $insight.method_or_setup
  } else {
    "The paper supports its argument through a concrete temporal setup rather than only a broad capability claim."
  }

  $thesis = if ($oneLine) { $oneLine } else { "$($paper.title) is worth reading for how it defines the $($paper.focus) problem, not only for the final numbers." }

  $introGuide = @(
    "Read the introduction as an argument, not as background filler.",
    "The friction point is: $problem",
    "The gap statement is: $introduction",
    "By the end of the introduction, you should be able to restate the paper's promise in one sentence."
  ) | Where-Object { $_ }

  $steps = @(
    @{
      title = "Start with the paper's promise"
      summary = "Do not memorize the prose first. Pin down the exact temporal claim the authors want you to believe."
      points = @(
        "Compress the paper into one sentence: $thesis",
        "Ask whether this is really about $($paper.focus) or a broader video-language gain.",
        "If the abstract sounds too broad, write down the smallest version of the claim you are willing to accept."
      )
    }
    @{
      title = "Turn the introduction into a problem statement"
      summary = "The introduction matters because it defines why the paper exists."
      points = @(
        "Research question: $problem",
        "Gap statement: $introduction",
        "At this point you should be able to say what existing work still misses."
      )
    }
    @{
      title = "Teach the method back in plain language"
      summary = "The goal here is to turn the setup into a clean, teachable pipeline."
      points = @(
        "One-sentence method or benchmark description: $methodSetup",
        (Category-Method-Lens $paper),
        "Separate the core mechanism from the surrounding support machinery."
      )
    }
    @{
      title = "Use the experiments to decide what to trust"
      summary = "Do not start with all tables. Look for the one or two results that directly support the claim."
      points = @(
        "Experimental headline: $experiments",
        (Category-Experiment-Lens $paper),
        "After reading the results, ask again whether the evidence is strong enough for the central claim."
      )
    }
  )

  $methodChecklist = @(
    "Restate the method in your own words: $methodSetup",
    (Category-Method-Lens $paper),
    "If there are several modules, identify which one is essential to the claim.",
    "Keep linking the method back to the gap defined in the introduction."
  )

  $comparisonResultLine = if ($comparison) {
    "When comparing against $($comparison.title), check whether both papers are solving the same temporal bottleneck."
  } else {
    "Compare against a nearby paper from the same cluster and ask whether the underlying claim is actually comparable."
  }
  $resultsChecklist = @(
    "Find the one table or figure that most directly supports the central claim.",
    "Map the result back to the claim: $coreClaim",
    $comparisonResultLine,
    "Look at ablations only after you know what the main evidence is supposed to prove."
  )

  $nextActionLine = if ($nextAction) {
    $nextAction
  } else {
    "Next, read one natural comparison paper and decide what this paper changes in your mental model."
  }
  $afterReading = @(
    "If you had to explain this paper in one sentence to a labmate, what would you say?",
    "Which layer of temporal understanding does this paper really improve?",
    $nextActionLine
  )

  $limitationLine = if ($limitations) {
    "The paper's own stated limitation is: $limitations"
  } else {
    "Use the limitations section to see which hard temporal cases are still left open."
  }
  $lessonPapers.Add([ordered]@{
    id = $paper.id
    title = $paper.title
    venue = $paper.venue
    year = $paper.year
    category = $paper.category
    focus = $paper.focus
    link = $paper.link
    figure = $insight.figure
    figureCaption = if ($insight.figure_caption) { $insight.figure_caption } else { "Use the figure as an entry point into the paper." }
    subtitle = "$($paper.venue) $($paper.year) | $($paper.focus)"
    thesis = $thesis
    bigPicture = "The right reading strategy is to watch how the paper turns $($paper.focus) into a concrete research problem, then see whether the setup and experiments actually support that framing."
    problemFrame = $problem
    authorClaim = $coreClaim
    researchQuestion = $problem
    coreClaim = $coreClaim
    methodSetup = $methodSetup
    coreInsight = (Category-Core-Insight $paper)
    readerValue = (Category-Reader-Value $paper)
    whyItMatters = $whyMatters
    fastTakeaways = @(
      @{ label = "Question"; text = $problem }
      @{ label = "Claim"; text = $coreClaim }
      @{ label = "Key insight"; text = (Category-Core-Insight $paper) }
    )
    introGuide = $introGuide
    steps = $steps
    methodSummary = $methodSetup
    methodChecklist = $methodChecklist
    resultsSummary = if ($experiments) { $experiments } else { "Read the experiments by asking whether they directly support the paper's promised temporal gain." }
    resultsChecklist = $resultsChecklist
    skepticism = @(
      "If the authors' favorite assumption were removed, how much of the conclusion would still hold?",
      "Is the gain really about temporal evidence or only about broader answer fluency?",
      $limitationLine
    )
    comparisonSummary = $comparisonSummary
    afterReading = $afterReading
    experimentChecks = $resultsChecklist
    thinkingPoints = (Category-Thinking-Points $paper $unresolved)
    readingHighlights = $readingHighlights
    figuresToInspect = $figures
    summaryNotes = [ordered]@{
      abstract = $abstract
      introduction = $introduction
      method = $methodSetup
      experiments = if ($experiments) { $experiments } else { "" }
      limitations = if ($limitations) { $limitations } else { "" }
    }
    comparison = if ($comparison) {
      [ordered]@{
        id = $comparison.id
        title = $comparison.title
        venue = $comparison.venue
        year = $comparison.year
        link = $comparison.link
      }
    } else { $null }
    sourceSummary = [ordered]@{
      one_line_takeaway = $oneLine
      why_it_matters = $whyMatters
      unresolved = $unresolved
      next_action = $nextAction
    }
  })
}

$output = [ordered]@{
  schema_version = 1
  generated_at = (Get-Date).ToString("s")
  topic_focus = $manifest.topic_focus
  papers = $lessonPapers
}

$json = $output | ConvertTo-Json -Depth 8
[System.IO.File]::WriteAllText($outputPath, $json + "`n", [System.Text.Encoding]::UTF8)
Write-Output "Wrote $outputPath"
