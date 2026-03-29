# Anchor Note: TempCompass

## Citation
- Title: TempCompass: Do Video LLMs Really Understand Videos?
- Venue and year: ACL 2024
- Link: https://arxiv.org/abs/2403.00476

## 1. What problem is this paper actually solving?
It is trying to measure temporal perception directly instead of letting a video benchmark blur together spatial recognition, commonsense priors, and temporal understanding.

## 2. What temporal failure mode is addressed?
Event order, speed, direction, attribute change, and related temporal aspects that are easy to fake with a few frames.

## 3. What representation of time is used?
Benchmark design rather than a new model representation. The key move is data construction with conflicting videos and multiple task formats.

## 4. Where does supervision come from?
Human- and LLM-assisted benchmark construction over open-domain videos.

## 5. What is actually novel versus engineering?
- Fundamental idea: evaluate temporal ability by constructing paired or conflicting examples that reduce single-frame and language-prior shortcuts.
- Mostly packaging / engineering: benchmark assembly pipeline and task formatting.

## 6. What evidence would convince me this generalizes?
I would want to see whether models that improve on TempCompass also improve on stronger egocentric and long-video benchmarks without specialized prompting.

## 7. If the authors' preferred benchmark disappeared, would the idea still matter?
Yes. The central idea is that temporal evaluation should isolate temporal evidence instead of letting static shortcuts dominate.

## 8. What likely breaks in realistic use?
Even if models do well on format-controlled questions, they may still fail when evidence is far apart or when the task requires temporal localization instead of classification.

## 9. What the repo would probably obscure
The repo would make this look like a benchmark release, but the real contribution is a diagnostic philosophy: force the evaluation to punish non-temporal shortcuts.

## 10. My verdict
- Keep in field map as: evaluation and benchmark pathology anchor
- Relevance to my research taste: very high
- One sentence takeaway: before building another temporal model, make sure the task truly requires time.
