# Motion-Grounded Video Reasoning: Understanding and Perceiving Motion at Pixel Level

- Venue: CVPR
- Year: 2025
- Rank: 15
- Status: PDF on disk; summary drafted on 2026-03-27.
- PDF: `paper-library/pdfs/groundmore.pdf`

## One-line takeaway

GroundMore argues that motion needs to be perceived at a more grounded, pixel-level level if we want better video reasoning.

## What problem it claims to solve

It targets the gap between coarse video semantics and the fine motion evidence needed for grounded temporal reasoning.

## Reading highlights

- The paper is useful when temporal error looks like motion misunderstanding rather than pure order confusion.
- It pushes the model toward more explicit motion perception.
- It is most relevant when causal or counterfactual questions depend on small motion cues.

## Section notes

### Abstract

The abstract should be read as a claim that motion is not a side feature but a core ingredient in grounded video reasoning.

### Introduction

The introduction likely motivates why current models miss motion details even when they can answer high-level questions.

### Method

The method should be read as motion grounding at a finer granularity than ordinary video-language alignment.

### Experiments

The evaluation matters most if it shows gains on motion-dependent reasoning rather than only broad benchmark improvements.

### Limitations

Pixel-level motion grounding can still leave open the problem of long-range temporal consistency.

## Figures to inspect

- Figure 1: The pixel-level motion reasoning overview.
- Figure 2: Any example showing motion-grounded failure and recovery.

## Why it matters for temporal hallucination

If the model cannot perceive motion precisely, it can hallucinate action state changes or causal relations that the video does not support.

## What still feels unresolved

It is still unclear how far pixel-level motion grounding helps with long-video reasoning where evidence is sparse and dispersed.

## Next action

Compare it with VideoRefer and VITED to separate motion grounding from broader temporal evidence reasoning.
