import { writeFileSync } from "node:fs";

const THEMES = [
  "attendance and retention",
  "transition to secondary",
  "cost barriers",
  "Learner Guide sessions",
  "wellbeing",
  "safety on the way to school",
  "livelihoods and enterprise",
  "government ownership of Learner Guides",
  "alumni leadership",
];

const CODES = {
  "attendance and retention": ["attendance after household duties", "staying through the term", "return after a missed week"],
  "transition to secondary": ["secondary transition decision", "readiness for the next school", "encouragement to continue"],
  "cost barriers": ["fee pressure at transition", "uniform and exam contributions", "household income and school costs"],
  "Learner Guide sessions": ["Learner Guide session value", "peer learning circle", "session rhythm and trust"],
  "wellbeing": ["peer wellbeing check-in", "someone to talk with", "confidence in school life"],
  "safety on the way to school": ["path safety in daylight", "journey to school", "walking with others"],
  "livelihoods and enterprise": ["enterprise skill interest", "household enterprise and school", "practical skills beside study"],
  "government ownership of Learner Guides": ["ministry ownership of Learner Guides", "government school session practice", "district support for guides"],
  "alumni leadership": ["CAMA alumni mentoring", "alumni leadership in the community", "former learners guiding others"],
};

const QUOTES = {
  "attendance and retention": [
    ["When home duties pile up I miss days, then it is harder to come back.", "Oma-work ye pila, mi miss luma-days, return li hard."],
    ["Our group is helping one another stay through to the end of term.", "Group ye li help stay tema-end."],
    ["A missed week is easier to recover when someone notices and welcomes you back.", "Week-miss li soft when person notice na welcome return."],
    ["I am still coming. The circle asks after me if I am not there.", "Mi tame koma. Circle li ask when mi no there."],
    ["Attendance is steadier when sessions sit on a day families already expect.", "Kivo li steady when senu-day li known ka oma."],
    ["Teachers say more learners are present in the weeks after a listening circle.", "Teacher li say kivo up after listen-circle."],
  ],
  "transition to secondary": [
    ["I want to go on to secondary. My family is still talking it through.", "Mi pena sola. Oma ye tame talk."],
    ["The step into secondary feels possible when older learners describe it plainly.", "Step ka sola li possible when mira talk plain."],
    ["We are preparing early so the move to secondary is not a surprise.", "Mi prepare early, sola-move no surprise."],
    ["Secondary is the hope. We need the pathway explained in our own words.", "Sola li hope. Path need words ka mi."],
    ["Learner Guides are walking with girls who are choosing the next school.", "Senu li walk with lemi choosing sola."],
    ["A parent said the transition conversation at home has started, which is new.", "Parent li say sola-talk oma has start. Ye new."],
  ],
  "cost barriers": [
    ["This term the exam contribution and uniform are more than our household can meet.", "Tema ye, kapa ka exam na uniform li pasa oma."],
    ["I want to move into secondary, and the costs are why we are still deciding.", "Mi pena sola, na kapa li resa mi tame."],
    ["Families here are talking about contributions more than they did at the start of term.", "Oma ye li tema kapa, pasa tema-open."],
    ["A small home enterprise helps, and it does not yet cover the school contribution.", "Padi oma li help, tano no cover kapa luma."],
    ["Uniform, exam fees and transport are arriving together this month.", "Uniform, exam-kapa na transport li arrive same month."],
    ["We are not stopping school. We are asking which cost can wait.", "Mi no stop luma. Mi ask which kapa can wait."],
    ["District conversations keep returning to contributions at the secondary step.", "Talk ye return ka kapa at sola-step."],
    ["Parents asked for the contribution calendar earlier, so they can plan.", "Parent li ask kapa-calendar early, so plan."],
  ],
  "Learner Guide sessions": [
    ["The Learner Guide session is where I ask the question I will not ask in a full class.", "Senu-session li where mi ask, no ask in full class."],
    ["Sessions are regular now. That rhythm is what the girls trust.", "Session li regular. Rhythm ye lemi trust."],
    ["We practised how to speak in a group. I used it at home the same week.", "Mi practise speak in group. Mi use oma same week."],
    ["The guide knows our names in the group and follows up when someone is quiet.", "Senu know group na follow when person quiet."],
    ["A teacher said the sessions are supporting learning, not sitting apart from it.", "Teacher li say session support learn, no apart."],
    ["In our government school the session is new, and learners are asking for it again.", "Luma bano, session li new, learner ask again."],
  ],
  wellbeing: [
    ["There is now a person I can talk to when school feels heavy.", "Now person mi can talk when luma feel heavy."],
    ["The check-in at the start of the session helps me settle.", "Check-in at session-start help mi settle."],
    ["I feel more confident speaking. That was not true last term.", "Mi feel confident speak. No true last tema."],
    ["Wellbeing here means being known, not being singled out.", "Vela mean known, no singled."],
    ["Friends in the circle notice when someone is quiet and sit with them.", "Friend in circle notice quiet na sit with."],
    ["A Learner Guide said the wellbeing moment is the part groups protect.", "Senu li say vela-moment li part group protect."],
  ],
  "safety on the way to school": [
    ["We walk together in the morning. That is when the path feels manageable.", "Mi walk together morning. Tera feel manageable then."],
    ["Daylight matters on our route. Later lessons make the return harder.", "Daylight matter on tera. Later lesson, return hard."],
    ["Parents are organising walking groups on two of the longer routes.", "Parent organise walk-group on long tera."],
    ["I told the circle that the path after the market is the part I plan around.", "Mi tell circle: tera after market li part mi plan."],
    ["The school is listening to which routes learners prefer.", "Luma li listen which tera learner prefer."],
    ["Walking with others has made this term feel more possible.", "Walk with others make tema ye more possible."],
  ],
  "livelihoods and enterprise": [
    ["I am learning to keep a simple record for the things we sell at home.", "Mi learn simple record for padi oma."],
    ["Enterprise skills matter because they sit beside school, not instead of it.", "Padi-skill matter beside luma, no instead."],
    ["A CAMA member showed us how a small service can support a school contribution.", "Mira show small service can support kapa luma."],
    ["We want practical skills that a household can use this season.", "Mi want practical skill oma can use season ye."],
    ["The enterprise conversation is giving parents a reason to stay in the learning circle.", "Padi-talk give parent reason stay in circle."],
    ["Girls asked for examples of enterprises that fit around school hours.", "Lemi ask example padi that fit around luma-hours."],
  ],
  "government ownership of Learner Guides": [
    ["Our government school has started Learner Guide sessions with district support.", "Luma bano start senu-session with district support."],
    ["The district officer asked what should stay the same if the ministry leads the sessions.", "Officer bano ask what stay same if bano lead session."],
    ["Teachers in the government school want a simple session guide they can keep.", "Teacher luma bano want simple senu-guide they keep."],
    ["Practice is travelling from the CAMFED-led schools into the government-led ones.", "Practice travel from luma-CAMFED into luma bano."],
    ["A government officer said the sessions should be owned locally, with evidence they can show.", "Officer bano say session owned local, with evidence they show."],
    ["Learner Guides asked to be recognised in the school timetable, not as visitors.", "Senu ask recognised in timetable, no as visitor."],
  ],
  "alumni leadership": [
    ["A CAMA member came back and sat with us. It made secondary feel nearer.", "Mira return na sit with mi. Sola feel near."],
    ["Alumni are leading the listening circle, not only attending it.", "Mira lead listen-circle, no only attend."],
    ["I trust the session more because the person leading it walked this path.", "Mi trust session because leader walk tera ye."],
    ["Former learners are mentoring guides in two schools this month.", "Mira mentor senu in two luma month ye."],
    ["Alumni leadership is visible to parents, and that is changing the conversation at home.", "Mira-lead visible ka parent, talk oma changing."],
    ["The association is organising who follows up after a circle, so nothing is left hanging.", "Association organise follow after circle, nothing hang."],
  ],
};

const SAFE_TEXT = [
  [
    "A learner asked that a trusted adult follow up about the journey to school. The detail is held by the safeguarding lead.",
    "Lemi ask trusted adult follow about tera ka luma. Detail held by care-lead.",
  ],
  [
    "A voice requested a private follow-up. Identifiers were removed and the note was routed to the safeguarding lead.",
    "Voice ask private follow. Identifier removed, note routed ka care-lead.",
  ],
  [
    "Someone described feeling unsafe on the way to school and asked for a trusted person to walk with the concern. Analysts do not see this note.",
    "Person describe tera uneasy na ask trusted person. Analyst no see note ye.",
  ],
];

function mulberry32(seed) {
  let a = seed >>> 0;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rnd = mulberry32(20261111);
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
const chance = (p) => rnd() < p;

function weighted(pairs) {
  const sum = pairs.reduce((s, p) => s + p[1], 0);
  let r = rnd() * sum;
  for (const [value, w] of pairs) {
    r -= w;
    if (r <= 0) return value;
  }
  return pairs[pairs.length - 1][0];
}

const schools = [];
for (let i = 1; i <= 40; i++) {
  const district = i <= 14 ? "District 1" : i <= 27 ? "District 2" : "District 3";
  const lead = rnd() < 0.42 ? "government-led" : "CAMFED-led";
  schools.push({ code: `S-${String(i).padStart(2, "0")}`, district, lead });
}

function dateFor(week) {
  const start = Date.UTC(2026, 7, 24);
  const day = (week - 1) * 7 + Math.floor(rnd() * 5);
  return new Date(start + day * 86400000).toISOString().slice(0, 10);
}

function pickWeek() {
  const weights = Array.from({ length: 12 }, (_, i) => 0.72 + i * 0.055);
  return weighted(weights.map((w, i) => [i + 1, w]));
}

function pickThemes(district, week) {
  const weights = THEMES.map((theme) => {
    let w = 1;
    if (theme === "cost barriers") {
      w = district === "District 2" && week >= 9 ? 3.6 : district === "District 2" ? 1.35 : 1;
    }
    if (theme === "safety on the way to school" && week >= 10) w = 1.55;
    if (theme === "Learner Guide sessions") w = 1.25;
    if (theme === "government ownership of Learner Guides" && district === "District 3") w = 1.4;
    if (theme === "alumni leadership") w = 0.9;
    if (theme === "transition to secondary") w = 1.15;
    return [theme, w];
  });
  const first = weighted(weights);
  const themes = [first];
  if (chance(0.38)) {
    const second = weighted(weights.filter(([t]) => t !== first));
    themes.push(second);
  }
  return themes;
}

function sentimentFor(themes) {
  if (themes.includes("cost barriers") || themes.includes("safety on the way to school")) {
    return weighted([
      ["concerned", 0.46],
      ["mixed", 0.34],
      ["steady", 0.14],
      ["hopeful", 0.06],
    ]);
  }
  if (
    themes.includes("Learner Guide sessions") ||
    themes.includes("alumni leadership") ||
    themes.includes("livelihoods and enterprise")
  ) {
    return weighted([
      ["hopeful", 0.48],
      ["steady", 0.28],
      ["mixed", 0.18],
      ["concerned", 0.06],
    ]);
  }
  return weighted([
    ["mixed", 0.36],
    ["steady", 0.28],
    ["hopeful", 0.22],
    ["concerned", 0.14],
  ]);
}

function profile(respondent) {
  if (respondent === "learner") {
    return {
      gender: weighted([
        ["Girl or young woman", 0.86],
        ["Boy or young man", 0.1],
        ["Not stated", 0.04],
      ]),
      ageBand: weighted([
        ["Under 15", 0.34],
        ["15–17", 0.46],
        ["18–24", 0.2],
      ]),
    };
  }
  if (respondent === "CAMA member") {
    return {
      gender: weighted([
        ["Girl or young woman", 0.78],
        ["Boy or young man", 0.14],
        ["Not stated", 0.08],
      ]),
      ageBand: weighted([
        ["18–24", 0.62],
        ["25–34", 0.38],
      ]),
    };
  }
  if (respondent === "Learner Guide") {
    return {
      gender: weighted([
        ["Girl or young woman", 0.74],
        ["Boy or young man", 0.18],
        ["Not stated", 0.08],
      ]),
      ageBand: weighted([
        ["18–24", 0.48],
        ["25–34", 0.4],
        ["35 and over", 0.12],
      ]),
    };
  }
  if (respondent === "parent") {
    return {
      gender: weighted([
        ["Girl or young woman", 0.62],
        ["Boy or young man", 0.28],
        ["Not stated", 0.1],
      ]),
      ageBand: weighted([
        ["25–34", 0.46],
        ["35 and over", 0.54],
      ]),
    };
  }
  return {
    gender: weighted([
      ["Girl or young woman", 0.48],
      ["Boy or young man", 0.4],
      ["Not stated", 0.12],
    ]),
    ageBand: weighted([
      ["25–34", 0.44],
      ["35 and over", 0.56],
    ]),
  };
}

const items = [];
for (let n = 0; n < 600; n++) {
  const week = pickWeek();
  const school = pick(schools);
  const respondent = weighted([
    ["learner", 0.4],
    ["CAMA member", 0.12],
    ["Learner Guide", 0.15],
    ["teacher", 0.15],
    ["parent", 0.12],
    ["government officer", 0.06],
  ]);
  const { gender, ageBand } = profile(respondent);
  const themes = pickThemes(school.district, week);
  const language = chance(0.46) ? "Language L" : "English";
  const pair = pick(QUOTES[themes[0]]);
  const original = language === "English" ? pair[0] : pair[1];
  const translation = pair[0];
  const codes = themes.slice(0, 2).map((theme) => ({
    code: pick(CODES[theme]),
    theme,
    confidence: Math.round((0.66 + rnd() * 0.3) * 100) / 100,
  }));
  items.push({
    id: `CV-${String(1400 + n)}`,
    week,
    date: dateFor(week),
    channel: weighted([
      ["WhatsApp", 0.32],
      ["SMS", 0.18],
      ["voice note", 0.16],
      ["survey", 0.22],
      ["interview", 0.12],
    ]),
    respondent,
    ageBand,
    gender,
    district: school.district,
    school: school.code,
    schoolLead: school.lead,
    language,
    original,
    translation,
    themes,
    codes,
    sentiment: sentimentFor(themes),
    safeguarding: false,
    consentRef: `CON-26-${String(3000 + n)}`,
    gatheredBy: weighted([
      ["CAMA researcher", 0.46],
      ["Learner Guide", 0.22],
      ["MEL officer", 0.18],
      ["school focal point", 0.14],
    ]),
  });
}

const safetyPool = items.filter((item) => item.themes.includes("safety on the way to school"));
const flagged = new Set();
while (flagged.size < 18 && flagged.size < safetyPool.length) {
  flagged.add(pick(safetyPool).id);
}
for (const item of items) {
  if (!flagged.has(item.id)) continue;
  const pair = pick(SAFE_TEXT);
  item.safeguarding = true;
  item.themes = ["safety on the way to school"];
  item.codes = [{ code: "referred safeguarding note", theme: "safety on the way to school", confidence: 0.98 }];
  item.sentiment = "concerned";
  item.original = item.language === "English" ? pair[0] : pair[1];
  item.translation = pair[0];
}

items.sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));

const learning = items.filter((i) => !i.safeguarding);
const pct = (n, d) => (d ? Math.round((n / d) * 1000) / 10 : 0);
const girls = learning.filter((i) => i.gender === "Girl or young woman").length;
const cama = learning.filter((i) => i.gatheredBy === "CAMA researcher").length;
const d2 = learning.filter((i) => i.district === "District 2");
const d2CostEarly = d2.filter((i) => i.week <= 8 && i.themes.includes("cost barriers")).length;
const d2CostLate = d2.filter((i) => i.week >= 9 && i.themes.includes("cost barriers")).length;
const earlyRate = d2CostEarly / 8;
const lateRate = d2CostLate / 4;
const lift = earlyRate ? Math.round((lateRate / earlyRate) * 10) / 10 : 0;

function themeShare(list, theme) {
  return pct(list.filter((i) => i.themes.includes(theme)).length, list.length);
}

const gov = learning.filter((i) => i.schoolLead === "government-led");
const cam = learning.filter((i) => i.schoolLead === "CAMFED-led");

const byDistrict = ["District 1", "District 2", "District 3"].map((d) => {
  const rows = learning.filter((i) => i.district === d);
  const schoolN = schools.filter((s) => s.district === d).length;
  const heard = new Set(rows.map((i) => i.school)).size;
  return `${d}: ${rows.length} voices, ${heard} of ${schoolN} schools`;
});

const consentLog = [];
for (let i = 0; i < 28; i++) {
  const sample = items[Math.floor((i * 17) % items.length)];
  consentLog.push({
    id: `CON-26-${String(4100 + i)}`,
    date: sample.date,
    channel: sample.channel,
    respondent: sample.respondent,
    scope: "Learning and adaptation. Not for identification.",
    status: "Granted",
    retention: "24 months, then aggregate only",
  });
}

const briefs = [
  {
    id: "community-voice",
    title: "Community Voice Brief",
    subtitle: "Country A · 12-week listening window · synthetic prototype",
    filename: "community-voice-brief.pdf",
    sections: [
      {
        heading: "Purpose",
        body: "This brief gathers what learners, families, Learner Guides, teachers, CAMA members and government officers have told community researchers. It is for learning and adaptation. It is a prototype built on synthetic data.",
      },
      {
        heading: "What we heard",
        body: `${learning.length} voices are in the learning view, across 3 districts and 40 schools. ${pct(girls, learning.length)}% are from girls and young women. ${pct(cama, learning.length)}% were gathered by CAMA researchers. ${items.filter((i) => i.safeguarding).length} voices were referred to the safeguarding lead and are not in this brief.`,
      },
      {
        heading: "Coverage",
        body: byDistrict.join(". ") + ".",
      },
      {
        heading: "Signals communities are returning to",
        body: `Cost barriers are the sharpest movement, especially in District 2, where mentions in weeks 9–12 are about ${lift} times the earlier weekly pace (${d2CostLate} voices in four weeks, after ${d2CostEarly} in the first eight). Learner Guide sessions remain a steady, hopeful thread. Girls and young women speak about transition to secondary alongside household costs.`,
      },
      {
        heading: "Invitation",
        body: "Confirm the District 2 cost signal with the people who raised it, and carry a short adaptation note into the next learning circle. Human validation of codes sits before any programme decision.",
      },
    ],
  },
  {
    id: "programme-insight",
    title: "Programme Insight Brief",
    subtitle: "For programme learning · Country A · synthetic prototype",
    filename: "programme-insight-brief.pdf",
    sections: [
      {
        heading: "Learning question",
        body: "What are communities telling us about staying in school, the step into secondary, and the role of Learner Guide sessions?",
      },
      {
        heading: "Insight",
        body: `Learner Guide sessions are mentioned with a hopeful or steady tone more often than other themes. Attendance is described as something a circle can notice and welcome back, not only as a count. Transition to secondary is tied, in girls' and parents' words, to whether costs can be planned.`,
      },
      {
        heading: "Where practice is already helping",
        body: "Guides, CAMA members and teachers describe a regular session rhythm, questions learners will ask in a small group, and alumni who make the next step feel nearer.",
      },
      {
        heading: "Suggested learning use",
        body: "Use this brief in a programme learning meeting. Pair it with the Validate queue so AI-suggested codes have been confirmed by a CAMA researcher or MEL officer before the insight travels further.",
      },
    ],
  },
  {
    id: "adaptive-note",
    title: "Adaptive Learning Note",
    subtitle: "One adaptation, one owner · synthetic prototype",
    filename: "adaptive-learning-note.pdf",
    sections: [
      {
        heading: "What changed in the evidence",
        body: `In District 2, cost-barrier mentions rose in the last four weeks of the window (weeks 9–12: ${d2CostLate} voices; weeks 1–8: ${d2CostEarly}). Households name exam contributions, uniforms and transport arriving together.`,
      },
      {
        heading: "Adaptation to test",
        body: "Share a simple contribution calendar earlier with families in District 2, through Learner Guide sessions and parent circles, and listen again in three weeks for whether the calendar is useful.",
      },
      {
        heading: "Who confirms it",
        body: "CAMA researchers validate the coding. The district learning circle decides whether to try the calendar. The action tracker holds the owner and the due date.",
      },
      {
        heading: "What we will listen for next",
        body: "Whether families say they can plan, whether girls still name cost as the reason a secondary decision is waiting, and whether any voice needs the safeguarding lead rather than the learning set.",
      },
    ],
  },
  {
    id: "early-warning",
    title: "Early Warning Alert",
    subtitle: "District 2 · cost barriers · synthetic prototype",
    filename: "early-warning-alert.pdf",
    sections: [
      {
        heading: "Signal",
        body: `Cost-barrier mentions in District 2 are running at about ${lift} times the earlier weekly pace. Weeks 9–12 hold ${d2CostLate} mentions; weeks 1–8 hold ${d2CostEarly}. This is an early signal for learning, not a conclusion.`,
      },
      {
        heading: "Who is speaking",
        body: "Learners, parents and Learner Guides. Girls and young women are the largest share of the wider listening set. Quotes name exam contributions, uniforms and transport.",
      },
      {
        heading: "What this alert asks",
        body: "A person closes the loop: confirm the signal with the District 2 circle, record a decision and an owner on the action tracker, and keep safeguarding-flagged notes out of this alert.",
      },
      {
        heading: "Method",
        body: "Synthetic voices over 12 weeks. Codes were suggested for human confirmation. No real learner or CAMA data sits in this prototype.",
      },
    ],
  },
  {
    id: "ministry",
    title: "Evidence for ministry",
    subtitle: "Learner Guides in government-led and CAMFED-led schools · Country A · synthetic",
    filename: "evidence-for-ministry.pdf",
    sections: [
      {
        heading: "Why this note",
        body: "District partners asked what communities say when Learner Guide sessions sit in government-led schools as well as CAMFED-led schools. Figures below are synthetic, for a conversation about evidence the ministry can use.",
      },
      {
        heading: "What the listening shows",
        body: `Government-led schools: ${gov.length} voices. ${themeShare(gov, "Learner Guide sessions")}% mention Learner Guide sessions. ${themeShare(gov, "government ownership of Learner Guides")}% speak about government ownership. CAMFED-led schools: ${cam.length} voices. ${themeShare(cam, "Learner Guide sessions")}% mention sessions. ${themeShare(cam, "government ownership of Learner Guides")}% speak about government ownership.`,
      },
      {
        heading: "In their words",
        body: "Government officers ask what should stay the same if the ministry leads the sessions. Teachers in government-led schools ask for a simple guide they can keep. Learner Guides ask to be on the timetable, not visitors. Practice is described as travelling, with local ownership.",
      },
      {
        heading: "Offer to the ministry",
        body: "A one-page evidence note, refreshed from community voice, can sit beside administrative data the ministry already holds. This layer exports by CSV or API into the CAMFED platform, dashboards and CRM. It adds to those systems. It does not replace them.",
      },
    ],
  },
];

const actions = [
  {
    id: "A-1",
    insight: "Cost-barrier mentions have risen in District 2 over the last four weeks.",
    decision: "Convene the District 2 learning circle and test an earlier contribution calendar.",
    owner: "MEL focal, District 2",
    due: "2026-11-20",
    status: "In motion",
  },
  {
    id: "A-2",
    insight: "Learner Guide sessions are described as the place learners ask questions they hold back in class.",
    decision: "Share a one-page practice note with government-led schools.",
    owner: "Programme learning lead",
    due: "2026-11-28",
    status: "Agreed",
  },
  {
    id: "A-3",
    insight: "Journey-to-school voices ask for walking groups on longer routes.",
    decision: "Community walk with the parent circle in District 1. Safeguarding notes stay with the lead.",
    owner: "District 1 CAMA circle",
    due: "2026-12-05",
    status: "Not yet started",
  },
  {
    id: "A-4",
    insight: "Government officers are asking what should stay the same if the ministry leads Learner Guide sessions.",
    decision: "Prepare the one-page evidence note for the district partner.",
    owner: "Government partnership",
    due: "2026-11-18",
    status: "In motion",
  },
];

const data = {
  country: "Country A",
  windowLabel: "24 Aug – 13 Nov 2026",
  schools,
  items,
  consentLog,
  baseline: { accepted: 96, edited: 22, rejected: 11 },
  actions,
  briefs,
};

const banned = ["surveillance", "monitoring system", "weakness", "Zimbabwe", "Tanzania", "Ghana", "Malawi", "Zambia"];
const blob = JSON.stringify(data).toLowerCase();
for (const word of banned) {
  if (blob.includes(word.toLowerCase())) {
    throw new Error(`Banned token present: ${word}`);
  }
}
if (items.length !== 600) throw new Error(`Expected 600 items, got ${items.length}`);
if (items.filter((i) => i.safeguarding).length < 12) throw new Error("Too few safeguarding items");

const out = `import type { VoiceData } from "./types";\n\nexport const voiceData = ${JSON.stringify(data)} as VoiceData;\n`;
writeFileSync(new URL("../src/data/voice-data.ts", import.meta.url), out);
console.log(
  JSON.stringify(
    {
      items: items.length,
      safeguarding: items.filter((i) => i.safeguarding).length,
      learning: learning.length,
      girlsPct: pct(girls, learning.length),
      camaPct: pct(cama, learning.length),
      d2CostEarly,
      d2CostLate,
      lift,
      gov: gov.length,
      cam: cam.length,
    },
    null,
    2,
  ),
);
