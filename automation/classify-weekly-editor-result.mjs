import { execFileSync } from "node:child_process";
import { appendFile, readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { ALLOWED_SOURCE_DOMAINS } from "./weekly-schema.mjs";

const RESULT_KEYS = [
  "candidateRejections",
  "outcome",
  "shortage",
  "storyClassifications",
  "summary",
];
const SECRET_PATTERNS = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/i,
  /\b(?:sk[-_]|gh[opusr]_)[A-Za-z0-9_-]{20,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\/(?:home\/runner|Users)\/[^\s]+/,
  /[A-Z]:\\Users\\/i,
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertExactKeys(value, keys, label) {
  assert(
    value && typeof value === "object" && !Array.isArray(value),
    `${label} must be an object`,
  );
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  assert(
    JSON.stringify(actual) === JSON.stringify(expected),
    `${label} contains missing or unexpected fields`,
  );
}

function assertSafeText(value, label, { min = 0, max = 1000 } = {}) {
  assert(typeof value === "string", `${label} must be a string`);
  const trimmed = value.trim();
  assert(trimmed.length >= min, `${label} is too short`);
  assert(trimmed.length <= max, `${label} is too long`);
  for (const pattern of SECRET_PATTERNS) {
    assert(!pattern.test(trimmed), `${label} contains sensitive-looking data`);
  }
  return trimmed;
}

function isAllowedSourceUrl(value) {
  if (value === "") return true;
  let url;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
  return (
    url.protocol === "https:" &&
    url.username === "" &&
    url.password === "" &&
    ALLOWED_SOURCE_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
    )
  );
}

function assertCandidateRejection(candidate, index) {
  assertExactKeys(candidate, ["reason", "url"], `candidateRejections[${index}]`);
  const url = assertSafeText(
    candidate.url,
    `candidateRejections[${index}].url`,
    { max: 500 },
  );
  assert(
    isAllowedSourceUrl(url),
    `candidateRejections[${index}].url must be empty or an allowlisted HTTPS source`,
  );
  assertSafeText(candidate.reason, `candidateRejections[${index}].reason`, {
    min: 12,
    max: 700,
  });
}

function assertStoryClassification(story, index) {
  assertExactKeys(
    story,
    ["classification", "publishedAt", "url"],
    `storyClassifications[${index}]`,
  );
  const url = assertSafeText(story.url, `storyClassifications[${index}].url`, {
    min: 12,
    max: 500,
  });
  assert(
    isAllowedSourceUrl(url),
    `storyClassifications[${index}].url must be an allowlisted HTTPS source`,
  );
  assert(
    ["new", "supporting", "carryover"].includes(story.classification),
    `storyClassifications[${index}].classification is invalid`,
  );
  assert(
    /^\d{4}-\d{2}-\d{2}$/.test(story.publishedAt),
    `storyClassifications[${index}].publishedAt must use YYYY-MM-DD`,
  );
  const publishedAt = new Date(`${story.publishedAt}T00:00:00Z`);
  assert(
    !Number.isNaN(publishedAt.valueOf()) &&
      publishedAt.toISOString().slice(0, 10) === story.publishedAt,
    `storyClassifications[${index}].publishedAt must be a real calendar date`,
  );
}

function validateStructuredResult(result) {
  assertExactKeys(result, RESULT_KEYS, "editor result");
  assert(
    ["proposal", "no_proposal"].includes(result.outcome),
    "editor result outcome is invalid",
  );
  assertSafeText(result.summary, "editor result summary", { min: 20, max: 1000 });
  assert(
    Array.isArray(result.candidateRejections),
    "candidateRejections must be an array",
  );
  assert(
    result.candidateRejections.length <= 20,
    "candidateRejections must contain at most twenty entries",
  );
  result.candidateRejections.forEach(assertCandidateRejection);
  assert(
    Array.isArray(result.storyClassifications),
    "storyClassifications must be an array",
  );
  result.storyClassifications.forEach(assertStoryClassification);

  if (result.outcome === "no_proposal") {
    assertSafeText(result.shortage, "editor result shortage", {
      min: 20,
      max: 1000,
    });
    assert(
      result.candidateRejections.length >= 1,
      "no_proposal must include candidate rejection evidence",
    );
    assert(
      result.storyClassifications.length === 0,
      "no_proposal must not claim displayed story classifications",
    );
  } else {
    assert(result.shortage === "", "proposal must use an empty shortage");
    assert(
      result.storyClassifications.length === 3,
      "proposal must classify exactly three displayed stories",
    );
  }
}

export function classifyWeeklyEditorResult(status, result) {
  validateStructuredResult(result);
  const entries = status.split("\n").filter(Boolean);
  const changedOnlyWeekly =
    entries.length === 1 &&
    /^(?: M|M |MM|A |AM|\?\?) content\/weekly\.json$/.test(entries[0]);

  if (changedOnlyWeekly) {
    assert(
      result.outcome === "proposal",
      "content/weekly.json changed but the editor reported no_proposal",
    );
    return "proposal";
  }

  if (entries.length === 0) {
    assert(
      result.outcome === "no_proposal",
      "no files changed but the editor did not report no_proposal",
    );
    return "editorial-shortage";
  }

  throw new Error(
    `Expected no changed files or exactly content/weekly.json; found: ${entries.join(", ")}`,
  );
}

async function main() {
  const resultPath = process.argv[2];
  assert(resultPath, "result JSON path is required");
  assert(process.env.GITHUB_OUTPUT, "GITHUB_OUTPUT is required");
  const result = JSON.parse(await readFile(resultPath, "utf8"));
  const status = execFileSync(
    "git",
    ["status", "--porcelain=v1", "--untracked-files=all"],
    { encoding: "utf8" },
  );
  const kind = classifyWeeklyEditorResult(status, result);
  if (kind === "proposal") {
    execFileSync("git", ["diff", "--check"], { stdio: "inherit" });
  }
  await appendFile(process.env.GITHUB_OUTPUT, `kind=${kind}\n`);
  console.log(`Classified the bounded editor result as ${kind}.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
