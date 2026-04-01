# Ranked Reading List

Rank key:
- `A`: must internalize
- `B`: important for map-building
- `C`: selective or comparison reading

## A-Tier: Must Internalize First

1. `TempCompass: Do Video LLMs Really Understand Videos?` (ACL 2024)  
   Why first: a clean diagnostic starting point for temporal perception weaknesses.  
   Link: https://arxiv.org/abs/2403.00476

2. `Video-MME: The First-Ever Comprehensive Evaluation Benchmark of Multi-modal LLMs in Video Analysis` (arXiv 2024)  
   Why first: the field-standard broad benchmark for seeing what later model papers usually optimize against.  
   Link: https://arxiv.org/abs/2405.21075

3. `MVBench: A Comprehensive Multi-modal Video Understanding Benchmark` (CVPR 2024)  
   Why first: broad temporal benchmark showing current MLLMs remain weak on time-sensitive tasks.  
   Link: https://openaccess.thecvf.com/content/CVPR2024/html/Li_MVBench_A_Comprehensive_Multi-modal_Video_Understanding_Benchmark_CVPR_2024_paper.html

4. `TimeChat: A Time-sensitive Multimodal Large Language Model for Long Video Understanding` (CVPR 2024)  
   Why first: representative method paper that injects explicit timestamp sensitivity.  
   Link: https://openaccess.thecvf.com/content/CVPR2024/html/Ren_TimeChat_A_Time-sensitive_Multimodal_Large_Language_Model_for_Long_Video_CVPR_2024_paper.html

5. `MovieChat: From Dense Token to Sparse Memory for Long Video Understanding` (CVPR 2024)  
   Why first: classic long-video memory design paper.  
   Link: https://openaccess.thecvf.com/content/CVPR2024/html/Song_MovieChat_From_Dense_Token_to_Sparse_Memory_for_Long_Video_CVPR_2024_paper.html

6. `MLVU: A Comprehensive Benchmark for Multi-Task Long Video Understanding` (arXiv 2024)  
   Why first: useful for understanding how long-video evaluation differs from short-clip QA.  
   Link: https://arxiv.org/abs/2406.04264

7. `LongVideoBench: A Benchmark for Long-context Interleaved Video-Language Understanding` (NeurIPS 2024 Datasets and Benchmarks)  
   Why first: strong reference point for long-context multimodal reasoning.  
   Link: https://arxiv.org/abs/2407.15754

8. `Temporal Reasoning Transfer from Text to Video` (ICLR 2025)  
   Why first: sharp hypothesis that the temporal bottleneck partly lives in the LLM, not just the video encoder.  
   Link: https://openreview.net/forum?id=sHAvMp5J4R

9. `Re-thinking Temporal Search for Long-Form Video Understanding` (CVPR 2025)  
   Why first: one of the clearest papers for reframing long-video understanding as sparse temporal search.  
   Link: https://openaccess.thecvf.com/content/CVPR2025/html/Ye_Re-thinking_Temporal_Search_for_Long-Form_Video_Understanding_CVPR_2025_paper.html

## B-Tier: Important for Map Building

10. `VITED: Video Temporal Evidence Distillation` (CVPR 2025)  
   Focus: evidence chains, long-form VideoQA, temporal localization.  
   Link: https://openaccess.thecvf.com/content/CVPR2025/html/Lu_VITED_Video_Temporal_Evidence_Distillation_CVPR_2025_paper.html

11. `On the Consistency of Video Large Language Models in Temporal Comprehension` (CVPR 2025)  
    Focus: robustness and trustworthiness of grounding outputs.  
    Link: https://openaccess.thecvf.com/content/CVPR2025/html/Jung_On_the_Consistency_of_Video_Large_Language_Models_in_Temporal_CVPR_2025_paper.html

12. `Omnia de EgoTempo: Benchmarking Temporal Understanding of Multi-Modal LLMs in Egocentric Videos` (CVPR 2025)  
    Focus: egocentric temporal evaluation and shortcut analysis.  
    Link: https://openaccess.thecvf.com/content/CVPR2025/html/Plizzari_Omnia_de_EgoTempo_Benchmarking_Temporal_Understanding_of_Multi-Modal_LLMs_in_CVPR_2025_paper.html

13. `Seq2Time: Sequential Knowledge Transfer for Video LLM Temporal Grounding` (CVPR 2025)  
    Focus: data-centric temporal transfer into long-video grounding.  
    Link: https://openaccess.thecvf.com/content/CVPR2025/html/Deng_Seq2Time_Sequential_Knowledge_Transfer_for_Video_LLM_Temporal_Grounding_CVPR_2025_paper.html

14. `STEP: Enhancing Video-LLMs' Compositional Reasoning by Spatio-Temporal Graph-guided Self-Training` (CVPR 2025)  
    Focus: compositional spatio-temporal reasoning and self-training.  
    Link: https://openaccess.thecvf.com/content/CVPR2025/html/Qiu_STEP_Enhancing_Video-LLMs_Compositional_Reasoning_by_Spatio-Temporal_Graph-guided_Self-Training_CVPR_2025_paper.html

15. `VideoComp: Advancing Fine-Grained Compositional and Temporal Alignment in Video-Text Models` (CVPR 2025)  
    Focus: temporal alignment under reordering and subtle negatives.  
    Link: https://openaccess.thecvf.com/content/CVPR2025/html/Kim_VideoComp_Advancing_Fine-Grained_Compositional_and_Temporal_Alignment_in_Video-Text_Models_CVPR_2025_paper.html

16. `Motion-Grounded Video Reasoning: Understanding and Perceiving Motion at Pixel Level` (CVPR 2025)  
    Focus: motion-grounded reasoning with causal and counterfactual question types.  
    Link: https://openaccess.thecvf.com/content/CVPR2025/html/Deng_Motion-Grounded_Video_Reasoning_Understanding_and_Perceiving_Motion_at_Pixel_Level_CVPR_2025_paper.html

17. `VideoEspresso: A Large-Scale Chain-of-Thought Dataset for Fine-Grained Video Reasoning via Core Frame Selection` (CVPR 2025)  
    Focus: reasoning supervision and core-frame selection.  
    Link: https://openaccess.thecvf.com/content/CVPR2025/html/Han_VideoEspresso_A_Large-Scale_Chain-of-Thought_Dataset_for_Fine-Grained_Video_Reasoning_via_CVPR_2025_paper.html

18. `UniVTG: Towards Unified Video-Language Temporal Grounding` (ICCV 2023)  
    Focus: unifying moment retrieval, highlight detection, and summarization-style browsing.  
    Link: https://openaccess.thecvf.com/content/ICCV2023/html/Lin_UniVTG_Towards_Unified_Video-Language_Temporal_Grounding_ICCV_2023_paper.html

19. `ProTeGe: Untrimmed Pretraining for Video Temporal Grounding by Video Temporal Grounding` (CVPR 2023)  
    Focus: pretraining on untrimmed videos for better boundary sensitivity.  
    Link: https://openaccess.thecvf.com/content/CVPR2023/html/Wang_ProTeGe_Untrimmed_Pretraining_for_Video_Temporal_Grounding_by_Video_Temporal_CVPR_2023_paper.html

20. `Localizing Moments in Long Video Via Multimodal Guidance` (ICCV 2023)  
    Focus: guidance-based pruning for long-video grounding.  
    Link: https://openaccess.thecvf.com/content/ICCV2023/html/Barrios_Localizing_Moments_in_Long_Video_Via_Multimodal_Guidance_ICCV_2023_paper.html

21. `Scanning Only Once: An End-to-end Framework for Fast Temporal Grounding in Long Videos` (ICCV 2023)  
    Focus: efficiency and long-video temporal grounding.  
    Link: https://openaccess.thecvf.com/content/ICCV2023/html/Pan_Scanning_Only_Once_An_End-to-end_Framework_for_Fast_Temporal_Grounding_ICCV_2023_paper.html

22. `ARGUS: Hallucination and Omission Evaluation in Video-LLMs` (ICCV 2025)  
    Focus: free-form hallucinations and omissions, including incorrect temporal relationships in video captioning.  
    Link: https://openaccess.thecvf.com/content/ICCV2025/html/Rawal_ARGUS_Hallucination_and_Omission_Evaluation_in_Video-LLMs_ICCV_2025_paper.html

23. `Enrich and Detect: Video Temporal Grounding with Multimodal LLMs` (ICCV 2025)  
    Focus: temporal grounding with explicit hallucination mitigation during query enrichment.  
    Link: https://openaccess.thecvf.com/content/ICCV2025/html/Pramanick_Enrich_and_Detect_Video_Temporal_Grounding_with_Multimodal_LLMs_ICCV_2025_paper.html

## C-Tier: Selective Comparison Reading

24. `Compositional Video Understanding with Spatiotemporal Structure-based Transformers` (CVPR 2024)  
    Focus: explicit structure and compositional generalization.  
    Link: https://openaccess.thecvf.com/content/CVPR2024/html/Yun_Compositional_Video_Understanding_with_Spatiotemporal_Structure-based_Transformers_CVPR_2024_paper.html

25. `Benchmarking the Robustness of Temporal Action Detection Models Against Temporal Corruptions` (CVPR 2024)  
    Focus: robustness to missing or corrupted temporal evidence.  
    Link: https://openaccess.thecvf.com/content/CVPR2024/html/Zeng_Benchmarking_the_Robustness_of_Temporal_Action_Detection_Models_Against_Temporal_CVPR_2024_paper.html

26. `VideoRefer Suite: Advancing Spatial-Temporal Object Understanding with Video LLM` (CVPR 2025)  
    Focus: object-centric spatial-temporal understanding.  
    Link: https://openaccess.thecvf.com/content/CVPR2025/html/Yuan_VideoRefer_Suite_Advancing_Spatial-Temporal_Object_Understanding_with_Video_LLM_CVPR_2025_paper.html

27. `Towards Debiasing Temporal Sentence Grounding in Video` (arXiv 2021)  
    Focus: old but still important anchor for annotation-bias pathology.  
    Link: https://arxiv.org/abs/2111.04321

28. `Temporal Sentence Grounding in Videos: A Survey and Future Directions` (TPAMI 2023 / arXiv)  
    Focus: survey anchor for temporal grounding terminology and taxonomy.  
    Link: https://arxiv.org/abs/2201.08071

28. `A Survey of Video Datasets for Grounded Event Understanding` (CVPRW 2024)  
    Focus: event-centric data landscape and dataset framing.  
    Link: https://openaccess.thecvf.com/content/CVPR2024W/VDU/html/Sanders_A_Survey_of_Video_Datasets_for_Grounded_Event_Understanding_CVPRW_2024_paper.html

## Suggested Reading Order by Week

### Weeks 1-2
- 1, 2, 3, 4, 17, 25

### Weeks 3-4
- 5, 6, 8, 9, 10, 24

### Weeks 5-6
- 7, 12, 13, 14, 21

### Weeks 7-8
- 11, 15, 16, 19, 20, 24

### Weeks 9-10
- 18, 21, 22, 25, 28 and targeted follow-ups around your top two idea directions

## Current Best Candidate Clusters

If you want to move toward publishable but applied-relevant work, the most promising cluster to track first is:
- `temporal search` + `evidence reasoning` + `benchmark debiasing`

Second-best cluster:
- `temporal grounding consistency` + `egocentric temporal understanding`

## Added for Temporal Hallucination Theme

If your actual topic is `temporal hallucination` or `temporal unfaithfulness` in Video-LLMs, prioritize this subset first:
- `ARGUS`
- `TempCompass`
- `On the Consistency of Video Large Language Models in Temporal Comprehension`
- `Omnia de EgoTempo`
- `Temporal Reasoning Transfer from Text to Video`
