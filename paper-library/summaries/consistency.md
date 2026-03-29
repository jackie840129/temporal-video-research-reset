# On the Consistency of Video Large Language Models in Temporal Comprehension

- Venue: CVPR
- Year: 2025
- Topic fit: Temporal consistency and self-verification under moment grounding.
- Status: PDF on disk; summary drafted on 2026-03-27.

## One-line takeaway

The paper shows that even when Video LLMs can find a moment once, they often cannot stay consistent when you probe the same belief again.

## What problem it claims to solve

It studies prediction consistency as a key indicator of robustness and trustworthiness in temporal grounding, rather than treating a single correct timestamp as enough.

## Reading highlights

- The workflow starts from an initial moment prediction and then applies probes to check whether later answers align with it.
- The paper separates grounding consistency from verification consistency.
- Current Video LLMs are sensitive to changes in video content, query wording, and task setup.
- Prompting and instruction tuning help only unstably.
- Event temporal verification tuning is proposed to explicitly train for consistency.

## Section notes

### Abstract

The abstract argues that temporal comprehension should be measured by stable behavior across probes, not just by one-shot timestamp accuracy.

### Introduction

The introduction motivates consistency as a robustness property that matters if we want models to be trustworthy temporal reasoners.

### Method

The paper builds probe questions around an initial grounding result, then checks whether the model can confirm or reject event occurrence coherently.

### Experiments

The reported behavior is close to chance-level consistency for many models, and the proposed tuning improves both grounding and consistency.

### Limitations

The approach is tied to the temporal grounding setting, so it may not fully capture broader captioning-style hallucinations or dialogue drift.

## Figures to inspect

- Figure 1: The inconsistency example where the model contradicts its own initial prediction.
- Figure 2: The probe pipeline for grounding consistency and verification consistency.

## Why it matters for temporal hallucination

Temporal hallucination is often not a single wrong answer but a lack of stable belief over time, and this paper makes that instability visible.

## What still feels unresolved

It is still unclear whether consistency is best improved by better temporal perception, better verification training, or a deeper change in the LLM backbone.

## Next action

Use this paper when arguing that temporal faithfulness needs repeated self-checks, not just first-pass accuracy.
