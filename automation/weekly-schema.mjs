export const CRITERION_IDS = [
  "superhuman-generality",
  "closed-loop-improvement",
  "self-sustaining-acceleration",
  "forecasting-regime-broken",
];

export const ALLOWED_SOURCE_DOMAINS = [
  "ai.google",
  "anthropic.com",
  "arxiv.org",
  "deepmind.google",
  "epoch.ai",
  "hai.stanford.edu",
  "huggingface.co",
  "metr.org",
  "microsoft.com",
  "openai.com",
  "research.google",
];

const STATUS_VALUES = new Set(["not_met", "partial", "met"]);
const SECRET_PATTERNS = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/i,
  /\b(?:sk[-_]|gh[opusr]_)[A-Za-z0-9_-]{20,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\/Users\/[^/\s]+/,
  /[A-Z]:\\Users\\/i,
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertString(value, path, { min = 1, max = 700 } = {}) {
  assert(typeof value === "string", `${path} must be a string`);
  const trimmed = value.trim();
  assert(trimmed.length >= min, `${path} is too short`);
  assert(trimmed.length <= max, `${path} is too long`);
  for (const pattern of SECRET_PATTERNS) {
    assert(!pattern.test(trimmed), `${path} contains sensitive-looking data`);
  }
}

function assertExactKeys(value, keys, path) {
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  assert(
    JSON.stringify(actual) === JSON.stringify(expected),
    `${path} contains missing or unexpected fields`,
  );
}

function assertLocalized(value, path, options) {
  assert(value && typeof value === "object", `${path} must be bilingual`);
  assertExactKeys(value, ["en", "es"], path);
  assertString(value.en, `${path}.en`, options);
  assertString(value.es, `${path}.es`, options);
}

function normalizedHostname(url) {
  return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
}

function isAllowedHostname(hostname) {
  return ALLOWED_SOURCE_DOMAINS.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
  );
}

function parseDate(value, path) {
  assert(
    typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value),
    `${path} must use YYYY-MM-DD`,
  );
  const date = new Date(`${value}T00:00:00Z`);
  assert(!Number.isNaN(date.valueOf()), `${path} is not a valid date`);
  assert(
    date.toISOString().slice(0, 10) === value,
    `${path} is not a real calendar date`,
  );
  return date;
}

export function validateWeeklyContent(data) {
  assert(data && typeof data === "object", "weekly content must be an object");
  assertExactKeys(
    data,
    [
      "schemaVersion",
      "issue",
      "reviewedAt",
      "verdict",
      "subtitle",
      "criteria",
      "stories",
    ],
    "weekly content",
  );
  assert(data.schemaVersion === 1, "schemaVersion must be 1");
  assert(
    Number.isInteger(data.issue) && data.issue > 0,
    "issue must be a positive integer",
  );
  const reviewedAt = parseDate(data.reviewedAt, "reviewedAt");
  assert(["NO", "YES"].includes(data.verdict), "verdict must be NO or YES");
  assertLocalized(data.subtitle, "subtitle", { min: 20, max: 180 });

  assert(Array.isArray(data.criteria), "criteria must be an array");
  assert(
    data.criteria.length === CRITERION_IDS.length,
    "criteria must contain exactly four entries",
  );
  const criterionIds = data.criteria.map((criterion) => criterion.id);
  assert(
    JSON.stringify(criterionIds) === JSON.stringify(CRITERION_IDS),
    "criteria must use the canonical IDs and order",
  );
  for (const [index, criterion] of data.criteria.entries()) {
    assertExactKeys(
      criterion,
      ["id", "status", "evidenceSummary"],
      `criteria[${index}]`,
    );
    assert(
      STATUS_VALUES.has(criterion.status),
      `criteria[${index}].status is invalid`,
    );
    assertLocalized(
      criterion.evidenceSummary,
      `criteria[${index}].evidenceSummary`,
      { min: 30, max: 320 },
    );
  }

  const allMet = data.criteria.every((criterion) => criterion.status === "met");
  assert(
    data.verdict === (allMet ? "YES" : "NO"),
    "YES is allowed only when all four strict criteria are met",
  );

  assert(Array.isArray(data.stories), "stories must be an array");
  assert(data.stories.length === 3, "stories must contain exactly three items");
  const seenUrls = new Set();
  for (const [index, story] of data.stories.entries()) {
    assertExactKeys(
      story,
      [
        "href",
        "publisher",
        "publishedAt",
        "headline",
        "label",
        "summary",
      ],
      `stories[${index}]`,
    );
    assertString(story.publisher, `stories[${index}].publisher`, {
      min: 2,
      max: 80,
    });
    assertString(story.href, `stories[${index}].href`, {
      min: 12,
      max: 500,
    });
    const sourceUrl = new URL(story.href);
    assert(sourceUrl.protocol === "https:", `stories[${index}].href must be HTTPS`);
    assert(
      isAllowedHostname(normalizedHostname(story.href)),
      `stories[${index}].href is outside the source allowlist`,
    );
    assert(!seenUrls.has(story.href), "story URLs must be unique");
    seenUrls.add(story.href);

    const publishedAt = parseDate(
      story.publishedAt,
      `stories[${index}].publishedAt`,
    );
    const ageDays = (reviewedAt - publishedAt) / 86_400_000;
    assert(ageDays >= 0, `stories[${index}] cannot be dated in the future`);
    assert(ageDays <= 14, `stories[${index}] is older than the 14-day window`);
    assertLocalized(story.headline, `stories[${index}].headline`, {
      min: 12,
      max: 180,
    });
    assertLocalized(story.label, `stories[${index}].label`, {
      min: 4,
      max: 70,
    });
    assertLocalized(story.summary, `stories[${index}].summary`, {
      min: 40,
      max: 420,
    });
  }

  return data;
}
