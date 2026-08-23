# Peter Tsai Personal Site v2

## Product definition

Evidence-driven multilingual professional identity system.

## Non-negotiable principles

1. Single source of truth: records are authored once and rendered into EN / zh-TW / zh-CN.
2. Evidence before narrative: factual claims must map to an evidence record; narrative positioning is explicitly marked as narrative.
3. Language parity by construction: page sections, record IDs, links and interaction behavior are shared across locales.
4. Mobile is a first-class interaction mode, not a reduced desktop layout.
5. Progressive enhancement: core content and navigation work without JavaScript.
6. Accessibility and reduced-motion behavior are part of the design system.
7. Production main remains stable while v2 evolves independently.

## Proposed source structure

```text
src/
  components/
  layouts/
  pages/
  content/
  i18n/
  styles/
public/
  assets/
qa/
```

## Content record contract

Every durable record receives a stable ID and one evidence level.

```yaml
id: kaust-phd-defense-2023
type: dissertation-defense
date: 2023-11-29
institution: KAUST

title:
  en: Broadband Wireless Communication Using Free-space Optics and Radio Frequency
  zh_tw: 寬頻無線通訊：自由空間光通訊與射頻
  zh_cn: 宽带无线通信：自由空间光通信与射频

evidence:
  level: official
  source: KAUST CEMSE
  url: https://cemse.kaust.edu.sa/events/by-type/phd-dissertation-defense/2023/11/29/broadband-wireless-communication-using-free
```

## Evidence levels

- `official`: first-party institutional record.
- `publication`: publisher / IEEE bibliographic record.
- `institutional`: institutional page, certificate, program or formal document.
- `self_reported`: factual item currently supported by the owner's own record only.
- `narrative`: positioning, synthesis or future direction; must not masquerade as a formal title, collaboration or achieved outcome.

### Claim discipline

- Participation != organization or leadership.
- Exchange != institutional collaboration.
- Affiliation != endorsement.
- Narrative positioning != formal job title.
- Future direction != completed research result.
- A record cannot use stronger relationship language than its evidence supports.

## Shared page model

### Home
Hero -> InstitutionRail -> Trajectory -> PortalGrid -> Footer

### Experience
PageIntro -> ExperienceTimeline -> AcademicMilestones -> Footer

### Research
PageIntro -> ResearchThemes -> CurrentDirection -> EvidenceLinks -> Footer

### Publications
PageIntro -> PublicationList -> Footer

### Talks
PageIntro -> AcademicMilestones -> InvitedTalks -> ConferencePresentations -> InstitutionalTalks -> Footer

### Recognition
PageIntro -> RecognitionList -> Footer

### Service
PageIntro -> FormalRoles -> ProfessionalService -> Memberships -> Participation -> Footer

## Locale parity contract

For every route, EN / zh-TW / zh-CN must share:

- the same section IDs and ordering;
- the same underlying record IDs;
- equivalent internal and evidence links;
- the same interaction capability;
- equivalent metadata and structured data.

Translation may adapt wording, but may not add or remove factual claims.

## Interaction model

Desktop: hover, focus, pointer depth and restrained reveal.

Mobile: tap/press feedback, disclosure where useful, scroll-safe layout, no hover-only information, no mandatory horizontal navigation scrolling.

All essential information remains visible without interaction.

## Design system direction

Quiet Glass / deep navy / restrained blue / high legibility / subtle motion.

Design tokens will own color, spacing, radius, typography, shadows, glass surfaces and motion duration. `prefers-reduced-motion` is mandatory.

## Automated QA gates

Before v2 can replace v1:

- all locale routes build;
- section parity passes across all three locales;
- stable record-ID parity passes;
- internal links resolve;
- evidence links are present where required;
- no horizontal document overflow at target mobile widths;
- keyboard focus is visible;
- images have alt text and dimensions;
- page titles, descriptions, canonical and hreflang metadata exist;
- structured Person data validates;
- reduced-motion mode remains usable;
- representative mobile and desktop screenshots are generated for review.

Target viewports: 375x812, 390x844, 768x1024, 1440x900.

## Migration strategy

Phase 1: architecture + content schema + evidence model.
Phase 2: migrate existing verified records without rewriting claims.
Phase 3: shared multilingual layouts/components.
Phase 4: Quiet Glass v2 visual and mobile interaction system.
Phase 5: automated parity, link, accessibility and viewport QA.
Phase 6: preview review; only then consider replacing `main`.
