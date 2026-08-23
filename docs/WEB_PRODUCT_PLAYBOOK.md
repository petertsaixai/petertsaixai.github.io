# Web Product Playbook

A reusable playbook distilled from the personal-site v1→v2 development process. The goal is not to preserve one website's code, but to preserve the operating principles that made later iterations faster, safer, and more coherent.

## 1. Product framing before implementation

- Decide what the site is meant to make visitors believe or understand before choosing UI components.
- Separate **identity**, **evidence**, **navigation**, and **interaction** instead of mixing them in one page.
- Treat public web presence as a product with release stages, not as a collection of static pages.
- Define what is **public**, **expandable**, **evidence-only**, and **internal-only** before migrating content.

## 2. Canonical content, not duplicated pages

- Maintain one canonical source of truth for multilingual and multi-page content.
- Render locale variants from the same record structure whenever possible.
- Store dates, institutions, evidence URLs, titles, and relationships as data rather than hand-written repeated HTML.
- When one record appears on multiple surfaces, reuse the same record rather than copy-and-edit.
- Add validation that detects missing locale fields and rendered parity drift.

## 3. Evidence architecture

Use explicit evidence levels so public claims do not outrun the available proof.

Suggested levels:

- `official` — official institutional, DOI, publisher, repository, or authoritative source
- `documented` — reliable supporting document or record
- `self_reported` — user-provided fact that has not yet been independently verified
- `narrative` — positioning or synthesis, not a factual claim

Rules:

- Do not convert application evidence into acceptance evidence.
- Do not infer causality from chronology.
- Preserve original wording when a source is historical, then create a separate current presentation field if needed.
- Public copy should be defensible without sounding defensive.

## 4. More intelligence, less interface

- The system may know much more than the visitor sees.
- Keep the first viewport sparse and high-signal.
- Use progressive disclosure for evidence, detail, dates, supervisors, links, and supporting records.
- Avoid turning the site into a long CV simply because more data exists.
- Every added element must earn its visual weight.

## 5. Interaction must reveal meaning

Use a consistent interaction rhythm:

**Reveal → Hold → Connect → Resolve**

- Reveal: expose the important signal.
- Hold: give the user enough time to understand it.
- Connect: show the relationship to people, institutions, research, time, or evidence.
- Resolve: return attention to the larger identity or story.

Rules:

- If motion only moves and reveals no meaning, remove it.
- Stronger motion belongs to stronger semantic transitions.
- Desktop hover and mobile tap should express the same concept, not imitate each other mechanically.
- Respect `prefers-reduced-motion`.

## 6. Information architecture by meaning, not by file count

Use content types that match how visitors think:

- Identity / Hero
- Journey / Experience
- Research
- Publications
- Talks / Academic milestones
- Recognition
- Service / Engagement
- Institutions / Communities
- Evidence / Sources

Do not create a new page just because a new dataset exists. Prefer grouped views, filters, timelines, and progressive disclosure.

## 7. Time-based content

- Sort dated content newest → oldest unless the narrative strongly requires otherwise.
- Group multiple records from the same milestone instead of repeating large cards.
- Prefer `Year → Milestone → Records → Evidence` over one-dot-per-record timelines.
- Keep publication-heavy surfaces grouped by year rather than forcing every item into a timeline.

## 8. Multilingual design

- Treat EN / zh-TW / zh-CN as one product, not three separate sites.
- Shared components first; locale content second.
- Test long labels and mobile overflow in every language.
- Avoid layout logic that only works because English strings are short.
- Add automated parity checks before release.

## 9. Mobile is a separate interaction surface

- Do not merely shrink desktop.
- Verify header, language switcher, institution labels, cards, timelines, and interactive targets on narrow screens.
- Prevent horizontal scrolling unless the interaction intentionally requires it.
- Prefer tap states, expansion, and concise detail over hover-dependent behavior.
- Make touch targets comfortably tappable.

## 10. Release engineering

Treat release as a gate sequence:

**Build → Validate → Preview/Artifact → Human QA → Merge → Production deploy → Smoke test**

Important lessons:

- `file exists` ≠ `deployed`.
- `workflow success` ≠ `public URL works`.
- `artifact uploaded` ≠ `preview hosted`.
- Do not announce success until the public endpoint returns the expected content.
- Separate feature work from release fixes once a version becomes a release candidate.
- Freeze scope before production cutover.

## 11. Preview strategy

- A preview must be independently verifiable in a browser.
- If preview hosting becomes a disproportionate blocker, do not confuse that with product readiness.
- Preserve a rollback point before production cutover.
- Production smoke tests should verify HTTP status, expected page content, language routes, navigation, CSS, and core interactions.

## 12. Branch and version discipline

- Use a dedicated branch per major version or system iteration.
- Do not mix next-generation experimentation into a release candidate.
- Create the next version only after the previous release branch is stable enough to separate concerns.
- Avoid force-updating long-lived branches unless recovery truly requires it.
- Keep version-specific code separate from version-independent site assets.

## 13. Cross-version state must survive redesigns

Some data belongs to the website as a long-lived product, not to a particular visual version:

- site launch date
- last published/updated date
- lifetime visits/pageviews
- analytics baseline
- evidence archive
- release history

Rule:

**Version changes must not erase history.**

If version-specific analytics are useful, store both lifetime and per-version counts. Public display can remain minimal.

## 14. Image and identity assets

- Use stable, authorized, public assets where possible.
- Avoid fragile external image URLs as the only long-term source for important identity imagery.
- Define fallback behavior for missing images.
- Keep identity effects subtle enough that the person's name remains the final focus.

## 15. Writing and positioning

- Prefer precise wording over impressive wording.
- Separate current positioning from historical source text.
- Avoid claims that overstate collaboration, selection, degree status, leadership, or institutional endorsement.
- Use strong evidence to reduce the need for defensive explanations.
- The public site should elevate the strongest verified signals and keep low-value or easily misread detail out of the first layer.

## 16. Reusable checklist for future websites

Before building:
- What should a visitor remember after 10 seconds?
- What is the canonical source of truth?
- Which claims need evidence?
- What belongs in the first layer vs. expand-on-demand?

Before release:
- Do all locales render from the same canonical data?
- Is there any horizontal overflow on mobile?
- Are dated records ordered correctly?
- Are public claims supported at the intended evidence level?
- Do build and parity checks pass?
- Does the actual public URL return the correct page?
- Is rollback possible?

After release:
- Run production smoke tests.
- Record release date / last updated.
- Preserve analytics counters across redesigns.
- Move new ideas to the next-version branch instead of reopening the release scope.

---

## Core principles

1. **More intelligence, less interface.**
2. **Every interaction must reveal meaning.**
3. **Reveal → Hold → Connect → Resolve.**
4. **Evidence before embellishment.**
5. **File exists ≠ deployed.**
6. **Version changes must not erase history.**
7. **Release candidates should stop accumulating features.**
