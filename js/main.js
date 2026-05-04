/* 2030B Entry-Point Site — interactivity (cards, filters, animations, hero)
 * © 2026 Maher. All rights reserved.
 *
 * The Entry Point's job is ATTENTION. Every block, section, and component
 * must earn it. This file:
 *   1) Auto-tags every <section>, every grid, every card so they all reveal.
 *   2) Adds typewriter / hero-line / chip-pop / stat-flip behaviours.
 *   3) Injects a live views counter into every <section data-b-hero> if not
 *      already present, then lets js/views.js populate it.
 *   4) Renders the home grid with the ENRICHED department descriptions so
 *      they read like the civilizational charters Maher wrote them as.
 */
(function () {
  function levelColor(level) {
    return (window.B_LEVEL_COLORS || {})[level] || '#d4a857';
  }
  function fmtCost(c){
    if (typeof c !== 'number') return '';
    return '$' + c.toFixed(2);
  }

  /* ======================================================
     DEPARTMENT CARD — emphatic, attention-earning
     ====================================================== */
  function depCardHTML(dep, prefix='') {
    return `
      <article class="b-dep-card" data-level="${dep.level}" style="--lc:${dep.color}" data-b-tilt>
        <header class="flex items-center gap-3">
          <span class="b-dep-icon" data-b-glow><i data-lucide="${dep.icon}" class="w-5 h-5"></i></span>
          <span class="b-dep-level" style="color:${levelColor(dep.level)}">● ${dep.level}</span>
          <span class="ml-auto text-xs font-mono text-amber-300/85" title="Daily cost per human">${fmtCost(dep.cost)}/day</span>
        </header>
        <h3 class="b-dep-name">${dep.name.replace(/^2030B /,'')}</h3>
        <p class="b-dep-short">${dep.short}</p>
        <footer class="b-dep-foot">
          <a href="${prefix}pages/dept-${dep.slug}.html">Read full <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></a>
          <span class="text-amber-200/45 text-[0.65rem] uppercase tracking-wider">${dep.details.length} mandates</span>
        </footer>
      </article>`;
  }

  function renderHomeGrid() {
    const grid = document.getElementById('depGrid');
    if (!grid || !window.B_REGISTRY) return;
    grid.innerHTML = window.B_REGISTRY.map(d => depCardHTML(d, '')).join('');
    grid.setAttribute('data-b-stagger','');
    if (window.lucide) try { lucide.createIcons(); } catch(e){}

    const filters = document.querySelectorAll('.b-filter');
    filters.forEach(b => b.addEventListener('click', () => {
      filters.forEach(x => x.removeAttribute('data-active'));
      b.setAttribute('data-active','');
      const f = b.dataset.filter;
      grid.querySelectorAll('.b-dep-card').forEach(c => {
        c.style.display = (f === 'all' || c.dataset.level === f) ? '' : 'none';
      });
      // Re-cascade after filter so visible cards animate in again
      grid.removeAttribute('data-b-in');
      requestAnimationFrame(() => grid.setAttribute('data-b-in',''));
    }));
  }

  /* ======================================================
     TYPEWRITER — splits [data-b-typewriter] into characters
     ====================================================== */
  function splitTypewriters(){
    document.querySelectorAll('[data-b-typewriter]:not([data-b-tw-split])').forEach(el => {
      el.setAttribute('data-b-tw-split','');
      const txt = el.textContent;
      el.textContent = '';
      let i = 0;
      for (const ch of txt){
        const span = document.createElement('span');
        span.className = 'b-tw-char' + (ch === ' ' ? ' b-tw-space' : '');
        span.textContent = ch;
        span.style.transitionDelay = (.04 + i * .025).toFixed(3) + 's';
        el.appendChild(span);
        i++;
      }
    });
  }

  /* ======================================================
     INJECT VIEWS COUNTER into every hero (if not present)
     - One inline chip beside the eyebrow .b-chip (legacy)
     - One animated hero block under the headline (new, richer)
     ====================================================== */
  function injectViewsCounter(){
    document.querySelectorAll('section[data-b-hero], section[id$="hero-section"], #audRoot > section:first-child').forEach(sec => {
      // 1) Inline chip beside the .b-chip eyebrow
      if (!sec.querySelector('[data-b-views]:not([data-b-views-hero])')) {
        const chip = sec.querySelector('.b-chip');
        const counter = document.createElement('span');
        counter.setAttribute('data-b-views','');
        counter.setAttribute('data-b-views-page','auto');
        counter.setAttribute('data-b-views-label','Eyes on this door');
        counter.style.marginLeft = '.5rem';
        if (chip && chip.parentNode){
          if (chip.nextSibling !== counter) chip.parentNode.insertBefore(counter, chip.nextSibling);
        } else {
          const inner = sec.querySelector('.relative, .max-w-7xl, .max-w-6xl, .max-w-5xl, .max-w-3xl') || sec;
          inner.insertBefore(counter, inner.firstChild);
        }
      }

      // 2) Animated hero views block — placed after the headline / sub-paragraph
      if (!sec.querySelector('[data-b-views-hero]')) {
        const heroBlock = document.createElement('div');
        heroBlock.setAttribute('data-b-views','');
        heroBlock.setAttribute('data-b-views-hero','');
        heroBlock.setAttribute('data-b-views-page','auto');
        // Anchor: prefer right after the first <h1>, fall back after sub-paragraph, else append.
        const h1 = sec.querySelector('h1');
        const sub = sec.querySelector('.b-hero-sub, p.lead, p[data-b-hero-sub]');
        const anchor = sub || h1;
        if (anchor && anchor.parentNode){
          anchor.parentNode.insertBefore(heroBlock, anchor.nextSibling);
        } else {
          const inner = sec.querySelector('.relative, .max-w-7xl, .max-w-6xl, .max-w-5xl, .max-w-3xl') || sec;
          inner.appendChild(heroBlock);
        }
      }
    });
  }

  /* ======================================================
     AUTO-TAG sections / grids / components for animation
     ====================================================== */
  function autoTag(){
    // Every <main> section becomes a block-level reveal
    document.querySelectorAll('main section, section[data-b-hero]').forEach(sec => {
      if (!sec.hasAttribute('data-b-anim') &&
          !sec.hasAttribute('data-b-stagger') &&
          !sec.hasAttribute('data-b-block') &&
          !sec.hasAttribute('data-b-no-anim')){
        sec.setAttribute('data-b-block','');
      }
    });

    // Auto-stagger card-like grids
    document.querySelectorAll('.grid:not([data-b-no-anim]):not([data-b-stagger]):not([data-b-anim])').forEach(g => {
      const n = g.children.length;
      if (n >= 2 && n <= 36){
        const cardy = Array.from(g.children).every(c =>
          ['DIV','A','ARTICLE','LI','SPAN','BUTTON','P'].includes(c.tagName));
        if (cardy) g.setAttribute('data-b-stagger','');
      }
    });

    // Tag every card-like article / .b-glass / .b-stat / .b-level-card as components
    document.querySelectorAll('article, .b-glass, .b-stat, .b-level-card, .b-dep-card').forEach(el => {
      if (!el.hasAttribute('data-b-component') &&
          !el.hasAttribute('data-b-no-anim') &&
          !el.closest('[data-b-stagger]')){
        el.setAttribute('data-b-component','');
      }
    });

    // Tag every primary CTA with emphasis (recurring breath)
    document.querySelectorAll('.b-btn-primary:not([data-b-emphasis]):not([data-b-no-anim])').forEach(b => {
      b.setAttribute('data-b-emphasis','');
    });

    // Tag every stat number with attention pulse
    document.querySelectorAll('.b-stat-num:not([data-b-attention])').forEach(n => {
      n.setAttribute('data-b-attention','');
    });

    // Tag every chip with glow halo
    document.querySelectorAll('.b-chip:not([data-b-glow])').forEach(c => c.setAttribute('data-b-glow',''));
  }

  /* ======================================================
     REVEAL — IntersectionObserver, gated on b-revealed
     ====================================================== */
  function reveal() {
    const SEL = [
      '[data-b-anim]:not([data-b-in])',
      '[data-b-stagger]:not([data-b-in])',
      '[data-b-block]:not([data-b-in])',
      '[data-b-component]:not([data-b-in])',
      '[data-b-typewriter]:not([data-b-in])'
    ].join(', ');

    autoTag();
    splitTypewriters();
    injectViewsCounter();

    function start(){
      if (!('IntersectionObserver' in window)) {
        document.querySelectorAll(SEL).forEach(el => el.setAttribute('data-b-in',''));
        return;
      }
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting){
            e.target.setAttribute('data-b-in','');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

      document.querySelectorAll(SEL).forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0){
          el.setAttribute('data-b-in','');
        } else {
          io.observe(el);
        }
      });

      setTimeout(function(){
        document.querySelectorAll(SEL).forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.top < window.innerHeight + 200) el.setAttribute('data-b-in','');
        });
      }, 1400);
    }

    if (document.documentElement.classList.contains('b-revealed')) {
      start();
    } else {
      document.addEventListener('b:revealed', start, { once:true });
      setTimeout(() => {
        document.documentElement.classList.add('b-revealed');
        start();
      }, 3200);
    }
  }

  /* ======================================================
     MOBILE TOGGLE
     ====================================================== */
  function mobileMenu() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-mobile-toggle]');
      if (!btn) return;
      const m = document.getElementById('bMobile');
      if (m) m.classList.toggle('hidden');
    });
  }

  function init() {
    renderHomeGrid();
    reveal();
    mobileMenu();
    if (window.lucide) try { lucide.createIcons(); } catch(e){}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  document.addEventListener('b:shell',     () => { autoTag(); injectViewsCounter(); if (window.lucide) try { lucide.createIcons(); } catch(e){} });
  document.addEventListener('b:megamenu',  () => { autoTag(); if (window.lucide) try { lucide.createIcons(); } catch(e){} });
  document.addEventListener('b:revealed',  () => { autoTag(); });

  window.B_RENDER = { depCardHTML, levelColor, fmtCost, autoTag, splitTypewriters, injectViewsCounter };
})();
