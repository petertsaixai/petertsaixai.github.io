# IP, Trademark & Attribution Governance

This file governs third-party intellectual property used on the public Peter Tsai Ming-Cheng personal website.

## Core rule

**Evidence can be public; ownership is not implied.**

A documented relationship with an institution (education, employment, research, membership, service, participation, or collaboration) does not by itself grant permission to reproduce that institution's logo, seal, photography, illustrations, publications, or other protected assets.

## Default decision rule

When permission or licensing is unclear, use **TEXT-ONLY** presentation and link to an authoritative source where useful. Do not download an asset from search results, social media, news sites, Wikipedia, or an unofficial logo repository merely because it is publicly accessible.

## Asset status

- `APPROVED` — use is supported by an official license, brand guideline, explicit permission, or other documented basis applicable to this use.
- `TEXT-ONLY` — institution or organization may be named factually, but its visual mark is not used.
- `VERIFY` — provenance, license, trademark policy, or scope of permission still needs verification.
- `DO-NOT-USE` — known restriction, incompatible license, misleading-affiliation risk, or insufficient rights.

## Registry fields

For every third-party visual or reusable asset, record:

| Field | Meaning |
| --- | --- |
| Asset | Logo, photograph, icon, font, illustration, chart, code library, etc. |
| Rights holder / owner | Known owner or licensor |
| Original source | Official or primary source URL |
| License / policy | Applicable license, terms, or brand policy |
| Permitted use | What the documented terms allow |
| Attribution | Required credit / notice / source / license |
| Modification | Whether alteration is permitted |
| Commercial-use status | Allowed, prohibited, unclear, or not applicable |
| Endorsement risk | Whether presentation could imply sponsorship or affiliation |
| Status | APPROVED / TEXT-ONLY / VERIFY / DO-NOT-USE |
| Evidence checked | Date and short note |

## Current institution registry

| Institution / community | Current presentation | Status | Note |
| --- | --- | --- | --- |
| Hon Hai Research Institute / Foxconn | Text | TEXT-ONLY | Documented professional experience; visual mark not required for credibility. |
| KAUST | Text | TEXT-ONLY | Documented education and research; logo use to be separately verified before addition. |
| USC | Text | TEXT-ONLY | Documented visiting-scholar experience; official visual-identity rules must be checked before any mark is used. |
| National Tsing Hua University | Text | TEXT-ONLY | Documented graduate study; logo/seal use requires separate brand-policy review. |
| National Taipei University of Technology | Text | TEXT-ONLY | Documented education; logo use not yet verified. |
| National Taiwan University | Text | TEXT-ONLY | Documented executive development; logo use not yet verified. |
| National Chengchi University | Text | TEXT-ONLY | Documented executive development; logo use not yet verified. |
| IEEE | Text + official external profile link | TEXT-ONLY | Publication/professional evidence may link to IEEE Xplore; do not reproduce publisher PDFs or protected page design. |
| GitHub | Text link | TEXT-ONLY | GitHub has separate logo/trademark usage rules; text link is sufficient. |
| Rotary | Text | TEXT-ONLY | Documented service roles; visual mark use not yet verified. |

## Content-specific rules

### Logos, seals and trademarks

1. Prefer factual institution names over logos.
2. Use a logo only after checking the rights holder's current official brand/trademark guidance for this exact context.
3. Do not recolor, crop, stretch, redraw, combine, animate, or otherwise modify a protected mark unless the applicable rules explicitly permit it.
4. Do not use marks in a way that suggests endorsement, sponsorship, employment, partnership, or official institutional ownership beyond the documented relationship.
5. Do not build the site's own visual identity from another organization's trade dress.

### Publications

1. Bibliographic facts, titles, author lists, venues, years, and links should come from authoritative publication records.
2. Do not host publisher PDFs unless redistribution rights are documented.
3. Do not copy figures, tables, abstracts, or substantial publisher text merely because the paper is publicly viewable.
4. Prefer links to the authoritative publication page.

### Photographs and event media

1. Confirm who owns the photograph or media before reuse.
2. Public availability does not equal permission to republish.
3. Consider copyright, privacy, publicity/personality rights, event terms, and identifiable people separately.
4. Keep evidence of permission when permission is the basis for use.

### Open / Creative Commons material

1. Record the exact license version and source.
2. Follow the license conditions, including attribution and any NonCommercial, NoDerivatives, or ShareAlike requirements.
3. For CC attribution, capture Title (when supplied), Author, Source, and License (TASL) where applicable.
4. A license on this website's original content does not automatically cover incorporated third-party material; third-party rights must be marked separately.

### Fonts, icons, code and libraries

1. Record the license and source before adding third-party assets to the repository.
2. Preserve required notices and attribution files.
3. Check whether commercial use, modification, redistribution, embedding, or webfont use has additional conditions.
4. Prefer system fonts and minimal dependencies when they achieve the design goal.

## AI / automation guardrail

An AI agent, code assistant, or automation modifying this site must not add a third-party logo, image, font, icon pack, publication PDF, figure, or other reusable asset unless the asset registry shows `APPROVED` for the intended use.

If an asset would improve the design but is not approved, the agent must use a text-only or original CSS/HTML alternative and mark the candidate `VERIFY` rather than silently importing it.

## Website disclaimer principle

Where institutional names are grouped for credibility or navigation, the page should make clear that the names represent documented education, research, professional experience, membership, service, or participation and do not imply institutional endorsement.

## Review before release

Before merging a release that adds third-party material:

1. Identify every newly added third-party asset.
2. Verify its original source and current terms.
3. Record it in this registry.
4. Confirm required attribution is visible or bundled as appropriate.
5. Check commercial-use restrictions, especially because this personal brand and playbook may later support paid work or products.
6. Check that no presentation implies endorsement or a relationship stronger than the evidence supports.
7. If uncertain, revert to TEXT-ONLY.

## Legal note

This governance file is an internal risk-control checklist, not legal advice. Where a proposed use is commercially important, ambiguous, or high-risk, obtain permission or qualified legal advice before publication.
