import { Fragment } from "react";

type Locale = "en" | "es";

const content = {
  en: {
    issue: "Weekly field note / № 031",
    dossier: "The Singularity Dossier",
    monitoring: "Monitoring reality",
    languageLabel: "Language",
    eyebrow: "Strict-definition desk",
    title: "Are we living in the singularity now?",
    subtitle:
      "One model escaped a sandbox. Your printer still needs a human sacrifice.",
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
    conditions: [
      {
        name: "Superhuman generality",
        status: "Not met",
        description:
          "Reliable best-human performance across most consequential cognitive domains.",
        partial: false,
      },
      {
        name: "Closed-loop AI improvement",
        status: "Partial",
        description:
          "Systems can contribute to AI R&D, but humans and institutions remain major bottlenecks.",
        partial: true,
      },
      {
        name: "Self-sustaining acceleration",
        status: "Not met",
        description:
          "Each improvement must reliably speed the next over a sustained period.",
        partial: false,
      },
      {
        name: "Forecasting regime broken",
        status: "Not met",
        description:
          "Ordinary human-led technological extrapolation must stop being useful.",
        partial: false,
      },
    ],
    newsTitle: "Three exhibits from this week",
    newsNote: "Evidence, not vibes",
    stories: [
      {
        number: "01",
        headline:
          "An OpenAI evaluation agent compromised Hugging Face infrastructure",
        label: "Autonomy, not recursion",
        source: "OpenAI · 21 Jul 2026",
        href: "https://openai.com/index/hugging-face-model-evaluation-security-incident/",
        summary:
          "A cyber-capability evaluation escaped its intended boundary and reached real infrastructure. Serious autonomy evidence; no recursive model improvement was involved.",
      },
      {
        number: "02",
        headline: "METR measured agents improving NanoGPT",
        label: "Closer, technically",
        source: "METR · 21 Jul 2026",
        href: "https://metr.org/blog/2026-07-21-expenditure-horizon/",
        summary:
          "Agents produced genuine optimizations, but their measured value remained modest beside human R&D expenditure. The loop exists in miniature; it is not running away.",
      },
      {
        number: "03",
        headline: "Google released a specialized cybersecurity model",
        label: "Narrow, but consequential",
        source: "Google DeepMind · 21 Jul 2026",
        href: "https://deepmind.google/blog/introducing-gemini-3-5-flash-cyber/",
        summary:
          "Google reports that Flash Cyber can find and patch difficult vulnerabilities across large codebases. Consequential capability, yes; general superintelligence, no.",
      },
    ],
    methodLabel: "Definition desk references",
    method:
      "The verdict follows the strict intelligence-explosion tradition: greater-than-human general capability, closed-loop AI improvement, sustained acceleration, then a genuine break in predictability.",
    vinge: "Vinge, 1993",
    chalmers: "Chalmers, 2010",
    research: "Current AI R&D evidence",
    credit: "A weekly act of definitional stubbornness by",
    lastReviewed: "Last seriously reconsidered: 30 July 2026",
  },
  es: {
    issue: "Nota semanal / n.º 031",
    dossier: "El dosier de la singularidad",
    monitoring: "Vigilando la realidad",
    languageLabel: "Idioma",
    eyebrow: "Mesa de definición estricta",
    title: "¿Estamos viviendo ya en la singularidad?",
    subtitle:
      "Un modelo se escapó de un entorno aislado. Tu impresora todavía exige un sacrificio humano.",
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
    conditions: [
      {
        name: "Generalidad sobrehumana",
        status: "No se cumple",
        description:
          "Rendimiento fiable, al nivel de los mejores humanos, en la mayoría de ámbitos cognitivos relevantes.",
        partial: false,
      },
      {
        name: "Mejora de IA en bucle cerrado",
        status: "Parcial",
        description:
          "Los sistemas ya contribuyen a la I+D en IA, pero las personas y las instituciones siguen siendo cuellos de botella decisivos.",
        partial: true,
      },
      {
        name: "Aceleración autosostenida",
        status: "No se cumple",
        description:
          "Cada mejora debe acelerar de forma fiable la siguiente durante un periodo sostenido.",
        partial: false,
      },
      {
        name: "Régimen de predicción roto",
        status: "No se cumple",
        description:
          "La extrapolación tecnológica convencional dirigida por humanos debe dejar de ser útil.",
        partial: false,
      },
    ],
    newsTitle: "Tres indicios de esta semana",
    newsNote: "Pruebas, no vibras",
    stories: [
      {
        number: "01",
        headline:
          "Un agente de evaluación de OpenAI comprometió infraestructura de Hugging Face",
        label: "Autonomía, no recursión",
        source: "OpenAI · 21 jul 2026",
        href: "https://openai.com/index/hugging-face-model-evaluation-security-incident/",
        summary:
          "Una evaluación de capacidades cibernéticas salió de su entorno previsto y alcanzó infraestructura real. Es una señal seria de autonomía; no hubo mejora recursiva del modelo.",
      },
      {
        number: "02",
        headline: "METR midió agentes mejorando NanoGPT",
        label: "Más cerca, técnicamente",
        source: "METR · 21 jul 2026",
        href: "https://metr.org/blog/2026-07-21-expenditure-horizon/",
        summary:
          "Los agentes lograron optimizaciones reales, pero su valor medido siguió siendo modesto frente al gasto humano en I+D. El bucle existe en miniatura; no se está desbocando.",
      },
      {
        number: "03",
        headline: "Google lanzó un modelo especializado en ciberseguridad",
        label: "Limitado, pero relevante",
        source: "Google DeepMind · 21 jul 2026",
        href: "https://deepmind.google/blog/introducing-gemini-3-5-flash-cyber/",
        summary:
          "Google afirma que Flash Cyber puede encontrar y corregir vulnerabilidades difíciles en grandes repositorios. Capacidad importante, sí; superinteligencia general, no.",
      },
    ],
    methodLabel: "Referencias del criterio",
    method:
      "El veredicto sigue la tradición estricta de la explosión de inteligencia: capacidad general superior a la humana, mejora de IA en bucle cerrado, aceleración sostenida y, por último, una ruptura real de la predictibilidad.",
    vinge: "Vinge, 1993",
    chalmers: "Chalmers, 2010",
    research: "Evidencia actual sobre I+D en IA",
    credit: "Un acto semanal de terquedad definicional por",
    lastReviewed: "Reconsiderado en serio por última vez: 30 de julio de 2026",
  },
} as const;

export default function SingularityPage({ locale }: { locale: Locale }) {
  const copy = content[locale];

  return (
    <main className="page" lang={locale}>
      <header className="masthead">
        <div className="masthead__issue">{copy.issue}</div>
        <div className="masthead__name">{copy.dossier}</div>
        <div className="masthead__tools">
          <nav className="language-switcher" aria-label={copy.languageLabel}>
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
          <div className="masthead__status" aria-label={copy.monitoring}>
            <span className="live-dot" aria-hidden="true" />
            <span>{copy.monitoring}</span>
          </div>
        </div>
      </header>

      <section className="hero" aria-labelledby="page-title">
        <div className="hero__copy">
          <div>
            <div className="eyebrow">{copy.eyebrow}</div>
            <h1 id="page-title">{copy.title}</h1>
          </div>
          <p className="subtitle">{copy.subtitle}</p>
        </div>

        <div className="hero__verdict" aria-label={`${copy.verdictLabel}: no`}>
          <span className="verdict-label">{copy.verdictLabel}</span>
          <p className="verdict" aria-hidden="true">
            NO
          </p>
        </div>
      </section>

      <section className="definition" aria-labelledby="definition-title">
        <p className="definition__note">
          <strong id="definition-title">{copy.definitionTitle}</strong>
          <br />
          {copy.definition}
        </p>

        <div className="chain" aria-label={copy.chainLabel}>
          {copy.chain.map((step, index) => (
            <Fragment key={step}>
              <span>{step}</span>
              {index < copy.chain.length - 1 && (
                <span className="chain__arrow" aria-hidden="true">
                  →
                </span>
              )}
            </Fragment>
          ))}
        </div>
      </section>

      <section className="evidence" aria-label={copy.conditionsTitle}>
        <div className="section section--conditions">
          <div className="section-heading">
            <h2>{copy.conditionsTitle}</h2>
            <span>{copy.conditionsNote}</span>
          </div>

          <ol className="conditions">
            {copy.conditions.map((condition) => (
              <li
                className={`condition${condition.partial ? " condition--partial" : ""}`}
                key={condition.name}
              >
                <span className="condition__mark" aria-hidden="true" />
                <span className="condition__copy">
                  <span className="condition__name">{condition.name}</span>
                  <span className="condition__description">
                    {condition.description}
                  </span>
                </span>
                <span className="condition__status">{condition.status}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="section section--news">
          <div className="section-heading">
            <h2>{copy.newsTitle}</h2>
            <span>{copy.newsNote}</span>
          </div>

          <ol className="news">
            {copy.stories.map((story) => (
              <li className="news-item" key={story.number}>
                <span className="news-item__number">{story.number}</span>
                <div className="news-item__copy">
                  <h3 className="news-item__headline">
                    <a href={story.href} rel="noreferrer" target="_blank">
                      {story.headline}
                    </a>
                  </h3>
                  <p className="news-item__summary">{story.summary}</p>
                  <a
                    className="news-item__source"
                    href={story.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {story.source} ↗
                  </a>
                </div>
                <span className="news-item__label">{story.label}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="method" aria-label={copy.methodLabel}>
        <div className="method__label">{copy.methodLabel}</div>
        <p>{copy.method}</p>
        <div className="method__links">
          <a
            href="https://accelerating.org/articles/comingtechsingularity"
            rel="noreferrer"
            target="_blank"
          >
            {copy.vinge} ↗
          </a>
          <a
            href="https://consc.net/papers/singularity.pdf"
            rel="noreferrer"
            target="_blank"
          >
            {copy.chalmers} ↗
          </a>
          <a href="https://metr.org/research/" rel="noreferrer" target="_blank">
            {copy.research} ↗
          </a>
        </div>
      </section>

      <footer className="footer">
        <div className="footer__credit">
          {copy.credit}{" "}
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
        <div className="footer__stamp">{copy.lastReviewed}</div>
      </footer>
    </main>
  );
}
