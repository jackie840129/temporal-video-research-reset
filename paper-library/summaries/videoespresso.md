# VideoEspresso: A Large-Scale Chain-of-Thought Dataset for Fine-Grained Video Reasoning via Core Frame Selection

- Venue: CVPR
- Year: 2025
- Topic fit: Reasoning supervision and core-frame selection for video understanding.
- Status: PDF on disk; summary drafted on 2026-03-27.

## One-line takeaway

VideoEspresso is interesting because it tries to improve video reasoning by selecting core frames and supervising the reasoning path more explicitly.

## What problem it claims to solve

It targets fine-grained video reasoning where the model needs to identify the most relevant frames before it can answer well.

## Reading highlights

- The paper is best read as a supervision and evidence-selection paper.
- It is relevant when the failure mode looks like bad frame selection rather than pure reasoning collapse.
- The core idea is that better reasoning starts with better evidence selection.

## Section notes

### Abstract

The abstract frames the paper as a large-scale reasoning dataset built around core frame selection.

### Introduction

The introduction motivates why fine-grained video reasoning depends on finding the important frames first.

### Method

The method centers on chain-of-thought style reasoning supervision and core-frame selection.

### Experiments

The experiments are useful for judging whether reasoning supervision changes what evidence the model uses.

### Limitations

The paper is more about reasoning supervision than about direct temporal hallucination measurement.

## Figures to inspect

- Figure 1: The dataset or pipeline overview.
- Figure 2: The core-frame selection illustration.

## Why it matters for temporal hallucination

If a model chooses the wrong core frames, it can still produce fluent answers that hallucinate the temporal chain from incomplete evidence.

## What still feels unresolved

It is not yet obvious how much reasoning-supervision gains transfer to open-ended temporal faithfulness.

## Next action

Use this as a supervision-side comparison when you want to test whether evidence selection is the main bottleneck.
