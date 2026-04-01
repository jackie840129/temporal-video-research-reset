# Video-MME: The First-Ever Comprehensive Evaluation Benchmark of Multi-modal LLMs in Video Analysis

- Venue: arXiv
- Year: 2024
- Rank: 2
- Topic fit: Broad benchmark for calibrating what the field means by general video understanding before narrowing down to temporal validity.
- Status: PDF on disk; summary drafted on 2026-04-01.
- PDF: `paper-library/pdfs/videomme.pdf`

## One-line takeaway

Video-MME is the broad field-standard benchmark you read when you want to know how strong a model looks on real video analysis across domains, durations, and modalities, not only on narrowly temporal tasks.

## What problem it claims to solve

It tries to fix the lack of a comprehensive and carefully annotated benchmark for evaluating multimodal LLMs on video analysis across short and long videos, different domains, and multiple input modalities.

## Reading highlights

- The benchmark spans diverse visual domains and subfields, so it aims to represent broad video analysis rather than one narrow task family.
- It explicitly varies video duration from short clips to hour-long videos, which matters for contextual and temporal stress.
- It evaluates multiple modality settings, including video-only, subtitles, and audio, to reveal what models really use.
- The dataset is manually selected and annotated at a higher quality bar than many broad benchmark collections.
- The most useful reading move is to compare what Video-MME measures well against what TempCompass measures more cleanly.

## Section notes

### Abstract

The central message is that the field needed a comprehensive benchmark for multimodal video analysis, and Video-MME provides broad coverage over domains, durations, modalities, and quality-controlled annotations.

### Introduction

The introduction is really about benchmark breadth: existing evaluation was too fragmented to tell whether multimodal LLMs were genuinely ready for broad video understanding.

### Method

Video-MME builds a benchmark around 900 manually selected videos, 2,700 question-answer pairs, multiple duration bands, multiple visual domains, and multiple modality configurations including subtitles and audio.

### Experiments

The experiments compare commercial and open-source multimodal models under the benchmark's different settings and show clear performance gaps, especially when video gets longer or when broader multimodal understanding is required.

### Limitations

It is intentionally broad, so it is less surgical than TempCompass about isolating whether the model truly used temporal evidence rather than subtitles, audio, or broad scene priors.

## Figures to inspect

- Figure 1: The benchmark overview that shows domains, durations, and modality settings.
- Figure 2: Any figure or table that breaks performance down by duration or modality configuration.

## Why it matters for temporal hallucination

Video-MME matters because it is the broad benchmark many later papers report, so it tells you how much a model looks good under realistic multimodal evaluation, but it also reminds you that broad success does not automatically mean temporally faithful reasoning.

## What still feels unresolved

It still leaves open how much of a model's score comes from real temporal reasoning versus support from subtitles, audio, and broad multimodal cues.

## Next action

Read this in Week 1 right after TempCompass so you can separate field-standard benchmark coverage from stricter temporal validity.
