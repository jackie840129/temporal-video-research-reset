# TempCompass: Do Video LLMs Really Understand Videos?

- Venue: ACL
- Year: 2024
- Topic fit: Foundational benchmark for temporal perception and shortcut detection.
- Status: PDF on disk; summary drafted on 2026-03-27.

## One-line takeaway

TempCompass is the cleanest starting point for asking whether a Video LLM really understands time, not just static content.

## What problem it claims to solve

It addresses the lack of benchmarks that separate different temporal aspects and task formats, so models can no longer hide behind static-frame bias or a single QA style.

## Reading highlights

- The benchmark is built around multiple temporal aspects, including cases where static content stays the same but temporal structure changes.
- It uses conflicting videos to reduce single-frame shortcuts and language priors.
- Human meta-information plus LLM-generated instructions is used to build diverse task prompts.
- An LLM-based evaluator is introduced to score responses more consistently at scale.
- The paper reports that current Video LLMs and even Image LLMs perform poorly on temporal perception.

## Section notes

### Abstract

The core message is diagnostic rather than architectural: current benchmarks do not adequately measure temporal perception, so TempCompass creates a broader testbed and shows that existing models are weak on it.

### Introduction

The paper argues that prior evaluations blur together temporal skills and do not test enough task formats, which makes it hard to see whether a model is actually reasoning about time.

### Method

TempCompass combines conflicting video pairs, multiple temporal aspect categories, and an instruction generation pipeline designed to produce richer evaluation prompts.

### Experiments

The benchmark is used to evaluate several state-of-the-art Video LLMs and Image LLMs, exposing strong temporal weakness across models.

### Limitations

It is primarily a benchmark paper, so it diagnoses failure modes more than it fixes them, and the LLM-based scoring pipeline may still inherit some evaluator bias.

## Figures to inspect

- Figure 1: The overview of how conflicting videos and temporal aspects are organized.
- Figure 2: The benchmark pipeline for data collection, instruction generation, and evaluation.

## Why it matters for temporal hallucination

TempCompass tells us whether a model is relying on static scene cues instead of temporal evidence, which is exactly the kind of hidden shortcut that often looks like temporal hallucination.

## What still feels unresolved

It is still not obvious which temporal aspect is the hardest in a causal sense versus just the hardest under the benchmark's prompt style.

## Next action

Use this as the first diagnostic lens when comparing later papers that claim to improve temporal grounding or consistency.
