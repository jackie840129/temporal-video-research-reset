# Temporal Reasoning Transfer from Text to Video

- Venue: ICLR
- Year: 2025
- Topic fit: Diagnostic paper showing the LLM backbone can be the temporal bottleneck.
- Status: PDF on disk; summary drafted on 2026-03-27.

## One-line takeaway

TRTV argues that video temporal reasoning fails not only because of visual encoding, but because the underlying LLM itself struggles with temporal concepts.

## What problem it claims to solve

It tests where temporal reasoning breaks and proposes transferring temporal reasoning skill from text-only tasks into video models.

## Reading highlights

- The diagnostic study suggests video representations already contain enough information for a small probing classifier to recover temporal details well.
- The bottleneck is attributed to the LLM backbone's difficulty with temporal concepts.
- The paper introduces Textual Temporal reasoning Transfer, or T3.
- T3 synthesizes temporal reasoning tasks in pure text from existing image-text datasets.
- The method improves LongVA-7B without using video data and lifts performance on TempCompass and Video-MME temporal reasoning.

## Section notes

### Abstract

The abstract is unusually important here because it flips the usual assumption: the main limitation may be reasoning over time, not perceiving time.

### Introduction

The introduction motivates a split between visual temporal evidence and the language model's ability to reason about that evidence.

### Method

T3 creates diverse textual temporal reasoning tasks and uses them as transfer data to strengthen the LLM side of a Video LLM.

### Experiments

The reported gains are strongest on temporal benchmarks, including TempCompass and Video-MME temporal reasoning, which supports the transfer hypothesis.

### Limitations

This is a strong diagnostic story, but it does not eliminate the need for better video-side evidence handling in harder long-form settings.

## Figures to inspect

- Figure 1: The diagnostic evidence that temporal information is already present in the video representation.
- Figure 2: The T3 pipeline for generating textual temporal reasoning tasks.

## Why it matters for temporal hallucination

If the LLM backbone is weak on temporal concepts, then the model can sound fluent while still hallucinating order, duration, or temporal relation facts.

## What still feels unresolved

The paper leaves open how far text-only transfer can go when the model must ground temporality in genuinely complex visual evidence.

## Next action

Use TRTV when you want to argue that temporal hallucination is partly a language-reasoning problem, not just a vision problem.
