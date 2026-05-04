/* 2030B Entry-Point Site — Audience landings (data + renderer)
 * © 2026 Maher. All rights reserved.
 *
 * Each audience landing reads its slug from <body data-audience="..."> and
 * renders the hero, value props, recommended departments, and a clear CTA.
 */
window.B_AUDIENCES = {
  general: {
    title:'For general readers', tag:'You · curious human',
    hero:'2030B, in plain language.',
    sub:'Twenty-five departments. $17.49 per human per day. One coordinated stack for the civilization ahead.',
    color:'#fbbf24', icon:'user',
    why:[
      { icon:'compass',  title:'You don\'t need a PhD',     body:'Every department has a one-paragraph identity card before any technicality.' },
      { icon:'layers',   title:'Five clear levels',        body:'From Critical (existence-bearing) to Low (long-horizon) — you always see priority at a glance.' },
      { icon:'wallet',   title:'Honest economics',         body:'Each department lists its daily cost per human. The total is $17.49/day — affordable, distributed.' }
    ],
    recommend:['ontology','ecosystem','existential-risk','collective-memory','sacred-arts'],
    cta:{ title:'Start with the registry', body:'See every department, its level, and its mandate.', href:'registry.html', label:'Open the Registry' }
  },
  researchers: {
    title:'For researchers', tag:'Scientists · academics',
    hero:'A registry your citations can land on.',
    sub:'Methods, datasets, benchmarks. Open commons under Data Commons; reproducibility under CSL.',
    color:'#d4a857', icon:'flask-conical',
    why:[
      { icon:'library',     title:'CSL: peer-review for awareness science', body:'Submission rules, review tiers, and a versioned archive.' },
      { icon:'database',    title:'Data Commons',                            body:'Curated public corpora with provenance audits and open weights.' },
      { icon:'shield-check',title:'Reality Verification',                    body:'Authentication standards for ontological claims and simulation tests.' }
    ],
    recommend:['csl','data-commons','reality-verification','ontology','ai-alignment'],
    cta:{ title:'Review the methods', body:'Open CSL\'s methodology library and the open benchmark suites.', href:'dept-csl.html', label:'Open CSL' }
  },
  policymakers: {
    title:'For policymakers', tag:'States · multilaterals',
    hero:'A coordinated stack ministries can adopt.',
    sub:'Critical-level departments are designed for state-scale operation: Existential Risk, Planetary Defense, Civilizational Continuity, Neural Sovereignty.',
    color:'#f5a3c0', icon:'landmark',
    why:[
      { icon:'shield',          title:'Neural Sovereignty doctrine', body:'Mental privacy laws and brain-data ownership frameworks.' },
      { icon:'satellite',       title:'Planetary Defense',           body:'Treaty-grade orbital response and asteroid-detection protocols.' },
      { icon:'building-2',      title:'Civilizational Continuity',   body:'Succession charters, redundancy maps, restart playbooks.' }
    ],
    recommend:['neural-sovereignty','existential-risk','planetary-defense','civilizational-continuity','quantum-ethics'],
    cta:{ title:'Brief your cabinet', body:'A 2-page department-by-department legislative brief.', href:'registry.html', label:'Open the Registry' }
  },
  investors: {
    title:'For investors', tag:'Capital · allocators',
    hero:'$17.49 per human per day · the smallest civilization ever.',
    sub:'Twenty-five departments at a sustainable, distributable, auditable cost. The math is on the $1Q vision page.',
    color:'#86c5a0', icon:'banknote',
    why:[
      { icon:'banknote', title:'Per-department cost field', body:'Every department publishes its daily cost. Aggregation = $17.49.' },
      { icon:'rocket',   title:'$1Q vision',                body:'Maher\'s plan to take global GDP from trillions into the first quadrillion.' },
      { icon:'zap',      title:'Energy & Data Commons',     body:'The two commons that make the rest of the stack capital-efficient.' }
    ],
    recommend:['energy-commons','data-commons','ai-alignment','genetic-stewardship','education-2030b'],
    cta:{ title:'Read the $1Q vision', body:'How 2030B targets a $1,000 trillion economy without inflation theatre.', href:'maher-vision.html', label:'Open the $1Q vision' }
  },
  builders: {
    title:'For builders', tag:'Engineers · founders · hackers',
    hero:'Build with the stack, not against it.',
    sub:'Open data, open weights, open standards. AI Alignment, Data Commons, and Energy Commons are written for builders.',
    color:'#7c8df5', icon:'hammer',
    why:[
      { icon:'cpu',      title:'AI Alignment specs',  body:'Capability audits, corrigibility tests, deployment incident response.' },
      { icon:'database', title:'Data Commons feeds',  body:'Provenance-clean datasets and open benchmarks.' },
      { icon:'zap',      title:'Energy Commons grid', body:'Open interoperability standards and storage capacity maps.' }
    ],
    recommend:['ai-alignment','data-commons','energy-commons','synthetic-empathy','reality-verification'],
    cta:{ title:'Pick your department', body:'Browse all twenty-five and find the surface you want to build on.', href:'departments.html', label:'Open the grid' }
  },
  educators: {
    title:'For educators', tag:'Teachers · deans',
    hero:'Curricula aligned with the live mandates.',
    sub:'The Education Department aligns syllabi with the five-detail mandate of every other department.',
    color:'#5fc1d4', icon:'school',
    why:[
      { icon:'graduation-cap',title:'Open credentialing rails', body:'Standards-based credentials that travel across institutions.' },
      { icon:'library',       title:'CSL teaching kits',        body:'Peer-reviewed teaching kits for awareness science.' },
      { icon:'archive',       title:'Collective Memory',        body:'Long-form archives that classes can build assignments around.' }
    ],
    recommend:['education-2030b','csl','collective-memory','interspecies-communication','memetic-engineering'],
    cta:{ title:'Open the Education department', body:'See the curriculum-alignment standards and credential rails.', href:'dept-education-2030b.html', label:'Open Education' }
  },
  students: {
    title:'For students', tag:'Learners worldwide',
    hero:'A 25-door classroom for the century ahead.',
    sub:'Start anywhere. Most students enter through Ontology, Quantum Ethics, AI Alignment, or Sacred Arts.',
    color:'#fbbf24', icon:'graduation-cap',
    why:[
      { icon:'compass', title:'Start with Ontology',    body:'Anchored in Al-Ḥaqq. The bedrock department.' },
      { icon:'cpu',     title:'AI Alignment is hiring', body:'The most builder-friendly entry into the stack.' },
      { icon:'palette', title:'Sacred Arts',            body:'For students whose path is contemplative or aesthetic.' }
    ],
    recommend:['ontology','quantum-ethics','ai-alignment','sacred-arts','synthetic-empathy'],
    cta:{ title:'Pick your first department', body:'Open the grid, scan the levels, and choose your door.', href:'departments.html', label:'Browse the grid' }
  },
  faith: {
    title:'For faith communities', tag:'Religious · contemplative',
    hero:'Anchored in Al-Ḥaqq. Hospitable to all traditions.',
    sub:'Ontology and Sacred Arts protect the meaning layer. Quantum Ethics works with — not against — moral seriousness.',
    color:'#d4a857', icon:'church',
    why:[
      { icon:'compass', title:'The anchor is Al-Ḥaqq',  body:'2030B refuses to relativize truth; it grounds itself.' },
      { icon:'palette', title:'Sacred Arts as a department', body:'Liturgy, calligraphy, sacred music, and contemplative architecture are stewarded, not folklorized.' },
      { icon:'scale',   title:'Quantum Ethics',         body:'Ethics robust to indeterminacy — friendly to mature theology.' }
    ],
    recommend:['ontology','sacred-arts','quantum-ethics','collective-memory','cosmic-heritage'],
    cta:{ title:'Open the Ontology charter', body:'The anchor department of the entire stack.', href:'dept-ontology.html', label:'Open Ontology' }
  },
  press: {
    title:'For press', tag:'Journalists · analysts',
    hero:'A press kit that matches the registry.',
    sub:'Quotable mandates. Cost figures with sources. A founder, a copyright, and a mailing address.',
    color:'#f5a3c0', icon:'newspaper',
    why:[
      { icon:'book-marked', title:'Registry as a primary source', body:'Every quote in the registry is dated and signed.' },
      { icon:'mail',        title:'Direct contact',                body:'Press goes to a single mailbox. No agency layer.' },
      { icon:'copyright',   title:'Clear attribution',             body:'2030B is © Maher. Use freely with attribution.' }
    ],
    recommend:['ontology','existential-risk','ai-alignment','planetary-defense','neural-sovereignty'],
    cta:{ title:'Reach the project', body:'Press contact + the official copyright notice.', href:'contact.html', label:'Open press contact' }
  },
  communities: {
    title:'For communities', tag:'Local · cultural groups',
    hero:'A door at human scale.',
    sub:'Civic Trust, Sacred Arts, and Collective Memory are written so neighbourhoods, not only nations, can adopt them.',
    color:'#86c5a0', icon:'home',
    why:[
      { icon:'handshake', title:'Civic Trust formats',   body:'Deliberative dialogue formats that any neighbourhood can run.' },
      { icon:'archive',   title:'Collective Memory kits',body:'Tools for archiving local knowledge with provenance.' },
      { icon:'palette',   title:'Sacred Arts at home',   body:'Cross-tradition encounter formats that travel between communities.' }
    ],
    recommend:['civic-trust','collective-memory','sacred-arts','interspecies-communication','memetic-engineering'],
    cta:{ title:'Open Civic Trust', body:'See the deliberative dialogue formats.', href:'dept-civic-trust.html', label:'Open Civic Trust' }
  }
};

(function renderAudience(){
  function init(){
    const slug = (document.body && document.body.dataset.audience) || '';
    const a = window.B_AUDIENCES[slug];
    const root = document.getElementById('audRoot');
    if (!a || !root) return;

    const cost = window.B_TOTAL_DAILY_COST || 17.49;
    document.title = a.title + ' · 2030B';

    const recs = (window.B_REGISTRY || []).filter(d => a.recommend.includes(d.slug));

    root.innerHTML = `
      <section class="relative overflow-hidden" data-b-block>
        <div class="absolute inset-0 -z-10 b-grid"></div>
        <div class="absolute -top-32 -left-32 w-96 h-96 b-orb" style="--c1:${a.color};--c2:#7c8df5"></div>
        <div class="max-w-6xl mx-auto px-4 sm:px-6 py-16 lg:py-24 relative">
          <span class="b-chip"><i data-lucide="${a.icon}" class="w-3.5 h-3.5"></i> ${a.tag}</span>
          <h1 class="font-display text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] mt-4 max-w-4xl">
            ${a.hero}
          </h1>
          <p class="mt-5 max-w-2xl text-lg text-gold-300/75 leading-relaxed">${a.sub}</p>
          <div class="mt-7 flex flex-wrap gap-3">
            <a href="${a.cta.href}" class="b-btn-primary"><i data-lucide="arrow-right" class="w-4 h-4"></i> ${a.cta.label}</a>
            <a href="departments.html" class="b-btn-ghost"><i data-lucide="layout-grid" class="w-4 h-4"></i> All 25 departments</a>
            <a href="maher-vision.html" class="b-btn-ghost"><i data-lucide="rocket" class="w-4 h-4"></i> $1Q vision</a>
          </div>
          <div class="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl" data-b-stagger>
            <div class="b-stat"><span class="b-stat-num">25</span><span class="b-stat-label">Departments</span></div>
            <div class="b-stat"><span class="b-stat-num">$${cost.toFixed(2)}</span><span class="b-stat-label">Daily / human</span></div>
            <div class="b-stat"><span class="b-stat-num">5</span><span class="b-stat-label">Priority levels</span></div>
            <div class="b-stat"><span class="b-stat-num">1</span><span class="b-stat-label">Anchor: <em>Al-Ḥaqq</em></span></div>
          </div>
        </div>
      </section>

      <section class="max-w-6xl mx-auto px-4 sm:px-6 py-14" data-b-block>
        <h2 class="font-display text-3xl sm:text-4xl font-bold">Why this door</h2>
        <p class="text-gold-300/70 mt-2 max-w-2xl">Three reasons this landing exists, written for ${a.tag.toLowerCase()}.</p>
        <div class="mt-7 grid sm:grid-cols-3 gap-4" data-b-stagger>
          ${a.why.map(w => `
            <article class="b-glass rounded-2xl p-5">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center" style="background:${a.color}1c;border:1px solid ${a.color}55;color:${a.color}">
                <i data-lucide="${w.icon}" class="w-5 h-5"></i>
              </div>
              <h3 class="font-display text-xl font-bold mt-4">${w.title}</h3>
              <p class="text-sm text-gold-300/70 mt-2 leading-relaxed">${w.body}</p>
            </article>
          `).join('')}
        </div>
      </section>

      <section class="max-w-6xl mx-auto px-4 sm:px-6 py-14" data-b-block>
        <h2 class="font-display text-3xl sm:text-4xl font-bold">Recommended departments</h2>
        <p class="text-gold-300/70 mt-2 max-w-2xl">Five departments selected for ${a.tag.toLowerCase()}. Cost field and level visible on each card.</p>
        <div class="mt-7 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4" data-b-stagger>
          ${recs.map(d => (window.B_RENDER ? window.B_RENDER.depCardHTML(d, '') : '')).join('')}
        </div>
      </section>

      <section class="max-w-6xl mx-auto px-4 sm:px-6 py-16" data-b-block>
        <div class="b-glass rounded-3xl p-8 sm:p-12 grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
          <div>
            <span class="b-chip" style="background:${a.color}22;border-color:${a.color}55;color:${a.color}"><i data-lucide="rocket" class="w-3.5 h-3.5"></i> Next step</span>
            <h2 class="font-display text-3xl sm:text-4xl font-bold mt-3">${a.cta.title}</h2>
            <p class="text-gold-300/75 mt-3 leading-relaxed max-w-xl">${a.cta.body}</p>
            <a href="${a.cta.href}" class="b-btn-primary mt-6"><i data-lucide="arrow-right" class="w-4 h-4"></i> ${a.cta.label}</a>
          </div>
          <div class="text-right">
            <p class="font-display text-5xl sm:text-7xl font-bold b-grad-text">$${cost.toFixed(2)}</p>
            <p class="text-xs uppercase tracking-[0.3em] text-amber-200/55 mt-2">Per human · per day · whole stack</p>
          </div>
        </div>
      </section>
    `;

    if (window.lucide) try { lucide.createIcons(); } catch(e){}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
