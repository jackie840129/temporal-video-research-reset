# MLVU: A Comprehensive Benchmark for Multi-Task Long Video Understanding

- Venue: arXiv
- Year: 2024
- Rank: 5
- Topic fit: Multi-task benchmark for long-video capability under varied demands.
- Status: PDF on disk; summary drafted on 2026-03-27.
- PDF: `paper-library/pdfs/mlvu.pdf`

## One-line takeaway

MLVU is useful because it tests whether long-video models stay reliable when the task changes, not just when the clip gets longer.

## What problem it claims to solve

It broadens long-video evaluation beyond a single task so degradation under context growth and task diversity becomes visible.

## Reading highlights

- The benchmark spans multiple long-video tasks.
- It is useful for seeing how performance changes as the context grows.
- It helps separate true long-video ability from short-clip QA skill.
- It gives a broader baseline than a single-task evaluation.

## Section notes

### Abstract

The abstract presents multi-task long-video evaluation as a more realistic test of video understanding.

### Introduction

The introduction motivates why long-video models should be tested across diverse task types, not just one benchmark format.

### Method

The benchmark aggregates multiple long-video understanding tasks into one evaluation setting.

### Experiments

The experiments use the benchmark to show how models behave when task diversity increases.

### Limitations

The paper is strong for coverage, but it still does not isolate the exact reason a model fails on temporal evidence.

## Figures to inspect

- Figure 1: The overall benchmark overview.
- Figure 2: The task breakdown or benchmark composition view.

## Why it matters for temporal hallucination

If a model only looks good on one long-video task, it may still hallucinate temporally when the evaluation changes slightly.

## What still feels unresolved

The open question is whether the benchmark failures are mostly due to retrieval, reasoning, or evaluation design.

## Next action

Use MLVU as a coverage check before trusting claims about long-video robustness.
