/* 2030B Entry-Point Site — Animated SVG Logos & Page Loader
 * © 2026 Maher. All rights reserved.
 *
 * window.B_LOGOS:
 *   square(size?)              — 2×2 matrix logo  ┌2 0┐  (square — entry point)
 *                                                 └3 0┘  the two 0s read as 'B'
 *   rect(opts?)                — rectangular wordmark logo (for any department)
 *                                opts = { size, slug, label }
 *   dept(slug, size?)          — small department glyph
 *   reveal()                   — manual reveal of the loader
 *
 * Loader contract:
 *   1. Boots IMMEDIATELY: html gets .b-booting (body hidden via CSS).
 *   2. Loader (#b-loader) is fully opaque (#04030a, no blur).
 *   3. On DOMContentLoaded + 250ms (hard cap 2.6s) the loader fades.
 *   4. AFTER reveal we add .b-revealed on <html>, dispatch 'b:revealed',
 *      and ONLY THEN do scroll-reveal / data-b-anim animations start.
 *      This guarantees logo + loader + post-load animations all play.
 */
(function () {
  'use strict';

  /* ============================================================
     INJECT GLOBAL CSS — runs before <body> exists
     ============================================================ */
  const CSS = `
  /* Hide body content while booting; loader stays visible */
  html.b-booting body{visibility:hidden!important}
  html.b-booting #b-loader{visibility:visible!important}

  /* Pre-reveal: scroll-reveal hooks start hidden */
  [data-b-anim],[data-b-stagger]>*{will-change:opacity,transform}

  /* After reveal: post-load page animations are allowed to run */
  html.b-revealed [data-b-logo-anim] *{animation-play-state:running!important}

  /* ============== LOADER ============== */
  #b-loader{
    position:fixed;inset:0;z-index:2147483647;
    background:#04030a;
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.4rem;
    color:#f5e6b3;font-family:'Inter',system-ui,sans-serif;
    transition:opacity .55s ease, visibility .55s ease;
    /* NO backdrop-filter — fully opaque cover */
  }
  #b-loader[data-hidden]{opacity:0;pointer-events:none;visibility:hidden}

  #b-loader .b-load-mark{
    width:160px;height:160px;position:relative;
  }
  #b-loader .b-load-mark svg{width:100%;height:100%;display:block;overflow:visible}

  #b-loader .b-load-title{
    font-family:'Cormorant Garamond',serif;
    font-size:1.4rem;letter-spacing:.05em;
    background:linear-gradient(90deg,#d4a857,#f5a3c0,#7c8df5,#86c5a0,#d4a857);
    background-size:300% 100%;
    -webkit-background-clip:text;background-clip:text;color:transparent;
    animation:bLoadShine 4s linear infinite;
  }
  #b-loader .b-load-sub{
    font-size:.7rem;letter-spacing:.32em;text-transform:uppercase;
    color:rgba(245,230,179,.55);
  }
  #b-loader .b-load-bar{
    width:220px;height:2px;border-radius:99px;overflow:hidden;
    background:rgba(245,230,179,.08);
  }
  #b-loader .b-load-bar i{
    display:block;height:100%;width:40%;
    background:linear-gradient(90deg,transparent,#d4a857,#f5a3c0,#7c8df5,transparent);
    animation:bLoadProgress 1.6s linear infinite;
  }

  @keyframes bLoadShine{0%{background-position:0% 50%}100%{background-position:300% 50%}}
  @keyframes bLoadProgress{0%{transform:translateX(-100%)}100%{transform:translateX(350%)}}

  /* ============== ANIMATED 2x2 MATRIX LOGO ==============
     Cells: 2 0 | 3 0  — the two 0s form a 'B'.
     Animations begin on load (during loader) and continue after reveal. */
  .b-logo-2x2 [data-b-cell]{
    transform-box:fill-box;transform-origin:50% 50%;
    animation:bCellPulse 3.6s ease-in-out infinite;
  }
  .b-logo-2x2 [data-b-cell="2"]{animation-delay:0s}
  .b-logo-2x2 [data-b-cell="0a"]{animation-delay:.45s}
  .b-logo-2x2 [data-b-cell="3"]{animation-delay:.90s}
  .b-logo-2x2 [data-b-cell="0b"]{animation-delay:1.35s}

  .b-logo-2x2 [data-b-glyph]{
    transform-box:fill-box;transform-origin:50% 50%;
    animation:bGlyphBreath 4s ease-in-out infinite;
  }
  .b-logo-2x2 [data-b-glyph="2"]{animation-delay:0s}
  .b-logo-2x2 [data-b-glyph="0a"]{animation-delay:.5s}
  .b-logo-2x2 [data-b-glyph="3"]{animation-delay:1s}
  .b-logo-2x2 [data-b-glyph="0b"]{animation-delay:1.5s}

  .b-logo-2x2 [data-b-bridge]{
    animation:bBridgeShine 3.2s ease-in-out infinite;
  }
  .b-logo-2x2 [data-b-frame]{
    transform-box:fill-box;transform-origin:50% 50%;
    animation:bFrameRot 24s linear infinite;
  }

  @keyframes bCellPulse{
    0%,100%{filter:brightness(1)}
    50%{filter:brightness(1.35)}
  }
  @keyframes bGlyphBreath{
    0%,100%{transform:scale(1);opacity:.95}
    50%{transform:scale(1.06);opacity:1}
  }
  @keyframes bBridgeShine{
    0%,100%{opacity:.45}
    50%{opacity:1}
  }
  @keyframes bFrameRot{
    from{transform:rotate(0)}to{transform:rotate(360deg)}
  }

  /* ============== ANIMATED RECT LOGO ============== */
  .b-logo-rect [data-b-rect-bg]{
    animation:bRectShine 5s linear infinite;
    background-size:300% 100%;
  }
  .b-logo-rect [data-b-rect-glyph]{
    transform-box:fill-box;transform-origin:50% 50%;
    animation:bGlyphBreath 4s ease-in-out infinite;
  }
  .b-logo-rect [data-b-rect-bar]{
    transform-box:fill-box;transform-origin:0% 50%;
    animation:bRectBar 3s ease-in-out infinite;
  }
  @keyframes bRectShine{0%{background-position:0% 50%}100%{background-position:300% 50%}}
  @keyframes bRectBar{
    0%,100%{transform:scaleX(.3);opacity:.4}
    50%{transform:scaleX(1);opacity:1}
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce){
    .b-logo-2x2 *,.b-logo-rect *,#b-loader *{animation:none!important}
  }
  `;

  function injectCSS(){
    if (document.getElementById('b-logos-css')) return;
    const s = document.createElement('style');
    s.id = 'b-logos-css';
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  /* ============================================================
     SQUARE 2x2 MATRIX LOGO
     Cells:  ┌ 2 │ 0 ┐
             ├───┼───┤
             └ 3 │ 0 ┘
     The right column (0/0) reads as a stylised 'B'.
     ============================================================ */
  function square(size = 140){
    const s = size;
    return `
    <svg viewBox="0 0 200 200" width="${s}" height="${s}" class="b-logo-2x2" data-b-logo-anim aria-label="2030B" role="img">
      <defs>
        <linearGradient id="bg2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#fbbf24"/>
          <stop offset="100%" stop-color="#d4a857"/>
        </linearGradient>
        <linearGradient id="bg0a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f5a3c0"/>
          <stop offset="100%" stop-color="#d4a857"/>
        </linearGradient>
        <linearGradient id="bg3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#7c8df5"/>
          <stop offset="100%" stop-color="#86c5a0"/>
        </linearGradient>
        <linearGradient id="bg0b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#86c5a0"/>
          <stop offset="100%" stop-color="#fbbf24"/>
        </linearGradient>
        <linearGradient id="bgFrame" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#d4a857" stop-opacity=".7"/>
          <stop offset="100%" stop-color="#7c8df5" stop-opacity=".5"/>
        </linearGradient>
        <linearGradient id="bgB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fbbf24"/>
          <stop offset="100%" stop-color="#86c5a0"/>
        </linearGradient>
      </defs>

      <!-- Outer rotating frame -->
      <rect data-b-frame x="6" y="6" width="188" height="188" rx="20"
        fill="none" stroke="url(#bgFrame)" stroke-width="1.2" stroke-dasharray="2 6" opacity=".6"/>

      <!-- 2x2 cells with rounded outer corners; inner corners squared -->
      <!-- TOP-LEFT '2' -->
      <rect data-b-cell="2" x="14" y="14" width="86" height="86"
        rx="14" ry="14" fill="url(#bg2)" opacity=".18"/>
      <rect x="14" y="14" width="86" height="86" rx="14" ry="14"
        fill="none" stroke="#fbbf24" stroke-width="1.4" opacity=".55"/>

      <!-- TOP-RIGHT '0' (upper bowl of B) -->
      <rect data-b-cell="0a" x="100" y="14" width="86" height="86"
        rx="14" ry="14" fill="url(#bg0a)" opacity=".18"/>
      <rect x="100" y="14" width="86" height="86" rx="14" ry="14"
        fill="none" stroke="#f5a3c0" stroke-width="1.4" opacity=".55"/>

      <!-- BOTTOM-LEFT '3' -->
      <rect data-b-cell="3" x="14" y="100" width="86" height="86"
        rx="14" ry="14" fill="url(#bg3)" opacity=".18"/>
      <rect x="14" y="100" width="86" height="86" rx="14" ry="14"
        fill="none" stroke="#7c8df5" stroke-width="1.4" opacity=".55"/>

      <!-- BOTTOM-RIGHT '0' (lower bowl of B) -->
      <rect data-b-cell="0b" x="100" y="100" width="86" height="86"
        rx="14" ry="14" fill="url(#bg0b)" opacity=".18"/>
      <rect x="100" y="100" width="86" height="86" rx="14" ry="14"
        fill="none" stroke="#86c5a0" stroke-width="1.4" opacity=".55"/>

      <!-- 'B' SPINE (the vertical bar that turns the right column into a B) -->
      <rect data-b-bridge x="98" y="22" width="6" height="156" rx="3"
        fill="url(#bgB)" opacity=".9"/>

      <!-- GLYPHS -->
      <text data-b-glyph="2" x="57"  y="78" text-anchor="middle"
        font-family="Cormorant Garamond, serif" font-weight="700" font-size="62"
        fill="#fbbf24">2</text>
      <text data-b-glyph="0a" x="143" y="78" text-anchor="middle"
        font-family="Cormorant Garamond, serif" font-weight="700" font-size="62"
        fill="#f5e6b3">0</text>
      <text data-b-glyph="3" x="57"  y="164" text-anchor="middle"
        font-family="Cormorant Garamond, serif" font-weight="700" font-size="62"
        fill="#86c5a0">3</text>
      <text data-b-glyph="0b" x="143" y="164" text-anchor="middle"
        font-family="Cormorant Garamond, serif" font-weight="700" font-size="62"
        fill="#f5e6b3">0</text>
    </svg>`;
  }

  /* ============================================================
     RECTANGULAR LOGO (any-department wordmark)
     ============================================================ */
  function rect(opts = {}){
    const {
      size = 200,
      slug = '',
      label = '2030B',
      sub = 'The Entry Point',
      color = '#d4a857'
    } = opts;
    const w = size, h = Math.round(size * 0.32);
    return `
    <svg viewBox="0 0 400 128" width="${w}" height="${h}"
      class="b-logo-rect" data-b-logo-anim role="img" aria-label="${label}">
      <defs>
        <linearGradient id="rect-${slug||'def'}-bg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#fbbf24"/>
          <stop offset="33%" stop-color="${color}"/>
          <stop offset="66%" stop-color="#7c8df5"/>
          <stop offset="100%" stop-color="#86c5a0"/>
        </linearGradient>
        <linearGradient id="rect-${slug||'def'}-bar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="${color}"/>
          <stop offset="100%" stop-color="#86c5a0"/>
        </linearGradient>
      </defs>

      <!-- Outer rect -->
      <rect x="2" y="2" width="396" height="124" rx="18" ry="18"
        fill="none" stroke="${color}" stroke-width="1.5" opacity=".4"/>

      <!-- Mini 2x2 mark on the left -->
      <g transform="translate(14,14)">
        <rect x="0"  y="0"  width="46" height="46" rx="8" fill="${color}" opacity=".18"/>
        <rect x="46" y="0"  width="46" height="46" rx="8" fill="${color}" opacity=".10"/>
        <rect x="0"  y="46" width="46" height="46" rx="8" fill="${color}" opacity=".10"/>
        <rect x="46" y="46" width="46" height="46" rx="8" fill="${color}" opacity=".22"/>
        <rect x="44" y="6"  width="4"  height="80" rx="2" fill="${color}" opacity=".75"/>
        <text data-b-rect-glyph x="23" y="34" text-anchor="middle"
          font-family="Cormorant Garamond, serif" font-weight="700" font-size="30"
          fill="#fbbf24">2</text>
        <text data-b-rect-glyph x="69" y="34" text-anchor="middle"
          font-family="Cormorant Garamond, serif" font-weight="700" font-size="30"
          fill="#f5e6b3">0</text>
        <text data-b-rect-glyph x="23" y="80" text-anchor="middle"
          font-family="Cormorant Garamond, serif" font-weight="700" font-size="30"
          fill="${color}">3</text>
        <text data-b-rect-glyph x="69" y="80" text-anchor="middle"
          font-family="Cormorant Garamond, serif" font-weight="700" font-size="30"
          fill="#f5e6b3">0</text>
      </g>

      <!-- Wordmark -->
      <text x="124" y="58"
        font-family="Cormorant Garamond, serif" font-weight="700" font-size="42"
        fill="url(#rect-${slug||'def'}-bg)">${label}</text>
      <text x="124" y="92"
        font-family="Inter, sans-serif" font-weight="500" font-size="14"
        fill="#f5e6b3" opacity=".7" letter-spacing="3">${sub.toUpperCase()}</text>

      <!-- Animated underline bar -->
      <rect data-b-rect-bar x="124" y="100" width="240" height="3" rx="1.5"
        fill="url(#rect-${slug||'def'}-bar)"/>
    </svg>`;
  }

  function dept(slug, size = 36){
    const colors = {
      'ecosystem':'#86c5a0','ontology':'#d4a857','csl':'#fbbf24',
      'quantum-ethics':'#f5a3c0','temporal-architecture':'#fbbf24',
      'memetic-engineering':'#86c5a0','synthetic-empathy':'#fbbf24',
      'dimensional-cartography':'#86c5a0','collective-memory':'#5fc1d4',
      'neural-sovereignty':'#f5a3c0','existential-risk':'#f5a3c0',
      'planetary-defense':'#f5a3c0','civilizational-continuity':'#f5a3c0',
      'interspecies-communication':'#7c8df5','reality-verification':'#fbbf24',
      'post-biological':'#86c5a0','cosmic-heritage':'#5fc1d4',
      'paradox-resolution':'#7c8df5','ai-alignment':'#fbbf24',
      'genetic-stewardship':'#fbbf24','energy-commons':'#86c5a0',
      'data-commons':'#86c5a0','civic-trust':'#7c8df5',
      'education-2030b':'#7c8df5','sacred-arts':'#5fc1d4'
    };
    const c = colors[slug] || '#d4a857';
    return `
    <svg viewBox="0 0 60 60" width="${size}" height="${size}"
      class="b-logo-2x2" data-b-logo-anim aria-hidden="true">
      <defs>
        <radialGradient id="bd-${slug}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${c}"/>
          <stop offset="100%" stop-color="${c}" stop-opacity=".1"/>
        </radialGradient>
      </defs>
      <rect data-b-cell="2"  x="6"  y="6"  width="22" height="22" rx="5" fill="${c}" opacity=".22"/>
      <rect data-b-cell="0a" x="32" y="6"  width="22" height="22" rx="5" fill="${c}" opacity=".15"/>
      <rect data-b-cell="3"  x="6"  y="32" width="22" height="22" rx="5" fill="${c}" opacity=".15"/>
      <rect data-b-cell="0b" x="32" y="32" width="22" height="22" rx="5" fill="${c}" opacity=".22"/>
      <rect data-b-bridge    x="29" y="9"  width="3"  height="42" rx="1.5" fill="${c}"/>
    </svg>`;
  }

  /* ============================================================
     LOADER LIFECYCLE
     ============================================================ */
  function ensureLoader(){
    if (document.getElementById('b-loader')) return;
    if (!document.body) return;
    const el = document.createElement('div');
    el.id = 'b-loader';
    el.innerHTML = `
      <div class="b-load-mark">${square(160)}</div>
      <div class="b-load-title">2030B · The Entry Point</div>
      <div class="b-load-sub">Anchoring sixteen departments…</div>
      <div class="b-load-bar"><i></i></div>
    `;
    document.body.appendChild(el);
  }

  function reveal(){
    const el = document.getElementById('b-loader');
    document.documentElement.classList.remove('b-booting');
    document.documentElement.classList.add('b-revealed');
    if (el){
      el.setAttribute('data-hidden','');
      setTimeout(() => { el.parentNode && el.parentNode.removeChild(el); }, 700);
    }
    document.dispatchEvent(new CustomEvent('b:revealed'));
  }

  function startLoader(){
    document.documentElement.classList.add('b-booting');
    injectCSS();
    if (document.body) ensureLoader();
    else document.addEventListener('DOMContentLoaded', ensureLoader, { once:true });
  }

  function scheduleReveal(){
    let done = false;
    const fire = () => { if (done) return; done = true; reveal(); };
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(fire, 250);
    } else {
      document.addEventListener('DOMContentLoaded', () => setTimeout(fire, 250), { once:true });
    }
    setTimeout(fire, 2600); // hard cap
  }

  /* ============================================================
     AUTO-RENDER inline placeholders
     ============================================================ */
  function renderInline(){
    document.querySelectorAll('[data-b-logo="square"], [data-b-logo="master"]').forEach(el => {
      if (el.dataset.bRendered) return;
      const sz = parseInt(el.dataset.bSize || '140', 10);
      el.innerHTML = square(sz);
      el.dataset.bRendered = '1';
    });
    document.querySelectorAll('[data-b-logo="rect"]').forEach(el => {
      if (el.dataset.bRendered) return;
      el.innerHTML = rect({
        size:  parseInt(el.dataset.bSize || '220', 10),
        slug:  el.dataset.bSlug  || '',
        label: el.dataset.bLabel || '2030B',
        sub:   el.dataset.bSub   || 'The Entry Point',
        color: el.dataset.bColor || '#d4a857'
      });
      el.dataset.bRendered = '1';
    });
    document.querySelectorAll('[data-b-logo="wordmark"]').forEach(el => {
      if (el.dataset.bRendered) return;
      el.innerHTML = `
        <span class="inline-flex items-center gap-3">
          ${square(44)}
          <span class="font-display font-bold text-lg leading-tight">
            <span class="b-gold-text">2030B</span>
            <span class="block text-[10px] tracking-[0.2em] uppercase opacity-60 mt-0.5 font-sans">The Entry Point</span>
          </span>
        </span>`;
      el.dataset.bRendered = '1';
    });
    document.querySelectorAll('[data-b-dept]').forEach(el => {
      if (el.dataset.bRendered) return;
      el.innerHTML = dept(el.dataset.bDept, parseInt(el.dataset.bSize || '36', 10));
      el.dataset.bRendered = '1';
    });
  }

  document.addEventListener('DOMContentLoaded', renderInline);
  document.addEventListener('b:shell', renderInline);
  document.addEventListener('b:megamenu', renderInline);

  /* ============================================================
     EXPORT + BOOT
     ============================================================ */
  window.B_LOGOS = { square, rect, dept, reveal, master:square /* legacy alias */ };

  startLoader();
  scheduleReveal();
})();
