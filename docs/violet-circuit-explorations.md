# Violet Circuit explorations

Status: implemented live experiments. Independent visual review returned ship for both explorations. The user selected **Assembly field** and **Activation frontier** for exploration. No winner or approved visual comp has been established. The existing Routed intelligence homepage and its pushed checkpoint are retained.

These are marketing surface studies within Violet Circuit, not changes to application foundations. [DESIGN.md](../DESIGN.md) and `.impeccable/design.json` continue to describe Routed intelligence. The larger display sizes and scene geometry below are intentional art direction for these experiments; do not promote them into application tokens.

## Routes and implementation

| Direction | Independent route | Content and artwork |
| --- | --- | --- |
| Assembly field | `/explorations/assembly-field/` | `content/en/explorations/assembly-field.md`; `layouts/partials/circuit-explorations/assembly.html` |
| Activation frontier | `/explorations/activation-frontier/` | `content/en/explorations/activation-frontier.md`; `layouts/partials/circuit-explorations/frontier.html` |

Both use `layouts/explorations/circuit-exploration.html`, with shared `styles.html` and `script.html` under `layouts/partials/circuit-explorations/`. The layout loads the existing Violet Circuit styles first, then scoped exploration styles. A labeled navigation strip links the homepage and both studies, with `aria-current="page"` on the active study. Content is excluded from automatic lists through `build.list: never`.

Use [Assembly field on localhost:1314](http://localhost:1314/explorations/assembly-field/) and [Activation frontier on localhost:1314](http://localhost:1314/explorations/activation-frontier/) for this session's preview. The original localhost:1313 preview served a stale stylesheet after mixed builds; it is not the review reference for these experiments.

## Shared expression

Local Archivo, Instrument Sans, and IBM Plex Mono retain their display, prose, and annotation roles. Both inherit the complete dark and `html.light` palettes, compact demo actions, and visible violet keyboard focus outline. SVG and CSS create all artwork; no raster comp or screenshot is a shipping asset. Decorative SVG and duplicated display treatments are hidden from assistive technology. Semantic headings and actual links carry meaning and actions.

Desktop heroes use a sticky stage below the 64px header inside a 220svh journey, with a 1400px minimum journey and 650px minimum stage. Display type is `clamp(70px, 8.5vw, 132px)`, reaching 145px at 1700px. At 1000px the artwork and text adjust; at 600px the journey becomes 190svh with a 1200px minimum, gutters become 24px, capability links stack, and artwork crops independently. Mobile hero display scales begin at 47px. These values document current composition choices, not a reusable type scale.

## Assembly field

Six layered SVG pieces start displaced and rotated around a central assembly. Fine repeated contours and translucent planes give the pieces material presence behind “Build what comes next.” Scroll progress brings them into alignment with staggered cubic easing. A decorative label moves from independent through composing to assembled.

The next scene presents three staggered capability links along a repeated CSS spine: applications, agents, and infrastructure. Diamond joints rotate square and fill on hover or keyboard focus. On mobile the links share one vertical flow. A static interlocking SVG bundle frames the closing invitation, “Assemble something that is yours,” with demo and platform links.

## Activation frontier

A diagonal boundary sweeps across a faint SVG topology, revealing violet conductors and ports. A matching CSS clip reveals a violet duplicate of “Potential, made active”; the semantic heading remains a single heading. The SVG uses `preserveAspectRatio="none"` so its boundary matches the overlay across viewport shapes.

Below the hero, three staggered capability discoveries sit along a separate scroll-linked diagonal edge. Small ports fill on hover and keyboard focus. Mobile places the discoveries in one column. A static field of diagonal CSS lines frames “The next move is yours” and the closing actions.

## Motion and verification

One queued animation frame responds to passive scroll and resize events; there is no autonomous animation loop. Assembly transforms and frontier clipping derive from journey progress. Reduced motion sets the hero to its completed state, removes assembly transforms, replaces sticky travel with a normal-flow stage, hides scroll instructions, fixes the lower frontier edge, and inherits disabled transitions. Preference changes trigger a redraw.

Review captures live under `.impeccable/review/explorations/` as evidence only. Desktop and mobile scenes and light themes were inspected. Browser checks confirmed scroll-driven transforms/clipping, reduced-motion completion with normal-flow stages, visible keyboard focus, and no horizontal overflow at 390px. Both routes build, retain one semantic H1 and noindex, and link to existing internal routes. JavaScript syntax and diff checks pass. Independent review returned ship for both explorations with no required fixes. Detector coverage was a degraded regex pass; its type-scale advisories are intentional surface-specific departures from the original homepage. These checks are not a comprehensive accessibility certification.
