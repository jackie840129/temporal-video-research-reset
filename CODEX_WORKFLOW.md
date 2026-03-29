# Codex Workflow

Use this file when you open a new Codex chat in this project.

## First message to send
Use one of these short commands:

- `Read records/ and CODEX_WORKFLOW.md, then update papers.`
- `Read records/ and CODEX_WORKFLOW.md, then organize inbox.`
- `Read records/ and CODEX_WORKFLOW.md, then plan this week.`
- `Read records/ and CODEX_WORKFLOW.md, then sync the website.`
- `Read records/, paper-library/, and CODEX_WORKFLOW.md, then continue the previous work.`

## Why
Do not rely on long chat history as memory.
The persistent memory for this project lives in:

- `records/paper-records.json`
- `records/paper-inbox.json`
- `records/topic-focus.json`
- `records/update-log.json`
- `paper-library/manifest/paper-manifest.json`
- `paper-library/logs/download-report.json`
- `GITHUB_PUBLISH_WORKFLOW.md`

## Default rules
- Never move papers marked `read` unless explicitly requested.
- Exclude disliked papers from future recommendations by default.
- Treat `Temporal hallucination in video understanding` as the main topic unless the records say otherwise.
- When the user says `撟急??湔paper`, read `records/` first, keep `read` papers fixed, skip disliked papers, and consider inbox items plus the paper-library manifest.
- When the user says `更新到github`, read `GITHUB_PUBLISH_WORKFLOW.md` first, then use that file as the publishing checklist.
