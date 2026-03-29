# Paper Library

This folder holds the offline paper cache and reading-support assets for the Temporal Video Research Navigator.

## Layout

- `manifest/` - canonical metadata for every paper in the workspace
- `pdfs/` - downloaded PDFs, one file per paper
- `summaries/` - per-paper reading highlights and section notes
- `figures/` - optional figure crops or screenshots pulled from papers
- `extracted-text/` - raw OCR or text extraction outputs when available
- `logs/` - download reports and missing-file reports
- `manual/` - notes for papers that must be supplied by hand

## Workflow

1. Run `scripts\download-paper-library.ps1` to fetch PDFs when possible.
2. If a PDF cannot be downloaded automatically, place it under `paper-library\pdfs\` using the filename from the manifest.
3. Fill `summaries\{paper-id}.md` with reading highlights.
4. Use the manifest as the source of truth for the website's "閱讀重點" view.

## Naming

- PDF filename: `{paper-id}.pdf`
- Summary filename: `{paper-id}.md`
- Optional figure folder: `figures\{paper-id}\`

## Current topic focus

The active theme in this project is `Temporal hallucination in video understanding`.

