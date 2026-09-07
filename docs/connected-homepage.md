# Connected Layers homepage

The selected Connected Layers experience now renders at `/` through `layouts/index.html` and `layouts/partials/connected-home/`. The former exploration routes and discarded designs are not part of this promotion.

- Copy: `data/connected_home.json`; workflow captions and recording slots: `layouts/partials/connected-home/request-path.html`.
- Palette: `static/css/connected-theme.css` and `connected-open-source.css`, using the Faros app dark/light tokens. Shared composition lives in `connected-base.css` and `connected-layers.css`.
- Theme and motion: `static/js/connected-theme.js`; the existing saved preferences are retained. A 420ms color/artwork fade, temporary hero glow, and visibility-gated channel pulse respect reduced motion and Motion off.
- Without JavaScript the default dark page remains readable and all three workflow sections are ordinary anchor destinations. The theme and motion controls remain hidden.
- Videos remain explicitly labeled recording placeholders. Replace `.cl-video-empty` inside each 16:9 `.cl-video-slot` when recordings are supplied.
- Only the eight used responsive WebPs are included, with provenance sidecars. The three fonts and Lucide icon carry their existing licenses.
- Production title, description, canonical URL, social metadata, structured data, and integration templates are shared with other pages through `head-metadata.html`. The homepage has its own CSS and scripts; other pages retain their existing shell.

Run `npm test` and `npm run build:production`. Both include the rendered homepage contract test for indexability, heading, theme/workflow controls, console destination, assets, and absence of exploration links. Browser verification covers desktop, mobile, and 4K in both themes; this is not a full cross-browser accessibility audit.
