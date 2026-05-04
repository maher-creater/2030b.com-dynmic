/* 2030B Entry-Point Site — GSAP page animations
 * © 2026 Maher. All rights reserved.
 *
 * Layered on top of the existing CSS-driven reveals (data-b-anim,
 * data-b-stagger, data-b-block) — does NOT replace them. GSAP adds:
 *
 *   1. Hero entrance choreography (chip pop, headline mask reveal,
 *      sub-paragraph fade, CTA stagger, orb drift, grid fade).
 *   2. Scroll-triggered section reveals via ScrollTrigger (loaded from CDN).
 *   3. Ambient float for [data-b-float], breathing scale for [data-b-breathe],
 *      magnetic hover for [data-b-magnet], counter rolls for [data-b-count].
 *   4. Smooth page-load fade-in of <main>.
 *
 * Gracefully degrades: if `window.gsap` is undefined the script only adds
 * a body class so the CSS fallback animations remain.
 */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function start() {
    if (!window.gsap) {
      document.documentElement.classList.add('b-no-gsap');
      return;
    }
    const gsap = window.gsap;
    const ST = window.ScrollTrigger;
    if (ST && gsap.registerPlugin) {
      try { gsap.registerPlugin(ST); } catch (_) {}
    }

    document.documentElement.classList.add('b-gsap-ready');

    // ── Page-load fade-in ──
    gsap.fromTo('main', { autoAlpha: 0, y: 20 }, {
      autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.05
    });

    // ── HERO choreography ──
    const hero = document.querySelector('section[data-b-hero], #hero-section');
    if (hero) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      const chip = hero.querySelector('.b-chip');
      const views = hero.querySelector('[data-b-views]');
      const headlineRows = hero.querySelectorAll('.b-hero-headline-inner, h1');
      const sub = hero.querySelector('.b-hero-sub, p.lead, p[data-b-hero-sub]');
      const actions = hero.querySelectorAll('.b-hero-actions a, .b-hero-actions button, .b-btn-primary, .b-btn-ghost');
      const stats = hero.querySelectorAll('.b-stat');
      const orbs = hero.querySelectorAll('.b-orb');

      if (chip) tl.fromTo(chip, { y: 20, autoAlpha: 0, scale: 0.9 },
        { y: 0, autoAlpha: 1, scale: 1, duration: 0.7, ease: 'back.out(1.6)' }, 0.05);

      if (views) tl.fromTo(views, { y: 20, autoAlpha: 0, scale: 0.85 },
        { y: 0, autoAlpha: 1, scale: 1, duration: 0.7, ease: 'back.out(1.8)' }, 0.18);

      if (headlineRows.length) tl.fromTo(headlineRows,
        { yPercent: 60, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 0.95, stagger: 0.12 }, 0.15);

      if (sub) tl.fromTo(sub, { y: 16, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7 }, 0.6);

      if (actions.length) tl.fromTo(actions, { y: 14, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.08 }, 0.75);

      if (stats.length) tl.fromTo(stats, { y: 18, autoAlpha: 0, scale: 0.95 },
        { y: 0, autoAlpha: 1, scale: 1, duration: 0.55, stagger: 0.07 }, 0.95);

      // Slow orb drift
      orbs.forEach((orb, i) => {
        gsap.to(orb, {
          x: '+=' + (40 + i * 15),
          y: '-=' + (30 + i * 10),
          duration: 14 + i * 3,
          yoyo: true, repeat: -1,
          ease: 'sine.inOut'
        });
      });
    }

    // ── ScrollTrigger sections (only if plugin is loaded) ──
    if (ST) {
      // Reveal each <main> section as it enters the viewport.
      document.querySelectorAll('main section').forEach((sec, i) => {
        if (sec.matches('[data-b-hero]') || sec.id === 'hero-section') return;
        gsap.fromTo(sec,
          { y: 50, autoAlpha: 0 },
          {
            y: 0, autoAlpha: 1, duration: 0.95, ease: 'power3.out',
            scrollTrigger: {
              trigger: sec,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );

        // Stagger card-like grids inside the section
        const grids = sec.querySelectorAll('.grid, [data-b-stagger]');
        grids.forEach(g => {
          const kids = g.children;
          if (kids.length < 2 || kids.length > 60) return;
          gsap.fromTo(kids,
            { y: 26, autoAlpha: 0, scale: 0.97 },
            {
              y: 0, autoAlpha: 1, scale: 1, duration: 0.6,
              ease: 'power2.out', stagger: 0.05,
              scrollTrigger: {
                trigger: g,
                start: 'top 88%',
                toggleActions: 'play none none none'
              }
            }
          );
        });
      });
    }

    // ── Ambient float ──
    document.querySelectorAll('[data-b-float]').forEach((el, i) => {
      gsap.to(el, {
        y: '+=' + (8 + (i % 3) * 4),
        duration: 3 + (i % 3),
        yoyo: true, repeat: -1, ease: 'sine.inOut'
      });
    });

    // ── Breathe ──
    document.querySelectorAll('[data-b-breathe]').forEach(el => {
      gsap.to(el, {
        scale: 1.04, duration: 2.6,
        yoyo: true, repeat: -1, ease: 'sine.inOut'
      });
    });

    // ── Magnet hover ──
    document.querySelectorAll('[data-b-magnet]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const mx = (e.clientX - r.left - r.width / 2) / r.width;
        const my = (e.clientY - r.top - r.height / 2) / r.height;
        gsap.to(el, { x: mx * 14, y: my * 14, duration: 0.45, ease: 'power3.out' });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1,0.45)' });
      });
    });

    // ── Counter roll-up: [data-b-count="42"] ──
    document.querySelectorAll('[data-b-count]').forEach(el => {
      const to = parseFloat(el.getAttribute('data-b-count'));
      if (isNaN(to)) return;
      const decimals = (String(to).split('.')[1] || '').length;
      const obj = { v: 0 };
      const trigger = ST ? {
        scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' }
      } : {};
      gsap.to(obj, Object.assign({
        v: to, duration: 1.6, ease: 'power2.out',
        onUpdate: () => {
          el.textContent = decimals
            ? obj.v.toFixed(decimals)
            : Math.round(obj.v).toLocaleString();
        }
      }, trigger));
    });

    // Re-fire ScrollTrigger refresh when new content arrives (shell, mega-menu, audience pages)
    function refreshST() {
      if (window.ScrollTrigger) {
        try { window.ScrollTrigger.refresh(); } catch (_) {}
      }
    }
    document.addEventListener('b:shell',     refreshST);
    document.addEventListener('b:megamenu',  refreshST);
    document.addEventListener('b:revealed',  refreshST);
    document.addEventListener('b:i18n',      refreshST);
  }

  // Wait for GSAP to be available (CDN script tag is async-safe).
  function waitForGsap(maxWaitMs, step) {
    const t0 = performance.now();
    (function check() {
      if (window.gsap) { start(); return; }
      if (performance.now() - t0 > maxWaitMs) { start(); return; } // fall through (degrade)
      setTimeout(check, step || 60);
    })();
  }

  ready(() => waitForGsap(1800, 70));
})();
