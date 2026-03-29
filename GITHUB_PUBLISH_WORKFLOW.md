# GitHub Publish Workflow

Use this file when the user says `更新到github` or asks to publish the local site/repo changes to GitHub.

## Intent
The normal working style for this project is:

1. Make and verify changes locally first.
2. Keep using the local website as the main review surface.
3. Only after the local version looks correct, sync the project to GitHub.

## Default publish steps
When the user says `更新到github`, follow this order:

1. Read this file first.
2. Check local git status.
3. Summarize changed files briefly for the user.
4. If there are code/content changes that should be published, run:
   - `git add -A`
   - `git commit -m "<clear summary>"`
   - `git push origin main`
5. If push fails because GitHub auth or `workflow` scope is missing, explain the exact one-time step the user needs to complete, then retry after they finish.
6. Remind the user that GitHub Pages deployment may take a short time after push.

## GitHub Pages notes
- The site is published from `.github/workflows/deploy-pages.yml`.
- The Pages source in GitHub should stay set to `GitHub Actions`.
- After a successful push, check whether the workflow was included in the push if deployment is expected.

## Safety rules
- Do not publish if there are obvious unfinished edits the user likely did not intend to ship.
- Do not rewrite history.
- Do not force-push unless the user explicitly asks.
- If there is no meaningful change to publish, say so instead of making an empty commit.

## Commit message style
Prefer short, concrete messages such as:

- `Update local research site content`
- `Refresh paper lessons and records`
- `Adjust GitHub Pages publishing flow`

## Expected response pattern
When handling `更新到github`, keep the response focused on:

1. What changed locally.
2. Whether commit succeeded.
3. Whether push succeeded.
4. Whether the user should now wait for GitHub Pages deployment.
