# Omnia de EgoTempo: Benchmarking Temporal Understanding of Multi-Modal LLMs in Egocentric Videos

- Venue: CVPR
- Year: 2025
- Rank: 11
- Topic fit: Egocentric temporal evaluation and shortcut analysis.
- Status: PDF on disk; summary drafted on 2026-03-27.
- PDF: `paper-library/pdfs/egotempo.pdf`

## One-line takeaway

EgoTempo checks whether temporal understanding still holds when the camera is first-person and the scene is much harder to shortcut.

## What problem it claims to solve

It evaluates temporal understanding in egocentric videos, where viewpoint and motion patterns differ from standard third-person clips.

## Reading highlights

- Egocentric video changes the difficulty profile of temporal reasoning.
- The benchmark is useful for exposing shortcutting in more realistic first-person scenes.
- It tests generalization beyond curated benchmark clips.
- It is a good bridge between temporal order understanding and real-world first-person video.

## Section notes

### Abstract

The abstract frames egocentric video as a harder and more realistic testbed for temporal understanding.

### Introduction

The introduction motivates why first-person video should be treated as a distinct temporal evaluation setting.

### Method

The benchmark builds egocentric evaluation tasks to test temporal understanding under first-person conditions.

### Experiments

The experiments compare models on egocentric temporal tasks and reveal how robust they are to viewpoint shift.

### Limitations

The benchmark is specialized, so it is best read as a stress test rather than a full solution to temporal hallucination.

## Figures to inspect

- Figure 1: The benchmark overview for egocentric temporal understanding.
- Figure 2: The task taxonomy or benchmark construction diagram.

## Why it matters for temporal hallucination

Egocentric videos are a useful place to catch temporal hallucination because the model has fewer easy shortcuts and the temporal structure is more realistic.

## What still feels unresolved

It is still not clear how much egocentric failure is due to viewpoint complexity versus genuine temporal reasoning weakness.

## Next action

Use EgoTempo when you want a harder, more realistic check on temporal understanding in first-person video.
