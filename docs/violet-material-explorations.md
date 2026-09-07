# Violet Circuit material explorations

Status: **SHIP FOR USER REVIEW** (2026-09-06). The user approved both full-page comps for implementation with “Build both for me to review.” These are independent alternatives; neither has been selected as the homepage. This record applies only to `layouts/partials/violet-replacements/` and the two exploration routes. The Routed intelligence rules in `DESIGN.md` and `.impeccable/design.json` retain their existing scope.

| Alternative | Local review | Approved comp |
| --- | --- | --- |
| Signal Through Matter | [Review Signal](http://localhost:1314/explorations/signal-through-matter/) | [.impeccable/mocks/replacements/signal-through-matter.png](../.impeccable/mocks/replacements/signal-through-matter.png) |
| Infinite Machine | [Review Machine](http://localhost:1314/explorations/infinite-machine/) | [.impeccable/mocks/replacements/infinite-machine.png](../.impeccable/mocks/replacements/infinite-machine.png) |

The fixed comparison control links both alternatives and the original homepage. Routes have `noindex, nofollow` and are excluded from Hugo lists. Copy, headings, controls, and capability links are live semantic HTML; generated artwork contains no interface text. Product claims follow `PRODUCT.md` and the existing platform documentation.

## Colors

These are the exact CSS palette values, scoped to these review pages. Raster material shading is part of the artwork, not an additional interface token system.

| Role | Signal Through Matter | Infinite Machine |
| --- | --- | --- |
| Ground | `#0a0b12` | `#f1f1f6` |
| Text | `#e9e9f2` | `#14152a` |
| Muted text | `#afb0c3` | `#4f5269` |
| Action/focus violet | `#a18aff` | `#6b48e8` |
| Rules | `#343044` | `#d2cfdf` |

Signal uses outlined square actions and smoke-gray transparent architecture with violet illumination. Its action hover mixes violet at 12% into transparent. Machine uses pale matte rails and recessed violet channels; filled actions have white text, a 3px radius, and hover violet `#5935d5`. Shared text selection uses `#8b6bff` with `#0a0b12` text. The review switch alone has the shallow shadow `0 8px 24px #0002`.

## Typography

Local Archivo (`MRArchivo`) carries headings and the wordmark; Instrument Sans (`MRInstrument`) carries prose, navigation, and actions. Both use `font-display: swap` and the existing WOFF2 files under `static/fonts/violet-circuit/`. No monospaced label role is introduced here.

Headings use weight 400, stretch 110%, line-height 1.04, and tracking `-.035em`. Signal's hero is `clamp(70px,6.9vw,110px)`. Machine's hero is weight 450 at `clamp(65px,6.25vw,104px)`. General section headings are `clamp(44px,4.2vw,66px)`; scenes override that scale to suit their negative space. Body paragraphs are 21px/1.55, generally limited to 450px; supporting scene copy uses 19–20px. Capability titles use 22px/1.2, tracking `-.02em`, stretch 100%. Actions are 16px. The precise per-scene values remain in `styles.html`.

At widths up to 1100px, both hero headings become 72px. At 650px and below they become `clamp(43px,10.8vw,68px)`, with 100% stretch. Mobile body copy uses 17px, actions 14px, and section headings range from 34px in the Machine junction to 55px in the Signal closing scene.

## Layout

Both pages have four expansive artwork scenes, a 92px desktop header, and a simple footer. Desktop gutters are 5.3%; paragraphs occupy the artwork's reserved negative space. Artwork uses absolutely positioned 1600 × 1100 images with `object-fit: cover`; scene-specific crops preserve the material composition.

| Scene | Signal Through Matter | Infinite Machine |
| --- | --- | --- |
| Hero | A tall connected smoked-glass structure with a violet path rising through it; left-aligned three-line headline. Minimum 850px; viewport-linked height capped at 1080px. | Monumental pale engineered rails enter diagonally along the bottom and right; two-line headline. Minimum 900px; viewport-linked height capped at 1100px. |
| System | Connected chambers with Applications, Agents, and Infrastructure links to the right. Height 1080px. | Circular junction with central headline and three capability links. A 1550px journey contains a sticky viewport-height stage, bounded to 850–1080px. |
| Governance | Controlled architectural cutaway with copy about workspace scope and access. Height 850px. | A quieter long channel beside governance copy. Height 720px. |
| Close | A coherent illuminated structure paired with “What will you connect?” and the demo action. Height 900px. | Wider machine composition paired with the same question and demo action. Height 850px. |

At 1700px and above, Signal scenes gain space; shared hero minimum height becomes 1050px. At 1100px and below, artwork crops and text widths tighten, and the header becomes 80px. At 650px and below, gutters become 24px and the header 74px. Header navigation retains Docs; the demo action remains visible. Hero copy precedes the artwork, actions stack, and independent crops place each image below its copy. Signal's system links form a vertical list with square violet markers. Machine's junction links stack inside the central opening; their brief descriptions are hidden on mobile while their labels remain real links. Mobile Signal scene heights are 980/1160/930/900px. Machine uses a 950px hero, 1120px journey with an 850px sticky stage, and 850px governance/closing scenes. The footer reserves 120px bottom padding for the review switch.

## Components and motion

Primary actions link to `/contact/`. Capability anchors link to App Studio, agents, and edges documentation. A skip link targets the main landmark. Decorative artwork has `aria-hidden="true"` and empty alternatives; all navigation and product meaning remain in HTML. Anchor focus uses a 2px solid theme-violet outline offset by 7px. Action arrows move 3px on hover with a 180ms transition.

Signal overlays a color image on a grayscale copy at 0.65 opacity. A 4.2-second arrival sequence reveals the hero from 8% to full illumination. A white leading edge, violet core, and long diffused wake follow the main conduit before discharging through two side routes. The illuminated material brightens during activation. The SVG uses the same 1513×1039 coordinates and centered cover crop as the artwork. A Replay signal button repeats this bounded sequence. Scrolling cancels playback and takes over: normalized travel controls the light packets and illumination mask in each scene, with 140ms exponential smoothing for a brief follow-through. Branches activate at 40% and 56% of the journey and finish together. Hovering or focusing a system link reveals its artwork fully; leaving or blurring restores the scroll mask. Scene-edge fades merge the artwork with the page ground.

Machine's junction artwork scales from 1.15 to 1 as scrolling traverses the sticky stage, with its transform origin at 50% 54%. Copy remains stationary in the stage. This is a scale change to a raster plate, not a rendered 3D camera or model.

Queued animation frames process scroll/resize events and skip offscreen scenes. Signal schedules frames during its bounded arrival/replay sequence and while scroll interpolation settles, then stops. There is no perpetual animation loop. Hiding the tab cancels playback. Reduced motion hides the light packets and replay control, removes the illumination mask, disables the junction transform and CSS transitions, and changes smooth scrolling to automatic scrolling. With JavaScript unavailable, authored defaults leave complete static artwork visible. Hero images receive high fetch priority; subsequent scenes use lazy loading and asynchronous decoding.

## Assets, provenance, and recall

The approved comps are recorded in their sibling JSON files and `.impeccable/mocks/replacements/manifest.json`, including the original prompt, generated source location, and user approval. They are reference compositions, not the production page background.

Eight clean artwork plates were generated from the approved comps using the built-in image generation tool, with text and controls excluded. Originals and generation prompts are retained under `.impeccable/assets/violet-replacements/`; Machine also retains source PNG metadata there. Each shipping WebP under `static/images/violet-replacements/` has a sibling `.webp.json` provenance record. The plates are `signal-hero`, `signal-system`, `signal-govern`, `signal-close`, `machine-hero`, `machine-junction`, `machine-govern`, and `machine-close`. These are generated conceptual architecture images, not product screenshots or evidence of customer results.

Implementation recall paths:

- `content/en/explorations/signal-through-matter.md` and `infinite-machine.md`: independent route definitions.
- `layouts/explorations/material-exploration.html`: document, header, footer, comparison switch, and page selection.
- `layouts/partials/violet-replacements/signal.html` and `machine.html`: scene content and product links.
- `layouts/partials/violet-replacements/art.html`, `arrow.html`, `styles.html`, and `script.html`: image rendering, icon, exact styling, and interaction behavior.
- `.impeccable/surfaces/layouts-partials-violet-replacements-signal-html.md` and `layouts-partials-violet-replacements-machine-html.md`: scoped surface briefs.
- `.impeccable/review/materials/`: 20 desktop, mobile, intermediate viewport, scene, and reduced-motion screenshots.

## Review evidence

The final reviewer disposition was **SHIP FOR USER REVIEW**, with no required fixes after inspecting all 20 screenshots. The Hugo build passed with 154 pages. `.impeccable/review/materials/build-checks.json` records 21 links per page, eight Signal image elements and four Machine image elements, zero link/asset errors, and passing page-contract/noindex checks. Browser checks observed no horizontal overflow at 390px, a solid keyboard-focus outline, no illumination mask with reduced motion, and a working comparison link.

Minor review notes: Machine's mobile junction omits short descriptions; the fixed review switch can temporarily cover scrolling content. The regex detector report at `/tmp/faros-material-detector.json` ran in degraded mode and flagged typography warnings in this scope. These checks support reviewing the alternatives; they do not establish global accessibility or performance certification. Final selection and any homepage replacement remain pending user review.

### Signal motion refinement

The user requested additional animation after the two-page review. `energy.html` and `signal-motion.html` add the routed arrival sequence, scroll-controlled packets, and replay control without changing Infinite Machine. Browser sampling observed arrival progress advance from 0.11 through 0.66 to 1.00, and scroll-driven branch dash offset from -487px to -859px. Mobile retained zero horizontal overflow; reduced motion removed the animated overlay and illumination mask. Captures live in `.impeccable/review/signal-motion/`. Hugo and JavaScript syntax checks passed. The earlier independent review applies to the two-page build before this bounded motion refinement.

### Stronger signal animation

Following the request to dial up animation, the activation now lasts 4.2 seconds, carries four layers of routed light, charges the material more visibly, and branches through the hero architecture. Scroll motion has a short eased follow-through. No new assets or dependencies were added; Infinite Machine is unchanged. Browser sampling recorded 169 frames over 2.8 seconds and distinct main/branch progress (0.67, 0.45, 0.25). At 390px, horizontal overflow was zero. Reduced motion hid packets and replay and removed the emission filter. Hugo (154 pages), JavaScript syntax, and whitespace checks passed.
