# Training-Free Adaptive Frame Selection for Video-Language Understanding

- Venue: OpenReview
- Year: 2025
- Rank: 32
- Status: want
- PDF: `paper-library/pdfs/coselect.pdf`

## One-line takeaway

CoSeLECT is a plug-in selector that chooses frames by balancing query relevance with temporal redundancy, giving a direct alternative to uniform 8-frame sampling.

## Problem it claims to solve

Uniform or query-agnostic sparse sampling wastes budget on frames that are redundant or irrelevant to the current video-language query.

## Reading highlights

- Training-free and plug-and-play, which matches an existing production pipeline better than heavy retraining.
- Explicitly combines semantic query relevance with redundancy reduction.
- Reports gains over both uniform sampling and stronger recent selection baselines.

## Section notes

### Abstract

The paper introduces CoSeLECT, a training-free adaptive frame selection method for MLLMs that uses temporal redundancy and query relevance together.

### Introduction

The argument is that frame selection should be adaptive to both the video and the question instead of being fixed in advance.

### Method

The selector clusters redundant frames and chooses a compact set that remains semantically aligned with the input query.

### Experiments

The paper reports consistent gains on Video-MME and MVBench over uniform sampling and several strong baselines.

### Limitations

The method assumes that the text query is informative; with only a short or weak textual cue, relevance estimation may be noisier.

## Figures to inspect

- Figure 1: The two-signal selection pipeline combining query relevance and redundancy.
- Figure 2: The main comparison table against uniform sampling and recent selection methods.

## Why it matters for temporal hallucination

For small VLLMs, missing the decisive frame can turn into a confident but unsupported event label; CoSeLECT is directly useful because it tries to keep the most relevant and non-redundant evidence.

## What still feels unresolved

It is still unclear how robust the query-guidance signal is when the prompt comes from only the first few seconds rather than a full downstream question.

## Next action

Compare CoSeLECT with VAP and Adaptive Greedy, especially on tasks where the text side is weak or only partially descriptive.
