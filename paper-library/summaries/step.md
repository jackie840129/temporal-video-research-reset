# STEP: Enhancing Video-LLMs' Compositional Reasoning by Spatio-Temporal Graph-guided Self-Training

- Venue: CVPR
- Year: 2025
- Rank: 13
- Status: PDF on disk; summary drafted on 2026-03-27.
- PDF: `paper-library/pdfs/step.pdf`

## One-line takeaway

STEP is a structure-heavy method paper that uses spatio-temporal graphs to improve compositional reasoning in Video LLMs.

## What problem it claims to solve

It targets the weakness of current Video LLMs on multi-step compositional questions where spatial and temporal relationships both matter.

## Reading highlights

- The method uses graph-guided self-training rather than only scaling supervision.
- It is best read as an attempt to impose structure on video reasoning.
- The paper sits closer to compositional faithfulness than to pure benchmark chasing.

## Section notes

### Abstract

The main claim is that structured self-training can make compositional reasoning more reliable than unstructured prompting or raw pretraining.

### Introduction

The introduction should be read as a diagnosis of why compositional video questions remain hard even when models look decent on simpler tasks.

### Method

The spatio-temporal graph is the key object: it is the mechanism meant to preserve relationships that are easy to lose in flat token sequences.

### Experiments

The experiments should be interpreted as evidence for whether structural guidance improves the model's reasoning path, not only the final answer.

### Limitations

The paper may improve structured compositional tasks without fully solving open-ended temporal hallucination.

## Figures to inspect

- Figure 1: The graph-guided self-training overview.
- Figure 2: Any example that shows how the structure changes reasoning.

## Why it matters for temporal hallucination

If temporal hallucination is partly a structure-loss problem, then graph-guided self-training is one plausible path to reduce unsupported temporal claims.

## What still feels unresolved

It remains unclear whether the structure mainly helps compositional reasoning or also improves faithfulness under more free-form video dialogue.

## Next action

Compare it against MASH-VLM and VideoComp to separate structure bias from actual temporal faithfulness.
