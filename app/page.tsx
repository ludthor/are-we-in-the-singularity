const conditions = [
  {
    name: "Superhuman generality",
    status: "Not met",
    description:
      "Reliable best-human performance across most consequential cognitive domains.",
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
  },
  {
    name: "Forecasting regime broken",
    status: "Not met",
    description:
      "Ordinary human-led technological extrapolation must stop being useful.",
  },
] as const;

const stories = [
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
] as const;

export default function Home() {
  return (
    <main className="page">
      <header className="masthead">
        <div className="masthead__issue">Weekly field note / № 031</div>
        <div className="masthead__name">The Singularity Dossier</div>
        <div className="masthead__status">
          <span className="live-dot" aria-hidden="true" />
          Monitoring reality
        </div>
      </header>

      <section className="hero" aria-labelledby="page-title">
        <div className="hero__copy">
          <div>
            <div className="eyebrow">Strict-definition desk</div>
            <h1 id="page-title">Are we living in the singularity now?</h1>
          </div>
          <p className="subtitle">
            One model escaped a sandbox. Your printer still needs a human
            sacrifice.
          </p>
        </div>

        <div className="hero__verdict" aria-label="Current verdict: no">
          <span className="verdict-label">This week’s verdict</span>
          <p className="verdict" aria-hidden="true">
            NO
          </p>
        </div>
      </section>

      <section className="definition" aria-labelledby="definition-title">
        <p className="definition__note">
          <strong id="definition-title">The strict definition.</strong>
          <br />
          Not “AI did something strange.” A singularity requires broadly
          superhuman systems improving the systems that improve them, fast
          enough to break ordinary forecasting.
        </p>

        <div className="chain" aria-label="The singularity causal chain">
          <span>superhuman capability</span>
          <span className="chain__arrow" aria-hidden="true">
            →
          </span>
          <span>AI improves AI</span>
          <span className="chain__arrow" aria-hidden="true">
            →
          </span>
          <span>feedback accelerates</span>
          <span className="chain__arrow" aria-hidden="true">
            →
          </span>
          <span>forecasts fail</span>
        </div>
      </section>

      <section className="evidence" aria-label="Weekly evidence">
        <div className="section section--conditions">
          <div className="section-heading">
            <h2>Threshold audit</h2>
            <span>Four locks, no shortcuts</span>
          </div>

          <ol className="conditions">
            {conditions.map((condition) => (
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
            <h2>Three exhibits from this week</h2>
            <span>Evidence, not vibes</span>
          </div>

          <ol className="news">
            {stories.map((story) => (
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

      <section className="method" aria-label="Method and references">
        <div className="method__label">Definition desk references</div>
        <p>
          The verdict follows the strict intelligence-explosion tradition:
          greater-than-human general capability, closed-loop AI improvement,
          sustained acceleration, then a genuine break in predictability.
        </p>
        <div className="method__links">
          <a
            href="https://accelerating.org/articles/comingtechsingularity"
            rel="noreferrer"
            target="_blank"
          >
            Vinge, 1993 ↗
          </a>
          <a
            href="https://consc.net/papers/singularity.pdf"
            rel="noreferrer"
            target="_blank"
          >
            Chalmers, 2010 ↗
          </a>
          <a href="https://metr.org/research/" rel="noreferrer" target="_blank">
            Current AI R&amp;D evidence ↗
          </a>
        </div>
      </section>

      <footer className="footer">
        <div className="footer__credit">
          A weekly act of definitional stubbornness by{" "}
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
          Last seriously reconsidered: 30 July 2026
        </div>
      </footer>
    </main>
  );
}
