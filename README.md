# المبادر — almobadir.com

Static site for **Almobadir** (المبادر), a Saudi Arabic business and finance media network.

> ست منصات. صوت واحد. — Six platforms. One voice.

## Stack

Pure HTML / CSS / JS — no build step. Served as static files.

## Structure

```
.
├── index.html              # Single-page site (RTL Arabic, dark theme)
├── assets/
│   ├── tokens.css          # Design tokens (colors, type scale, spacing)
│   ├── base.css            # Reset + base typography
│   ├── components.css      # Reusable UI primitives
│   ├── fonts.css           # @font-face declarations
│   ├── v3.css              # Section styles (hero, manifesto, network, method, content, newsletter, founder, footer)
│   ├── v3.js               # Section behaviour (scroll reveals, marquee, form)
│   ├── Badrshaqer.jpg      # Founder portrait
│   ├── fonts/              # Brand font files (Mostaqbali, Graphik Arabic, Madani Arabic)
│   └── logo/               # Wordmark + favicon SVGs
└── README.md
```

## Local preview

```bash
python -m http.server 8765
# open http://localhost:8765
```

Or any static server (`npx serve`, `live-server`, etc.).

## Sections

1. **Hero** — wordmark, tagline, network KPIs panel, channel chips, ticker
2. **Manifesto** — editorial charter on cream paper
3. **Network** — six brands grid (المبادر, مايندست, زاد, فلوسك, نيوز, الوكالة)
4. **Method** — five-frame editorial process scroll
5. **Content** — latest posts grid
6. **Newsletter** — sticky preview + signup
7. **Founder** — Badr Shaker editorial profile
8. **Footer** — sitemap + CTA + base

## Responsive

- Desktop ≥ 1100px — full multi-column layouts
- Tablet 720–1100px — relaxed grids
- Phone ≤ 720px — single-column, condensed
- Tight phone ≤ 480px — further compaction

## Hosting

Hosted on GitHub Pages. Custom domain configured via `CNAME` (when set).

---

© Almobadir · 2026
