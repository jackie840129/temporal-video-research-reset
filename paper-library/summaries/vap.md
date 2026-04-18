# Video Active Perception: Efficient Inference-Time Long-Form Video Understanding with Vision-Language Models

- Venue: OpenReview
- Year: 2024
- Rank: 30
- Status: want
- PDF: `paper-library/pdfs/vap.pdf`

## One-line takeaway

Treat keyframe selection as active evidence acquisition at inference time instead of passive uniform sampling.

## Problem it claims to solve

Long-form video QA with VLMs is expensive, and uniform sparse sampling often misses decisive evidence under a fixed frame budget.

## Reading highlights

- Uses active perception to frame keyframe selection as information-seeking rather than simple subsampling.
- Emphasizes inference-time use without retraining the base video-language model.
- Useful comparison point for any pipeline that already has a lightweight text query or short description available.

## Section notes

### Abstract

The paper proposes Video Active Perception (VAP), a training-free method for long-form video understanding that selects informative frames using a lightweight text-conditioned video generation model as a prior.

### Introduction

The core argument is that long-video failure is partly a selection problem: the model cannot reason over evidence it never sees.

### Method

VAP scores candidate frames by how much they differ from the model's prior expectation, then keeps the frames that are most likely to add useful information for answering the question.

### Experiments

The paper reports stronger zero-shot results on long-form video QA benchmarks than standard uniform sampling under the same budget.

### Limitations

The method is query-dependent, so it is strongest when the downstream task or text cue is already available at selection time.

## Figures to inspect

- Figure 1: The active perception pipeline for turning prior expectation into frame selection.
- Figure 2: The result table comparing VAP against uniform or other sparse selection baselines.

## Why it matters for temporal hallucination

If sparse selection misses the real evidence, a small VLLM can produce a plausible but unsupported event label; VAP is useful because it attacks that evidence-missing failure directly.

## What still feels unresolved

The paper is strongest for query-conditioned QA and may transfer less directly to open-ended event classification when the prompt is short and noisy.

## Next action

Compare VAP against CoSeLECT and Adaptive Greedy to see which notion of query relevance best matches small-model household-event classification.
