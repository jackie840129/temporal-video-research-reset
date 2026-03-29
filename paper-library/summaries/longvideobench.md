# LongVideoBench: A Benchmark for Long-context Interleaved Video-Language Understanding

- Venue: NeurIPS D&B
- Year: 2024
- Rank: 6
- Topic fit: Long-context video-language reasoning and sparse evidence retrieval.
- Status: PDF on disk; summary drafted on 2026-03-27.
- PDF: `paper-library/pdfs/longvideobench.pdf`

## One-line takeaway

LongVideoBench treats long-context video understanding as an evidence alignment problem, not just a language generation problem.

## What problem it claims to solve

It evaluates whether models can keep track of scattered evidence across long interleaved video-language inputs.

## Reading highlights

- Interleaved inputs make the reasoning problem harder because evidence can be spread across modalities and time.
- Long-context evidence is easy to lose, even when the answer seems obvious in hindsight.
- The benchmark is useful for studying retrieval-like behavior in video LLMs.
- It fits well with papers that frame long-video understanding as search rather than dense scanning.

## Section notes

### Abstract

The abstract positions long-context interleaving as the core stress test for modern video-language models.

### Introduction

The introduction motivates why long-context reasoning should be evaluated differently from short-clip QA.

### Method

The benchmark uses interleaved video-language inputs to force models to keep track of evidence over time.

### Experiments

The experiments compare models under long-context conditions and show whether they can preserve the right evidence.

### Limitations

The benchmark is strong for context stress, but it still does not fully separate retrieval failure from reasoning failure.

## Figures to inspect

- Figure 1: The benchmark overview and interleaved input setup.
- Figure 2: The long-context task taxonomy or construction pipeline.

## Why it matters for temporal hallucination

Long-context hallucination often happens because the model loses evidence alignment before it starts reasoning, and this benchmark tests that failure mode directly.

## What still feels unresolved

It remains unclear how much improvement requires better memory, better retrieval, or a stronger temporal backbone.

## Next action

Use LongVideoBench when you want to test whether the model can keep evidence aligned over long mixed-modality contexts.
