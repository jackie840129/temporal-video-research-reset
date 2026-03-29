# Anchor Note: ViTED

## Citation
- Title: VITED: Video Temporal Evidence Distillation
- Venue and year: CVPR 2025
- Link: https://openaccess.thecvf.com/content/CVPR2025/html/Lu_VITED_Video_Temporal_Evidence_Distillation_CVPR_2025_paper.html

## 1. What problem is this paper actually solving?
It tries to improve long-form VideoQA by recovering sequences of temporally localized evidence spans rather than answering from uniformly sampled frames.

## 2. What temporal failure mode is addressed?
Missing nonuniformly distributed evidence and failing at multi-step temporal reasoning.

## 3. What representation of time is used?
Chains of evidence intervals and supporting visual evidence.

## 4. Where does supervision come from?
Automatically constructed evidence reasoning chains distilled from existing datasets.

## 5. What is actually novel versus engineering?
- Fundamental idea: temporal reasoning should be mediated by explicit evidence chains, not hidden inside end-task prediction.
- Mostly packaging / engineering: how the evidence chains are constructed and trained.

## 6. What evidence would convince me this generalizes?
I would want robustness to wrong or partial evidence chains, plus transfer to benchmarks built to resist language shortcuts.

## 7. If the authors' preferred benchmark disappeared, would the idea still matter?
Yes. Evidence-centric reasoning is a broadly useful lens for temporal faithfulness.

## 8. What likely breaks in realistic use?
If the evidence construction process inherits dataset biases, the chain may look interpretable without being truly causal.

## 9. What the repo would probably obscure
The implementation may feel like another training recipe, but the real contribution is a representation choice: temporal evidence should be explicit and inspectable.

## 10. My verdict
- Keep in field map as: evidence-chain anchor
- Relevance to my research taste: extremely high
- One sentence takeaway: explicit evidence chains are one of the most promising ways to turn temporal reasoning from a claim into something testable.
