# Temporal Video Research Reset

This workspace turns the 10-week plan into a working research system focused on temporal video understanding.

## GitHub Pages Deployment
This repo already contains a GitHub Pages workflow at [.github/workflows/deploy-pages.yml](./.github/workflows/deploy-pages.yml) that publishes the `site/` folder as a static website.

Website URL: [https://jackie840129.github.io/temporal-video-research-reset/](https://jackie840129.github.io/temporal-video-research-reset/)

Use this setup flow:

1. Create a GitHub repository and push this project to the `main` branch.
2. In GitHub, open `Settings -> Pages`.
3. Set `Source` to `GitHub Actions`.
4. Wait for the `Deploy GitHub Pages` workflow to finish.
5. Open the published URL shown in the workflow or Pages settings.

Notes:
- The site is static, so GitHub Pages is a good fit.
- The `/api/records/...` sync endpoints do not exist on GitHub Pages. In that environment the UI falls back to browser `localStorage`, so personal status/inbox changes stay in the browser you are using instead of writing back into the repo.
- Your computer does not need to stay on after the site is deployed.

## Start Here
- Read [field-map.md](./field-map.md) to rebuild the landscape.
- Use [reading-list.md](./reading-list.md) as the ranked queue.
- Fill one note per important paper with [templates/paper-note-template.md](./templates/paper-note-template.md).
- Update [trackers/idea-tracker.md](./trackers/idea-tracker.md) and [trackers/open-problems.md](./trackers/open-problems.md) every week.

## Output Artifacts
- `field map`: taxonomy, paper clusters, evaluation gaps, and comparison prompts
- `paper notes`: one-page structured notes for anchor papers
- `idea tracker`: open questions, candidate directions, and validation probes

## Weekly Cadence
- `3` deep reads
- `3-5` skim-and-rank papers
- `1` synthesis pass using [templates/weekly-synthesis-template.md](./templates/weekly-synthesis-template.md)

## Week-by-Week
See [weekly-schedule.md](./weekly-schedule.md).

## Source Policy
This workspace is seeded from primary sources only: CVPR/ICCV/OpenReview/arXiv papers and surveys published between 2023 and 2025, gathered on March 26, 2026.

## Design Principle
The system is intentionally biased against "repo cloning as learning."
Read the paper first, inspect code only to verify implementation choices, and write down what the repo hides about the real contribution.
