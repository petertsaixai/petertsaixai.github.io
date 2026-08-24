# v3 — Career × Research Graph

v3 is not “more content.” It is a quieter interface backed by a richer relationship model.

## Product principles

- **More intelligence, less interface.**
- **Every interaction must reveal meaning. If it only moves, remove it.**
- **Reveal → Hold → Connect → Resolve.**
- **The story always resolves back to Peter Tsai Ming-Cheng.**
- **Version changes must not erase history.**

## Public experience

The first view stays sparse: identity, positioning, and a small number of exploration anchors. Education, research, mentors, talks, awards, institutions, places, and evidence are progressively disclosed rather than listed all at once.

## Signature identity motion

The name animation is the motion reference for the whole system:

1. Full name appears first.
2. `AI` in `TsAI` reveals and holds.
3. A subtle gradient sweep travels across `TSAI`.
4. `ENG` in `Ming-ChENG` reveals and holds.
5. The emphasis resolves back into the full name: **Peter Tsai Ming-Cheng**.

The full sequence should run once on first entry, roughly 6–8 seconds total. Hover/tap may replay a shorter version. It should never loop continuously.

## Motion grammar

All important interactions use the same four-beat rhythm:

**Reveal → Hold → Connect → Resolve**

- Journey: reveal a year → hold → connect institution/research/mentor → resolve to the full journey.
- Mentor: reveal person → hold → connect related years/work → resolve to Peter's trajectory.
- Research: reveal topic → hold → connect talks/publications/milestones → resolve to overall positioning.
- Evidence: reveal only on demand → verify → collapse back into the concise presentation.

Motion hierarchy follows information hierarchy. The name gets the richest motion; journey is secondary; ordinary cards only receive light feedback.

## Information architecture

The internal model may know much more than the visitor sees:

- Person
- Institution
- Education
- Experience
- Research topic
- Mentor / supervisor
- Thesis / dissertation
- Publication
- Conference presentation
- Award
- Teaching
- Place
- Evidence

These are graph relationships, not repeated resume fields.

## Visibility model

Every fact receives a visibility level:

- `hero` — strongest positioning signals only
- `explore` — useful public context
- `evidence` — official or supporting proof shown on demand
- `internal` — retained for accuracy but not proactively surfaced

Public presentation must stay factual and selective. Internal facts can prevent overclaiming without becoming public emphasis.

## Persistent site metadata

The following belong to the site, not to a version:

- `site_launch_at`
- `last_published_at`
- `lifetime_visits`
- optional `views_by_version`
- release history
- evidence archive

A v4/v5 redesign must continue the same lifetime counters and history instead of resetting them.

`last_published_at` should represent a meaningful content release, not every CSS or implementation commit.

## v3 scope rule

v2 remains the production release line. v3 development happens only on `v3-system` until a later release gate.
