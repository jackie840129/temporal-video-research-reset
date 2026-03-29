# MASH-VLM: Mitigating Action-Scene Hallucination in Video-LLMs through Disentangled Spatial-Temporal Representations

- Venue: CVPR
- Year: 2025
- Topic fit: Hallucination mitigation through spatial-temporal disentangling and positional control.
- Status: PDF on disk; summary drafted on 2026-03-27.

## One-line takeaway

MASH-VLM argues that action-scene hallucination comes from entangled spatial-temporal features and positional bias, then attacks both directly.

## What problem it claims to solve

It targets cases where a Video LLM predicts an action from scene context or infers a scene from an observed action incorrectly.

## Reading highlights

- The paper identifies two causes of action-scene hallucination: mixed spatial-temporal attention and standard RoPE bias.
- DST-attention separates spatial and temporal tokens with masked attention.
- Harmonic-RoPE changes positional handling so text, spatial, and temporal tokens stay better balanced.
- The UNSCENE benchmark has 1,320 videos and 4,078 QA pairs.
- The method achieves strong results on UNSCENE and also improves general video understanding benchmarks.

## Section notes

### Abstract

The abstract makes a compact causal claim: if spatial and temporal signals are entangled too early, the model is more likely to hallucinate action-scene associations.

### Introduction

The paper frames hallucination as an architectural issue, not only a data problem, which is useful for thinking about where temporal errors originate.

### Method

The model combines DST-attention with Harmonic-RoPE so that spatial and temporal information stay more separated while still aligning with text.

### Experiments

The UNSCENE benchmark is the main evaluation vehicle, and the method shows strong gains there as well as on broader benchmarks.

### Limitations

The paper is very relevant for hallucination mitigation, but it focuses more on action-scene confusion than on fine-grained event-order reasoning.

## Figures to inspect

- Figure 1: The action-scene hallucination examples that motivate the architecture.
- Figure 2: The DST-attention and Harmonic-RoPE design diagram.

## Why it matters for temporal hallucination

It is useful because many temporal hallucinations are actually entanglement errors, where scene context leaks into event prediction or event order gets overridden by coarse spatial cues.

## What still feels unresolved

The open question is whether the same disentangling strategy helps with longer multi-event temporal reasoning, not just action-scene association.

## Next action

Treat this as the main architecture paper to compare against benchmark-first papers like TempCompass and VidHalluc.
