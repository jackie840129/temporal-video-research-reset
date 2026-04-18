# Scaling Video-Language Models to 10K Frames via Hierarchical Differential Distillation

- Venue: ICML
- Year: 2025
- Rank: 31
- Status: want
- PDF: `paper-library/pdfs/vilamp.pdf`

## One-line takeaway

ViLAMP keeps a few keyframes rich and compresses the rest, turning long-video understanding into a mixed-precision evidence pipeline.

## Problem it claims to solve

Pure token pruning often throws away important temporal evidence, but processing every frame densely is too expensive for long videos.

## Reading highlights

- Combines differential keyframe selection with patch-level feature merging.
- Useful because it separates "what to keep fully" from "what can be compressed."
- Strong fit if you care about small-budget inference rather than only model scaling.

## Section notes

### Abstract

The paper introduces hierarchical differential distillation and a ViLAMP architecture that preserves query-relevant keyframes while compressing non-keyframes.

### Introduction

The framing is that long-video understanding needs selective retention, not just more context length.

### Method

The key design is two-level compression: frame-level keyframe selection plus patch-level feature merging for the rest of the video.

### Experiments

The paper reports competitive long-form video understanding while scaling to very long inputs with much lower compute than dense processing.

### Limitations

The approach is more system-heavy than simple training-free selectors and may be less plug-and-play for an existing 4B production stack.

## Figures to inspect

- Figure 1: The hierarchical pipeline showing keyframe retention and non-keyframe compression.
- Figure 2: Any ablation showing how frame selection and feature merging each contribute.

## Why it matters for temporal hallucination

This paper matters because temporal mistakes can come from over-compression as well as under-selection; it gives a concrete design for preserving salient moments without keeping all frames equally rich.

## What still feels unresolved

It is not obvious how much of the gain comes from better selection versus the larger overall hierarchical architecture.

## Next action

Read this against MovieChat and LV-Haystack to separate memory design, search quality, and hierarchical compression.
