import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { validateWeeklyContent } from "./weekly-schema.mjs";

const DAY_MS = 86_400_000;
const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "de",
  "del",
  "el",
  "en",
  "for",
  "from",
  "in",
  "la",
  "las",
  "los",
  "of",
  "on",
  "para",
  "por",
  "que",
  "the",
  "to",
  "un",
  "una",
  "y",
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function parseDate(value) {
  return new Date(`${value}T00:00:00Z`);
}

function normalizeText(value) {
  return value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
    .trim();
}

function tokens(value) {
  return new Set(
    normalizeText(value)
      .split(/\s+/)
      .filter((token) => token.length > 2 && !STOP_WORDS.has(token)),
  );
}

function jaccard(left, right) {
  const union = new Set([...left, ...right]);
  if (union.size === 0) return 0;
  let intersection = 0;
  for (const token of left) {
    if (right.has(token)) intersection += 1;
  }
  return intersection / union.size;
}

export function likelySameDevelopment(left, right) {
  for (const language of ["en", "es"]) {
    if (
      normalizeText(left.headline[language]) ===
      normalizeText(right.headline[language])
    ) {
      return true;
    }
    if (
      jaccard(
        tokens(left.headline[language]),
        tokens(right.headline[language]),
      ) >= 0.8
    ) {
      return true;
    }
  }
  return false;
}

export function validateWeeklyProposal(previous, proposal, expectedReviewDate) {
  validateWeeklyContent(previous);
  validateWeeklyContent(proposal);

  assert(
    proposal.issue === previous.issue + 1,
    `issue must increment exactly once from ${previous.issue}`,
  );
  assert(
    proposal.reviewedAt === expectedReviewDate,
    `reviewedAt must equal the actual review date ${expectedReviewDate}`,
  );
  assert(
    parseDate(proposal.reviewedAt) > parseDate(previous.reviewedAt),
    "reviewedAt must be strictly after the previous approved reviewedAt",
  );

  for (let left = 0; left < proposal.stories.length; left += 1) {
    for (let right = left + 1; right < proposal.stories.length; right += 1) {
      assert(
        !likelySameDevelopment(proposal.stories[left], proposal.stories[right]),
        `stories[${left}] and stories[${right}] appear to describe the same development`,
      );
    }
  }

  const previousByUrl = new Map(
    previous.stories.map((story) => [story.href, story]),
  );
  const classifications = [];

  for (const [index, story] of proposal.stories.entries()) {
    const priorStory = previousByUrl.get(story.href);
    if (priorStory) {
      assert(
        story.publisher === priorStory.publisher,
        `stories[${index}] carryover publisher must remain unchanged`,
      );
      assert(
        story.publishedAt === priorStory.publishedAt,
        `stories[${index}] carryover publication date must remain unchanged`,
      );
      classifications.push({ index, kind: "carryover", story });
      continue;
    }

    const afterPreviousReview =
      parseDate(story.publishedAt) > parseDate(previous.reviewedAt);
    const duplicateIndex = previous.stories.findIndex((candidate) =>
      likelySameDevelopment(story, candidate),
    );
    if (afterPreviousReview) {
      const ageDays =
        (parseDate(proposal.reviewedAt) - parseDate(story.publishedAt)) / DAY_MS;
      assert(
        ageDays <= 7,
        `stories[${index}] cannot count as genuinely new outside the seven-day research window`,
      );
      assert(
        duplicateIndex === -1,
        `stories[${index}] appears to recycle previous development stories[${duplicateIndex}] through a new URL`,
      );
      classifications.push({ index, kind: "new", story });
      continue;
    }

    assert(
      duplicateIndex === -1,
      `stories[${index}] appears to relabel previous development stories[${duplicateIndex}] as supporting evidence through a new URL`,
    );
    classifications.push({ index, kind: "supporting", story });
  }

  const newStories = classifications.filter(({ kind }) => kind === "new");
  assert(
    newStories.length >= 1,
    "proposal must contain at least one genuinely new date, URL, and development",
  );

  return {
    previousIssue: previous.issue,
    issue: proposal.issue,
    previousReviewedAt: previous.reviewedAt,
    reviewedAt: proposal.reviewedAt,
    verdict: proposal.verdict,
    classifications,
  };
}

function markdownLinkLabel(value) {
  return value.replace(/[\[\]]/g, "");
}

export function createPullRequestBody(result, runUrl) {
  const lines = [
    "## Weekly dossier proposal",
    "",
    `Automated proposal for issue ${result.issue}, reviewed ${result.reviewedAt}.`,
    `Workflow run: ${runUrl}`,
    "",
  ];

  if (result.verdict === "YES") {
    lines.push(
      "> [!WARNING]",
      "> This proposal changes the verdict to **YES**. All four strict conditions still require explicit human verification.",
      "",
    );
  }

  lines.push("### Story classification", "");
  for (const { kind, story } of result.classifications) {
    const label =
      kind === "new"
        ? "Genuinely new"
        : kind === "carryover"
          ? "Carryover"
          : "Supporting (not new, not carried over)";
    lines.push(
      `- **${label}:** ${story.publisher} — [${markdownLinkLabel(story.headline.en)}](${story.href}) (${story.publishedAt})`,
    );
  }

  lines.push(
    "",
    "### Automated gates",
    "",
    "- [x] Exactly three distinct source URLs are present.",
    "- [x] At least one source has a new URL and publication date strictly after the previous approved review.",
    "- [x] Carryovers retain their original publisher, URL, and publication date.",
    "- [x] All sources satisfy the schema's 14-day maximum age.",
    "- [x] The proposal changes only `content/weekly.json`.",
    "- [x] Content validation and the complete test suite passed.",
    "",
    "### Human review",
    "",
    "- [ ] Confirm at least one displayed development is genuinely new, including the underlying event rather than only its URL.",
    "- [ ] Open all three source links and verify publisher, title, publication date, relevance, and primary-source status.",
    "- [ ] Confirm every carryover is honestly labeled and still timely and consequential.",
    "- [ ] Confirm the English and Spanish text have equivalent meaning.",
    "- [ ] Review all four criteria in canonical order and verify their evidence.",
    "- [ ] Confirm the verdict is `YES` only if all four strict criteria are `met`.",
    "- [ ] Confirm the subtitle is accurate, dryly humorous, and appropriate in both languages.",
    "",
    "This pull request is intentionally a draft. The automation never merges or deploys.",
  );

  return `${lines.join("\n")}\n`;
}

function parseArguments(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    assert(key?.startsWith("--") && value, `invalid argument near ${key}`);
    result[key.slice(2)] = value;
  }
  return result;
}

async function main() {
  const args = parseArguments(process.argv.slice(2));
  for (const required of [
    "previous",
    "current",
    "review-date",
    "metadata",
    "pr-body",
    "run-url",
  ]) {
    assert(args[required], `--${required} is required`);
  }

  const previous = JSON.parse(await readFile(args.previous, "utf8"));
  const proposal = JSON.parse(await readFile(args.current, "utf8"));
  const validation = validateWeeklyProposal(
    previous,
    proposal,
    args["review-date"],
  );
  const metadata = {
    issue: validation.issue,
    reviewedAt: validation.reviewedAt,
    verdict: validation.verdict,
    title: `Weekly singularity review ${validation.reviewedAt}`,
    classifications: validation.classifications.map(({ kind, story }) => ({
      kind,
      publisher: story.publisher,
      publishedAt: story.publishedAt,
      href: story.href,
      headline: story.headline.en,
    })),
  };

  await writeFile(args.metadata, `${JSON.stringify(metadata, null, 2)}\n`);
  await writeFile(
    args["pr-body"],
    createPullRequestBody(validation, args["run-url"]),
  );
  console.log(
    `Validated weekly proposal ${validation.previousIssue} -> ${validation.issue} with ${validation.classifications.filter(({ kind }) => kind === "new").length} genuinely new development(s).`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
