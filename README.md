# Are we living in the singularity now?

A bilingual weekly field note that answers one question using a deliberately
strict definition of the technological singularity.

- Live site: <https://singularity-now.pages.dev>
- Spanish: <https://singularity-now.pages.dev/es/>
- Previous deployment: <https://are-we-in-the-singularity.ludthor.chatgpt.site>
- Author: [@ludthor](https://github.com/ludthor)

## Local development

Requires Node.js `>=22.13.0`.

```bash
npm ci
npm run dev
npm test
```

The production site is a static export hosted on Cloudflare Pages:

```bash
npm run build:pages
npx wrangler pages deploy dist/client --project-name singularity-now
```

Weekly editorial data lives in `content/weekly.json`. The application keeps
stable labels and the strict definition in code, while both language versions
read the same issue number, verdict, evidence statuses, source URLs, and dates
from that file.

## Weekly review automation

A GitHub Actions workflow runs on hosted infrastructure every Monday morning,
with a later fallback attempt and a manual trigger. Its operating contract is
checked into `AUTOMATION.md`, so the rules are reviewable alongside the code.

The workflow:

1. Installs the committed dependencies before research, then runs Codex without
   GitHub write credentials. Its proxied command network is restricted to the
   schema's primary-source domains, and a fixed gate accepts only a
   `content/weekly.json` change.
2. Researches live primary sources from an explicit domain allowlist and
   requires at least one genuinely new development.
3. Produces one bilingual structured record for the week.
4. Rejects malformed data, non-HTTPS or non-allowlisted sources, duplicate
   stories, stale dates, sensitive-looking text, and a `YES` verdict unless all
   four strict criteria are met.
5. Mechanically compares the proposal with the previous approved issue,
   protects carryover dates and publishers, and builds and tests both language
   routes.
6. Uses a separate fixed publishing job to open or refresh a short-lived audit
   pull request containing only `content/weekly.json`.
7. Builds the Cloudflare Pages static export, marks the audit PR ready, and
   squash-merges it with a head-commit lock only after every gate passes.
8. Rebuilds the exact merged commit and deploys it to production. Research,
   publishing, and deployment failures open or refresh assigned GitHub issues.

An issue already merged for the current review date suppresses the fallback
schedule. A failed same-day draft is refreshed and retried automatically.

The pull request remains available as an audit record. Human spot checks are
welcome but are not a release gate for this intentionally low-risk toy project.

The OpenAI API key is stored only as the `OPENAI_API_KEY` Actions repository
secret and passed directly to the Codex Action. GitHub write access uses the
workflow run's short-lived `GITHUB_TOKEN`; no personal access token is stored in
the repository. Cloudflare Direct Upload uses the `CLOUDFLARE_ACCOUNT_ID` and
`CLOUDFLARE_API_TOKEN` Actions secrets only in the fixed deployment workflow.
