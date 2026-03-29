# TimeChat: A Time-sensitive Multimodal Large Language Model for Long Video Understanding

- Venue: CVPR
- Year: 2024
- Rank: 3
- Topic fit: Timestamp-aware long-video understanding and temporal localization.
- Status: PDF on disk; summary drafted on 2026-03-27.
- PDF: `paper-library/pdfs/timechat.pdf`

## One-line takeaway

TimeChat is a method paper that tries to make a Video LLM care more explicitly about time, not just about scene semantics.

## What problem it claims to solve

It targets the mismatch between long-video understanding and weak timestamp sensitivity, where the model may summarize content without grounding it in time.

## Reading highlights

- The paper centers explicit time sensitivity as the key design axis.
- It is useful when you want to compare timestamp-aware and timestamp-blind long-video models.
- The work is more about making time visible to the model than about building a new hallucination benchmark.
- It serves as a practical method anchor for temporal localization.

## Section notes

### Abstract

The abstract frames timestamp awareness as necessary for long-video understanding and positions the model as time-sensitive rather than just language-capable.

### Introduction

The introduction motivates why long videos need explicit time binding and why that matters for model behavior.

### Method

The method builds a time-sensitive multimodal model intended to improve how temporal information is tracked over long videos.

### Experiments

The experiments compare the model against long-video baselines and emphasize whether time sensitivity improves the output.

### Limitations

The paper is not primarily a hallucination benchmark, so its main value is in showing how timestamp sensitivity can help rather than proving faithfulness on its own.

## Figures to inspect

- Figure 1: The method overview for the time-sensitive architecture.
- Figure 2: The long-video pipeline or timestamp-aware design diagram.

## Why it matters for temporal hallucination

If a model cannot bind answers to the right time, it may produce fluent but unsupported temporal claims, which is a common form of temporal hallucination.

## What still feels unresolved

The open question is whether stronger time sensitivity actually improves grounded temporal faithfulness or just improves the style of the answer.

## Next action

Use TimeChat when you want a method-side anchor for temporal localization in long video.
