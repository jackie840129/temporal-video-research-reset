# Scanning Only Once: An End-to-end Framework for Fast Temporal Grounding in Long Videos

- Venue: ICCV
- Year: 2023
- Rank: 20
- Status: PDF on disk; summary drafted on 2026-03-27.
- PDF: `paper-library/pdfs/scanonce.pdf`

## One-line takeaway

ScanOnce pushes long-video grounding toward a one-pass, efficiency-first setup.

## What problem it claims to solve

It addresses the cost and noise of repeatedly scanning long videos for temporal grounding.

## Reading highlights

- Efficiency is the core design goal here.
- The one-pass setup changes the search tradeoff.
- It is a useful baseline for long-video grounding under compute constraints.

## Section notes

### Abstract

The abstract should be read as an efficiency claim: you can ground a moment without repeatedly revisiting the full video.

### Introduction

The introduction likely argues that long videos make multi-pass scanning expensive and potentially noisy.

### Method

The method is an end-to-end one-scan framework for temporal grounding.

### Experiments

The experiments matter most if they show that the speedup does not completely destroy localization quality.

### Limitations

Efficiency-first designs can miss hard evidence if the relevant moment is not captured in the first pass.

## Figures to inspect

- Figure 1: The one-pass grounding pipeline.
- Figure 2: Any efficiency versus accuracy comparison.

## Why it matters for temporal hallucination

If the right evidence is never revisited, the model can hallucinate a plausible but unsupported temporal span.

## What still feels unresolved

It remains unclear how robust one-pass grounding is when the question depends on subtle evidence far apart in time.

## Next action

Compare it with Guidance and lvhaystack to see whether efficiency comes at the cost of faithfulness.
