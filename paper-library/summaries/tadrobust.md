# Benchmarking the Robustness of Temporal Action Detection Models Against Temporal Corruptions

- Venue: CVPR
- Year: 2024
- Topic fit: Robustness under corrupted temporal evidence.
- Status: PDF on disk; summary drafted on 2026-03-27.

## One-line takeaway

TADRobust asks a simple but important question: do temporal detectors still work when the video timeline is corrupted?

## What problem it claims to solve

It studies whether temporal action detection models are genuinely robust or only perform well on clean, well-aligned timelines.

## Reading highlights

- The paper makes corruption sensitivity visible instead of hiding it behind clean benchmark scores.
- It is useful for thinking about missing frames, shifted boundaries, or noisy temporal evidence.
- Robustness is the key lens, not just nominal accuracy.

## Section notes

### Abstract

The abstract positions temporal corruption as the stress test that reveals whether temporal detection is truly stable.

### Introduction

The introduction motivates robustness as a necessary complement to standard temporal detection evaluation.

### Method

The benchmark introduces temporal corruptions and measures how models degrade under them.

### Experiments

The experiments are best interpreted as a robustness map rather than a new modeling recipe.

### Limitations

This is a temporal action detection paper, so its lessons transfer to video LLM hallucination mainly as evaluation intuition.

## Figures to inspect

- Figure 1: The corruption taxonomy or setup overview.
- Figure 2: Example degradation under corruption.

## Why it matters for temporal hallucination

If a model collapses under corrupted temporal input, then apparent hallucination may actually be sensitivity to weak or missing evidence rather than purely bad reasoning.

## What still feels unresolved

The paper does not fully answer how robustness benchmarks for action detection should be mapped onto open-ended video LLM behavior.

## Next action

Use it as a robustness reference when you want to test whether temporal faithfulness survives noisy evidence.
