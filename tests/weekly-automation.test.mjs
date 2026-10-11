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
const deploymentWorkflow = await readFile(
  new URL("../.github/workflows/deploy-pages.yml", import.meta.url),
  "utf8",
);
const editorOutputSchema = JSON.parse(
  await readFile(
    new URL(
      "../.github/codex/schemas/weekly-dossier-output.json",
      import.meta.url,
    ),
    "utf8",
  ),
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

test("a merged current issue suppresses duplicates while a failed draft remains retryable", () => {
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
      "const alreadyPublished = approved.reviewedAt === reviewDate;",
    ),
  );
  assert.ok(
    workflow.includes(
      'core.setOutput("should_run", !alreadyPublished ? "true" : "false");',
    ),
  );
  assert.match(workflow, /Refreshing retryable audit pull request/);
});

test("weekly research receives exact dates and a structured fail-closed result", () => {
  assert.match(workflow, /genuinelyNewDateBounds/);
  assert.match(workflow, /Genuinely new publishedAt interval \(inclusive\)/);
  assert.match(workflow, /output-file: \$\{\{ runner\.temp \}\}\/weekly-editor-result\.json/);
  assert.match(
    workflow,
    /output-schema-file: \.github\/codex\/schemas\/weekly-dossier-output\.json/,
  );
  assert.match(workflow, /steps\.editor_result\.outputs\.kind == 'proposal'/);
  assert.match(workflow, /stage="editorial-shortage"/);
  assert.match(workflow, /invalid structured result or changed an unauthorized path/);
  assert.deepEqual(editorOutputSchema.properties.outcome.enum, [
    "proposal",
    "no_proposal",
  ]);
  assert.equal(editorOutputSchema.additionalProperties, false);
});

test("weekly release is head-locked, automatic, and deploys the merge commit", () => {
  const secretGate = workflow.indexOf("Confirm release secrets are configured");
  const codex = workflow.indexOf("Run the bounded Codex editor");
  assert.ok(secretGate !== -1 && secretGate < codex);
  assert.match(workflow, /npm run build:pages/);
  assert.match(workflow, /gh pr ready "\$PR_URL"/);
  assert.match(workflow, /--match-head-commit "\$head_sha"/);
  assert.match(workflow, /merge_sha: \$\{\{ steps\.merge\.outputs\.merge_sha \}\}/);
  assert.match(workflow, /commit_sha: \$\{\{ needs\.publish\.outputs\.merge_sha \}\}/);
  assert.match(workflow, /close_weekly_failure: true/);
  assert.doesNotMatch(workflow, /--add-reviewer/);
});

test("Cloudflare deployment rebuilds and verifies the exact production commit", () => {
  const checkout = deploymentWorkflow.indexOf("Check out the exact release commit");
  const install = deploymentWorkflow.indexOf("Install committed dependencies");
  const build = deploymentWorkflow.indexOf("Validate content and build the static export");
  const deploy = deploymentWorkflow.indexOf("Deploy to the production Pages branch");
  assert.ok(checkout !== -1 && checkout < install && install < build && build < deploy);
  assert.match(deploymentWorkflow, /ref: \$\{\{ inputs\.commit_sha \|\| github\.sha \}\}/);
  assert.match(deploymentWorkflow, /npm run content:validate/);
  assert.match(deploymentWorkflow, /npm run build:pages/);
  assert.match(deploymentWorkflow, /--project-name singularity-now/);
  assert.match(deploymentWorkflow, /--branch main/);
  assert.match(deploymentWorkflow, /https:\/\/singularity-now\.pages\.dev\/es\//);
  assert.match(deploymentWorkflow, /stories\[0\]\.href/);
  assert.match(deploymentWorkflow, /did not serve the expected weekly source/);
});

test("failure signaling distinguishes deploy, publish, and propose failures", () => {
  const reporter = workflow.slice(workflow.indexOf("let rawStage"));
  assert.ok(reporter.includes('process.env.DEPLOY_RESULT === "failure"'));
  assert.ok(reporter.includes('rawStage = "deploy";'));
  assert.ok(reporter.includes('process.env.PUBLISH_RESULT === "failure"'));
  assert.ok(reporter.includes('rawStage = "publish";'));
  assert.ok(reporter.includes('process.env.PROPOSE_RESULT === "failure"'));
  assert.ok(reporter.includes('rawStage = "propose";'));
  assert.ok(reporter.includes('rawStage === "success"'));
  assert.ok(workflow.includes("(?:sk[-_]|gh[opusr]_)[A-Za-z0-9_-]{12,}"));
});
