/* 2030B Entry-Point Site — Mega-menu with animated icons
 * © 2026 Maher. All rights reserved.
 *
 * Auto-mounts into [data-b-megamenu] (rendered by shell.js).
 * Four top-level triggers: Departments · Levels · WebBook · Project
 * Each opens a hidden desktop panel with grouped links and an animated
 * icon glyph per item. The panel uses left:50% / translate(-50%) so it
 * stays centred under the trigger and never clips on narrow desktops.
 */
(function () {
  'use strict';

  /* ============== ANIMATED-ICON CSS ============== */
  const CSS = `
  /* ---------- Mega-menu shell ---------- */
  .b-mm{position:relative}
  .b-mm-list{display:flex;align-items:center;gap:.25rem}
  .b-mm-trigger{
    display:inline-flex;align-items:center;gap:.35rem;
    padding:.45rem .8rem;border-radius:.55rem;
    font-size:.85rem;font-weight:500;color:rgba(245,230,179,.7);
    transition:color .2s ease, background .2s ease;
    cursor:pointer;border:1px solid transparent;
  }
  .b-mm-trigger:hover,.b-mm-trigger[data-open]{color:#fbbf24;background:rgba(212,168,87,.08);border-color:rgba(212,168,87,.18)}
  .b-mm-trigger .b-mm-caret{
    width:10px;height:10px;transition:transform .25s ease;
  }
  .b-mm-trigger[data-open] .b-mm-caret{transform:rotate(180deg)}

  /* Centred panel — never clips */
  .b-mm-panel{
    position:absolute;top:calc(100% + 8px);left:50%;transform:translateX(-50%);
    width:min(960px, calc(100vw - 2rem));
    background:rgba(8,7,15,.94);backdrop-filter:blur(14px);
    border:1px solid rgba(212,168,87,.22);border-radius:1rem;
    box-shadow:0 30px 80px rgba(0,0,0,.55), 0 0 0 1px rgba(212,168,87,.08);
    padding:1.4rem;
    opacity:0;visibility:hidden;pointer-events:none;
    transition:opacity .25s ease, transform .25s ease, visibility .25s ease;
    z-index:60;
  }
  .b-mm-panel[data-open]{opacity:1;visibility:visible;pointer-events:auto;transform:translateX(-50%) translateY(0)}
  .b-mm-panel:not([data-open]){transform:translateX(-50%) translateY(-6px)}

  /* On narrow desktops, anchor panel to the trigger left to avoid clipping. */
  @media (max-width:1100px){
    .b-mm-panel{left:0;transform:translateX(0);width:min(720px, calc(100vw - 2rem))}
    .b-mm-panel[data-open]{transform:translateX(0) translateY(0)}
    .b-mm-panel:not([data-open]){transform:translateX(0) translateY(-6px)}
  }

  .b-mm-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.4rem}
  @media(min-width:960px){.b-mm-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}

  .b-mm-group h4{
    font-size:.65rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;
    color:rgba(245,230,179,.45);margin-bottom:.55rem;
  }
  .b-mm-item{
    display:flex;align-items:flex-start;gap:.7rem;
    padding:.55rem .65rem;border-radius:.55rem;
    color:rgba(245,230,179,.85);transition:background .2s ease,color .2s ease;
  }
  .b-mm-item:hover{background:rgba(212,168,87,.10);color:#fbbf24}
  .b-mm-item-title{font-size:.85rem;font-weight:600;line-height:1.2}
  .b-mm-item-desc{font-size:.72rem;color:rgba(245,230,179,.55);margin-top:.15rem;line-height:1.4}

  /* Promo card spans the last column on wide screens */
  .b-mm-promo{
    grid-column:span 1;
    background:linear-gradient(135deg,rgba(212,168,87,.14),rgba(124,141,245,.10));
    border:1px solid rgba(212,168,87,.28);border-radius:.85rem;
    padding:1rem;display:flex;flex-direction:column;gap:.5rem;
  }
  .b-mm-promo-tag{font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;color:#fbbf24}
  .b-mm-promo-title{font-family:'Cormorant Garamond',serif;font-size:1.15rem;font-weight:700;color:#f5e6b3;line-height:1.2}
  .b-mm-promo-body{font-size:.75rem;color:rgba(245,230,179,.65);line-height:1.5}
  .b-mm-promo-cta{font-size:.78rem;font-weight:600;color:#fbbf24;display:inline-flex;align-items:center;gap:.3rem;margin-top:auto}

  /* ---------- Animated icon glyph (per menu item) ---------- */
  .b-mm-glyph{
    width:36px;height:36px;flex-shrink:0;
    border-radius:.5rem;display:inline-flex;align-items:center;justify-content:center;
    background:linear-gradient(135deg,rgba(212,168,87,.18),rgba(212,168,87,.04));
    border:1px solid rgba(212,168,87,.22);
    color:#fbbf24;
    position:relative;overflow:hidden;
  }
  .b-mm-glyph svg{width:18px;height:18px;position:relative;z-index:2;transition:transform .35s ease}
  .b-mm-glyph::before{
    content:'';position:absolute;inset:-50%;
    background:conic-gradient(from 0deg, transparent 0%, rgba(212,168,87,.35) 25%, transparent 50%);
    animation:bMmSpin 4.5s linear infinite;
    opacity:0;transition:opacity .3s ease;
  }
  .b-mm-item:hover .b-mm-glyph{
    border-color:rgba(212,168,87,.5);
    box-shadow:0 6px 18px rgba(212,168,87,.18);
  }
  .b-mm-item:hover .b-mm-glyph::before{opacity:1}
  .b-mm-item:hover .b-mm-glyph svg{transform:scale(1.18) rotate(-6deg)}

  /* Idle micro-pulse so icons subtly breathe even when not hovered */
  .b-mm-glyph svg{animation:bMmIdle 4s ease-in-out infinite}
  .b-mm-group:nth-child(1) .b-mm-glyph svg{animation-delay:0s}
  .b-mm-group:nth-child(2) .b-mm-glyph svg{animation-delay:.7s}
  .b-mm-group:nth-child(3) .b-mm-glyph svg{animation-delay:1.4s}

  @keyframes bMmSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
  @keyframes bMmIdle{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}

  /* ---------- Mobile (sub-960px) ---------- */
  .b-mm-mobile{display:none}
  @media (max-width: 1023px){
    .b-mm-list{display:none}
    .b-mm-mobile{display:block}
    .b-mm-mobile details{
      border:1px solid rgba(212,168,87,.18);border-radius:.65rem;
      margin-bottom:.5rem;background:rgba(8,7,15,.7);
    }
    .b-mm-mobile summary{
      list-style:none;cursor:pointer;
      padding:.7rem 1rem;font-size:.85rem;font-weight:600;color:#f5e6b3;
      display:flex;align-items:center;justify-content:space-between;
    }
    .b-mm-mobile summary::-webkit-details-marker{display:none}
    .b-mm-mobile summary::after{
      content:'＋';color:#fbbf24;font-size:1rem;transition:transform .2s ease;
    }
    .b-mm-mobile details[open] summary::after{content:'－'}
    .b-mm-mobile-links{padding:.25rem .6rem .6rem}
    .b-mm-mobile-links a{
      display:flex;gap:.6rem;align-items:center;
      padding:.45rem .55rem;border-radius:.4rem;
      font-size:.82rem;color:rgba(245,230,179,.8);
    }
    .b-mm-mobile-links a:hover{background:rgba(212,168,87,.08);color:#fbbf24}
  }

  @media (prefers-reduced-motion: reduce){
    .b-mm-glyph svg,.b-mm-glyph::before,.b-mm-trigger .b-mm-caret{animation:none!important;transition:none!important}
  }
  `;

  function injectCSS(){
    if (document.getElementById('b-mm-css')) return;
    const s = document.createElement('style');
    s.id = 'b-mm-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ============== MENU DATA ============== */
  function NAV(prefix){
    const link = (slug) => prefix + 'pages/' + slug;
    return [
      {
        key:'departments',
        title:'Departments',
        icon:'layout-grid',
        groups:[
          { title:'Critical · 7', items:[
            { icon:'globe-2',         title:'Ecosystem',                desc:'Planetary biodiversity & symbiosis',  href:link('dept-ecosystem.html') },
            { icon:'compass',         title:'Ontology',                 desc:'What exists, anchored in Al-Ḥaqq',    href:link('dept-ontology.html') },
            { icon:'scale',           title:'Quantum Ethics',           desc:'Ethics for an entangled world',       href:link('dept-quantum-ethics.html') },
            { icon:'shield',          title:'Neural Sovereignty',       desc:'Defends the inviolability of thought',href:link('dept-neural-sovereignty.html') },
            { icon:'alert-triangle',  title:'Existential Risk',         desc:'Watching the edges of survival',      href:link('dept-existential-risk.html') },
            { icon:'satellite',       title:'Planetary Defense',        desc:'Active defense against orbital threats',href:link('dept-planetary-defense.html') },
            { icon:'building-2',      title:'Civilizational Continuity',desc:'Survival of identity across disruption',href:link('dept-civilizational-continuity.html') }
          ]},
          { title:'High · 6', items:[
            { icon:'library',        title:'CSL',                  desc:'Conscious Science Literature',      href:link('dept-csl.html') },
            { icon:'hourglass',      title:'Temporal Architecture',desc:'Time-flow infrastructure',          href:link('dept-temporal-architecture.html') },
            { icon:'heart-handshake',title:'Synthetic Empathy',    desc:'Artificial compassion protocols',   href:link('dept-synthetic-empathy.html') },
            { icon:'shield-check',   title:'Reality Verification', desc:'Authenticates what is real',        href:link('dept-reality-verification.html') },
            { icon:'cpu',            title:'AI Alignment',         desc:'Frontier-model safety audits',      href:link('dept-ai-alignment.html') },
            { icon:'dna',            title:'Genetic Stewardship', desc:'Heritable edits & lineage care',    href:link('dept-genetic-stewardship.html') }
          ]},
          { title:'Medium · 5 · Standard · 4 · Low · 3', items:[
            { icon:'share-2',       title:'Memetic Engineering',     desc:'Cultural transmission systems',  href:link('dept-memetic-engineering.html') },
            { icon:'map',           title:'Dimensional Cartography', desc:'Maps of parallel realities',     href:link('dept-dimensional-cartography.html') },
            { icon:'cpu',           title:'Post-Biological',         desc:'Organic-digital transitions',    href:link('dept-post-biological.html') },
            { icon:'zap',           title:'Energy Commons',          desc:'Open clean-energy commons',      href:link('dept-energy-commons.html') },
            { icon:'database',      title:'Data Commons',            desc:'Open datasets & benchmarks',     href:link('dept-data-commons.html') },
            { icon:'languages',     title:'Interspecies Comms',      desc:'Cross-species translation',      href:link('dept-interspecies-communication.html') },
            { icon:'infinity',      title:'Paradox Resolution',      desc:'Consistency engine',            href:link('dept-paradox-resolution.html') },
            { icon:'handshake',     title:'Civic Trust',             desc:'Trust infrastructure',          href:link('dept-civic-trust.html') },
            { icon:'graduation-cap',title:'Education',               desc:'Curricula & lifelong rails',    href:link('dept-education-2030b.html') },
            { icon:'archive',       title:'Collective Memory',       desc:'Species-wide records',          href:link('dept-collective-memory.html') },
            { icon:'sparkles',      title:'Cosmic Heritage',         desc:'Interstellar legacy archives',  href:link('dept-cosmic-heritage.html') },
            { icon:'palette',       title:'Sacred Arts',             desc:'Contemplative & ritual forms',  href:link('dept-sacred-arts.html') }
          ]}
        ],
        promo:{ tag:'Browse', title:'All twenty-five at once', body:'Every department on a single grid, filterable by priority level. Daily-cost field included.', href:link('departments.html'), cta:'Open the grid' }
      },
      {
        key:'levels',
        title:'Levels',
        icon:'layers',
        groups:[
          { title:'Priority framework', items:[
            { icon:'circle-alert',    title:'Critical · 7',  desc:'Existence-bearing departments',     href:link('levels.html#critical') },
            { icon:'circle-arrow-up', title:'High · 6',      desc:'Load-bearing infrastructure',       href:link('levels.html#high') },
            { icon:'circle-dot',      title:'Medium · 5',    desc:'Direction-shaping departments',     href:link('levels.html#medium') }
          ]},
          { title:'Coherence & long horizon', items:[
            { icon:'circle',          title:'Standard · 4',  desc:'Coherence-keeping departments',     href:link('levels.html#standard') },
            { icon:'circle-slash',    title:'Low · 3',       desc:'Long-horizon, ancestral work',      href:link('levels.html#low') },
            { icon:'book-marked',     title:'Read framework',desc:'How priority is assigned & audited',href:link('levels.html') }
          ]}
        ],
        promo:{ tag:'Registry', title:'The canonical short table', body:'Every department, its level, daily cost, and its five-detail mandate — as Maher recorded it.', href:link('registry.html'), cta:'Open the Registry' }
      },
      {
        key:'audiences',
        title:'Audiences',
        icon:'users',
        groups:[
          { title:'Public & curious', items:[
            { icon:'user',           title:'For general readers', desc:'A friendly door into 2030B',  href:link('for-general.html') },
            { icon:'graduation-cap', title:'For students',        desc:'Learn the stack from scratch',href:link('for-students.html') },
            { icon:'newspaper',      title:'For press',           desc:'Press kit & briefings',        href:link('for-press.html') }
          ]},
          { title:'Practitioners', items:[
            { icon:'flask-conical',  title:'For researchers',  desc:'Methods, datasets, citations',  href:link('for-researchers.html') },
            { icon:'hammer',         title:'For builders',     desc:'Engineers, founders, hackers',  href:link('for-builders.html') },
            { icon:'school',         title:'For educators',    desc:'Curricula & teaching kits',     href:link('for-educators.html') }
          ]},
          { title:'Decision-makers', items:[
            { icon:'landmark',       title:'For policymakers', desc:'States & multilaterals',        href:link('for-policymakers.html') },
            { icon:'banknote',       title:'For investors',    desc:'$17.49/day economics',          href:link('for-investors.html') },
            { icon:'church',         title:'For faith',        desc:'Religious & contemplative',     href:link('for-faith.html') },
            { icon:'home',           title:'For communities',  desc:'Local & cultural groups',       href:link('for-communities.html') }
          ]}
        ],
        promo:{ tag:'Pick a door', title:'Ten audiences · ten landings', body:'2030B speaks differently to a researcher than to a faith community. Open the door that fits you.', href:link('for-general.html'), cta:'Start with the general door' }
      },
      {
        key:'project',
        title:'Project',
        icon:'sparkle',
        groups:[
          { title:'About', items:[
            { icon:'user',       title:'About Maher',  desc:'Founder, framework, anchor',           href:link('about.html') },
            { icon:'mail',       title:'Contact',      desc:'Reach the project',                    href:link('contact.html') },
            { icon:'copyright',  title:'Copyright',    desc:'© 2026 Maher · all rights reserved',   href:link('copyright.html') }
          ]},
          { title:'Browse', items:[
            { icon:'layout-grid',title:'All departments', desc:'Sixteen departments at a glance',   href:link('departments.html') },
            { icon:'book-marked',title:'Official Registry', desc:'Canonical short table',           href:link('registry.html') },
            { icon:'layers',     title:'Five levels',     desc:'How the stack is ordered',          href:link('levels.html') }
          ]}
        ],
        promo:{ tag:'Author', title:'Founded, written, copyrighted by Maher', body:'2030B is the original work of Maher. Read, share, and quote with attribution.', href:link('about.html'), cta:'About the author' }
      }
    ];
  }

  /* ============== RENDER ============== */
  function buildPanel(def){
    const groupsHTML = def.groups.map(g => `
      <div class="b-mm-group">
        <h4>${g.title}</h4>
        <div class="space-y-0.5">
          ${g.items.map(it => `
            <a class="b-mm-item" href="${it.href}">
              <span class="b-mm-glyph"><i data-lucide="${it.icon}"></i></span>
              <span class="min-w-0">
                <span class="b-mm-item-title">${it.title}</span>
                <span class="b-mm-item-desc block">${it.desc}</span>
              </span>
            </a>`).join('')}
        </div>
      </div>`).join('');

    const promoHTML = def.promo ? `
      <div class="b-mm-promo">
        <span class="b-mm-promo-tag">${def.promo.tag}</span>
        <span class="b-mm-promo-title">${def.promo.title}</span>
        <span class="b-mm-promo-body">${def.promo.body}</span>
        <a class="b-mm-promo-cta" href="${def.promo.href}">${def.promo.cta} <i data-lucide="arrow-right" style="width:14px;height:14px"></i></a>
      </div>` : '';

    return `<div class="b-mm-panel" data-mm-panel="${def.key}">
      <div class="b-mm-grid">${groupsHTML}${promoHTML}</div>
    </div>`;
  }

  function buildDesktop(prefix){
    const navs = NAV(prefix);
    const triggers = navs.map(def => `
      <li class="b-mm">
        <button type="button" class="b-mm-trigger" data-mm-trigger="${def.key}" aria-haspopup="true" aria-expanded="false">
          <i data-lucide="${def.icon}" style="width:14px;height:14px"></i>
          <span>${def.title}</span>
          <i data-lucide="chevron-down" class="b-mm-caret"></i>
        </button>
        ${buildPanel(def)}
      </li>`).join('');
    return `<ul class="b-mm-list">${triggers}</ul>`;
  }

  function buildMobile(prefix){
    const navs = NAV(prefix);
    const items = navs.map(def => `
      <details>
        <summary><span class="inline-flex items-center gap-2"><i data-lucide="${def.icon}" style="width:16px;height:16px"></i> ${def.title}</span></summary>
        <div class="b-mm-mobile-links">
          ${def.groups.map(g => g.items.map(it => `
            <a href="${it.href}"><i data-lucide="${it.icon}" style="width:14px;height:14px;color:#fbbf24"></i> ${it.title}</a>
          `).join('')).join('')}
        </div>
      </details>`).join('');
    return `<div class="b-mm-mobile">${items}</div>`;
  }

  /* ============== MOUNT + WIRE ============== */
  function mount(){
    injectCSS();
    const host = document.querySelector('[data-b-megamenu]');
    if (!host || host.dataset.mmRendered) return false;
    const prefix = (document.body && document.body.dataset.prefix) || '';
    host.innerHTML = buildDesktop(prefix);
    host.dataset.mmRendered = '1';

    const mobileHost = document.querySelector('[data-b-megamenu-mobile]');
    if (mobileHost && !mobileHost.dataset.mmRendered) {
      mobileHost.innerHTML = buildMobile(prefix);
      mobileHost.dataset.mmRendered = '1';
    }

    wireEvents(host);
    if (window.lucide) try { lucide.createIcons(); } catch(e){}
    document.dispatchEvent(new CustomEvent('b:megamenu'));
    return true;
  }

  function closeAll(except){
    document.querySelectorAll('.b-mm-panel[data-open]').forEach(p => {
      if (p !== except) p.removeAttribute('data-open');
    });
    document.querySelectorAll('.b-mm-trigger[data-open]').forEach(t => {
      if (!except || t.dataset.mmTrigger !== except.dataset.mmPanel) {
        t.removeAttribute('data-open');
        t.setAttribute('aria-expanded','false');
      }
    });
  }

  function wireEvents(host){
    let hoverTimer;
    host.querySelectorAll('.b-mm').forEach(li => {
      const trigger = li.querySelector('.b-mm-trigger');
      const panel   = li.querySelector('.b-mm-panel');
      if (!trigger || !panel) return;

      const open = () => {
        clearTimeout(hoverTimer);
        closeAll(panel);
        panel.setAttribute('data-open','');
        trigger.setAttribute('data-open','');
        trigger.setAttribute('aria-expanded','true');
      };
      const scheduleClose = () => {
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => {
          panel.removeAttribute('data-open');
          trigger.removeAttribute('data-open');
          trigger.setAttribute('aria-expanded','false');
        }, 160);
      };

      li.addEventListener('mouseenter', open);
      li.addEventListener('mouseleave', scheduleClose);
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        if (panel.hasAttribute('data-open')) {
          panel.removeAttribute('data-open');
          trigger.removeAttribute('data-open');
          trigger.setAttribute('aria-expanded','false');
        } else {
          open();
        }
      });
      trigger.addEventListener('focus', open);
      panel.addEventListener('mouseenter', () => clearTimeout(hoverTimer));
      panel.addEventListener('mouseleave', scheduleClose);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAll();
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.b-mm')) closeAll();
    });
  }

  /* ============== BOOT ============== */
  function tryMount(retries){
    if (mount()) return;
    if (retries <= 0) return;
    setTimeout(() => tryMount(retries - 1), 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => tryMount(20));
  } else {
    tryMount(20);
  }
  document.addEventListener('b:shell', () => tryMount(5));
})();
