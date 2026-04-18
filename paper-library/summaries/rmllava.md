# RM-LLaVA: An Efficient Training-Free Video Understanding Framework with Redundancy-Minimized Frame Selection

- Venue: OpenReview
- Year: 2025
- Rank: 33
- Status: want
- PDF: `paper-library/pdfs/rmllava.pdf`

## One-line takeaway

RM-LLaVA argues that under a fixed frame budget, removing redundant frames and preserving diversity can be as important as increasing raw context length.

## Problem it claims to solve

Simple frame sampling often wastes visual tokens on highly similar frames, leaving too little budget for broad temporal coverage.

## Reading highlights

- Training-free method centered on diversity rather than model retraining.
- Uses structure-aware clustering before final frame selection.
- Helpful if the main issue is outdoor-camera redundancy, where many neighboring frames look almost identical.

## Section notes

### Abstract

The paper proposes Redundancy-Minimized Frame Selection (RMFS), a two-stage process with candidate refinement and semantic diversity maximization.

### Introduction

The key framing is that complex video content needs temporal coverage, not repeated views of almost the same moment.

### Method

The method first refines a candidate pool with clustering, then selects a compact and informative set by maximizing semantic diversity.

### Experiments

The paper reports improved performance over several training-free baselines on standard VideoQA benchmarks.

### Limitations

Diversity alone may not be enough when the decisive evidence is subtle and strongly query-dependent rather than just non-redundant.

## Figures to inspect

- Figure 1: The two-stage RMFS design.
- Figure 2: The ablation or benchmark table showing the gain from redundancy minimization.

## Why it matters for temporal hallucination

Redundant frame budgets can hide the exact moment that would disambiguate arrival, delivery, or no-human noise, so redundancy-aware selection is directly relevant to avoiding unsupported classifications.

## What still feels unresolved

The paper seems stronger on coverage than on fine-grained task-conditioned relevance, so the best downstream use may depend on how informative the text cue is.

## Next action

Read this next to CoSeLECT to compare diversity-first versus query-guided selectors.
