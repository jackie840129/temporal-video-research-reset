# Adaptive Greedy Frame Selection for Long Video Understanding

- Venue: arXiv
- Year: 2026
- Rank: 34
- Status: want
- PDF: `paper-library/pdfs/adaptivegreedy.pdf`

## One-line takeaway

This paper treats frame selection as a submodular optimization problem that balances query relevance with temporal coverage under a fixed budget.

## Problem it claims to solve

Uniform sparse sampling misses decisive moments, while pure relevance ranking collapses onto near-duplicate frames and loses distant evidence.

## Reading highlights

- Very recent frame-selection paper with a clean optimization lens.
- Uses both relevance and representativeness instead of relying on only one signal.
- Especially relevant when budget is tight and the decisive event may occupy only a small slice of the video.

## Section notes

### Abstract

The paper proposes a question-adaptive greedy selector that combines a modular relevance term with a facility-location coverage term and routes questions to different relevance-coverage tradeoff presets.

### Introduction

The core point is that small frame budgets force a tradeoff between relevance and coverage, and a good selector should optimize both explicitly.

### Method

The approach builds a 1 FPS candidate pool, embeds frames in separate relevance and similarity spaces, and greedily optimizes a submodular objective under the frame budget.

### Experiments

The paper reports gains on MLVU over uniform sampling and a strong recent baseline, especially under tight frame budgets.

### Limitations

It is a fresh preprint, so it is worth reading with extra skepticism around benchmark breadth and downstream transfer.

## Figures to inspect

- Figure 1: The relevance-plus-coverage frame selection objective and routing design.
- Figure 2: The budget-sensitive result table showing the gain over uniform sampling.

## Why it matters for temporal hallucination

This paper is aligned with the practical failure mode where a model misses the one decisive frame and then invents a plausible narrative from incomplete evidence.

## What still feels unresolved

The method is benchmarked on QA-style setups, so the transfer to event classification with a short initial description still needs to be reasoned through carefully.

## Next action

Use this paper as the most recent optimization-based comparison point against VAP, CoSeLECT, and RM-LLaVA.
