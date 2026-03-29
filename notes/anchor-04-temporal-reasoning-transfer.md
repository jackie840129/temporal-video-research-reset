# Anchor Note: Temporal Reasoning Transfer from Text to Video

## Citation
- Title: Temporal Reasoning Transfer from Text to Video
- Venue and year: ICLR 2025
- Link: https://openreview.net/forum?id=sHAvMp5J4R

## 1. What problem is this paper actually solving?
It asks whether video-LLM temporal weakness really comes from visual encoding, then proposes transferring temporal reasoning skill from text into video models.

## 2. What temporal failure mode is addressed?
Poor temporal change tracking and weak reasoning about temporal relationships despite apparently adequate visual features.

## 3. What representation of time is used?
The notable shift is not a new visual time representation, but transferring temporal reasoning competence through the language side.

## 4. Where does supervision come from?
Textual temporal reasoning data and transfer into video-LLM training.

## 5. What is actually novel versus engineering?
- Fundamental idea: temporal reasoning may be bottlenecked by the LLM's reasoning capacity, not only the video encoder.
- Mostly packaging / engineering: the transfer procedure and training recipe.

## 6. What evidence would convince me this generalizes?
I would want gains on localization-heavy, evidence-sensitive benchmarks, not only multiple-choice QA.

## 7. If the authors' preferred benchmark disappeared, would the idea still matter?
Yes. The diagnostic claim alone changes where one should intervene in video-LLM systems.

## 8. What likely breaks in realistic use?
Transferred textual reasoning may remain detached from grounded visual evidence if retrieval and localization stay weak.

## 9. What the repo would probably obscure
The code may make this look like another finetuning recipe, but the real contribution is a causal hypothesis about where temporal reasoning fails.

## 10. My verdict
- Keep in field map as: diagnosis-of-bottleneck anchor
- Relevance to my research taste: very high
- One sentence takeaway: if the LLM cannot reason about time in text, better video tokens alone may not save it.
