# Re-thinking Temporal Search for Long-Form Video Understanding

- Venue: CVPR
- Year: 2025
- Rank: 8
- Topic fit: Sparse temporal search and long-form evidence retrieval.
- Status: PDF on disk; summary drafted on 2026-03-27.
- PDF: `paper-library/pdfs/lvhaystack.pdf`

## One-line takeaway

lvhaystack reframes long-form video understanding as finding the right moments first, because reasoning cannot fix missing evidence.

## What problem it claims to solve

It argues that long-form video fails mainly when the model searches the wrong moments or fails to retrieve the right evidence span.

## Reading highlights

- The paper treats temporal search as a first-class problem.
- Sparse evidence is the core assumption.
- Search quality should be judged separately from final answer quality.
- It is one of the clearest papers for linking long-video evaluation to retrieval failure.

## Section notes

### Abstract

The abstract frames long-form video understanding as a search problem over sparse evidence rather than a dense scanning problem.

### Introduction

The introduction motivates why long-video models need to locate evidence before they can reason correctly.

### Method

The method focuses on temporal search over sparse video evidence, with less emphasis on dense processing.

### Experiments

The experiments test whether the search strategy improves long-video answering and evidence selection.

### Limitations

The paper is strong on reframing, but it still leaves open how much of the improvement comes from retrieval versus downstream reasoning.

## Figures to inspect

- Figure 1: The long-form search overview.
- Figure 2: The search pipeline or evidence selection diagram.

## Why it matters for temporal hallucination

If the model searches the wrong moment, it can produce a fluent but temporally unsupported answer, which is exactly the sort of failure temporal hallucination exposes.

## What still feels unresolved

It is still unclear how to measure search quality independently from answer quality in a fully reliable way.

## Next action

Use lvhaystack as the key reference when you want to argue that retrieval is the bottleneck before reasoning.
