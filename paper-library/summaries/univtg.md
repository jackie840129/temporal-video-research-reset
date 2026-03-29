# UniVTG: Towards Unified Video-Language Temporal Grounding

- Venue: ICCV
- Year: 2023
- Rank: 17
- Status: PDF on disk; summary drafted on 2026-03-27.
- PDF: `paper-library/pdfs/univtg.pdf`

## One-line takeaway

UniVTG is an older but useful grounding paper that unifies multiple temporal video-language tasks under one framework.

## What problem it claims to solve

It addresses the fragmentation of temporal grounding tasks, where moment retrieval, highlight detection, and related settings are often treated separately.

## Reading highlights

- This is a strong terminology and task-organization reference.
- It is more useful as a grounding anchor than as a direct hallucination paper.
- The unification idea helps when comparing later temporal localization methods.

## Section notes

### Abstract

The abstract should be read as a unification claim: different temporal grounding tasks can share a common modeling setup.

### Introduction

The introduction is helpful for seeing how the field framed temporal grounding before the current wave of Video LLM benchmarks.

### Method

The method likely matters most as a shared structure for multiple temporal localization tasks rather than one isolated benchmark.

### Experiments

The experiments are most useful for understanding whether a unified approach is competitive across task variants.

### Limitations

As an older grounding paper, it may not directly target modern hallucination-style failure modes.

## Figures to inspect

- Figure 1: The unified grounding framework.
- Figure 2: Any diagram showing how tasks are mapped into the shared setup.

## Why it matters for temporal hallucination

It gives us a historical grounding baseline for what "temporal localization" meant before hallucination became a central concern.

## What still feels unresolved

It is still not obvious whether unifying grounding tasks is enough to make models faithful to temporal evidence in open-ended settings.

## Next action

Use it as the historical anchor when comparing ProTeGe, Guidance, and ScanOnce.
