import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  ALLOWED_SOURCE_DOMAINS,
  CRITERION_IDS,
  validateWeeklyContent,
} from "../automation/weekly-schema.mjs";

const weekly = JSON.parse(
  await readFile(new URL("../content/weekly.json", import.meta.url), "utf8"),
);

test("weekly content passes the fail-closed schema", () => {
  assert.equal(validateWeeklyContent(weekly), weekly);
  assert.equal(weekly.criteria.length, CRITERION_IDS.length);
  assert.equal(weekly.stories.length, 3);
});

test("weekly sources remain unique and allowlisted", () => {
  const urls = weekly.stories.map((story) => new URL(story.href));
  assert.equal(new Set(urls.map((url) => url.href)).size, 3);
  for (const url of urls) {
    const hostname = url.hostname.replace(/^www\./, "");
    assert.ok(
      ALLOWED_SOURCE_DOMAINS.some(
        (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
      ),
    );
  }
});

test("fails closed on extra fields, invalid verdicts, and untrusted sources", () => {
  const withExtraField = structuredClone(weekly);
  withExtraField.internalNote = "should never ship";
  assert.throws(
    () => validateWeeklyContent(withExtraField),
    /missing or unexpected fields/,
  );

  const unjustifiedYes = structuredClone(weekly);
  unjustifiedYes.verdict = "YES";
  assert.throws(
    () => validateWeeklyContent(unjustifiedYes),
    /YES is allowed only/,
  );

  const untrustedSource = structuredClone(weekly);
  untrustedSource.stories[0].href = "https://example.com/ai-rumor";
  assert.throws(
    () => validateWeeklyContent(untrustedSource),
    /outside the source allowlist/,
  );
});

test("rejects modern API-key shapes in publishable content", () => {
  const withSyntheticSecret = structuredClone(weekly);
  const syntheticKey = ["sk", "proj", "abcdefghijklmnopqrstuvwxyz012345"].join(
    "-",
  );
  withSyntheticSecret.subtitle.en =
    `Synthetic credential ${syntheticKey} must never ship.`;
  assert.throws(
    () => validateWeeklyContent(withSyntheticSecret),
    /sensitive-looking data/,
  );
});
