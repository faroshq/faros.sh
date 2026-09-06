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
- Scroll-linked signal movement and equivalent pointer/focus branch activation.
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

Flat ground and fine translucent strokes provide depth through repetition and overlap. Text-backed cutouts preserve legibility over the conductors. There are no raised marketing cards. Primary-action hover has a small violet glow; moving signals have a three-pixel drop shadow. Exact effects are recorded in the sidecar.

## Shapes

Routing combines straight runs, rounded turns, and tightly repeated lines. Square terminals identify connection points. Action corners use the small action radius; open-source braces are typographic forms. The governance aperture is a static stack of rounded rectangles with incremental rotation around a central connection mark. These large artwork curves do not redefine portal corner tokens.

## Components

### Primary action and text link
The filled demo link is compact against the display typography: semibold 16px text and a separated directional arrow. Hover changes violet and adds the restrained glow. Secondary links are 15px, with open spacing and an underline on hover. All homepage anchors have a two-pixel violet focus outline offset by eight pixels.

### Capability branches
Each capability is a complete anchor containing a title, explanation, detail link treatment, and square terminal. Pointer entry or keyboard focus brightens its associated desktop SVG branch; leaving or blurring clears it. The terminal fills for hover and focus. The detail arrow moves only on hover. Mobile preserves the terminal and connecting rail while hiding the desktop SVG network.

### Conductor hero
Decorative SVG is hidden from assistive technology and ignores pointer events. Fine conductors carry short bright signal segments. Visible scene progress updates `--flow` through a single queued animation frame on passive scroll/resize events; this moves the hero signal dash offsets. There is no continuous animation loop.

### Governance aperture, source mark, and closing ribbon
The governance aperture stays still. The open-source mark is oversized monospaced braces around the Faros name and license annotation. The closing ribbon repeats the conductor grammar around a large question and demo link; it has no signal animation. Decorative artwork is hidden from assistive technology; semantic headings and real anchors carry the content. Site navigation and footer remain inherited shell components outside this extraction.

**The Motion Follows Input Rule.** Motion follows scrolling or an explicit hover/focus state. Reduced-motion preference freezes hero signals at their phase offsets, disables transitions, and removes scene progress when the preference changes.

## Do's and Don'ts

### Do:
- Do preserve the homepage scope and consult the main Faros design authority for application UI.
- Do keep route artwork behind readable copy and make every capability a real link.
- Do retain keyboard focus, theme parity, and static reduced-motion rendering.
- Do use the shipped local fonts and code-native artwork.

### Don't:
- Don't promote homepage display sizes or spacious scene geometry into portal component rules.
- Don't replace the route language with UI mockups or unapproved generated raster compositions.
- Don't animate the governance aperture or introduce continuous autonomous signal loops.


Implementation evidence: `layouts/partials/violet-circuit/page.html`, `styles.html`, and `script.html`. Review captures: `.impeccable/review/desktop.png`, `mobile.png`, `light.png`, plus desktop/mobile `-composition`, `-govern`, `-open`, and `-close` scenes. Captures establish rendered appearance; they are not a blanket accessibility certification.
