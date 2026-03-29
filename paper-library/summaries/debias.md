# Towards Debiasing Temporal Sentence Grounding in Video

- Venue: arXiv
- Year: 2021
- Topic fit: Dataset bias and shortcut detection in temporal grounding.
- Status: PDF on disk; summary drafted on 2026-03-27.

## One-line takeaway

This is an early warning paper showing that temporal grounding can look better than it really is when the dataset is biased.

## What problem it claims to solve

It studies how annotation and dataset bias can let models exploit shortcuts instead of actually grounding the correct moment.

## Reading highlights

- The paper is important as a pathology anchor, not just as an older grounding method.
- It helps explain why a benchmark win may not mean a model truly understands temporal evidence.
- Its main contribution is the reminder that evaluation design can create fake progress.

## Section notes

### Abstract

The abstract frames bias as a hidden reason temporal grounding models can appear stronger than they are.

### Introduction

The introduction motivates why dataset bias matters if the goal is real moment grounding.

### Method

The paper studies and mitigates bias sources in temporal sentence grounding datasets and settings.

### Experiments

The experiments are most useful as a bias diagnosis rather than a standalone model story.

### Limitations

Because it is bias-focused, it does not directly solve temporal hallucination; it mostly explains why shortcuts exist.

## Figures to inspect

- Figure 1: The bias diagnosis or dataset setup overview.
- Figure 2: Any example showing shortcut-prone annotations or splits.

## Why it matters for temporal hallucination

Temporal hallucination can be hard to distinguish from dataset shortcutting, and this paper helps you remember that some apparent temporal ability is only bias exploitation.

## What still feels unresolved

The paper does not fully answer how to transfer bias-aware lessons into modern video LLM evaluation.

## Next action

Use this as the older pathology anchor when discussing benchmark debiasing.
