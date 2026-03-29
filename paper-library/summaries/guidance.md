# Localizing Moments in Long Video Via Multimodal Guidance

- Venue: ICCV
- Year: 2023
- Rank: 19
- Status: PDF on disk; summary drafted on 2026-03-27.
- PDF: `paper-library/pdfs/guidance.pdf`

## One-line takeaway

This paper uses multimodal guidance to prune long videos toward the relevant moment.

## What problem it claims to solve

It addresses the fact that long videos are too dense to search naively, so models need help narrowing the evidence.

## Reading highlights

- The main contribution is guided pruning for long-video localization.
- It is a good reminder that search is often the bottleneck before reasoning.
- The paper belongs in the long-video retrieval and efficiency cluster.

## Section notes

### Abstract

The abstract should be read as a claim that multimodal guidance improves the ability to find relevant moments in long videos.

### Introduction

The introduction likely motivates why long videos cannot be handled well by brute-force scanning alone.

### Method

The method is the pruning or guidance mechanism that narrows the search space before final localization.

### Experiments

The experiments matter most if they show better localization on long videos, especially when evidence is sparse.

### Limitations

Guided pruning can improve efficiency while still missing hard evidence if the guidance signal is weak.

## Figures to inspect

- Figure 1: The guided localization pipeline.
- Figure 2: Any example showing before-and-after pruning behavior.

## Why it matters for temporal hallucination

If a model cannot find the right moment, later temporal answers can sound plausible while remaining unsupported.

## What still feels unresolved

It is still unclear how much guided pruning improves faithful reasoning rather than only faster narrowing.

## Next action

Compare it with ScanOnce and lvhaystack to understand the search-efficiency tradeoff.
