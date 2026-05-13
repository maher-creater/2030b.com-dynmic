# 2030B-ABC — كن أعقل (Be More Sane)
**Book 1 of the Rushd Trilogy · 2030B Ecosystem · Education-2030B Department**

| Field | Value |
|---|---|
| Title (AR) | كن أعقل |
| Title (EN) | Be More Sane |
| Author | Maher © 2026. All rights reserved. |
| Project | 2030B Ecosystem (one of Maher's **10 projects**) |
| Department | `education-2030b` (with anchors in `ontology` + `collective-memory`) |
| Book # | 1 of Maher's **30 books** · also 1 of the 3-book Rushd Trilogy |
| Sub-series | **Rushd Trilogy** → كن أعقل · كن أصدق · كن أكمل |
| Type | Wisdom / civilisational reasoning (non-fiction) |
| Currency | **USD** priced · paid in **USDT** or **BNB** via Binance Pay |
| Cover price | **$30 USD** (cost of one international passport — universal threshold) |
| Royalty | **10%** of every paid copy → Maher's Binance wallet |
| Target sales | **4,000,000,000** copies (> half of adults) → **$120B** book revenue · **$12B** to Maher |
| Series math | Maher's 34 books × ~$150B/book ≈ **$5.10T** → ~4.63% of 2026 world GDP |

## Folder layout
```
2030b-abc/
├── README.md                ← this file
├── php/
│   ├── index.php            ← Binance Pay purchase endpoint + SQLite ledger
│   ├── .htaccess            ← blocks direct DB access
│   └── schema.sql           ← reference schema (auto-applied by index.php)
├── toc/
│   ├── toc-arabic.md        ← Arabic TOC with per-chapter descriptions
│   └── toc-companion-en.md  ← English TOC of companion book "+$150B from one book"
├── covers/
│   ├── cover-front-prompt.md
│   ├── cover-back-prompt.md
│   └── back-cover-wisdom.md ← Maher's words that print on the reader's mind
├── chapters/
│   └── ch-XX-*.md           ← each chapter, 1500-2500 words, also saved to AI Drive
└── db/                      ← runtime SQLite (created on first hit)
```
