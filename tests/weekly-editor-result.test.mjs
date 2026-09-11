import assert from "node:assert/strict";
import test from "node:test";
import { classifyWeeklyEditorResult } from "../automation/classify-weekly-editor-result.mjs";

function noProposalResult() {
  return {
    outcome: "no_proposal",
    summary: "No eligible development was published inside the exact new-date interval.",
    shortage: "Zero genuinely new developments qualified; at least one is required.",
    candidateRejections: [
      {
        url: "https://anthropic.com/research/older-result",
        reason: "The displayed publication date predates the previous approved review.",
      },
    ],
    storyClassifications: [],
  };
}

function proposalResult() {
  return {
    outcome: "proposal",
    summary: "Three primary-source developments were verified and classified for review.",
    shortage: "",
    candidateRejections: [],
    storyClassifications: [
      {
        url: "https://openai.com/index/new-result/",
        publishedAt: "2026-08-17",
        classification: "new",
      },
      {
        url: "https://metr.org/blog/supporting-result/",
        publishedAt: "2026-08-12",
        classification: "supporting",
      },
      {
        url: "https://epoch.ai/blog/carried-result/",
        publishedAt: "2026-08-10",
        classification: "carryover",
      },
    ],
  };
}

test("classifies a structured unchanged result as an editorial shortage", () => {
  assert.equal(
    classifyWeeklyEditorResult("", noProposalResult()),
    "editorial-shortage",
  );
});

test("classifies an exact weekly content change as a proposal", () => {
  assert.equal(
    classifyWeeklyEditorResult(" M content/weekly.json\n", proposalResult()),
    "proposal",
  );
});

test("rejects a silent no-change result", () => {
  assert.throws(
    () => classifyWeeklyEditorResult("", proposalResult()),
    /did not report no_proposal/,
  );
});

test("rejects a no-proposal claim that changed weekly content", () => {
  assert.throws(
    () =>
      classifyWeeklyEditorResult(
        " M content/weekly.json\n",
        noProposalResult(),
      ),
    /changed but the editor reported no_proposal/,
  );
});

test("rejects unauthorized changed paths", () => {
  assert.throws(
    () => classifyWeeklyEditorResult(" M README.md\n", noProposalResult()),
    /Expected no changed files or exactly content\/weekly.json/,
  );
});

test("rejects no-proposal reports without rejection evidence", () => {
  const result = noProposalResult();
  result.candidateRejections = [];
  assert.throws(
    () => classifyWeeklyEditorResult("", result),
    /must include candidate rejection evidence/,
  );
});

test("rejects rejection URLs outside the primary-source allowlist", () => {
  const result = noProposalResult();
  result.candidateRejections[0].url = "https://example.com/untrusted";
  assert.throws(
    () => classifyWeeklyEditorResult("", result),
    /allowlisted HTTPS source/,
  );
});

test("rejects sensitive-looking data in the public shortage report", () => {
  const result = noProposalResult();
  result.summary = "The private contact test@example.com supplied no qualifying evidence.";
  assert.throws(
    () => classifyWeeklyEditorResult("", result),
    /contains sensitive-looking data/,
  );
});
