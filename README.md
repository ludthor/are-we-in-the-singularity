# Are we living in the singularity now?

A bilingual weekly field note that answers one question using a deliberately
strict definition of the technological singularity.

- Live site: <https://are-we-in-the-singularity.ludthor.chatgpt.site>
- Spanish: <https://are-we-in-the-singularity.ludthor.chatgpt.site/es>
- Author: [@ludthor](https://github.com/ludthor)

## Local development

Requires Node.js `>=22.13.0`.

```bash
npm ci
npm run dev
npm test
```

Weekly editorial data lives in `content/weekly.json`. The application keeps
stable labels and the strict definition in code, while both language versions
read the same issue number, verdict, evidence statuses, source URLs, and dates
from that file.

## Weekly review automation

A scheduled Codex project automation runs every Monday morning. Its operating
contract is checked into `AUTOMATION.md`, so the rules are reviewable alongside
the code.

The workflow:

1. Researches with web access restricted to an explicit primary-source domain
   allowlist.
2. Produces one bilingual structured record for the week.
3. Rejects malformed data, non-HTTPS or non-allowlisted sources, duplicate
   stories, stale dates, sensitive-looking text, and a `YES` verdict unless all
   four strict criteria are met.
4. Verifies that all three selected source URLs resolve.
5. Builds and tests both language routes.
6. Opens or refreshes a **draft pull request** containing only
   `content/weekly.json`.

It never deploys or merges. A person must verify the links, dates, translations,
criteria, and joke before merging.

No API key or other long-lived credential is stored in GitHub.
