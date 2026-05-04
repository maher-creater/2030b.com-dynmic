# 2030B Views Counter — Backend (PHP + SQLite)

**Endpoint:** `https://2030b.com/views_url/index.php`
**Storage :** SQLite file `views.sqlite` auto-created in this directory on first hit.
**Author  :** © 2026 Maher. All rights reserved.

## Files
- `index.php`  — full router, schema bootstrap, throttling, increment + stats.
- `.htaccess`  — Apache hardening (blocks `.sqlite*` access, forces `index.php`).
- `views.sqlite` — created automatically; **must be writable** by the web user.

## HTTP contract

| Method | Query                                       | Action                                       |
|--------|---------------------------------------------|----------------------------------------------|
| OPTIONS| —                                           | CORS preflight (204)                         |
| POST   | `?page=<slug>&sid=<uuid>&ref=<url>`         | Increment + return total                     |
| GET    | `?page=<slug>&hit=1&sid=<uuid>`             | GET fallback increment                       |
| GET    | `?page=<slug>`                              | Read total only (no increment)               |
| GET    | `?stats=1`                                  | Top pages + global totals                    |
| GET    | `?stats=1&page=<slug>`                      | Page stats + 90-day timeseries               |
| GET    | (no params)                                 | Service banner + totals + top 25             |

### Response (success)
```json
{
  "ok": true,
  "page": "home",
  "views": 12345,
  "uniques": 4321,
  "today": 56,
  "bots": 12,
  "bumped": true,
  "ts": 1745000000
}
```

## Anti-abuse
- **Slug** sanitised to `[a-z0-9_\-/]{1,80}`.
- **Per-sid cool-down**: 30 s minimum between increments per `(page, sid)`.
- **Per-ip cool-down**: 5 s hard floor per `(page, ip_hash)`.
- **IP hashing**: SHA-256 with a daily-rotating salt — no plaintext IP stored.
- **Bot UA detection**: counted in `pages.bots`, never in `total` / `uniques`.

## Schema
```sql
pages(slug PK, total, uniques, today, today_date, bots, first_seen, last_seen)
hits (id PK, slug, sid, ip_hash, ua, ref, is_bot, ts, day)
daily(slug, day, hits, uniques, PK(slug,day))
meta (k PK, v)
```

## Deployment
1. Upload `index.php` and `.htaccess` to `https://2030b.com/views_url/`.
2. Make the directory writable so SQLite can create `views.sqlite`:
   ```sh
   chmod 755 views_url
   chown www-data:www-data views_url       # adjust to your web user
   ```
3. First request creates the schema. No further setup is required.

## Client integration
The 2030B entry-point site posts a hit on load via `js/views.js`:
```js
fetch('https://2030b.com/views_url/index.php?page=home&sid=<uuid>', { method:'POST' })
  .then(r => r.json())
  .then(j => render(j.views));
```
The returned number animates with a count-up effect inside any
`<span data-b-views>` placeholder. The script auto-injects a counter into
every hero section (`section[data-b-hero]` or `#hero-section`) so no manual
markup is required per page.
