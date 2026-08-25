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
- Every highlighted claim must be traceable to a public node or evidence edge.
- Desktop and mobile must preserve the same information hierarchy.
- Reduced motion is a first-class path, not a fallback.

## Website preview scope

v4 is now a multi-view website preview rather than a single interaction demo:

1. Hero identity and positioning.
2. Throughline narrative explaining the relationship-first model.
3. Research / Technology / Impact Perspective Lenses.
4. Lens summary generated from graph-backed milestones.
5. Journey cards re-ranked by lens relevance with Connected Context.
6. Research-map section with a dedicated graph-generated `research.html` deep view.
7. Selected-work section with a dedicated `work.html` evidence view.
8. Current-direction section and public profile/evidence links.
9. Desktop/mobile browser QA covers the overview and both deep views.
10. v3 production remains untouched.

## Safety

v4 development is isolated on `v4-system`. Every preview view lives under `/v4/prototype/` and must remain `noindex,nofollow`. Deep views reuse the same validated public v3 graph and exclude `internal` visibility. Do not merge or promote to production without a separate release process and explicit owner approval.
