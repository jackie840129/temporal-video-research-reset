# Local API

The local PowerShell server exposes JSON endpoints under `/api/`.

## Endpoints
- `GET /api/health`
- `GET /api/records/paper-records`
- `POST /api/records/paper-records`
- `GET /api/records/paper-inbox`
- `POST /api/records/paper-inbox`
- `GET /api/records/topic-focus`
- `POST /api/records/topic-focus`
- `GET /api/records/update-log`
- `POST /api/records/update-log`

## Notes
- `POST` expects a complete JSON document for the target file.
- The API is local-only and intended for the project website and Codex workflows.
