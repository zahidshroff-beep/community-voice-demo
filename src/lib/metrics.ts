import { voiceData } from "@/data/voice-data";
import type { District, Theme, VoiceItem } from "@/data/types";
import { DISTRICTS, THEMES } from "@/data/types";
import { pct } from "@/lib/utils";

export interface ListeningChoices {
  channel: string;
  respondent: string;
  district: string;
  theme: string;
  gender: string;
  q: string;
}

export const ALL_CHOICES: ListeningChoices = {
  channel: "all",
  respondent: "all",
  district: "all",
  theme: "all",
  gender: "all",
  q: "",
};

export const FOCUS_THEMES = [
  "cost barriers",
  "attendance and retention",
  "Learner Guide sessions",
  "safety on the way to school",
] as const satisfies readonly Theme[];

export const THEME_SHORT: Record<Theme, string> = {
  "attendance and retention": "Attendance",
  "transition to secondary": "Transition",
  "cost barriers": "Cost",
  "Learner Guide sessions": "Learner Guides",
  wellbeing: "Wellbeing",
  "safety on the way to school": "Journey",
  "livelihoods and enterprise": "Livelihoods",
  "government ownership of Learner Guides": "Gov. ownership",
  "alumni leadership": "Alumni",
};

export const SERIES = ["#0e5c56", "#b8613a", "#3d6b73", "#6e864f"] as const;

export function learningItems() {
  return voiceData.items.filter((item) => !item.safeguarding);
}

export function safeguardingItems() {
  return voiceData.items.filter((item) => item.safeguarding);
}

export function applyChoices(items: VoiceItem[], choices: ListeningChoices) {
  const q = choices.q.trim().toLowerCase();
  return items.filter((item) => {
    if (choices.channel !== "all" && item.channel !== choices.channel) return false;
    if (choices.respondent !== "all" && item.respondent !== choices.respondent) return false;
    if (choices.district !== "all" && item.district !== choices.district) return false;
    if (choices.theme !== "all" && !item.themes.includes(choices.theme as Theme)) return false;
    if (choices.gender !== "all" && item.gender !== choices.gender) return false;
    if (!q) return true;
    const blob = `${item.id} ${item.original} ${item.translation} ${item.themes.join(" ")} ${item.school} ${item.respondent}`.toLowerCase();
    return blob.includes(q);
  });
}

export function summary(items: VoiceItem[]) {
  const girls = items.filter((item) => item.gender === "Girl or young woman").length;
  const cama = items.filter((item) => item.gatheredBy === "CAMA researcher").length;
  return {
    voices: items.length,
    girlsPct: pct(girls, items.length),
    camaPct: pct(cama, items.length),
    schools: new Set(items.map((item) => item.school)).size,
  };
}

export function districtCoverage(items: VoiceItem[]) {
  return DISTRICTS.map((district) => {
    const rows = items.filter((item) => item.district === district);
    const schoolCount = voiceData.schools.filter((school) => school.district === district).length;
    const heard = new Set(rows.map((item) => item.school)).size;
    return {
      district,
      voices: rows.length,
      heard,
      schoolCount,
      coverage: pct(heard, schoolCount),
    };
  });
}

export function themeTrend(items: VoiceItem[], theme: string) {
  const themes: Theme[] = theme !== "all" ? [theme as Theme] : [...FOCUS_THEMES];
  return Array.from({ length: 12 }, (_, index) => {
    const week = index + 1;
    const row: Record<string, string | number> = { week: `W${week}` };
    for (const name of themes) {
      row[THEME_SHORT[name]] = items.filter((item) => item.week === week && item.themes.includes(name)).length;
    }
    return row;
  });
}

export function trendKeys(theme: string) {
  const themes: Theme[] = theme !== "all" ? [theme as Theme] : [...FOCUS_THEMES];
  return themes.map((name) => THEME_SHORT[name]);
}

export function heatmap(items: VoiceItem[]) {
  return {
    districts: [...DISTRICTS],
    themes: [...THEMES],
    cells: DISTRICTS.map((district) =>
      THEMES.map(
        (theme) => items.filter((item) => item.district === district && item.themes.includes(theme)).length,
      ),
    ),
  };
}

export function costSignal(items: VoiceItem[]) {
  const district2 = items.filter((item) => item.district === "District 2");
  const early = district2.filter((item) => item.week <= 8 && item.themes.includes("cost barriers")).length;
  const late = district2.filter((item) => item.week >= 9 && item.themes.includes("cost barriers")).length;
  const earlyPace = early / 8;
  const latePace = late / 4;
  const lift = earlyPace ? Math.round((latePace / earlyPace) * 10) / 10 : late > 0 ? 9 : 0;
  return { early, late, lift, inView: district2.length };
}

export function emergingSignals(items: VoiceItem[]) {
  return THEMES.map((theme) => {
    const latest = items.filter((item) => item.week === 12 && item.themes.includes(theme)).length;
    const prior =
      items.filter((item) => item.week >= 8 && item.week <= 11 && item.themes.includes(theme)).length / 4;
    return { theme, latest, prior: Math.round(prior * 10) / 10, delta: Math.round((latest - prior) * 10) / 10 };
  })
    .sort((a, b) => b.delta - a.delta || b.latest - a.latest)
    .slice(0, 3);
}

export function clusters(items: VoiceItem[]) {
  return THEMES.map((theme) => {
    const rows = items.filter((item) => item.themes.includes(theme));
    const codes = new Map<string, { total: number; count: number; quotes: VoiceItem[] }>();
    for (const item of rows) {
      for (const code of item.codes) {
        if (code.theme !== theme) continue;
        const known = codes.get(code.code) ?? { total: 0, count: 0, quotes: [] };
        known.total += code.confidence;
        known.count += 1;
        if (known.quotes.length < 2) known.quotes.push(item);
        codes.set(code.code, known);
      }
    }
    return {
      theme,
      count: rows.length,
      codes: [...codes.entries()]
        .map(([code, value]) => ({
          code,
          confidence: value.count ? Math.round((value.total / value.count) * 100) : 0,
          quotes: value.quotes,
        }))
        .sort((a, b) => b.confidence - a.confidence || b.quotes.length - a.quotes.length)
        .slice(0, 3),
    };
  })
    .filter((cluster) => cluster.count > 0)
    .sort((a, b) => b.count - a.count);
}

export function reviewQueue(items: VoiceItem[]) {
  return [...items]
    .filter((item) => Math.min(...item.codes.map((code) => code.confidence)) < 0.84)
    .sort((a, b) => b.week - a.week || a.id.localeCompare(b.id))
    .slice(0, 16);
}

export function genderSplit(items: VoiceItem[]) {
  const genders = ["Girl or young woman", "Boy or young man", "Not stated"] as const;
  return genders.map((gender) => {
    const rows = items.filter((item) => item.gender === gender);
    return {
      gender,
      voices: rows.length,
      share: pct(rows.length, items.length),
      hopeful: pct(rows.filter((item) => item.sentiment === "hopeful").length, rows.length),
      cost: pct(rows.filter((item) => item.themes.includes("cost barriers")).length, rows.length),
      transition: pct(rows.filter((item) => item.themes.includes("transition to secondary")).length, rows.length),
    };
  });
}

export function ageByGender(items: VoiceItem[]) {
  const ages = ["Under 15", "15–17", "18–24", "25–34", "35 and over"] as const;
  return ages.map((age) => {
    const rows = items.filter((item) => item.ageBand === age);
    return {
      age,
      "Girl or young woman": rows.filter((item) => item.gender === "Girl or young woman").length,
      "Boy or young man": rows.filter((item) => item.gender === "Boy or young man").length,
      "Not stated": rows.filter((item) => item.gender === "Not stated").length,
    };
  });
}

export function girlQuotes(items: VoiceItem[]) {
  const seen = new Set<string>();
  const quotes = [];
  for (const item of items) {
    if (item.gender !== "Girl or young woman") continue;
    if (seen.has(item.translation)) continue;
    seen.add(item.translation);
    quotes.push(item);
    if (quotes.length === 3) break;
  }
  return quotes;
}

export function leadComparison(items: VoiceItem[]) {
  return (["government-led", "CAMFED-led"] as const).map((lead) => {
    const rows = items.filter((item) => item.schoolLead === lead);
    const share = (theme: Theme) => pct(rows.filter((item) => item.themes.includes(theme)).length, rows.length);
    return {
      lead,
      voices: rows.length,
      schools: new Set(rows.map((item) => item.school)).size,
      sessions: share("Learner Guide sessions"),
      ownership: share("government ownership of Learner Guides"),
      hopeful: pct(rows.filter((item) => item.sentiment === "hopeful" || item.sentiment === "steady").length, rows.length),
    };
  });
}

export function leadChart(items: VoiceItem[]) {
  const rows = leadComparison(items);
  const metrics = [
    { metric: "Learner Guide sessions", key: "sessions" },
    { metric: "Government ownership", key: "ownership" },
    { metric: "Hopeful or steady", key: "hopeful" },
  ] as const;
  return metrics.map((metric) => {
    const row: Record<string, string | number> = { metric: metric.metric };
    for (const lead of rows) row[lead.lead] = lead[metric.key];
    return row;
  });
}

export function quotesFor(items: VoiceItem[], respondent: VoiceItem["respondent"], take: number) {
  const seen = new Set<string>();
  const quotes: VoiceItem[] = [];
  for (const item of items) {
    if (item.respondent !== respondent) continue;
    if (seen.has(item.translation)) continue;
    seen.add(item.translation);
    quotes.push(item);
    if (quotes.length === take) break;
  }
  return quotes;
}

export function districtMax(cells: number[][]) {
  return Math.max(1, ...cells.flat());
}

export type CoverageRow = ReturnType<typeof districtCoverage>[number];

export function isDistrict(value: string): value is District {
  return (DISTRICTS as readonly string[]).includes(value);
}
