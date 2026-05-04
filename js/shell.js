/* 2030B Entry-Point Site — shell renderer (nav + footer)
 * © 2026 Maher. All rights reserved.
 *
 * Set <body data-prefix=""> on root pages, or data-prefix="../" inside /pages/.
 * The mega-menu (js/megamenu.js) auto-mounts into [data-b-megamenu].
 *
 * NOTE: WebBook is treated only as a tool throughout this site (not a
 * department). Departments project WebBooks; we do not advertise the reader
 * as a top-level destination on the entry point.
 */
(function () {
  function navHTML(prefix) {
    return `
    <header class="b-header">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <nav class="b-nav">
          <a href="${prefix}index.html" class="flex items-center gap-2.5 shrink-0" aria-label="2030B home">
            <span class="w-10 h-10 inline-flex items-center justify-center" data-b-logo="square" data-b-size="40"></span>
            <span class="font-display font-bold text-lg leading-none hidden sm:inline-block">
              <span class="b-gold-text">2030B</span>
              <span class="block text-[10px] tracking-[0.2em] uppercase opacity-60 mt-0.5 font-sans">The Entry Point</span>
            </span>
          </a>

          <!-- Mega-menu (desktop) — populated by js/megamenu.js -->
          <div data-b-megamenu class="hidden lg:block flex-1 px-4 min-w-0"></div>

          <div class="flex items-center gap-1.5 shrink-0">
            <!-- Animated nav-icons (search · account · language · theme) -->
            <button data-b-aside-toggle="search" class="b-nav-icon" aria-label="Search" data-i18n-aria="nav.search">
              <i data-lucide="search" class="w-4 h-4"></i>
            </button>
            <button data-b-aside-toggle="user" class="b-nav-icon" aria-label="Your account" data-i18n-aria="nav.account">
              <i data-lucide="user-round" class="w-4 h-4"></i>
            </button>
            <button data-b-aside-toggle="lang" class="b-nav-icon" aria-label="Language" data-i18n-aria="nav.language">
              <i data-lucide="languages" class="w-4 h-4"></i>
            </button>
            <button data-b-theme-toggle class="b-nav-icon" aria-label="Toggle theme" data-i18n-aria="nav.theme">
              <i data-lucide="sun-moon" class="w-4 h-4"></i>
            </button>

            <a href="${prefix}pages/maher-vision.html" class="b-btn-primary text-sm hidden md:inline-flex ml-1">
              <i data-lucide="rocket" class="w-4 h-4"></i> <span data-i18n="common.vision_cta">$1Q vision</span>
            </a>
            <button data-mobile-toggle class="lg:hidden w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300" aria-label="Menu"><i data-lucide="menu" class="w-5 h-5"></i></button>
          </div>
        </nav>

        <!-- Mobile drawer — populated by js/megamenu.js -->
        <div id="bMobile" class="hidden lg:hidden mt-2 b-glass rounded-xl p-4">
          <div data-b-megamenu-mobile></div>
          <div class="mt-3 pt-3 border-t border-amber-200/10 flex flex-col gap-1">
            <a class="block py-1.5 b-navlink" href="${prefix}pages/maher-vision.html" data-i18n="common.vision_cta">The $1Q vision</a>
            <a class="block py-1.5 b-navlink" href="${prefix}pages/about.html" data-i18n="nav.about">About Maher</a>
          </div>
        </div>
      </div>
    </header>

    <!-- Aside backdrops + side panels -->
    <div class="b-aside-backdrop" data-b-aside-backdrop aria-hidden="true"></div>

    <aside class="b-aside" data-b-aside="search" aria-hidden="true">
      <header class="b-aside-head">
        <h3 class="b-aside-title" data-i18n="nav.search">Search 2030B</h3>
        <button class="b-nav-icon" data-b-aside-close aria-label="Close"><i data-lucide="x" class="w-4 h-4"></i></button>
      </header>
      <div class="b-aside-body">
        <label class="block text-xs uppercase tracking-[0.2em] text-amber-200/55 mb-2" data-i18n="nav.search">Search</label>
        <input type="search" placeholder="Try: ontology, $17.49, planetary defense…" class="w-full px-3 py-2 rounded-lg bg-amber-500/5 border border-amber-200/15 text-amber-100 placeholder-amber-200/40 focus:outline-none focus:border-amber-300/50">
        <p class="mt-3 text-xs text-amber-100/50">Search runs across all twenty-five department pages and the official Registry.</p>
        <div class="mt-5 grid grid-cols-2 gap-2">
          <a class="b-aside-action" href="${prefix}pages/registry.html"><i data-lucide="book-marked" class="w-4 h-4"></i> <span data-i18n="nav.registry">Registry</span></a>
          <a class="b-aside-action" href="${prefix}pages/levels.html"><i data-lucide="layers" class="w-4 h-4"></i> <span data-i18n="nav.levels">Levels</span></a>
          <a class="b-aside-action" href="${prefix}pages/departments.html"><i data-lucide="layout-grid" class="w-4 h-4"></i> <span data-i18n="nav.departments">Departments</span></a>
          <a class="b-aside-action" href="${prefix}pages/maher-vision.html"><i data-lucide="rocket" class="w-4 h-4"></i> <span data-i18n="common.vision_cta">$1Q vision</span></a>
        </div>
      </div>
    </aside>

    <aside class="b-aside" data-b-aside="user" aria-hidden="true">
      <header class="b-aside-head">
        <h3 class="b-aside-title" data-i18n="nav.account">Your account</h3>
        <button class="b-nav-icon" data-b-aside-close aria-label="Close"><i data-lucide="x" class="w-4 h-4"></i></button>
      </header>
      <div class="b-aside-body">
        <div class="flex items-center gap-3">
          <div class="b-aside-avatar">M</div>
          <div>
            <p class="text-amber-100 font-semibold">Guest</p>
            <p class="text-xs text-amber-100/55">Sign in to save your reading position.</p>
          </div>
        </div>
        <div class="mt-5 grid gap-2">
          <a class="b-aside-action" href="#"><i data-lucide="log-in" class="w-4 h-4"></i> Sign in</a>
          <a class="b-aside-action" href="#"><i data-lucide="user-plus" class="w-4 h-4"></i> Create an account</a>
          <a class="b-aside-action" href="${prefix}pages/contact.html"><i data-lucide="mail" class="w-4 h-4"></i> <span data-i18n="nav.contact">Contact the project</span></a>
        </div>
      </div>
    </aside>

    <aside class="b-aside" data-b-aside="lang" aria-hidden="true">
      <header class="b-aside-head">
        <h3 class="b-aside-title" data-i18n="nav.language">Language</h3>
        <button class="b-nav-icon" data-b-aside-close aria-label="Close"><i data-lucide="x" class="w-4 h-4"></i></button>
      </header>
      <div class="b-aside-body">
        <p class="text-xs uppercase tracking-[0.2em] text-amber-200/55 mb-3">Choose a language</p>
        <div class="grid grid-cols-2 gap-2" data-b-langs>
          <button class="b-aside-action" data-lang="en">English</button>
          <button class="b-aside-action" data-lang="ar" dir="rtl">العربية</button>
          <button class="b-aside-action" data-lang="fr">Français</button>
          <button class="b-aside-action" data-lang="es">Español</button>
          <button class="b-aside-action" data-lang="tr">Türkçe</button>
          <button class="b-aside-action" data-lang="ur" dir="rtl">اردو</button>
          <button class="b-aside-action" data-lang="id">Indonesia</button>
          <button class="b-aside-action" data-lang="zh">中文</button>
        </div>
      </div>
    </aside>`;
  }

  function footHTML(prefix) {
    const inPages = prefix === '../';
    const link = (slug) => inPages ? slug : `pages/${slug}`;
    return `
    <footer class="border-t border-amber-200/10 mt-24 pt-14 pb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-5 gap-10">
        <div class="md:col-span-2">
          <a href="${prefix}index.html" class="inline-flex items-center gap-2.5">
            <span class="w-10 h-10 inline-flex items-center justify-center" data-b-logo="square" data-b-size="40"></span>
            <span class="font-display font-bold text-lg">
              <span class="b-gold-text">2030B</span>
              <span class="block text-[10px] tracking-[0.2em] uppercase opacity-60">The Entry Point</span>
            </span>
          </a>
          <p class="mt-4 text-sm text-amber-100/65 leading-relaxed max-w-md">
            The public registry of the twenty-five departments responsible for the civilization ahead.
            Total operating cost: $17.49 per human per day.
          </p>
          <p class="mt-5 text-xs font-mono text-amber-100/50" data-i18n="common.copyright">© 2026 Maher · 2030B is a copyrighted work of Maher. All rights reserved.</p>
        </div>

        <div>
          <h4 class="font-semibold text-amber-50 text-sm" data-i18n="nav.departments">Browse</h4>
          <ul class="mt-3 space-y-2 text-sm text-amber-100/65">
            <li><a class="hover:text-amber-300" href="${link('departments.html')}" data-i18n="common.all_departments">All 25 departments</a></li>
            <li><a class="hover:text-amber-300" href="${link('registry.html')}" data-i18n="nav.registry">Official Registry</a></li>
            <li><a class="hover:text-amber-300" href="${link('levels.html')}" data-i18n="home.levels_title">Five priority levels</a></li>
            <li><a class="hover:text-amber-300" href="${link('maher-vision.html')}" data-i18n="common.vision_cta">The $1Q vision</a></li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-amber-50 text-sm">Critical level</h4>
          <ul class="mt-3 space-y-2 text-sm text-amber-100/65">
            <li><a class="hover:text-amber-300" href="${link('dept-ecosystem.html')}">Ecosystem</a></li>
            <li><a class="hover:text-amber-300" href="${link('dept-ontology.html')}">Ontology</a></li>
            <li><a class="hover:text-amber-300" href="${link('dept-quantum-ethics.html')}">Quantum Ethics</a></li>
            <li><a class="hover:text-amber-300" href="${link('dept-neural-sovereignty.html')}">Neural Sovereignty</a></li>
            <li><a class="hover:text-amber-300" href="${link('dept-planetary-defense.html')}">Planetary Defense</a></li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-amber-50 text-sm">For you</h4>
          <ul class="mt-3 space-y-2 text-sm text-amber-100/65">
            <li><a class="hover:text-amber-300" href="${link('for-general.html')}">For general readers</a></li>
            <li><a class="hover:text-amber-300" href="${link('for-researchers.html')}">For researchers</a></li>
            <li><a class="hover:text-amber-300" href="${link('for-builders.html')}">For builders</a></li>
            <li><a class="hover:text-amber-300" href="${link('about.html')}">About Maher</a></li>
            <li><a class="hover:text-amber-300" href="${link('contact.html')}">Contact</a></li>
          </ul>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 mt-10 pt-6 border-t border-amber-200/10 flex flex-wrap items-center justify-between gap-3">
        <p class="text-xs text-amber-100/45">2030B · Twenty-five departments · One entry point</p>
        <p class="text-xs text-amber-100/45 font-mono">Authored, maintained, and copyrighted by <span class="text-amber-300">Maher</span>.</p>
      </div>
    </footer>`;
  }

  function activeNav() {
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('[data-mm-trigger]').forEach(t => {
      const k = t.dataset.mmTrigger;
      if ((k === 'departments' && (path.startsWith('dept-') || path === 'departments.html')) ||
          (k === 'levels' && path === 'levels.html') ||
          (k === 'audiences' && path.startsWith('for-')) ||
          (k === 'project' && (path === 'about.html' || path === 'contact.html' || path === 'copyright.html' || path === 'maher-vision.html'))) {
        t.setAttribute('data-active','');
      }
    });
  }

  /* ============== Aside (slide-in side panels) wiring ============== */
  function wireAsides(){
    const open = (key) => {
      closeAll();
      const a = document.querySelector(`[data-b-aside="${key}"]`);
      const bd = document.querySelector('[data-b-aside-backdrop]');
      if (!a) return;
      a.setAttribute('data-open','');
      a.setAttribute('aria-hidden','false');
      if (bd) bd.setAttribute('data-open','');
      document.documentElement.classList.add('b-aside-locked');
    };
    const closeAll = () => {
      document.querySelectorAll('.b-aside[data-open]').forEach(a => {
        a.removeAttribute('data-open');
        a.setAttribute('aria-hidden','true');
      });
      const bd = document.querySelector('[data-b-aside-backdrop]');
      if (bd) bd.removeAttribute('data-open');
      document.documentElement.classList.remove('b-aside-locked');
    };
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-b-aside-toggle]');
      if (t) { e.preventDefault(); open(t.dataset.bAsideToggle); return; }
      if (e.target.closest('[data-b-aside-close]') || e.target.matches('[data-b-aside-backdrop]')) closeAll();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });

    // Theme toggle
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-b-theme-toggle]');
      if (!t) return;
      const html = document.documentElement;
      const isLight = html.classList.toggle('b-light');
      try { localStorage.setItem('b-theme', isLight ? 'light' : 'dark'); } catch(_){}
    });
    try {
      if (localStorage.getItem('b-theme') === 'light') document.documentElement.classList.add('b-light');
    } catch(_){}

    // Language buttons
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-lang]');
      if (!t) return;
      const lang = t.dataset.lang;
      try { localStorage.setItem('b-lang', lang); } catch(_){}
      const rtl = (lang === 'ar' || lang === 'ur');
      document.documentElement.setAttribute('lang', lang);
      document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr');
      document.querySelectorAll('[data-b-langs] [data-lang]').forEach(b => b.removeAttribute('data-active'));
      t.setAttribute('data-active','');
    });
  }

  function renderShell() {
    const prefix = (document.body && document.body.dataset.prefix) || '';
    const head = document.querySelector('[data-shell]');
    const foot = document.querySelector('[data-shell-foot]');
    if (head && !head.dataset.rendered) {
      head.innerHTML = navHTML(prefix);
      head.dataset.rendered = '1';
    }
    if (foot && !foot.dataset.rendered) {
      foot.innerHTML = footHTML(prefix);
      foot.dataset.rendered = '1';
    }
    activeNav();
    wireAsides();
    if (window.lucide) try { lucide.createIcons(); } catch(e){}
    document.dispatchEvent(new CustomEvent('b:shell'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderShell);
  } else {
    renderShell();
  }
})();
