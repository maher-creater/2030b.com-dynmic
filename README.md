# 2030B — The Entry Point

The public entry-point site for **2030B**: a coordinated stack of **twenty-five
departments** for the civilization ahead. Total operating cost:
**$17.49 per human per day**. Anchored in **Al-Ḥaqq**.

> "Nothing is impossible — only incapable people. With 2030B, there are only capables."
> — *Maher*

© 2026 Maher · 2030B is a copyrighted work of Maher. All rights reserved.

---

## What's in this drop

### Adjustments completed
1. **Ontology SVG logo loading** — `OntoLogos.renderAuto()` is now retried after
   `shell:rendered`, `megamenu:rendered`, `onto:revealed`, and at 600 ms /
   1.8 s / 3.8 s, so logos always paint after the loader hands off.
2. **Ontology dark/light theme** — added `html.onto-light` rules (in addition
   to legacy `html.light`) covering `body`, glass surfaces, chips, gradient
   text, ghost buttons, and the grid background.
3. **Ontology nav-icon asides** — smooth slide-in: `transform .55s
   cubic-bezier(.2,.9,.25,1)` + opacity fade, plus a child-stagger so the
   inner content cascades in (180–420 ms delays).
4. **2030B navbar icons** — Search · Account · Language · Theme. Each button
   has an idle conic-gradient halo (revealed on hover), an icon scale/rotate
   on hover, and triggers a side aside (slide-in from right).
5. **2030B section/block/component animations** — new `[data-b-block]` hook,
   `data-b-anim="left|right|zoom"` variants, and auto-tagging of every
   `<section>` and card grid in `js/main.js`. All gated on
   `html.b-revealed` so they only run after the loader hands off.
6. **Mega-menu left-side fix** — both the megamenu's own CSS and `style.css`
   now collapse `left:50%/translateX(-50%)` to `left:0/translateX(0)` on
   viewports ≤ 1100 px, so the panel never extends off-screen on the left.
7. **WebBook removed from the entry point** — WebBook is treated only as a
   tool. The mega-menu's "WebBook" entry is replaced by **Audiences**; the
   home page no longer advertises a reader CTA; cards no longer link to a
   reader.
8. **Registry expanded to 25 departments** with `cost` field on each;
   `window.B_TOTAL_DAILY_COST = 17.49` exposed for the audience pages and
   the $1Q vision page.
9. **Ten audience landing pages** — `for-general`, `for-researchers`,
   `for-policymakers`, `for-investors`, `for-builders`, `for-educators`,
   `for-students`, `for-faith`, `for-press`, `for-communities`. All driven
   by `js/audiences.js` (data + renderer).
10. **Maher's $1Q vision page** — `pages/maher-vision.html` with hero,
    four key numbers, the math (three multipliers, "why this is not
    inflation", what "capable" means), tier sidebar, and a four-stage path.

---

## Public URLs (relative)

### Root
| Path | Description |
|---|---|
| `/2030b-site/index.html` | Home — hero · stats · levels · 25-grid · audiences · Maher |
| `/2030b-site/README.md`  | This file |

### Library pages (`/2030b-site/pages/`)
| Path | Purpose |
|---|---|
| `departments.html` | All 25 departments grid |
| `registry.html`    | Canonical short table (with `cost` column) |
| `levels.html`      | Five priority levels framework |
| `standard.html`    | (Legacy) WebBook standard reference |
| `about.html`       | About Maher |
| `contact.html`     | Project contact |
| `copyright.html`   | © 2026 Maher · all rights reserved |
| `404.html`         | Not found |
| `maher-vision.html`| **The $1Q vision** (new) |

### Department pages (`pages/dept-{slug}.html`)
Each is a thin redirect into `department.html?slug={slug}`:

| Slug | Level | Cost / day |
|---|---|---|
| `ecosystem`                  | Critical | $1.20 |
| `ontology`                   | Critical | $0.95 |
| `quantum-ethics`             | Critical | $0.88 |
| `neural-sovereignty`         | Critical | $0.92 |
| `existential-risk`           | Critical | $1.05 |
| `planetary-defense`          | Critical | $0.85 |
| `civilizational-continuity`  | Critical | $0.78 |
| `csl`                        | High     | $0.62 |
| `temporal-architecture`      | High     | $0.71 |
| `synthetic-empathy`          | High     | $0.66 |
| `reality-verification`       | High     | $0.74 |
| `ai-alignment`               | High     | $0.83 |
| `genetic-stewardship`        | High     | $0.69 |
| `memetic-engineering`        | Medium   | $0.58 |
| `dimensional-cartography`    | Medium   | $0.55 |
| `post-biological`            | Medium   | $0.61 |
| `energy-commons`             | Medium   | $0.64 |
| `data-commons`               | Medium   | $0.57 |
| `interspecies-communication` | Standard | $0.46 |
| `paradox-resolution`         | Standard | $0.43 |
| `civic-trust`                | Standard | $0.49 |
| `education-2030b`            | Standard | $0.52 |
| `collective-memory`          | Low      | $0.34 |
| `cosmic-heritage`            | Low      | $0.32 |
| `sacred-arts`                | Low      | $0.30 |

**Total: $17.49 per human per day** across the entire 25-department stack.

### Audience landings (`pages/for-*.html`)
| Slug | Audience |
|---|---|
| `for-general`      | Curious humans · plain-language doorway |
| `for-researchers`  | Scientists · academics |
| `for-policymakers` | States · multilaterals |
| `for-investors`    | Capital · allocators |
| `for-builders`     | Engineers · founders · hackers |
| `for-educators`    | Teachers · deans |
| `for-students`     | Learners worldwide |
| `for-faith`        | Religious · contemplative |
| `for-press`        | Journalists · analysts |
| `for-communities`  | Local · cultural groups |

Each landing reads its slug from `<body data-audience="...">` and renders:
hero · 3 value props · 5 recommended departments (with cost field) · CTA.

---

## File structure

```
2030b-site/
├── index.html
├── README.md
├── css/
│   └── style.css            (tokens · nav · grid · loader hooks · animations · light theme)
├── js/
│   ├── logos.js             (loader · 2×2 matrix logo · rect logo · dept marks)
│   ├── registry.js          (25-department registry + cost field + level counts)
│   ├── shell.js             (nav · footer · nav-icon asides · theme toggle · language toggle)
│   ├── megamenu.js          (Departments · Levels · Audiences · Project)
│   ├── main.js              (home grid · filters · auto reveal · auto-stagger)
│   └── audiences.js         (audience data + landing renderer)
└── pages/
    ├── departments.html · registry.html · levels.html · standard.html
    ├── about.html · contact.html · copyright.html · 404.html
    ├── department.html               (template · driven by ?slug=)
    ├── dept-{slug}.html              (25 redirect pages)
    ├── for-{audience}.html           (10 audience landings)
    ├── maher-vision.html             ($1Q vision)
    └── read-webbook*.html            (legacy reader variants — not advertised)
```

---

## Data model

`window.B_REGISTRY` — array of 25 department objects:

```js
{
  slug: 'ecosystem',
  name: '2030B Ecosystem Department',
  level: 'Critical',           // Critical | High | Medium | Standard | Low
  icon: 'globe-2',             // Lucide icon name
  color: '#86c5a0',
  cost: 1.20,                  // USD per human per day
  short: '…',                  // one-sentence identity card
  full: '…',                   // 1–3 paragraph description
  details: ['…','…','…','…','…']  // five-detail mandate
}
```

Other globals exposed on `window`:
- `B_LEVEL_COLORS`  — `Critical → Low` colour map
- `B_LEVEL_COUNTS`  — `{Critical:7, High:6, Medium:5, Standard:4, Low:3}`
- `B_TOTAL_DAILY_COST` — `17.49`
- `B_LOGOS`         — `square` · `rect` · `dept` · `reveal` · `master`
- `B_RENDER`        — `depCardHTML` · `levelColor` · `fmtCost`
- `B_AUDIENCES`     — audience data keyed by slug

No backend tables are required for the entry point.

---

## Animation system — `css/animations.css` + `js/main.js`

The Entry Point's job is **attention**. Every block, section, and component
must earn it. Hooks (auto-tagged on every page by `main.js`):

| Hook | Effect | Variants |
|---|---|---|
| `data-b-block`        | section-level reveal · 40 px / 1 s | `data-b-anim-pose="left\|right\|zoom"` |
| `data-b-anim`         | element reveal · 24 px / .7 s     | `="left\|right\|zoom\|fade\|tilt\|drop"` |
| `data-b-stagger > *`  | child cascade · .04 s per child (up to 24) | — |
| `data-b-component`    | bouncy pop-in (cubic-bezier overshoot) | — |
| `data-b-emphasis`     | recurring breath for hero CTA · 4.6 s loop | auto on `.b-btn-primary` |
| `data-b-attention`    | heartbeat pulse for stats numbers · 3.2 s loop | auto on `.b-stat-num` |
| `data-b-glow`         | recurring soft halo · 3.8 s loop  | auto on `.b-chip` |
| `data-b-typewriter`   | character cascade for hero headlines | — |
| `data-b-tilt`         | gentle 3D hover tilt for cards    | auto on `.b-dep-card` |
| `data-b-marquee`      | infinite horizontal scroll        | — |
| `data-b-delay="1..5"` | adds 80 / 180 / 280 / 400 / 550 ms delay | — |
| `data-b-no-anim`      | opt-out of auto-tagging           | — |

Special component animations baked in:
- **`.b-btn-primary`** — recurring shimmer sweep every 4.4 s.
- **`.b-dep-card`** — diagonal scan-line every 7 s (offset per nth-child).
- **`.b-stat-num`** — 3-D number flip on first reveal.
- **`.b-chip`** — pop-in on hero reveal (`.85 s`, overshoot easing).
- **`.b-orb`** — slow drift (`bOrbDrift` 18 s) once revealed.
- **`.b-level-card`** — coloured rim sweep on hover (uses `--lc`).
- **Hero headline** — masked row + `translateY(110%) → 0` per row, .25/.42/.58 s delays.

All animations are gated on `html.b-revealed` (set by the loader handoff)
so they always begin **after** the first paint. `prefers-reduced-motion`
forces every animated element to its end state with all transitions
disabled. Auto-tagging in `main.js` covers every `<main> section`, every
`.grid` with 2–36 cardy children, every `.b-glass / .b-stat / .b-level-card
/ article`, every `.b-chip`, every `.b-btn-primary`, and every `.b-stat-num`.

---

## Views counter — `js/views.js` + `views_url/index.php`

Every entry-point page now reports a hit to a public PHP+SQLite endpoint and
displays a live, animated counter inside the hero chip.

### Client (`js/views.js`)
- Auto-injects `<span data-b-views>` into every `section[data-b-hero]` and
  `#hero-section` when the page loads.
- POSTs to `https://2030b.com/views_url/index.php?page=<slug>&sid=<uuid>`.
- `<slug>` defaults to `location.pathname` (e.g. `home`, `maher-vision`,
  `for-investors`, `department`, `registry`, …).
- `<uuid>` is generated once with `crypto.randomUUID()` and persisted in
  `localStorage` under `b-views-session`.
- Renders a chip with conic-gradient halo, gold-shimmer number, pulse dot,
  and a count-up animation (`1.6 s`, easeOut-cubic). Falls back to `—`
  silently if the endpoint is unreachable.
- Re-runs on `b:shell`, `b:megamenu`, `b:revealed` to catch shell-rendered
  heroes (audience landings, dynamic department pages).

### Server (`views_url/index.php`)
Single-file PHP with auto-bootstrapped SQLite:

| Method | Query | Action |
|---|---|---|
| `OPTIONS` | — | CORS preflight (204) |
| `POST`    | `?page=<slug>&sid=<uuid>&ref=<url>` | Increment + return total |
| `GET`     | `?page=<slug>&hit=1&sid=<uuid>`     | GET-fallback increment  |
| `GET`     | `?page=<slug>`                      | Read total (no increment) |
| `GET`     | `?stats=1`                          | Top pages + global totals |
| `GET`     | `?stats=1&page=<slug>`              | 90-day timeseries for slug |
| `GET`     | (no params)                         | Service banner + top 25 |

Anti-abuse:
- Slug sanitised to `[a-z0-9_\-/]{1,80}`.
- Per-`sid` cool-down: **30 s**; per-`ip` cool-down: **5 s**.
- IP hashed with a daily-rotating salt (no plaintext IP stored).
- Bot UAs (curl, wget, headless, social-card scrapers, …) counted in a
  separate `bots` column, never in `total` / `uniques`.
- `.htaccess` blocks `*.sqlite*` from being served and disables indexing.

Schema (auto-created):
```sql
pages(slug PK, total, uniques, today, today_date, bots, first_seen, last_seen)
hits (id PK, slug, sid, ip_hash, ua, ref, is_bot, ts, day)
daily(slug, day, hits, uniques, PK(slug,day))
meta (k PK, v)
```

Deployment:
1. Upload `views_url/index.php` and `views_url/.htaccess` to
   `https://2030b.com/views_url/`.
2. Make the directory writable so SQLite can create `views.sqlite`.
3. First request creates schema; no further setup required.

---

## Mega-menu (`js/megamenu.js`)

Four desktop triggers, each opening a centred panel
(`left:50% / translate(-50%)`, max-width `min(960 px, calc(100 vw − 2 rem))`):

1. **Departments** — Critical 7 · High 6 · Medium 5 + Standard 4 + Low 3 + promo
2. **Levels** — priority framework + coherence/long-horizon + registry promo
3. **Audiences** — Public & curious · Practitioners · Decision-makers + promo
4. **Project** — About · Browse + author promo

Each item shows a 36 × 36 `b-mm-glyph` with idle pulse, hover halo (conic
gradient), and inner icon scale/rotate. Mobile drawer renders the same data
as `<details>` accordions. **Left-clipping fix:** below 1100 px the panel
collapses to `left:0/translateX(0)` and a 720 px width.

---

## Loader contract

| Phase | Class | Effect |
|---|---|---|
| Boot  | `html.b-booting`  | body hidden via CSS · `#b-loader` visible (opaque `#04030a`, no blur) |
| Reveal| `html.b-revealed` | body shows · `#b-loader` fades out · `b:revealed` event fires |

`js/main.js` listens for `b:revealed` and only then starts the
IntersectionObserver. Hard cap: 2.6 s for the loader, 3.2 s fallback for
reveal. Same pattern is used in `ontology/` (`onto-booting / onto-revealed`).

---

## Verification (Playwright console capture)

| Page | JS errors | Notes |
|---|---|---|
| `2030b-site/index.html`               | 0 | Tailwind-CDN warning only |
| `2030b-site/pages/maher-vision.html`  | 0 | Tailwind-CDN warning only |
| `2030b-site/pages/for-investors.html` | 0 | Tailwind-CDN warning only |
| `ontology/index.html`                 | 0 | Tailwind-CDN warning only |

The views counter is wired into every entry-point page (root `index.html`
and every page in `pages/` except the redirect-only `dept-*.html` shells —
which inherit the counter from `department.html` they redirect to). It will
silently fail-open with `—` if `2030b.com/views_url/` is unreachable.

---

## Pending / future work
- Localise audience copy into the eight UI languages (currently English only).
- Translate Maher's $1Q vision into the same eight languages.
- Build a printable per-audience PDF brief from each `for-*.html`.
- Add search index (Lunr.js) so the search aside actually queries content.
- Compile Tailwind locally to remove the CDN warning.

## Recommended next steps
1. Connect the **Become a Seeker** / **Sign in** asides to a real auth
   endpoint (currently stubbed).
2. Add a real cost-audit page that explains the per-department $X.XX figures.
3. Hook the language buttons to a translation pipeline (right now they
   only flip `lang`/`dir`).
4. Add a sitemap.xml + OG/Twitter meta on every page.

---

## Deployment
Use the **Publish** tab in this environment to publish the static site.
All paths are relative; no build step is required.
