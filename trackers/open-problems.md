# Open Problems

Only keep problems here if they survive comparison across papers.

## Seeded Problems from the Current Literature

1. Temporal search is still under-modeled.
   Many long-video systems still behave like sparse frame samplers rather than evidence retrievers. LV-Haystack and ViTED suggest that frame selection quality, not only context length, is the core bottleneck.

2. Benchmarks often overestimate temporal understanding.
   TempCompass, EgoTempo, and debiasing work all point to shortcutting through language priors, single frames, or annotation regularities.

3. Temporal grounding outputs are not reliably self-consistent.
   Consistency-focused work suggests models can produce plausible moments without stable underlying temporal representations.

4. Better video encoders are not the whole story.
   Temporal Reasoning Transfer from Text to Video argues the LLM itself may bottleneck temporal reasoning, which opens a different intervention path.

5. Compositional temporal reasoning is still weakly grounded.
   STEP, VideoComp, and Motion-Grounded Video Reasoning all indicate that multi-step reasoning gains are fragile unless evidence is explicit.

## Problem Statement Template
- Problem:
- Papers compared:
- Why current results are insufficient:
- What minimal probe would expose the gap:
- Why this matters:
