# ProTeGe: Untrimmed Pretraining for Video Temporal Grounding by Video Temporal Grounding

- Venue: CVPR
- Year: 2023
- Rank: 18
- Status: PDF on disk; summary drafted on 2026-03-27.
- PDF: `paper-library/pdfs/protege.pdf`

## One-line takeaway

ProTeGe argues that pretraining on untrimmed videos can make boundary localization sharper.

## What problem it claims to solve

It targets the weakness that standard pretraining does not necessarily teach the model where an event starts and ends.

## Reading highlights

- The key idea is pretraining with untrimmed video rather than only trimmed clips.
- Boundary sensitivity is the central concern.
- It is useful as a pre-Video-LMM grounding baseline.

## Section notes

### Abstract

The abstract should be read as a data and pretraining claim: untrimmed video exposure can improve temporal grounding.

### Introduction

The introduction likely motivates why temporal boundaries are easy to miss when models are trained on simplified data.

### Method

The method is best understood as a pretraining strategy designed to preserve temporal boundary information.

### Experiments

The experiments matter most if they show better localization or boundary recall rather than only generic video understanding.

### Limitations

The approach may help grounding without fully solving hallucination in free-form captioning or reasoning.

## Figures to inspect

- Figure 1: The pretraining and grounding overview.
- Figure 2: Any example showing improved temporal boundary behavior.

## Why it matters for temporal hallucination

Weak boundaries are a natural source of unsupported temporal claims, so better pretraining can matter even before model architecture changes.

## What still feels unresolved

It is still unclear how much pretraining on untrimmed videos transfers to modern Video LLMs and long-form hallucination settings.

## Next action

Compare it with UniVTG and Guidance to separate pretraining effects from search or architecture effects.
