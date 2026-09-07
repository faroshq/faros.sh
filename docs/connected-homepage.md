# Connected Layers marketing design

The selected Connected Layers experience now renders at `/` through `layouts/index.html` and `layouts/partials/connected-home/`. The former exploration routes and discarded designs are not part of this promotion.

- Copy: `data/connected_home.json`; workflow captions and recording slots: `layouts/partials/connected-home/request-path.html`.
- Palette: `static/css/connected-theme.css` and `connected-open-source.css`, using the Faros app dark/light tokens. Shared composition lives in `connected-base.css` and `connected-layers.css`.
- Theme and motion: `static/js/connected-theme.js`; the existing saved preferences are retained. A 420ms color/artwork fade, temporary hero glow, and visibility-gated channel pulse respect reduced motion and Motion off.
- Without JavaScript the default dark page remains readable and all three workflow sections are ordinary anchor destinations. The theme and motion controls remain hidden.
- Videos remain explicitly labeled recording placeholders. Replace `.cl-video-empty` inside each 16:9 `.cl-video-slot` when recordings are supplied.
- Artwork is served as responsive WebPs at widths 960, 1536, 2560, 3840, and 6144. They are encoded at quality 85 from the user-supplied 6144×4096 PNG masters. The browser chooses using layout size and device pixel ratio; `sizes` includes the object-fit cover crop and 2500px desktop artwork cap. Base and glow layers share the same candidates. PNG masters stay local and are not referenced by the page. The three fonts and Lucide icon carry their existing licenses.
- Production title, description, canonical URL, social metadata, structured data, and integration templates are shared with other pages through `head-metadata.html`. The homepage and seven marketing routes share the Connected Layers head, navigation, footer, palette, and theme runtime. Documentation shares the same top navigation, theme control, and palette, with its own reading layout and section/search toolbar.

Run `npm test` and `npm run build:production`. Both include the rendered homepage contract test for indexability, heading, theme/workflow controls, console destination, assets, and absence of exploration links. Browser verification covers desktop, mobile, and 4K in both themes; this is not a full cross-browser accessibility audit.

## Marketing pages

Platform, Developers, Solutions, Open source, and Company use the marketing-hub template with open content rows, generous spacing, and fine dividers. Pricing and Contact retain their dedicated layouts and interactions. Shared shell styling lives in `static/css/connected-marketing.css`; page styles are scoped to `.cm-page`.

`tests/marketing.test.py` verifies the seven routes, shared controls, canonical/indexability metadata, local assets, Contact form contract, native Pricing accordions, and the shared docs navigation/theme integration. Contact is a leaf page at `content/en/contact/index.md`, preserving `/contact/`.

## Product visuals

Platform, Developers, and Solutions add progressively enhanced visual explorers near the hero. `marketing-visuals.js` enables tab selection and arrow/Home/End keyboard navigation; all examples remain visible without JavaScript. Platform highlights architectural layers and briefly illuminates the request path on selection. Developers uses documented CLI examples and illustrative result explanations. Solutions diagrams workspace isolation, governed agent tools, and outbound edge connectivity. Diagrams use the shared palette and respect reduced motion.

The visuals are in `layouts/partials/marketing-hub/{platform-visual,developer-visual,solutions-visual}.html`; CSS is scoped in `marketing-visuals.css` and `developer-visual.css`. These are explanatory illustrations, not recordings of a live tenant.

## Shared site theme and docs

`site-theme.js` applies the preference before paint on marketing and docs pages. The canonical key is `faros-theme` (light, dark, or system). Migration prefers an existing canonical choice, then `faros-connected-theme`, then `faros-docs-theme`, with dark as the new-visitor default. The shared picker uses `connected-theme.js`; docs no longer has an independent theme controller. System changes and storage events synchronize the resolved palette. Legacy `.dark` is a projection of the shared choice for existing docs syntax tokens, not a separate preference.

Docs reuse the marketing header and retain their section popovers, search dialog, sidebar, article tools, and code controls. `connected-docs.css` supplies the reading-specific typography and token aliases; a ResizeObserver measures the two-row header for sticky navigation and anchor offsets.
