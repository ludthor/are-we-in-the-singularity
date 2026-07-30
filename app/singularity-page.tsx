import { Fragment } from "react";
import weekly from "../content/weekly.json";

type Locale = "en" | "es";
type CriterionId = (typeof weekly.criteria)[number]["id"];
type Status = (typeof weekly.criteria)[number]["status"];

const copy = {
  en: {
    issuePrefix: "Weekly field note / №",
    dossier: "The Singularity Dossier",
    monitoring: "Monitoring reality",
    languageLabel: "Language",
    eyebrow: "Strict-definition desk",
    title: "Are we living in the singularity now?",
    verdictLabel: "This week’s verdict",
    definitionTitle: "The strict definition.",
    definition:
      "Not “AI did something strange.” A singularity requires broadly superhuman systems improving the systems that improve them, fast enough to break ordinary forecasting.",
    chainLabel: "The singularity causal chain",
    chain: [
      "superhuman capability",
      "AI improves AI",
      "feedback accelerates",
      "forecasts fail",
    ],
    conditionsTitle: "Threshold audit",
    conditionsNote: "Four locks, no shortcuts",
    conditionNames: {
      "superhuman-generality": "Superhuman generality",
      "closed-loop-improvement": "Closed-loop AI improvement",
      "self-sustaining-acceleration": "Self-sustaining acceleration",
      "forecasting-regime-broken": "Forecasting regime broken",
    },
    statusLabels: {
      not_met: "Not met",
      partial: "Partial",
      met: "Met",
    },
    newsTitle: "Three exhibits from this week",
    newsNote: "Evidence, not vibes",
    methodLabel: "Definition desk references",
    method:
      "The verdict follows the strict intelligence-explosion tradition: greater-than-human general capability, closed-loop AI improvement, sustained acceleration, then a genuine break in predictability.",
    vinge: "Vinge, 1993",
    chalmers: "Chalmers, 2010",
    research: "Current AI R&D evidence",
    credit: "A weekly act of definitional stubbornness by",
    lastReviewedPrefix: "Last seriously reconsidered:",
  },
  es: {
    issuePrefix: "Nota semanal / n.º",
    dossier: "El dosier de la singularidad",
    monitoring: "Vigilando la realidad",
    languageLabel: "Idioma",
    eyebrow: "Mesa de definición estricta",
    title: "¿Estamos viviendo ya en la singularidad?",
    verdictLabel: "Veredicto de esta semana",
    definitionTitle: "La definición estricta.",
    definition:
      "No basta con que «la IA haya hecho algo raro». Una singularidad requiere sistemas ampliamente sobrehumanos que mejoren los sistemas que los mejoran, con suficiente rapidez como para inutilizar las predicciones ordinarias.",
    chainLabel: "La cadena causal de la singularidad",
    chain: [
      "capacidad sobrehumana",
      "la IA mejora la IA",
      "el bucle se acelera",
      "las predicciones fallan",
    ],
    conditionsTitle: "Auditoría del umbral",
    conditionsNote: "Cuatro condiciones, sin atajos",
    conditionNames: {
      "superhuman-generality": "Generalidad sobrehumana",
      "closed-loop-improvement": "Mejora de IA en bucle cerrado",
      "self-sustaining-acceleration": "Aceleración autosostenida",
      "forecasting-regime-broken": "Régimen de predicción roto",
    },
    statusLabels: {
      not_met: "No se cumple",
      partial: "Parcial",
      met: "Se cumple",
    },
    newsTitle: "Tres indicios de esta semana",
    newsNote: "Pruebas, no vibras",
    methodLabel: "Referencias del criterio",
    method:
      "El veredicto sigue la tradición estricta de la explosión de inteligencia: capacidad general superior a la humana, mejora de IA en bucle cerrado, aceleración sostenida y, por último, una ruptura real de la predictibilidad.",
    vinge: "Vinge, 1993",
    chalmers: "Chalmers, 2010",
    research: "Evidencia actual sobre I+D en IA",
    credit: "Un acto semanal de terquedad definicional por",
    lastReviewedPrefix: "Reconsiderado en serio por última vez:",
  },
} as const;

function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function formatReviewDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export default function SingularityPage({ locale }: { locale: Locale }) {
  const labels = copy[locale];

  return (
    <main className="page" lang={locale}>
      <header className="masthead">
        <div className="masthead__issue">
          {labels.issuePrefix} {String(weekly.issue).padStart(3, "0")}
        </div>
        <div className="masthead__name">{labels.dossier}</div>
        <div className="masthead__tools">
          <nav className="language-switcher" aria-label={labels.languageLabel}>
            <a
              href="/"
              hrefLang="en"
              lang="en"
              aria-current={locale === "en" ? "page" : undefined}
            >
              EN
            </a>
            <span aria-hidden="true">/</span>
            <a
              href="/es"
              hrefLang="es"
              lang="es"
              aria-current={locale === "es" ? "page" : undefined}
            >
              ES
            </a>
          </nav>
          <div className="masthead__status" aria-label={labels.monitoring}>
            <span className="live-dot" aria-hidden="true" />
            <span>{labels.monitoring}</span>
          </div>
        </div>
      </header>

      <section className="hero" aria-labelledby="page-title">
        <div className="hero__copy">
          <div>
            <div className="eyebrow">{labels.eyebrow}</div>
            <h1 id="page-title">{labels.title}</h1>
          </div>
          <p className="subtitle">{weekly.subtitle[locale]}</p>
        </div>

        <div
          className="hero__verdict"
          aria-label={`${labels.verdictLabel}: ${weekly.verdict}`}
        >
          <span className="verdict-label">{labels.verdictLabel}</span>
          <p className="verdict" aria-hidden="true">
            {weekly.verdict}
          </p>
        </div>
      </section>

      <section className="definition" aria-labelledby="definition-title">
        <p className="definition__note">
          <strong id="definition-title">{labels.definitionTitle}</strong>
          <br />
          {labels.definition}
        </p>

        <div className="chain" aria-label={labels.chainLabel}>
          {labels.chain.map((step, index) => (
            <Fragment key={step}>
              <span>{step}</span>
              {index < labels.chain.length - 1 && (
                <span className="chain__arrow" aria-hidden="true">
                  →
                </span>
              )}
            </Fragment>
          ))}
        </div>
      </section>

      <section className="evidence" aria-label={labels.conditionsTitle}>
        <div className="section section--conditions">
          <div className="section-heading">
            <h2>{labels.conditionsTitle}</h2>
            <span>{labels.conditionsNote}</span>
          </div>

          <ol className="conditions">
            {weekly.criteria.map((criterion) => {
              const id = criterion.id as CriterionId;
              const status = criterion.status as Status;
              return (
                <li
                  className={`condition${status === "partial" ? " condition--partial" : ""}`}
                  key={id}
                >
                  <span className="condition__mark" aria-hidden="true" />
                  <span className="condition__copy">
                    <span className="condition__name">
                      {labels.conditionNames[id]}
                    </span>
                    <span className="condition__description">
                      {criterion.evidenceSummary[locale]}
                    </span>
                  </span>
                  <span className="condition__status">
                    {labels.statusLabels[status]}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="section section--news">
          <div className="section-heading">
            <h2>{labels.newsTitle}</h2>
            <span>{labels.newsNote}</span>
          </div>

          <ol className="news">
            {weekly.stories.map((story, index) => (
              <li className="news-item" key={story.href}>
                <span className="news-item__number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="news-item__copy">
                  <h3 className="news-item__headline">
                    <a href={story.href} rel="noreferrer" target="_blank">
                      {story.headline[locale]}
                    </a>
                  </h3>
                  <p className="news-item__summary">
                    {story.summary[locale]}
                  </p>
                  <a
                    className="news-item__source"
                    href={story.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {story.publisher} · {formatDate(story.publishedAt, locale)} ↗
                  </a>
                </div>
                <span className="news-item__label">
                  {story.label[locale]}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="method" aria-label={labels.methodLabel}>
        <div className="method__label">{labels.methodLabel}</div>
        <p>{labels.method}</p>
        <div className="method__links">
          <a
            href="https://accelerating.org/articles/comingtechsingularity"
            rel="noreferrer"
            target="_blank"
          >
            {labels.vinge} ↗
          </a>
          <a
            href="https://consc.net/papers/singularity.pdf"
            rel="noreferrer"
            target="_blank"
          >
            {labels.chalmers} ↗
          </a>
          <a href="https://metr.org/research/" rel="noreferrer" target="_blank">
            {labels.research} ↗
          </a>
        </div>
      </section>

      <footer className="footer">
        <div className="footer__credit">
          {labels.credit}{" "}
          <a href="https://github.com/ludthor" rel="noreferrer" target="_blank">
            @ludthor
          </a>
          .{" "}
          <a href="https://github.com/ludthor" rel="noreferrer" target="_blank">
            GitHub ↗
          </a>{" "}
          /{" "}
          <a href="https://x.com/ludthor" rel="noreferrer" target="_blank">
            X ↗
          </a>
        </div>
        <div className="footer__stamp">
          {labels.lastReviewedPrefix}{" "}
          {formatReviewDate(weekly.reviewedAt, locale)}
        </div>
      </footer>
    </main>
  );
}
