/* 2030B Entry-Point Site — Views Counter (animated hero section)
 * © 2026 Maher. All rights reserved.
 *
 * Posts a "view" hit to https://2030b.com/views_url/index.php (with a shared
 * token) and renders the returned count inside any [data-b-views] element.
 * Auto-injects an animated views block into every hero (`section[data-b-hero]`
 * or `#hero-section`) showing:
 *   - Live total views (count-up roll)
 *   - "Today" hits
 *   - Unique visitors
 *   - Pulse dot · gold-shimmer number · conic halo · GSAP entrance
 *
 * All elements carry data-i18n attributes so labels translate live.
 */
(function () {
  'use strict';

  /* ───── CONFIG ───── */
  const ENDPOINT      = 'https://2030b.com/views_url/index.php';
  const STORAGE_KEY   = 'b-views-session';
  const ANIM_MS       = 1600;
  // Public client token — also accepted server-side. Used to mark legitimate
  // entry-point traffic; pair with the per-sid / per-ip cooldowns server-side.
  const CLIENT_TOKEN  = 'b2030-public-9f3c2e7a4d1b8056';

  /* ───── CSS (injected once) ───── */
  const CSS = `
  .b-views{
    display:inline-flex;align-items:center;gap:.6rem;flex-wrap:wrap;
    padding:.5rem .85rem;border-radius:999px;
    background:linear-gradient(135deg,rgba(212,168,87,.16),rgba(124,141,245,.12));
    border:1px solid rgba(212,168,87,.34);
    color:#f5e6b3;font-weight:600;font-size:.78rem;letter-spacing:.05em;
    box-shadow:0 8px 24px rgba(0,0,0,.25),0 0 0 1px rgba(212,168,87,.08) inset;
    position:relative;overflow:hidden;
    transition:transform .35s ease,border-color .35s ease,box-shadow .35s ease;
  }
  .b-views::before{
    content:'';position:absolute;inset:-50%;
    background:conic-gradient(from 0deg,transparent 0%,rgba(212,168,87,.45) 25%,transparent 50%);
    animation:bViewsHalo 6s linear infinite;opacity:.55;pointer-events:none;
  }
  .b-views > *{position:relative;z-index:2}
  .b-views:hover{transform:translateY(-1px);border-color:rgba(212,168,87,.55);box-shadow:0 14px 30px rgba(212,168,87,.18)}
  .b-views-pulse{
    width:8px;height:8px;border-radius:50%;
    background:#fbbf24;box-shadow:0 0 12px rgba(251,191,36,.85);
    animation:bViewsPulse 1.6s ease-in-out infinite;
  }
  .b-views-num{
    font-family:'JetBrains Mono','Cormorant Garamond',monospace;
    font-weight:700;font-size:.95rem;letter-spacing:.02em;
    color:#fbbf24;min-width:2ch;text-align:right;
    background:linear-gradient(90deg,#fbbf24,#f5a3c0,#7c8df5,#86c5a0,#fbbf24);
    background-size:300% 100%;
    -webkit-background-clip:text;background-clip:text;color:transparent;
    animation:bViewsShine 5s linear infinite;
  }
  .b-views-label{color:rgba(245,230,179,.78);text-transform:uppercase;font-size:.66rem;letter-spacing:.18em}
  .b-views-sep{opacity:.35;margin:0 .25rem}
  .b-views-mini{
    display:inline-flex;align-items:center;gap:.3rem;
    font-size:.7rem;color:rgba(245,230,179,.7);font-weight:500;
  }
  .b-views-mini b{color:#fbbf24;font-weight:700;font-family:'JetBrains Mono',monospace}
  .b-views[data-b-views-loading] .b-views-num{opacity:.6}
  .b-views[data-b-views-bumped]{
    animation:bViewsBump .9s cubic-bezier(.2,1.6,.4,1) 1;
  }

  /* Animated hero views BLOCK (richer than the chip). Inject via [data-b-views-hero]. */
  .b-views-hero{
    display:inline-flex;align-items:center;gap:1rem;flex-wrap:wrap;
    padding:.7rem 1.1rem;border-radius:1rem;margin-top:.85rem;
    background:linear-gradient(135deg,rgba(212,168,87,.10),rgba(124,141,245,.08));
    border:1px solid rgba(212,168,87,.28);
    box-shadow:0 10px 30px rgba(0,0,0,.22),0 0 0 1px rgba(212,168,87,.06) inset;
    position:relative;overflow:hidden;
  }
  .b-views-hero::before{
    content:'';position:absolute;inset:-40%;
    background:conic-gradient(from 0deg,transparent 0%,rgba(245,163,192,.28) 20%,transparent 40%,rgba(124,141,245,.25) 65%,transparent 85%);
    animation:bViewsHalo 9s linear infinite;opacity:.55;pointer-events:none;
  }
  .b-views-hero > *{position:relative;z-index:2}
  .b-views-hero-eye{
    width:34px;height:34px;border-radius:50%;
    background:radial-gradient(circle,rgba(251,191,36,.45),rgba(124,141,245,.05));
    display:inline-flex;align-items:center;justify-content:center;
    box-shadow:0 0 18px rgba(251,191,36,.55), inset 0 0 12px rgba(212,168,87,.35);
    animation:bViewsEye 3.4s ease-in-out infinite;
  }
  .b-views-hero-eye::after{
    content:'';width:10px;height:10px;border-radius:50%;background:#fbbf24;
    box-shadow:0 0 10px rgba(251,191,36,1);
  }
  .b-views-hero-stack{display:inline-flex;flex-direction:column;line-height:1.1}
  .b-views-hero-num{
    font-family:'JetBrains Mono','Cormorant Garamond',monospace;
    font-weight:800;font-size:1.6rem;letter-spacing:.02em;
    background:linear-gradient(90deg,#fbbf24,#f5a3c0,#7c8df5,#86c5a0,#fbbf24);
    background-size:300% 100%;
    -webkit-background-clip:text;background-clip:text;color:transparent;
    animation:bViewsShine 6s linear infinite;
  }
  .b-views-hero-label{color:rgba(245,230,179,.65);text-transform:uppercase;font-size:.6rem;letter-spacing:.22em;margin-top:.15rem}
  .b-views-hero-divider{width:1px;height:34px;background:linear-gradient(180deg,transparent,rgba(212,168,87,.35),transparent)}
  .b-views-hero-mini{display:inline-flex;flex-direction:column;line-height:1.15}
  .b-views-hero-mini b{
    font-family:'JetBrains Mono',monospace;font-weight:700;color:#fbbf24;font-size:1rem;
  }
  .b-views-hero-mini span{color:rgba(245,230,179,.55);text-transform:uppercase;font-size:.55rem;letter-spacing:.2em;margin-top:.1rem}

  @keyframes bViewsPulse{
    0%,100%{transform:scale(.85);box-shadow:0 0 6px rgba(251,191,36,.5)}
    50%{transform:scale(1.15);box-shadow:0 0 18px rgba(251,191,36,1)}
  }
  @keyframes bViewsEye{
    0%,100%{transform:scale(1);box-shadow:0 0 18px rgba(251,191,36,.55), inset 0 0 12px rgba(212,168,87,.35)}
    50%{transform:scale(1.07);box-shadow:0 0 28px rgba(251,191,36,.95), inset 0 0 18px rgba(245,163,192,.5)}
  }
  @keyframes bViewsHalo{from{transform:rotate(0)}to{transform:rotate(360deg)}}
  @keyframes bViewsShine{0%{background-position:0 0}100%{background-position:300% 0}}
  @keyframes bViewsBump{
    0%{transform:scale(1)}
    35%{transform:scale(1.18)}
    70%{transform:scale(.96)}
    100%{transform:scale(1)}
  }
  @media (prefers-reduced-motion: reduce){
    .b-views,.b-views *,.b-views::before,
    .b-views-hero,.b-views-hero *,.b-views-hero::before{animation:none!important;transition:none!important}
  }`;

  function injectCSS() {
    if (document.getElementById('b-views-css')) return;
    const s = document.createElement('style');
    s.id = 'b-views-css';
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  /* ───── helpers ───── */
  function pageKey(el) {
    const explicit = el && el.dataset && el.dataset.bViewsPage;
    if (explicit && explicit !== 'auto') return explicit;
    const path = (location.pathname || '/').replace(/\/+$/, '/');
    let slug = path.split('/').pop() || 'index.html';
    if (!slug || slug === 'index.html' || slug === '') slug = 'home';
    slug = slug.replace(/\.html?$/, '');
    return slug || 'home';
  }

  function sessionId() {
    try {
      let s = localStorage.getItem(STORAGE_KEY);
      if (!s) {
        s = (window.crypto && crypto.randomUUID) ? crypto.randomUUID()
          : (Date.now().toString(36) + Math.random().toString(36).slice(2));
        localStorage.setItem(STORAGE_KEY, s);
      }
      return s;
    } catch (_) {
      return 'anon-' + Math.random().toString(36).slice(2);
    }
  }

  function fmt(n) {
    if (n == null || isNaN(n)) return '—';
    if (n >= 1e9) return (n / 1e9).toFixed(2).replace(/\.?0+$/, '') + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
    return String(Math.round(n));
  }

  function countUp(el, from, to, ms) {
    if (from === to) { el.textContent = fmt(to); return; }
    const start = performance.now();
    const easeOut = t => 1 - Math.pow(1 - t, 3);
    function tick(now) {
      const t = Math.min(1, (now - start) / ms);
      const v = from + (to - from) * easeOut(t);
      el.textContent = fmt(Math.round(v));
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = fmt(to);
    }
    requestAnimationFrame(tick);
  }

  /* ───── render: chip variant ───── */
  function renderChip(el) {
    if (el.dataset.bViewsRendered) return;
    el.dataset.bViewsRendered = '1';
    el.classList.add('b-views');
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');

    el.innerHTML =
      '<span class="b-views-pulse" aria-hidden="true"></span>' +
      '<span class="b-views-label" data-i18n="common.views_label">Eyes on this door</span>' +
      '<span class="b-views-num" data-b-views-num>0</span>' +
      '<span class="b-views-sep">·</span>' +
      '<span class="b-views-mini"><b data-b-views-today>0</b> <span data-i18n="common.today">today</span></span>';
    el.setAttribute('data-b-views-loading', '');
  }

  /* ───── render: hero block variant ───── */
  function renderHero(el) {
    if (el.dataset.bViewsRendered) return;
    el.dataset.bViewsRendered = '1';
    el.classList.add('b-views-hero');
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');

    el.innerHTML = `
      <span class="b-views-hero-eye" aria-hidden="true"></span>
      <span class="b-views-hero-stack">
        <span class="b-views-hero-num" data-b-views-num>0</span>
        <span class="b-views-hero-label" data-i18n="common.live_views">Live views</span>
      </span>
      <span class="b-views-hero-divider" aria-hidden="true"></span>
      <span class="b-views-hero-mini">
        <b data-b-views-today>0</b>
        <span data-i18n="common.today">Today</span>
      </span>
      <span class="b-views-hero-mini">
        <b data-b-views-uniques>0</b>
        <span data-i18n="common.uniques">Unique visitors</span>
      </span>
    `;
    el.setAttribute('data-b-views-loading', '');
  }

  function render(el) {
    if (el.hasAttribute('data-b-views-hero')) renderHero(el);
    else renderChip(el);
  }

  /* ───── network ───── */
  function hit(page) {
    const url = ENDPOINT
      + '?page='  + encodeURIComponent(page)
      + '&sid='   + encodeURIComponent(sessionId())
      + '&ref='   + encodeURIComponent(document.referrer || '')
      + '&token=' + encodeURIComponent(CLIENT_TOKEN)
      + '&t='     + Date.now();

    const headers = {
      'Accept': 'application/json',
      'X-2030B-Token': CLIENT_TOKEN
    };

    return fetch(url, {
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
      headers: headers,
      body: null
    }).then(r => r.ok ? r.json() : Promise.reject(r.status))
      .catch(() => fetch(url, { mode: 'cors', credentials: 'omit', headers: headers })
        .then(r => r.ok ? r.json() : Promise.reject(r.status)));
  }

  /* ───── init ───── */
  function init() {
    injectCSS();
    const els = document.querySelectorAll('[data-b-views]:not([data-b-views-rendered])');
    if (!els.length) return;

    els.forEach(render);

    // Re-apply i18n on the freshly rendered labels
    if (window.B_I18N && window.B_I18N.reapply) {
      try { window.B_I18N.reapply(); } catch (_) {}
    }

    // Group by page-key so we only hit once per page-load.
    const groups = new Map();
    els.forEach(el => {
      const k = pageKey(el);
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(el);
    });

    groups.forEach((list, key) => {
      hit(key).then(json => {
        const total   = (json && (json.views || json.total || json.count)) || 0;
        const today   = (json && json.today)   || 0;
        const uniques = (json && json.uniques) || 0;
        list.forEach(el => {
          el.removeAttribute('data-b-views-loading');
          const num = el.querySelector('[data-b-views-num]');
          const td  = el.querySelector('[data-b-views-today]');
          const uq  = el.querySelector('[data-b-views-uniques]');
          if (num) countUp(num, 0, total, ANIM_MS);
          if (td)  countUp(td, 0, today,   ANIM_MS);
          if (uq)  countUp(uq, 0, uniques, ANIM_MS);
          el.setAttribute('data-b-views-bumped', '');
          setTimeout(() => el.removeAttribute('data-b-views-bumped'), 1000);
        });
      }).catch(() => {
        list.forEach(el => {
          el.removeAttribute('data-b-views-loading');
          el.querySelectorAll('[data-b-views-num],[data-b-views-today],[data-b-views-uniques]')
            .forEach(n => { n.textContent = '—'; });
          el.title = 'Counter offline · view recorded locally';
        });
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  document.addEventListener('b:shell',     init);
  document.addEventListener('b:megamenu',  init);
  document.addEventListener('b:revealed',  init);
  document.addEventListener('b:i18n',      function () {
    // No re-init on language change — just keep showing the current numbers.
  });

  window.B_VIEWS = { hit, fmt, pageKey, init, CLIENT_TOKEN };
})();
