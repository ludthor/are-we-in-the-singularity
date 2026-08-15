import assert from "node:assert/strict";
import test from "node:test";
import {
  createPullRequestBody,
  validateWeeklyProposal,
} from "../automation/validate-weekly-proposal.mjs";

function previousIssue() {
  return {
    schemaVersion: 1,
    issue: 40,
    reviewedAt: "2026-08-03",
    verdict: "NO",
    subtitle: {
      en: "The benchmark moved. The singularity still needs directions.",
      es: "El benchmark avanzó. La singularidad aún necesita indicaciones.",
    },
    criteria: [
      "superhuman-generality",
      "closed-loop-improvement",
      "self-sustaining-acceleration",
      "forecasting-regime-broken",
    ].map((id) => ({
      id,
      status: "not_met",
      evidenceSummary: {
        en: `No qualifying evidence establishes ${id} across the required strict threshold.`,
        es: `Ninguna prueba válida demuestra ${id} conforme al umbral estricto requerido.`,
      },
    })),
    stories: [
      {
        href: "https://openai.com/index/reasoning-benchmark/",
        publisher: "OpenAI",
        headlineEn: "A reasoning benchmark exposed bounded planning limits",
        headlineEs: "Un benchmark de razonamiento mostró límites de planificación",
        labelEn: "Measured planning limit",
        labelEs: "Límite de planificación medido",
      },
      {
        href: "https://metr.org/blog/agent-time-horizon/",
        publisher: "METR",
        headlineEn: "An agent evaluation measured a longer task horizon",
        headlineEs: "Una evaluación de agentes midió un horizonte de tareas mayor",
        labelEn: "Longer, not unbounded",
        labelEs: "Mayor, no ilimitado",
      },
      {
        href: "https://deepmind.google/blog/biology-specialist/",
        publisher: "Google DeepMind",
        headlineEn: "A specialist biology model improved a protein workflow",
        headlineEs: "Un modelo biológico especializado mejoró un proceso de proteínas",
        labelEn: "Specialist science gain",
        labelEs: "Mejora científica especializada",
      },
    ].map((development) => ({
      href: development.href,
      publisher: development.publisher,
      publishedAt: "2026-07-28",
      headline: {
        en: development.headlineEn,
        es: development.headlineEs,
      },
      label: {
        en: development.labelEn,
        es: development.labelEs,
      },
      summary: {
        en: `This earlier primary-source result documents ${development.headlineEn.toLowerCase()} without satisfying the strict singularity conditions.`,
        es: `Este resultado anterior de fuente primaria documenta que ${development.headlineEs.toLowerCase()} sin cumplir las condiciones estrictas de singularidad.`,
      },
    })),
  };
}

function validProposal() {
  const previous = previousIssue();
  const proposal = structuredClone(previous);
  proposal.issue += 1;
  proposal.reviewedAt = "2026-08-10";
  proposal.subtitle = {
    en: "A fresh result arrived. The feedback loop remains on annual leave.",
    es: "Llegó un resultado nuevo. El bucle de mejora sigue de vacaciones.",
  };
  proposal.stories[0] = {
    href: "https://openai.com/index/new-reasoning-evaluation/",
    publisher: "OpenAI",
    publishedAt: "2026-08-08",
    headline: {
      en: "A new reasoning evaluation measured reliable bounded gains",
      es: "Una nueva evaluación de razonamiento midió mejoras fiables y limitadas",
    },
    label: {
      en: "New evidence, finite result",
      es: "Prueba nueva, resultado finito",
    },
    summary: {
      en: "The primary evaluation reports a newly measured capability gain with explicit limitations and no evidence of autonomous recursive improvement.",
      es: "La evaluación primaria informa de una mejora de capacidad recién medida con límites explícitos y sin pruebas de mejora recursiva autónoma.",
    },
  };
  return { previous, proposal };
}

test("accepts one new development plus honest carryovers", () => {
  const { previous, proposal } = validProposal();
  const result = validateWeeklyProposal(previous, proposal, "2026-08-10");
  assert.deepEqual(
    result.classifications.map(({ kind }) => kind),
    ["new", "carryover", "carryover"],
  );
  assert.match(
    createPullRequestBody(result, "https://github.com/example/actions/runs/1"),
    /Genuinely new/,
  );
});

test("rejects a proposal with no genuinely new development", () => {
  const { previous, proposal } = validProposal();
  proposal.stories[0] = structuredClone(previous.stories[0]);
  assert.throws(
    () => validateWeeklyProposal(previous, proposal, "2026-08-10"),
    /at least one genuinely new/,
  );
});

test("rejects carryover date or publisher laundering", () => {
  const { previous, proposal } = validProposal();
  proposal.stories[1].publishedAt = "2026-08-01";
  assert.throws(
    () => validateWeeklyProposal(previous, proposal, "2026-08-10"),
    /publication date must remain unchanged/,
  );
});

test("rejects an old development republished behind a new URL", () => {
  const { previous, proposal } = validProposal();
  proposal.stories[0] = structuredClone(previous.stories[0]);
  proposal.stories[0].href =
    "https://openai.com/index/republished-prior-development/";
  proposal.stories[0].publishedAt = "2026-08-08";
  assert.throws(
    () => validateWeeklyProposal(previous, proposal, "2026-08-10"),
    /recycle previous development/,
  );
});

test("rejects a nominally new story outside the seven-day research window", () => {
  const { previous, proposal } = validProposal();
  previous.reviewedAt = "2026-07-30";
  proposal.stories[0].publishedAt = "2026-08-01";
  assert.throws(
    () => validateWeeklyProposal(previous, proposal, "2026-08-10"),
    /seven-day research window/,
  );
});
