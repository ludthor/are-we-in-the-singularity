# Are we living in the singularity now?

## The one-line product

A tiny weekly newspaper that answers an enormous question with a very large
**NO**, then shows its work.

The joke is the contrast: breathless AI news goes in; a stubbornly literal
definition comes out.

## Editorial position

“AI is getting very good” is not the technological singularity.

For this project, the answer changes to **YES** only when all of these are
supported by strong, independent evidence:

1. **Superhuman general capability** — artificial systems reliably exceed the
   best humans across most consequential cognitive domains, not only selected
   benchmarks.
2. **Closed-loop AI improvement** — those systems can substantially improve AI
   research and engineering end to end, with little or no human bottleneck.
3. **Self-sustaining acceleration** — the resulting improvements produce
   faster further improvements over a sustained period.
4. **A broken forecasting regime** — technological and social change is moving
   fast enough that ordinary human-led extrapolation is no longer useful.

This is deliberately stricter than AGI, impressive agents, benchmark wins, mass
adoption, or a CEO saying the word “singularity.”

### Why this definition

- Vernor Vinge called greater-than-human intelligence the essence of the
  singularity and described a regime in which old models of the future stop
  working:
  https://accelerating.org/articles/comingtechsingularity
- David Chalmers formalized the core argument as an intelligence explosion:
  AI capable of improving AI may produce a rapid path to superintelligence:
  https://consc.net/papers/singularity.pdf
- METR’s work on long-task autonomy and AI R&D is useful evidence about the
  approach to the threshold, but capability measurements are not themselves
  proof that the threshold has been crossed:
  https://metr.org/research/

## The weekly page

### 1. The verdict

Question: **Are we living in the singularity now?**

Answer: **NO**

Weekly subtitle example:

> The models can now run your browser. They still cannot run a small-town
> zoning meeting.

Add a quiet timestamp: “Last seriously reconsidered: 30 July 2026.”

### 2. The evidence board

Four compact instruments—one for each condition—show:

- status: not met / disputed / met;
- one plain-language observation;
- the best current evidence;
- what would change the status.

This should look like an editorial infographic or a transit-status board, not a
futurist dashboard. No glowing brains, neon gradients, wireframe heads, circuit
patterns, or fake terminal text.

### 3. Three things AI did this week

Exactly three stories. Each gets:

- a factual headline;
- a two-sentence summary;
- a short “singularity relevance” label;
- a source and publication date.

Possible relevance labels:

- “Closer, technically”
- “Large, but not recursive”
- “Mostly a press release”
- “Economically weird; cosmically normal”
- “The benchmark moved. Civilization remains available.”

The page should distinguish “important AI news” from “evidence for the
singularity.” Most weeks they are not the same thing.

### 4. The strict definition

A short expandable explanation of the four conditions, with links to the
original sources. The concise view matters more than an essay.

### 5. Footer

“A weekly act of definitional stubbornness by
[@ludthor](https://x.com/ludthor).”

## Tone

Dry, observant, slightly skeptical, never sneering.

The humor should target hype, category errors, and our desire to declare every
interesting Tuesday a new epoch. It should not minimize real capabilities,
risks, labor effects, or scientific progress.

## Visual direction

Aim for a small independent newspaper or public-information poster:

- warm off-white paper;
- near-black type;
- one signal color, probably vermilion or cobalt;
- oversized grotesk “NO” paired with a readable serif for evidence;
- visible rules, footnotes, dates, and source links;
- restrained motion, perhaps only the weekly subtitle or evidence status
  changing on load;
- no stock/generated hero illustration.

The main visual resource should be the evidence board itself. A second useful
graphic is a simple four-step causal chain:

`superhuman capability → AI improves AI → feedback accelerates → forecasts fail`

## Update system

Use a weekly scheduled job, preferably Monday morning in Europe/Madrid:

1. Collect candidates from primary lab/research feeds and a small set of
   reputable independent outlets.
2. Deduplicate and rank for significance, novelty, and relevance to the four
   conditions.
3. Draft summaries, relevance labels, and several subtitle candidates.
4. Verify dates, links, and factual claims.
5. Update one versioned content file and publish.

Recommended first version: the job opens a reviewable pull request. This keeps
the humor human and prevents a bad summary or compromised feed from publishing
itself.

The verdict should be a separate, manually controlled field. A scheduled job
may recommend reconsideration, but it may not change **NO** to **YES**.

## Source policy

Prefer:

1. original papers, model cards, incident reports, and official announcements;
2. independent reporting from outlets with named authors and corrections
   policies;
3. specialist evaluation organizations such as METR or Epoch AI.

Never treat social posts, benchmark screenshots, anonymous aggregators, or
company claims as sufficient evidence for changing a condition.

## First-release scope

- One responsive page
- One weekly content file
- Four-condition evidence board
- Three sourced stories
- One dry subtitle
- Source/methodology panel
- @ludthor credit
- Scheduled draft update

No accounts, comments, newsletter, live ticker, chatbot, token counter, or
“probability of singularity” dial in v1.
