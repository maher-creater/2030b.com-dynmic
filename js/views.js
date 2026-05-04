/* 2030B Entry-Point Site — Views Counter (animated, attention-grabbing)
 * © 2026 Maher. All rights reserved.
 *
 * Posts a "view" hit to https://2030b.com/views_url/index.php and renders the
 * returned count inside any [data-b-views] element. The counter rolls up with
 * a count-up animation so it earns the user's attention rather than appearing
 * as a static number.
 *
 * USAGE in any page hero:
 *   <span data-b-views data-b-views-page="auto" data-b-views-label="Eyes on this door"></span>
 *
 * The page key defaults to location.pathname; you can override with:
 *   data-b-views-page="home" / "maher-vision" / "for-investors" / etc.
 */
(function () {
  'use strict';

  const ENDPOINT = 'https://2030b.com/views_url/index.php';
  const STORAGE_KEY = 'b-views-session';
  const ANIM_MS = 1600;

  /* ---------- inject animation CSS once ---------- */
  const CSS = `
  .b-views{
    display:inline-flex;align-items:center;gap:.55rem;
    padding:.45rem .8rem;border-radius:999px;
    background:linear-gradient(135deg,rgba(212,168,87,.14),rgba(124,141,245,.10));
    border:1px solid rgba(212,168,87,.32);
    color:#f5e6b3;font-weight:600;font-size:.78rem;letter-spacing:.05em;
    box-shadow:0 8px 24px rgba(0,0,0,.25),0 0 0 1px rgba(212,168,87,.08) inset;
    position:relative;overflow:hidden;
    transition:transform .35s ease,border-color .35s ease,box-shadow .35s ease;
  }
  .b-views::before{
    content:'';position:absolute;inset:-50%;
    background:conic-gradient(from 0deg,transparent 0%,rgba(212,168,87,.45) 25%,transparent 50%);
    animation:bViewsHalo 6s linear infinite;opacity:.55;
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
    font-weight:700;font-size:.92rem;letter-spacing:.02em;
    color:#fbbf24;min-width:2ch;text-align:right;
    background:linear-gradient(90deg,#fbbf24,#f5a3c0,#7c8df5,#86c5a0,#fbbf24);
    background-size:300% 100%;
    -webkit-background-clip:text;background-clip:text;color:transparent;
    animation:bViewsShine 5s linear infinite;
  }
  .b-views-label{color:rgba(245,230,179,.78);text-transform:uppercase;font-size:.66rem;letter-spacing:.18em}
  .b-views[data-b-views-loading] .b-views-num{opacity:.6}
  .b-views[data-b-views-bumped]{
    animation:bViewsBump .9s cubic-bezier(.2,1.6,.4,1) 1;
  }
  @keyframes bViewsPulse{
    0%,100%{transform:scale(.85);box-shadow:0 0 6px rgba(251,191,36,.5)}
    50%{transform:scale(1.15);box-shadow:0 0 18px rgba(251,191,36,1)}
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
    .b-views,.b-views *,.b-views::before{animation:none!important;transition:none!important}
  }`;

  function injectCSS(){
    if (document.getElementById('b-views-css')) return;
    const s = document.createElement('style');
    s.id = 'b-views-css';
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  /* ---------- helpers ---------- */
  function pageKey(el){
    const explicit = el.dataset.bViewsPage;
    if (explicit && explicit !== 'auto') return explicit;
    const path = (location.pathname || '/').replace(/\/+$/, '/');
    let slug = path.split('/').pop() || 'index.html';
    if (!slug || slug === 'index.html' || slug === '') slug = 'home';
    slug = slug.replace(/\.html?$/, '');
    return slug || 'home';
  }

  function sessionId(){
    try {
      let s = localStorage.getItem(STORAGE_KEY);
      if (!s){
        s = (crypto && crypto.randomUUID) ? crypto.randomUUID()
          : (Date.now().toString(36) + Math.random().toString(36).slice(2));
        localStorage.setItem(STORAGE_KEY, s);
      }
      return s;
    } catch(_){
      return 'anon-' + Math.random().toString(36).slice(2);
    }
  }

  function fmt(n){
    if (n == null || isNaN(n)) return '—';
    if (n >= 1e9) return (n/1e9).toFixed(2).replace(/\.?0+$/,'') + 'B';
    if (n >= 1e6) return (n/1e6).toFixed(2).replace(/\.?0+$/,'') + 'M';
    if (n >= 1e3) return (n/1e3).toFixed(1).replace(/\.0$/,'') + 'k';
    return String(Math.round(n));
  }

  /* ---------- count-up animation ---------- */
  function countUp(el, from, to, ms){
    if (from === to){ el.textContent = fmt(to); return; }
    const start = performance.now();
    const easeOut = t => 1 - Math.pow(1 - t, 3);
    function tick(now){
      const t = Math.min(1, (now - start) / ms);
      const v = from + (to - from) * easeOut(t);
      el.textContent = fmt(Math.round(v));
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = fmt(to);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- render ---------- */
  function render(el){
    if (el.dataset.bViewsRendered) return;
    el.dataset.bViewsRendered = '1';
    el.classList.add('b-views');
    el.setAttribute('role','status');
    el.setAttribute('aria-live','polite');
    const label = el.dataset.bViewsLabel || 'Live views';
    el.innerHTML =
      '<span class="b-views-pulse" aria-hidden="true"></span>' +
      '<span class="b-views-label">' + label + '</span>' +
      '<span class="b-views-num" data-b-views-num>0</span>';
    el.setAttribute('data-b-views-loading','');
  }

  /* ---------- network ---------- */
  function hit(page){
    const url = ENDPOINT
      + '?page=' + encodeURIComponent(page)
      + '&sid='  + encodeURIComponent(sessionId())
      + '&ref='  + encodeURIComponent(document.referrer || '')
      + '&t='    + Date.now();

    return fetch(url, {
      method: 'POST',
      mode:   'cors',
      credentials: 'omit',
      headers: { 'Accept': 'application/json' },
      body: null
    }).then(r => r.ok ? r.json() : Promise.reject(r.status))
      .catch(() => fetch(url, { mode:'cors', credentials:'omit' })
        .then(r => r.ok ? r.json() : Promise.reject(r.status)));
  }

  /* ---------- init ---------- */
  function init(){
    injectCSS();
    const els = document.querySelectorAll('[data-b-views]:not([data-b-views-rendered])');
    if (!els.length) return;

    els.forEach(render);

    // Group by page key so we hit the endpoint once per page key per page-load.
    const groups = new Map();
    els.forEach(el => {
      const k = pageKey(el);
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(el);
    });

    groups.forEach((list, key) => {
      hit(key).then(json => {
        const total = (json && (json.views || json.total || json.count)) || 0;
        list.forEach(el => {
          el.removeAttribute('data-b-views-loading');
          const num = el.querySelector('[data-b-views-num]');
          if (num) countUp(num, 0, total, ANIM_MS);
          el.setAttribute('data-b-views-bumped','');
          setTimeout(()=> el.removeAttribute('data-b-views-bumped'), 1000);
        });
      }).catch(() => {
        list.forEach(el => {
          el.removeAttribute('data-b-views-loading');
          const num = el.querySelector('[data-b-views-num]');
          if (num) num.textContent = '—';
          el.title = 'Counter offline · view recorded locally';
        });
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  // Re-scan after shell / megamenu / audience renders
  document.addEventListener('b:shell',     init);
  document.addEventListener('b:megamenu',  init);
  document.addEventListener('b:revealed',  init);

  window.B_VIEWS = { hit, fmt, pageKey };
})();
