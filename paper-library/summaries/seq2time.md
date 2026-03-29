# Seq2Time: Sequential Knowledge Transfer for Video LLM Temporal Grounding

- Venue: CVPR
- Year: 2025
- Rank: 12
- Status: PDF on disk; summary drafted on 2026-03-27.
- PDF: `paper-library/pdfs/seq2time.pdf`

## One-line takeaway

Seq2Time is a data-centric temporal grounding paper that asks whether sequential transfer can make Video LLMs better at finding the right moment.

## What problem it claims to solve

It targets the gap between generic video understanding and precise temporal grounding, where models may understand content but still miss the correct time span.

## Reading highlights

- The paper centers sequential knowledge transfer rather than treating grounding as a generic QA problem.
- It is useful for thinking about how temporal supervision can be staged or transferred.
- The main value is in improving grounding behavior on long-video settings where evidence is spread out.

## Section notes

### Abstract

The core claim is that temporal grounding can improve if the model is taught sequential knowledge in a way that better matches the structure of the task.

### Introduction

The paper positions temporal grounding as a transfer problem, not just a modeling problem, which is helpful when thinking about why general Video LLMs still miss time spans.

### Method

Seq2Time emphasizes sequential knowledge transfer for temporal grounding, so the method should be read as a bridge between data construction and grounding behavior.

### Experiments

The experiments matter most as a check on whether sequential transfer helps the model pick the right temporal evidence rather than only sounding more confident.

### Limitations

The main limitation is that transfer-based improvements can be hard to separate from benchmark-specific gains unless the evaluation is broad.

## Figures to inspect

- Figure 1: The overall transfer and grounding pipeline.
- Figure 2: Any figure showing how sequential knowledge is constructed or transferred.

## Why it matters for temporal hallucination

If a model can improve grounding through sequential transfer, that suggests some temporal hallucination comes from missing training structure rather than only weak perception.

## What still feels unresolved

It is still unclear how much sequential transfer generalizes beyond the grounding setting into broader open-ended video understanding.

## Next action

Compare it against TimeChat, VITED, and lvhaystack to see whether the gain is really temporal or mainly a task-formulation effect.
