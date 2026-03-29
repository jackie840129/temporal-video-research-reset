# VideoComp: Advancing Fine-Grained Compositional and Temporal Alignment in Video-Text Models

- Venue: CVPR
- Year: 2025
- Rank: 14
- Status: PDF on disk; summary drafted on 2026-03-27.
- PDF: `paper-library/pdfs/videocomp.pdf`

## One-line takeaway

VideoComp focuses on fine-grained temporal alignment, especially when subtle reordering and compositional details matter.

## What problem it claims to solve

It addresses the mismatch between video-text similarity and actual temporal alignment, where a model may match content but still misread order.

## Reading highlights

- The paper is a good fit for thinking about reordering-based stress tests.
- It sits at the boundary between compositional reasoning and temporal faithfulness.
- Subtle negatives are likely more informative here than easy benchmark wins.

## Section notes

### Abstract

The main idea is that fine-grained temporal alignment needs to be measured and optimized more carefully than generic video-text matching.

### Introduction

The introduction should frame why temporal alignment is fragile when the task depends on small differences in order or composition.

### Method

Read the method as a way to make the representation more sensitive to alignment details that ordinary models flatten away.

### Experiments

The strongest evidence would be any evaluation on subtle negatives or order-sensitive comparisons.

### Limitations

The paper may improve alignment metrics without fully solving broad temporal hallucination in open-ended settings.

## Figures to inspect

- Figure 1: The alignment problem setup.
- Figure 2: Any diagram showing the fine-grained temporal alignment mechanism.

## Why it matters for temporal hallucination

Order confusion is one of the most common forms of temporal hallucination, and VideoComp is directly aimed at that failure mode.

## What still feels unresolved

It is still unclear how much fine-grained alignment transfers from curated reordering tests to real-world video understanding.

## Next action

Compare it with STEP and MASH-VLM to see whether the improvement comes from representation alignment or from a broader reasoning gain.
