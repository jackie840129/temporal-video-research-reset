# Record Schemas

## `paper-records.json`
- `schema_version`
- `updated_at`
- `paper_policy`
- `papers`

Each `papers.<paperId>` object may contain:
- `status`
- `disliked`
- `priority`
- `tags`
- `notes`
- `updated_at`

## `paper-inbox.json`
- `schema_version`
- `updated_at`
- `items`
- `triage_policy`

Each inbox item may contain:
- `title`
- `url`
- `note`
- `tags`
- `source`
- `added_at`
- `triage_status`

## `topic-focus.json`
- `schema_version`
- `updated_at`
- `primary_topic`
- `secondary_topics`
- `query_terms`
- `selection_policy`
- `active_questions`
- `notes`

## `update-log.json`
- `schema_version`
- `updated_at`
- `entries`

Each entry may contain:
- `date`
- `action`
- `summary`
