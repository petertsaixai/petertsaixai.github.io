# v4 — Perspective Lenses

v4 builds on the v3 Career × Research Graph without replacing its facts or evidence model.

## Product thesis

v3 answers: **What happened, and what is it connected to?**

v4 adds: **What does this path mean from a specific visitor perspective?**

The same public graph is interpreted through three lenses:

- **Research** — education, theses, mentors, research threads, talks.
- **Technology** — technical topics and the path from research artifacts toward applied capability.
- **Impact** — the trajectory from research and institutions toward broader industry/public positioning.

No lens may invent new facts. A lens may only rank, group, and emphasize public nodes already present in the graph.

## Experience principles

- One graph, multiple readings.
- Perspective changes emphasis, never truth.
- Default experience remains quiet and legible.
- v3 is the visual quality floor: v4 should look simpler while being more capable underneath.
- Intelligence is progressive disclosure, not dashboard chrome.
- Prefer editorial rows, typography, whitespace, and relationship cues over repeated cards.
- Every highlighted claim must be traceable to a public node or evidence edge.
- Desktop and mobile must preserve the same information hierarchy.
- Reduced motion is a first-class path, not a fallback.

## Website preview scope

v4 is a multi-view website preview:

1. Hero identity and positioning, visually descended from v3.
2. Quiet Research / Technology / Impact Perspective controls.
3. Lens summary generated from graph-backed milestones.
4. Journey re-ranked by lens relevance with Connected Context.
5. Editorial research rows with a dedicated graph-generated `research.html` deep view.
6. Curated selected-work rows with a dedicated `work.html` evidence view.
7. Current-direction section and public profile/evidence links.
8. Desktop/mobile browser QA covers the overview and both deep views.
9. v3 production remains untouched.

## Visual Direction 2

The first full-site experiment proved the information architecture but became too card-heavy and dashboard-like. Direction 2 deliberately restores the v3 navy/blue palette, larger identity-led hero, timeline rhythm, restrained surfaces, and whitespace. Lens intelligence remains, but its UI is demoted from a feature block to a quiet reading control. Research and work use editorial rows rather than repeated card grids.

## Safety

v4 development is isolated on `v4-system`. Every preview view lives under `/v4/prototype/` and must remain `noindex,nofollow`. Deep views reuse the same validated public v3 graph and exclude `internal` visibility. Do not merge or promote to production without a separate release process and explicit owner approval.
