import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { ALLOWED_SOURCE_DOMAINS } from "../automation/weekly-schema.mjs";

const codexConfig = await readFile(
  new URL("../.github/codex/config.toml", import.meta.url),
  "utf8",
);
const workflow = await readFile(
  new URL("../.github/workflows/weekly-dossier.yml", import.meta.url),
  "utf8",
);

test("Codex command networking is proxied and mirrors the source allowlist", () => {
  assert.match(codexConfig, /\[features\]\nnetwork_proxy = true/);
  assert.match(
    codexConfig,
    /\[permissions\.weekly-editor\.network\]\nenabled = true/,
  );

  const marker = "[permissions.weekly-editor.network.domains]\n";
  const start = codexConfig.indexOf(marker);
  assert.notEqual(start, -1);
  const remainder = codexConfig.slice(start + marker.length);
  const end = remainder.search(/\n\[/);
  const domainSection = end === -1 ? remainder : remainder.slice(0, end);
  const configuredDomains = [...domainSection.matchAll(/^"\*\*\.(.+)" = "allow"$/gm)]
    .map(([, domain]) => domain);

  assert.deepEqual(configuredDomains, ALLOWED_SOURCE_DOMAINS);
  assert.doesNotMatch(domainSection, /^"\*" = "allow"$/m);
});

test("an older open dossier cannot suppress the current weekly run", () => {
  assert.ok(
    workflow.includes("const branch = `automation/weekly-${reviewDate}`;"),
  );
  assert.ok(
    workflow.includes(
      "const existing = pulls.find(({ head }) => head.ref === branch);",
    ),
  );
  assert.ok(
    workflow.includes(
      'core.setOutput("should_run", force || !existing ? "true" : "false");',
    ),
  );
});

test("failure signaling distinguishes publish and unclassified propose failures", () => {
  const reporter = workflow.slice(workflow.indexOf("let rawStage"));
  assert.ok(reporter.includes('process.env.PUBLISH_RESULT === "failure"'));
  assert.ok(reporter.includes('rawStage = "publish";'));
  assert.ok(reporter.includes('process.env.PROPOSE_RESULT === "failure"'));
  assert.ok(reporter.includes('rawStage = "propose";'));
  assert.ok(reporter.includes('rawStage === "success"'));
  assert.ok(workflow.includes("(?:sk[-_]|gh[opusr]_)[A-Za-z0-9_-]{12,}"));
});
