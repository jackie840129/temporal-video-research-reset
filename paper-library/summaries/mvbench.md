# MVBench: A Comprehensive Multi-modal Video Understanding Benchmark

- Venue: CVPR
- Year: 2024
- Rank: 2
- Topic fit: Broad benchmark for checking whether general video understanding covers time-sensitive behavior.
- Status: PDF on disk; summary drafted on 2026-03-27.
- PDF: `paper-library/pdfs/mvbench.pdf`

## One-line takeaway

MVBench is the wide-angle benchmark you use when you want to see whether a model is broadly competent on video understanding or only good at a few easy task types.

## What problem it claims to solve

It tries to expose the gap between narrow benchmark success and real multi-modal video understanding across a wider task mix.

## Reading highlights

- The benchmark spans a broad set of video understanding tasks, so failure is harder to hide behind one favorable format.
- It is useful as a comparison baseline when another paper claims a temporal improvement.
- Broad coverage makes it easier to see whether the model actually understands time or just recognizes familiar answer patterns.
- The benchmark is more diagnostic than architectural, so its value is in exposure rather than mitigation.

## Section notes

### Abstract

The paper's main message is that existing evaluations are too narrow and that video models need broader testing to reveal their actual limits.

### Introduction

The introduction motivates a larger benchmark by arguing that single-task evaluation can overstate video understanding.

### Method

MVBench collects a wider mix of tasks to stress different video understanding skills rather than a single temporal capability.

### Experiments

The experiments use the benchmark to compare models across multiple tasks, making it easier to see uneven performance.

### Limitations

The paper is useful for diagnosis, but it does not by itself explain why a model fails or how to fix temporal hallucination.

## Figures to inspect

- Figure 1: The overall benchmark overview and task coverage.
- Figure 2: The benchmark construction or task taxonomy view.

## Why it matters for temporal hallucination

MVBench is important because temporal hallucination often looks less obvious when evaluation is too narrow; a broader benchmark makes shortcut behavior easier to spot.

## What still feels unresolved

It is still not obvious which failures come from temporal reasoning itself versus general multi-modal weakness.

## Next action

Use MVBench as a broad baseline before trusting claims of temporal improvement from narrower papers.
