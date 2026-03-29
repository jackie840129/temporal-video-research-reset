# VITED: Video Temporal Evidence Distillation

- Venue: CVPR
- Year: 2025
- Rank: 9
- Topic fit: Evidence chains and grounded long-form reasoning.
- Status: PDF on disk; summary drafted on 2026-03-27.
- PDF: `paper-library/pdfs/vited.pdf`

## One-line takeaway

VITED makes temporal evidence itself the thing to learn, which is useful when you care about faithfulness instead of only answer quality.

## What problem it claims to solve

It targets the gap between correct-looking answers and actually grounded video evidence.

## Reading highlights

- Temporal evidence distillation is the central idea.
- The paper is aimed at long-form reasoning settings.
- It provides a useful comparison point for search-first approaches.
- It is one of the more direct attempts to make evidence explicit in temporal reasoning.

## Section notes

### Abstract

The abstract positions evidence distillation as a way to make video reasoning more faithful and more inspectable.

### Introduction

The introduction motivates why temporal evidence should be explicit rather than implicit.

### Method

The method distills temporal evidence so the model has a clearer support chain for its answer.

### Experiments

The experiments evaluate whether the evidence-centric setup improves long-form understanding and localization.

### Limitations

The method may improve faithfulness, but it still depends on how well the model can recover the right evidence in the first place.

## Figures to inspect

- Figure 1: The evidence distillation overview.
- Figure 2: The architecture or evidence-chain pipeline.

## Why it matters for temporal hallucination

Temporal hallucination often looks like unsupported but plausible reasoning, and VITED is important because it tries to make the support chain visible.

## What still feels unresolved

It is still not obvious how much evidence distillation helps on genuinely hard multi-event reasoning versus simpler temporal localization.

## Next action

Use VITED as a core comparison point whenever you want to discuss evidence-first temporal reasoning.
