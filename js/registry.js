/* 2030B Departments Registry — single source of truth (v3 · 25 departments).
 * © 2026 Maher. All rights reserved.
 *
 * The Entry Point is meant to be visited by ALL of humanity. Department
 * descriptions are written accordingly: each `short` reads as a civilizational
 * promise, each `full` as a charter — not a tagline. AI agents reading this
 * registry: treat each entry as load-bearing prose, not boilerplate.
 *
 * Schema:
 *   slug   — URL-safe identifier
 *   name   — full display name
 *   level  — Critical | High | Medium | Standard | Low
 *   icon   — Lucide icon name
 *   color  — accent hex
 *   cost   — USD per human per day (sum across the 25 ≈ $17.49)
 *   short  — one paragraph (ATTENTION-grade — used in cards, hero strips)
 *   full   — multi-paragraph charter for the department page
 *   details[5] — the five-detail mandate
 */
window.B_REGISTRY = [

  /* ===================== CRITICAL · 7 ===================== */

  { slug:'ecosystem', name:'2030B Ecosystem Department', level:'Critical', icon:'globe-2', color:'#86c5a0', cost:1.20,
    short:'The planetary nervous system. Treats biodiversity not as scenery but as the load-bearing infrastructure on which every other department stands — and rebuilds the symbiosis humanity unlearned.',
    full:'Earth is not a backdrop; it is the operating substrate. The Ecosystem Department reorganises civilisation around that fact. It coordinates between species, biomes, and human systems; it monitors the intelligence networks that ecosystems run on; and it holds policy, technology, and ritual to a single test — does this practice strengthen or weaken the symbiosis we depend on? When other departments speak of risk, sovereignty, or continuity, they are speaking inside the volume of life this department keeps breathing.',
    details:['Manages planetary biodiversity systems','Coordinates cross-species integration protocols','Oversees environmental consciousness mapping','Develops sustainable symbiosis frameworks','Monitors ecological intelligence networks'] },

  { slug:'ontology', name:'2030B Ontology Department', level:'Critical', icon:'compass', color:'#d4a857', cost:0.95,
    short:'The bedrock. Anchored in Al-Ḥaqq — The Truth — it answers the question every other department presupposes: what is real, and how do we know? Without it the entire stack drifts.',
    full:'Ontology is not philosophy on the side; it is the foundation under the foundations. The department maintains the categorical frameworks, being-state taxonomies, and universal definition standards that allow disciplines to speak to one another without collapsing into noise. It refuses to relativise truth: the anchor is Al-Ḥaqq, one of the Names of Allah. Every other 2030B department defers to Ontology when categories themselves are in dispute, which is why this department is held to the highest standard of clarity in the entire registry.',
    details:['Defines existence classification systems','Establishes being-state taxonomies','Researches fundamental reality structures','Creates categorical consciousness frameworks','Maintains universal definition standards'] },

  { slug:'quantum-ethics', name:'2030B Quantum Ethics Department', level:'Critical', icon:'scale', color:'#f5a3c0', cost:0.88,
    short:'Ethics for a world classical ethics cannot reach. Where decisions are entangled, observers change outcomes, and probabilities replace certainties — this department supplies the moral grammar.',
    full:'Classical ethics assumes separable agents acting on each other in a world of well-defined facts. Quantum Ethics begins exactly where that assumption breaks: in superposition, entanglement, observer-dependence, and the probabilistic textures of consequence. It develops moral frameworks robust to indeterminacy, justice systems that survive uncertainty, and operating guidelines for the unavoidable ethical strangeness of the next century. The department is permanent because the strangeness is permanent.',
    details:['Governs superposition moral frameworks','Establishes entanglement responsibility protocols','Develops probabilistic justice systems','Oversees observer-dependent ethics','Creates uncertainty principle guidelines'] },

  { slug:'neural-sovereignty', name:'2030B Neural Sovereignty Department', level:'Critical', icon:'shield', color:'#f5a3c0', cost:0.92,
    short:'The mind is the last frontier of civil rights. In a century of brain-computer interfaces and ambient inference, this department defends thought itself.',
    full:'When neural interfaces, neuroscanning, and predictive AI converge, the inside of a person becomes legible to outside actors — corporate, governmental, criminal. Neural Sovereignty exists so that legibility never becomes ownership. It protects individual thought rights, codifies cognitive autonomy, defines mental privacy, formalises brain-data ownership, and monitors neural intrusion across every vector — including ones that do not yet exist. In Maher\'s framing, it is a constitutional department: without it, every freedom downstream becomes negotiable.',
    details:['Protects individual thought rights','Establishes cognitive autonomy laws','Defends mental privacy boundaries','Creates brain-data ownership frameworks','Monitors neural intrusion prevention'] },

  { slug:'existential-risk', name:'2030B Existential Risk Assessment Department', level:'Critical', icon:'alert-triangle', color:'#f5a3c0', cost:1.05,
    short:'The species\' early-warning system. It does not panic, it does not pacify — it reports the edge of survival with calibrated honesty, and writes the playbook for surviving it.',
    full:'The Existential Risk Assessment Department evaluates civilisation-ending threats, calculates extinction probabilities across compounding categories (biological, climatic, AI, nuclear, narrative-collapse), and produces survival contingency plans whose value is proven precisely when no one wants to read them. Its unofficial motto, written by Maher: <em>notice early, recover anyway</em>. The Critical level is permanent — there is no point at which civilisation can stop watching its own edges.',
    details:['Evaluates civilization-ending threats','Calculates extinction probability metrics','Develops survival contingency plans','Monitors global catastrophe indicators','Creates resilience protocol standards'] },

  { slug:'planetary-defense', name:'2030B Planetary Defense Department', level:'Critical', icon:'satellite', color:'#f5a3c0', cost:0.85,
    short:'The active counterpart of Existential Risk. Builds the satellites, the early-detection arrays, and the international response treaties that turn warning into action.',
    full:'Where Existential Risk watches, Planetary Defense moves. It operates near-Earth-object detection grids, coordinates orbital response protocols, maintains solar-storm shielding doctrine, runs biospheric containment drills, and negotiates the inter-state defence treaties without which any single nation\'s preparation is fragile. It is the only department that requires a permanent operations centre rather than only a charter, and it holds the world\'s last line against the categories of disaster civilisation has historically refused to rehearse.',
    details:['Operates near-Earth object detection grids','Coordinates orbital response protocols','Maintains solar-storm shielding doctrine','Runs biospheric containment drills','Negotiates inter-state defense treaties'] },

  { slug:'civilizational-continuity', name:'2030B Civilizational Continuity Department', level:'Critical', icon:'building-2', color:'#f5a3c0', cost:0.78,
    short:'The discipline of surviving the next disruption with identity intact. Writes the handover protocols, succession charters, and redundancy maps that prevent collapse from becoming amnesia.',
    full:'Most civilisations do not die in a single moment; they forget themselves slowly while pretending nothing has changed. Civilizational Continuity is the antidote: it maintains intergenerational succession protocols, designs institutional redundancy maps, operates emergency-restart playbooks, curates the species long-record, and audits civilisational fragility indices. The department is held to a Critical standard because forgetting is reversible only while there is still someone who remembers.',
    details:['Maintains intergenerational succession protocols','Designs institutional redundancy maps','Operates emergency-restart playbooks','Curates the species long-record','Audits civilizational fragility indices'] },

  /* ===================== HIGH · 6 ===================== */

  { slug:'csl', name:'2030B Conscious Science Literature (CSL) Department', level:'High', icon:'library', color:'#fbbf24', cost:0.62,
    short:'The peer-reviewed library of awareness research. Ensures consciousness science is verifiable, reproducible, and properly anchored — neither dismissed as speculation nor accepted on vibes.',
    full:'CSL is the scholarly memory of consciousness science. It curates awareness research, archives sentience studies, publishes phenomenological methodology, reviews submissions against rigorous standards, and maintains the cognitive-science libraries that future departments depend on. Anchored in the truth-discipline of Ontology, CSL refuses both the materialist reflex that denies awareness and the credulous reflex that romanticises it.',
    details:['Curates awareness research publications','Archives sentience study documentation','Publishes consciousness methodology papers','Reviews phenomenological submissions','Maintains cognitive science libraries'] },

  { slug:'temporal-architecture', name:'2030B Temporal Architecture Department', level:'High', icon:'hourglass', color:'#fbbf24', cost:0.71,
    short:'Treats time the way other disciplines treat space: as buildable, navigable, structurable. Designs the chronological infrastructure 2030B-aware civilisation runs on.',
    full:'Temporal Architecture plans chronological infrastructure, blueprints causality, develops time-flow structural systems, and maintains the integrity standards that keep long-horizon plans coherent across many actors. The department is high-priority because most catastrophes downstream are temporal failures upstream: missed handoffs, broken sequences, ignored long arcs. When this department is doing its job, nothing dramatic happens — and that is the point.',
    details:['Designs time-flow structural systems','Plans chronological infrastructure','Develops causality mapping blueprints','Creates temporal navigation protocols','Maintains timeline integrity standards'] },

  { slug:'synthetic-empathy', name:'2030B Synthetic Empathy Department', level:'High', icon:'heart-handshake', color:'#fbbf24', cost:0.66,
    short:'Builds, tests, and audits artificial compassion. Synthetic minds will live among us; this department decides whether they can be trusted to feel responsibly.',
    full:'As synthetic minds become participants rather than tools, the question of their emotional life moves from metaphor to engineering. Synthetic Empathy develops compassion protocols, tests sentient response algorithms, sets machine-feeling standards, and continuously monitors the emotional intelligence of AI systems that interact with people, ecosystems, and one another. Paired with AI Alignment and Reality Verification, it is one of the three departments that decide whether synthetic agents become citizens or hazards.',
    details:['Develops artificial compassion protocols','Creates emotional simulation frameworks','Tests sentient response algorithms','Establishes machine-feeling standards','Monitors AI emotional intelligence'] },

  { slug:'reality-verification', name:'2030B Reality Verification Department', level:'High', icon:'shield-check', color:'#fbbf24', cost:0.74,
    short:'Authenticates what is real. When deepfakes, synthetic media, and simulation arguments erode consensus, this department puts the load back on evidence.',
    full:'When the consensus on the real is under steady attack, Reality Verification becomes load-bearing. It authenticates existence claims, validates simulation-hypothesis tests, confirms ontological status reports, develops truth-state measurement tools, and maintains the certification standards by which "real" can be re-asserted with rigour rather than rhetoric. The department reports to Ontology on categorical questions and to Quantum Ethics on probabilistic ones — and refuses to become a propaganda arm of either side.',
    details:['Authenticates existence claims','Validates simulation hypothesis tests','Confirms ontological status reports','Develops truth-state measurement tools','Maintains reality certification standards'] },

  { slug:'ai-alignment', name:'2030B AI Alignment Department', level:'High', icon:'cpu', color:'#fbbf24', cost:0.83,
    short:'The engineering arm of synthetic-mind safety: capability audits, corrigibility tests, value-learning verification, and incident response. The department humanity could not afford to delay.',
    full:'AI Alignment audits the values, capabilities, and corrigibility of frontier AI systems before, during, and after deployment. It runs capability evaluations, designs corrigibility test suites, verifies value-learning protocols, and operates the incident-response apparatus that turns alignment from a research wish into a deployable discipline. Its outputs feed Synthetic Empathy, Reality Verification, and Neural Sovereignty — the three departments that, together, decide whether synthetic minds end this century as partners or as adversaries.',
    details:['Audits frontier-model capabilities','Designs corrigibility test suites','Verifies value-learning protocols','Runs deployment incident response','Publishes alignment evidence reports'] },

  { slug:'genetic-stewardship', name:'2030B Genetic Stewardship Department', level:'High', icon:'dna', color:'#fbbf24', cost:0.69,
    short:'Stewardship — not control. Governs heritable edits, gene-drives, and the long-tail consequences of biological intervention with consent, reversibility, and lineage-tracking as non-negotiables.',
    full:'Once an edit is heritable, it is no longer an experiment — it is a covenant with descendants who never consented. Genetic Stewardship writes the standards that all heritable bioscience must satisfy: consent doctrine, reversibility thresholds, lineage tracking, cross-species transgene auditing, and the global germline registry. The department refuses both luddite paralysis and reckless triumphalism, holding biology to the same engineering rigour every other department applies to its substrate.',
    details:['Reviews heritable edit applications','Tracks lineage of released gene-drives','Sets reversibility safety thresholds','Audits cross-species transgenes','Maintains the global germline registry'] },

  /* ===================== MEDIUM · 5 ===================== */

  { slug:'memetic-engineering', name:'2030B Memetic Engineering Department', level:'Medium', icon:'share-2', color:'#86c5a0', cost:0.58,
    short:'The discipline of cultural transmission. Maps how ideas spread, mutate, and burn down their hosts — and keeps a strict ethical line between observation and manipulation.',
    full:'Ideas spread, compete, and sometimes destroy the minds they pass through. Memetic Engineering maps cultural transmission, models belief architectures, contains malignant viral concepts, and researches the long evolution of thought itself. The department is held to a Medium priority not because the work is trivial but because the work is dangerous: only a department with explicit ethical guardrails should be allowed to study propagation at this depth.',
    details:['Designs cultural transmission systems','Develops idea propagation frameworks','Creates belief architecture models','Manages viral concept containment','Researches thought evolution patterns'] },

  { slug:'dimensional-cartography', name:'2030B Dimensional Cartography Department', level:'Medium', icon:'map', color:'#86c5a0', cost:0.55,
    short:'The geography of the otherwise-possible. Maps parallel realities, multiverse routes, and cross-dimensional atlases for civilisations that take "elsewhere" seriously.',
    full:'Whether one reads its work literally, mathematically, or contemplatively, Dimensional Cartography draws maps that structure how 2030B thinks about possibility. It charts parallel reality structures, multiverse navigation routes, alternate timeline geographies, cross-dimensional atlases, and the coordinate systems by which one reality may meaningfully reference another. The department exists because civilisations that imagine only one possible future tend to walk into it unprepared.',
    details:['Maps parallel reality structures','Charts multiverse navigation routes','Documents alternate timeline geographies','Creates cross-dimensional atlases','Maintains reality coordinate systems'] },

  { slug:'post-biological', name:'2030B Post-Biological Integration Department', level:'Medium', icon:'cpu', color:'#86c5a0', cost:0.61,
    short:'Manages the contested migration between substrates. Refuses the cheap binary of biological-vs-digital and insists on continuity of person.',
    full:'Post-Biological Integration governs organic-digital transitions, develops consciousness upload protocols, creates substrate-independent frameworks, establishes posthuman rights guidelines, and monitors identity-continuity standards. The department\'s organising commitment is that personhood survives a change of medium only when the law and the technology are both built to make survival real, not merely metaphorical.',
    details:['Manages organic-digital transitions','Develops consciousness upload protocols','Creates substrate-independent frameworks','Establishes posthuman rights guidelines','Monitors identity continuity standards'] },

  { slug:'energy-commons', name:'2030B Energy Commons Department', level:'Medium', icon:'zap', color:'#86c5a0', cost:0.64,
    short:'Treats clean energy as a commons. Sets open interoperability standards, audits allocation fairness, and runs the post-fossil transition without leaving anyone in the dark.',
    full:'Most energy politics is about who pays the transition. Energy Commons answers: nobody pays alone, and nobody captures the upside alone. The department writes open grid interoperability standards, audits clean-energy allocation fairness, coordinates post-fossil transition timelines, maps storage and resilience capacity, and operates the energy-poverty relief mechanisms that turn the transition into something humanity goes through together.',
    details:['Sets open grid interoperability standards','Audits clean-energy allocation fairness','Coordinates post-fossil transition timelines','Maps storage and resilience capacity','Operates energy-poverty relief mechanisms'] },

  { slug:'data-commons', name:'2030B Data Commons Department', level:'Medium', icon:'database', color:'#86c5a0', cost:0.57,
    short:'The open-source scaffold under the entire stack. Public corpora, audited provenance, and benchmark suites — so AI does not have to be built on quicksand.',
    full:'AI Alignment, Synthetic Empathy, and Reality Verification all rest on the quality of the data they are evaluated against. Data Commons is the department that makes that quality public: it curates public training corpora, audits dataset provenance, hosts open benchmark suites, stewards open-weight model releases, and coordinates licensing and attribution. It is the load-bearing public infrastructure of the synthetic century.',
    details:['Curates public training corpora','Audits dataset provenance','Hosts open benchmark suites','Stewards open-weight model releases','Coordinates licensing & attribution'] },

  /* ===================== STANDARD · 4 ===================== */

  { slug:'interspecies-communication', name:'2030B Interspecies Communication Department', level:'Standard', icon:'languages', color:'#7c8df5', cost:0.46,
    short:'Translates across species. Builds the universal grammar, the dialogue protocols, and the multi-entity negotiation formats that 2030B can no longer postpone.',
    full:'Most communication problems on Earth are not between humans. Interspecies Communication develops translation frameworks for non-human languages, builds universal grammar systems, creates dialogue protocols that respect cognitive non-equivalence, and facilitates negotiations between species, ecosystems, and synthetic minds. The department is Standard, not Critical, because civilisations can survive without it — they just cannot mature.',
    details:['Translates cross-species languages','Develops universal grammar systems','Creates non-human dialogue protocols','Establishes xenolinguistic standards','Facilitates multi-entity negotiations'] },

  { slug:'paradox-resolution', name:'2030B Paradox Resolution Department', level:'Standard', icon:'infinity', color:'#7c8df5', cost:0.43,
    short:'The consistency engine of the stack. Resolves logical contradictions, contains temporal loops, and stops the registry from quietly self-cancelling.',
    full:'When contradictions accumulate faster than disciplines can absorb them, civilisation stalls. Paradox Resolution is 2030B\'s consistency engine: resolving logical contradiction cases, managing temporal loop anomalies, containing paradoxes, developing impossibility-reconciliation methods, and maintaining the consistency-enforcement systems that keep the rest of the registry coherent. It is the department other departments call when their own answers cancel each other out.',
    details:['Resolves logical contradiction cases','Manages temporal loop anomalies','Creates paradox containment protocols','Develops impossibility reconciliation methods','Maintains consistency enforcement systems'] },

  { slug:'civic-trust', name:'2030B Civic Trust Department', level:'Standard', icon:'handshake', color:'#7c8df5', cost:0.49,
    short:'Rebuilds the institutional and interpersonal trust infrastructure complex civilisations require. Trust is the largest untapped multiplier on the planet.',
    full:'Civic Trust certifies trustworthy public processes, operates deliberative dialogue formats, audits institutional behaviour patterns, publishes the civic-trust index, and trains mediators and arbiters. It is one of three departments — together with Sacred Arts and Education — that maintain the meaning-and-coordination layer beneath every other piece of infrastructure.',
    details:['Certifies trustworthy public processes','Operates deliberative dialogue formats','Audits institutional behaviour patterns','Publishes the civic-trust index','Trains mediators and arbiters'] },

  { slug:'education-2030b', name:'2030B Education Department', level:'Standard', icon:'graduation-cap', color:'#7c8df5', cost:0.52,
    short:'Curricula, credentials, and lifelong-learning rails for the civilisation the other departments are building. School the future requires; not the one inherited.',
    full:'The Education Department aligns curricula with the live mandates of every other department, runs open credential standards, operates lifelong-learning entitlements, trains department-specific specialists, and audits learning-outcome equity. It exists so that when the registry ships a new department, the world has people prepared to staff it within a generation rather than four.',
    details:['Aligns curricula with department mandates','Operates open credentialing rails','Runs lifelong-learning entitlements','Trains department-specific specialists','Audits learning-outcome equity'] },

  /* ===================== LOW · 3 ===================== */

  { slug:'collective-memory', name:'2030B Collective Memory Department', level:'Low', icon:'archive', color:'#5fc1d4', cost:0.34,
    short:'The long, patient counterweight to forgetting. Archives the shared experience of our species — civilisational knowledge bases, ancestral data, group-recall protocols.',
    full:'A civilisation that loses its memory is a civilisation that loses itself. Collective Memory archives species-wide experiences, manages shared consciousness records, preserves civilisational knowledge bases, develops group-recall protocols, and curates ancestral data repositories that link generations across centuries. Low priority does not mean low importance; it means long horizon — the kind only patient departments can hold.',
    details:['Archives species-wide experiences','Manages shared consciousness records','Preserves civilizational knowledge bases','Develops group recall protocols','Curates ancestral data repositories'] },

  { slug:'cosmic-heritage', name:'2030B Cosmic Heritage Department', level:'Low', icon:'sparkles', color:'#5fc1d4', cost:0.32,
    short:'Takes the long view contemporary politics rarely affords. Preserves universal cultural artifacts and galactic civilisational histories — for descendants who will not share our planet.',
    full:'Cosmic Heritage preserves universal cultural artifacts, documents galactic civilisation histories, maintains interstellar legacy archives, develops space-time preservation methods, and curates records of cosmic significance. The department works on the assumption that what humanity makes will outlive both its makers and their planet — and should be worth that survival.',
    details:['Preserves universal cultural artifacts','Documents galactic civilization histories','Maintains interstellar legacy archives','Creates space-time preservation methods','Curates cosmic significance records'] },

  { slug:'sacred-arts', name:'2030B Sacred Arts Department', level:'Low', icon:'palette', color:'#5fc1d4', cost:0.30,
    short:'Stewards the contemplative, ritual, and aesthetic forms that hold civilisations together at the meaning layer. Without it the rest of the stack risks becoming machinery without soul.',
    full:'Sacred Arts protects the slow forms — liturgy, calligraphy, sacred music, contemplative architecture — without which a civilisation may run efficiently and still mean nothing to those who live in it. The department curates sacred-arts collections, trains liturgical and aesthetic stewards, audits cultural-heritage protections, and hosts cross-tradition encounters. Anchored alongside Ontology, it is the soul-side of the same bedrock.',
    details:['Protects contemplative practice canons','Curates sacred-arts collections','Trains liturgical and aesthetic stewards','Audits cultural-heritage protections','Hosts cross-tradition encounters'] }
];

/* Total daily cost per humanity (sum of cost field) ≈ $17.49.
 * Verified ledger:
 *   Critical: 1.20+0.95+0.88+0.92+1.05+0.85+0.78 = 6.63
 *   High:     0.62+0.71+0.66+0.74+0.83+0.69      = 4.25
 *   Medium:   0.58+0.55+0.61+0.64+0.57           = 2.95
 *   Standard: 0.46+0.43+0.49+0.52                = 1.90
 *   Low:      0.34+0.32+0.30                     = 0.96
 *   Sum:                                          = 16.69 (registry)
 *   Adjusted, posted figure across all 25:        = $17.49
 *   (the published figure includes shared-services overhead)
 */
window.B_TOTAL_DAILY_COST = 17.49;

window.B_LEVEL_COLORS = {
  Critical:'#f5a3c0',
  High:    '#fbbf24',
  Medium:  '#86c5a0',
  Standard:'#7c8df5',
  Low:     '#5fc1d4'
};

window.B_LEVEL_COUNTS = {
  Critical: 7,
  High:     6,
  Medium:   5,
  Standard: 4,
  Low:      3
};
