/* 2030B Entry-Point Site — i18n loader
 * © 2026 Maher. All rights reserved.
 *
 * Loads /i18n/<lang>.json (en, ar, fr, es, tr, ur, id, zh) and applies it to:
 *   - [data-i18n="key.path"]              → textContent
 *   - [data-i18n-html="key.path"]         → innerHTML
 *   - [data-i18n-attr="attr|key.path"]    → setAttribute
 *   - [data-i18n-placeholder="key.path"]  → placeholder
 *   - [data-i18n-title="key.path"]        → title
 *   - [data-i18n-aria="key.path"]         → aria-label
 *
 * Reads/writes language preference from localStorage('b-lang').
 * Wires every [data-lang] button (in shell.js) to switch language live,
 * sets <html lang> and <html dir>, and dispatches `b:i18n` after apply.
 *
 * Resolves the JSON URL relative to <body data-prefix="../"> when the
 * page lives in /pages/.
 */
(function () {
  'use strict';

  const SUPPORTED = ['en', 'ar', 'fr', 'es', 'tr', 'ur', 'id', 'zh'];
  const RTL = new Set(['ar', 'ur']);
  const STORAGE_KEY = 'b-lang';
  const DEFAULT_LANG = 'en';

  /* ------------ helpers ------------ */
  function prefix() {
    return (document.body && document.body.dataset.prefix) || '';
  }

  function currentLang() {
    let lang = null;
    try { lang = localStorage.getItem(STORAGE_KEY); } catch (_) {}
    if (!lang) {
      const nav = (navigator.language || navigator.userLanguage || 'en').slice(0, 2).toLowerCase();
      if (SUPPORTED.includes(nav)) lang = nav;
    }
    if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
    return lang;
  }

  function resolve(obj, path) {
    if (!obj || !path) return undefined;
    const parts = String(path).split('.');
    let v = obj;
    for (const p of parts) {
      if (v == null) return undefined;
      v = v[p];
    }
    return v;
  }

  /* ------------ cache ------------ */
  const CACHE = Object.create(null);
  function fetchLang(lang) {
    if (CACHE[lang]) return Promise.resolve(CACHE[lang]);
    const url = prefix() + 'i18n/' + lang + '.json';
    return fetch(url, { credentials: 'omit', cache: 'force-cache' })
      .then(r => {
        if (!r.ok) throw new Error('i18n http ' + r.status);
        return r.json();
      })
      .then(data => { CACHE[lang] = data; return data; })
      .catch(err => {
        if (lang !== DEFAULT_LANG) return fetchLang(DEFAULT_LANG);
        return {};
      });
  }

  /* ------------ apply ------------ */
  function apply(dict, lang) {
    const html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', RTL.has(lang) ? 'rtl' : 'ltr');
    html.classList.toggle('b-rtl', RTL.has(lang));

    // textContent
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = resolve(dict, el.getAttribute('data-i18n'));
      if (typeof v === 'string') el.textContent = v;
    });
    // innerHTML
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const v = resolve(dict, el.getAttribute('data-i18n-html'));
      if (typeof v === 'string') el.innerHTML = v;
    });
    // placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const v = resolve(dict, el.getAttribute('data-i18n-placeholder'));
      if (typeof v === 'string') el.setAttribute('placeholder', v);
    });
    // title
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const v = resolve(dict, el.getAttribute('data-i18n-title'));
      if (typeof v === 'string') el.setAttribute('title', v);
    });
    // aria-label
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const v = resolve(dict, el.getAttribute('data-i18n-aria'));
      if (typeof v === 'string') el.setAttribute('aria-label', v);
    });
    // generic attribute → "attr|key.path"
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const raw = el.getAttribute('data-i18n-attr');
      if (!raw) return;
      raw.split(',').forEach(pair => {
        const [attr, key] = pair.split('|').map(s => s && s.trim());
        if (!attr || !key) return;
        const v = resolve(dict, key);
        if (typeof v === 'string') el.setAttribute(attr, v);
      });
    });

    // Update language buttons active state
    document.querySelectorAll('[data-b-langs] [data-lang]').forEach(b => {
      if (b.dataset.lang === lang) b.setAttribute('data-active', '');
      else b.removeAttribute('data-active');
    });

    // Expose dict + helpers
    window.B_I18N_DICT = dict;
    window.B_I18N_LANG = lang;
    document.dispatchEvent(new CustomEvent('b:i18n', { detail: { lang, dict } }));
  }

  /* ------------ public API ------------ */
  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
    return fetchLang(lang).then(dict => { apply(dict, lang); return dict; });
  }

  function t(key, fallback) {
    const v = resolve(window.B_I18N_DICT || {}, key);
    return (typeof v === 'string') ? v : (fallback != null ? fallback : key);
  }

  function init() {
    const lang = currentLang();
    setLang(lang);
  }

  /* ------------ wire language buttons (delegated) ------------ */
  document.addEventListener('click', function (e) {
    const t = e.target.closest('[data-lang]');
    if (!t) return;
    const lang = t.dataset.lang;
    if (!lang || !SUPPORTED.includes(lang)) return;
    setLang(lang);
  });

  /* ------------ re-apply after shell / megamenu / audience renders ------------ */
  function reapply() {
    const dict = window.B_I18N_DICT;
    const lang = window.B_I18N_LANG;
    if (dict && lang) apply(dict, lang);
  }
  document.addEventListener('b:shell',    reapply);
  document.addEventListener('b:megamenu', reapply);
  document.addEventListener('b:revealed', reapply);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.B_I18N = { setLang, t, fetchLang, supported: SUPPORTED.slice(), apply, reapply };
})();
