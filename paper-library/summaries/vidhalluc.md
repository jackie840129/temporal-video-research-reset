# VidHalluc: Evaluating Temporal Hallucinations in Multimodal Large Language Models for Video Understanding

- Venue: CVPR
- Year: 2025
- Topic fit: Direct benchmark for hallucination across action, temporal sequence, and scene transition.
- Status: PDF on disk; summary drafted on 2026-03-27.

## One-line takeaway

VidHalluc turns temporal hallucination into a benchmarkable problem and shows that most multimodal LLMs are still fragile on it.

## What problem it claims to solve

It targets hallucinations in video understanding, especially cases where visually similar but semantically different clips trigger inaccurate model outputs.

## Reading highlights

- The benchmark contains 5,002 videos arranged as paired cases that are designed to be hallucination-prone.
- It evaluates hallucination across action, temporal sequence, and scene transition.
- The paper's framing emphasizes that visual encoders often fail on visually different but semantically similar pairs.
- Most evaluated MLLMs are vulnerable across the three dimensions.
- DINO-HEAL is a training-free mitigation method that reweights visual features using spatial saliency from DINOv2.

## Section notes

### Abstract

The abstract makes the paper's agenda clear: measure hallucination directly, show that current models fail, and demonstrate a lightweight mitigation that improves results without retraining.

### Introduction

The paper positions hallucination as a missing evaluation axis for video models, not just a generic LLM issue imported from text.

### Method

VidHalluc defines paired video cases and multiple hallucination dimensions, then measures whether the model stays faithful to the video evidence under each setting.

### Experiments

The reported experiments show widespread vulnerability, while DINO-HEAL gives a consistent improvement on the benchmark.

### Limitations

The benchmark is strong for controlled hallucination testing, but it still favors curated pair-based failure cases over open-ended conversational video understanding.

## Figures to inspect

- Figure 1: The paired-video example that illustrates the hallucination setup.
- Figure 2: The benchmark taxonomy across action, temporal sequence, and scene transition.

## Why it matters for temporal hallucination

This is one of the most directly relevant papers in the repo because it separates temporal hallucination from general factual error and tests whether the model confuses event order or scene change.

## What still feels unresolved

The open question is how much benchmark improvement on these curated hallucination pairs transfers to free-form temporal reasoning in the wild.

## Next action

Use VidHalluc as the main reference when you want to talk about hallucination metrics rather than general temporal grounding accuracy.
