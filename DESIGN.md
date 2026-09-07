---
name: Faros — Violet Circuit homepage
description: Spacious editorial routing for the Faros marketing homepage.
colors:
  ground: "#0a0b12"
  ink: "#e9e9f2"
  muted: "#9b9db5"
  violet: "#8b6bff"
  bright: "#a18aff"
  rule: "rgba(255,255,255,.11)"
  light-ground: "#f1f1f6"
  light-ink: "#14152a"
  light-muted: "#565975"
  light-violet: "#6b48e8"
  light-bright: "#5a38d6"
  light-on: "#ffffff"
  light-rule: "#dfdeeb"
typography:
  display:
    fontFamily: "VCArchivo, 'Archivo', sans-serif"
    fontSize: "clamp(68px, 8.1vw, 124px)"
    fontWeight: 500
    lineHeight: 0.99
    letterSpacing: "-.035em"
  headline:
    fontFamily: "VCArchivo, 'Archivo', sans-serif"
    fontSize: "clamp(42px, 4.5vw, 72px)"
    fontWeight: 500
    lineHeight: 1.03
    letterSpacing: "-.035em"
  title:
    fontFamily: "VCArchivo, 'Archivo', sans-serif"
    fontSize: "clamp(23px, 2.3vw, 34px)"
    fontWeight: 500
    lineHeight: 1.03
    letterSpacing: "-.025em"
  body:
    fontFamily: "VCInstrument, 'Instrument Sans', sans-serif"
    fontSize: "clamp(17px, 1.45vw, 21px)"
    lineHeight: 1.65
  label:
    fontFamily: "VCMono, 'IBM Plex Mono', monospace"
    fontSize: "11px"
    lineHeight: 2
rounded:
  action: "4px"
spacing:
  mobile-gutter: "24px"
  desktop-gutter: "6.25%"
components:
  button-primary:
    backgroundColor: "{colors.violet}"
    textColor: "{colors.ground}"
    rounded: "{rounded.action}"
    padding: "17px 22px"
  button-primary-hover:
    backgroundColor: "{colors.bright}"
  button-primary-light:
    backgroundColor: "{colors.light-violet}"
    textColor: "{colors.light-on}"
    rounded: "{rounded.action}"
    padding: "17px 22px"
  text-link:
    textColor: "{colors.ink}"
    padding: "10px 0"
---

# Design System: Faros — Violet Circuit homepage

## Overview

**Creative North Star: "Routed intelligence"**

Routed intelligence gives Violet Circuit a spacious editorial expression for the Faros marketing homepage: wide typography, deliberate empty space, and fine conductors route people, agents, and infrastructure into a connected system. Violet identifies routes, terminals, and actions; dark ground keeps the composition quiet.

This document covers only the implemented homepage marketing expression in `layouts/partials/violet-circuit/`. It inherits identity vocabulary from `../faros/docs/design/README.md`; it does not replace application foundations, PortalKit contracts, or portal density rules. The user authorized larger display typography, spacious geometry, and restrained motion for this surface.

The user delegated direction selection and implementation. Routed intelligence was selected from three considered directions (also assembly field and activation frontier), superseding the earlier shape-only and comp-first workflow. Earlier generated raster comps were not approved or used. This is an implementation record, not a claim that a generated comp was accepted.

**Key Characteristics:**
- Wide display type with restrained monospaced annotations.
- Thin violet conductors and square terminals; artwork is SVG, CSS, and typography.
- Scroll-linked sphere transport and pulsation, with equivalent pointer/focus branch activation.
- Dark and light themes, local fonts, and a reduced-motion alternative.

## Colors

### Primary
Violet is the circuit and action color. Bright violet marks signals, active branches, and primary-action hover. Neither is used to imply a product status that the page does not represent.

### Neutral
Near-black ground, pale ink, and muted lavender text establish the dark composition. The light theme switches to cool paper, deep ink, and darker violet. Rules separate the open-source scene without introducing panels.

**The Theme Pair Rule.** Read the dark and light tokens as complete coordinated sets. The `html.light` state switches the homepage palette; it does not change artwork or information hierarchy. Dark CTA text uses ground; light CTA text uses light-on.

## Typography

Archivo is the wide display voice, Instrument Sans carries prose and links, and IBM Plex Mono identifies small annotations and the source braces. The local WOFF2 files and their licenses live in `static/fonts/violet-circuit/`; font loading uses `swap`. Headings apply a width stretch of 125% in addition to the frontmatter properties.

The display role is the desktop hero. Headline is the section heading; title is the capability name. Body copy generally stays within 420–450px, and capability descriptions within 280px. Labels are supporting annotations, never the only carrier of an essential product claim.

At 1000px and below, hero size becomes `clamp(65px, 9.6vw, 100px)`. At 600px and below it becomes `clamp(42px, 11.5vw, 66px)` with tighter tracking; section headings are 40px and capability titles 25px. The closing question has its own desktop scale (`clamp(60px, 7.5vw, 112px)`) and a 59px mobile size.

## Layout

The homepage is a sequence of five open scenes: conductor hero, capability branches, governance aperture, open-source statement, and closing ribbon. Desktop gutters use the spacing token; the hero copy sits left while routing passes around it. Capability links stagger along branches, and governance pairs an oversized cropped aperture with copy. These are homepage compositions, not reusable application layouts.

Desktop hero height follows `calc(100svh + 200px)` within 1040–1250px. The composition scene is 1040px; governance has a 900px minimum; the closing scene is 950px. At 1700px the hero inset increases to 12%. At 1000px the composition tightens. At 600px, gutters switch to the mobile token, actions stack, capability links become normal-flow content on a vertical CSS rail, governance and open-source stack, and the hero/ribbon artwork crops independently of copy. The mobile hero and closing scene remain 1000px and 830px respectively.

## Elevation & Depth

Flat ground and fine translucent strokes provide depth through repetition and overlap. Text-backed cutouts preserve legibility over the conductors. There are no raised marketing cards. Primary-action hover has a small violet glow; tiny network spheres use a bounded radial light falloff. Exact effects are recorded in the sidecar.

## Shapes

Routing combines straight runs, rounded turns, and tightly repeated lines. Square terminals identify connection points. Action corners use the small action radius; open-source braces are typographic forms. The governance aperture is a static stack of rounded rectangles with incremental rotation around a central connection mark. These large artwork curves do not redefine portal corner tokens.

## Components

### Primary action and text link
The filled demo link is compact against the display typography: semibold 16px text and a separated directional arrow. Hover changes violet and adds the restrained glow. Secondary links are 15px, with open spacing and an underline on hover. All homepage anchors have a two-pixel violet focus outline offset by eight pixels.

### Capability branches
Each capability is a complete anchor containing a title, explanation, detail link treatment, and square terminal. Pointer entry or keyboard focus brightens its associated desktop SVG branch; leaving or blurring clears it. The terminal fills for hover and focus. The detail arrow moves only on hover. Mobile preserves the terminal and connecting rail while hiding the desktop SVG network.

### Conductor hero and routed pulses
Decorative SVG is hidden from assistive technology and ignores pointer events. Tiny network spheres replace the prior line highlights. Their body diameter pulses between approximately 17 and 20 SVG units, with a bright core and restrained halo. This intermediate scale follows feedback that both the 45-unit and nine-unit versions missed the mark. No binary text is rendered. A shared depth-layered mesh and restrained violet light define each sphere.

A single queued animation frame samples real conductor paths on scroll and resize. Scroll distance advances the spheres and modulates their scale and opacity, so motion and pulsation stop immediately when scrolling stops. There is no autonomous loop or pause control. Reduced-motion preference renders stationary spheres at authored phase offsets. Offscreen scenes are skipped during scroll updates.

### Governance aperture, source mark, and closing ribbon
The governance aperture stays still. The open-source mark is oversized monospaced braces around the Faros name and license annotation. The closing ribbon and desktop capability branches carry the same tiny scroll-driven spheres. Decorative artwork remains hidden from assistive technology; semantic headings and real anchors carry content. Navigation and footer remain inherited shell components.

**The Motion Follows Input Rule.** Only scrolling advances and pulses the spheres. Hover and keyboard focus emphasize capability branches. Reduced motion freezes travel and pulsation while preserving the static artwork and functional feedback.

## Do's and Don'ts

### Do:
- Do preserve the homepage scope and consult the main Faros design authority for application UI.
- Do keep route artwork behind readable copy and make every capability a real link.
- Do retain keyboard focus, theme parity, and static reduced-motion rendering.
- Do use the shipped local fonts and code-native artwork.

### Don't:
- Don't promote homepage display sizes or spacious scene geometry into portal component rules.
- Don't replace the route language with UI mockups or unapproved generated raster compositions.
- Don't animate the governance aperture or introduce unrelated ambient particles; all sphere movement and pulsation follows scrolling.


Implementation evidence: `layouts/partials/violet-circuit/page.html`, `styles.html`, and `script.html`. Review captures: `.impeccable/review/desktop.png`, `mobile.png`, `light.png`, plus desktop/mobile `-composition`, `-govern`, `-open`, and `-close` scenes. Captures establish rendered appearance; they are not a blanket accessibility certification.

### Subsequent explorations — separate scope

The user selected Assembly field and Activation frontier for additional live experiments on independent routes. Their implementation and provisional surface decisions are recorded in [Violet Circuit explorations](docs/violet-circuit-explorations.md). Neither is a selected winner or approved comp. The Routed intelligence homepage record, its design sidecar, and the pushed checkpoint remain retained; exploration display sizes do not extend the normative tokens above or application rules.

Orb density refinement: 12 spheres in the hero and nine each on desktop capability branches and the closing ribbon (30 total). The user requested more visible transport and stronger glow; the sphere body size and scroll-only motion remain unchanged. The halo extends to 40 SVG units at maximum pulse, with a brighter core and rim.

Signal Through Matter and Infinite Machine are separate material explorations built from both user-approved full-page comps for review. Their palettes, raster provenance, responsive scenes, motion, implementation paths, and review evidence are recorded in [Violet Circuit material explorations](docs/violet-material-explorations.md). Both are ready for user review; neither is a selected homepage replacement. This scoped addition does not change the Routed intelligence tokens or `.impeccable/design.json`.
