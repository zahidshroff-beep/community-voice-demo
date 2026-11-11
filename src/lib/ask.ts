import type { Theme, VoiceItem } from "@/data/types";
import { THEMES } from "@/data/types";

const HINT =
  "This prototype answers only from the synthetic Country A evidence. Ask about cost barriers in District 2, Learner Guide sessions, transition, or what girls and young women are saying.";

export interface AskAnswer {
  text: string;
  ids: string[];
}

export function askEvidence(question: string, items: VoiceItem[]): AskAnswer {
  const q = question.trim().toLowerCase();
  if (!q) return { text: HINT, ids: [] };

  let pool = items.filter((item) => !item.safeguarding);
  const theme = THEMES.find((name) => q.includes(name.toLowerCase()) || q.includes(short(name)));
  if (theme) pool = pool.filter((item) => item.themes.includes(theme));
  if (q.includes("district 2") || q.includes("district2")) pool = pool.filter((item) => item.district === "District 2");
  else if (q.includes("district 1")) pool = pool.filter((item) => item.district === "District 1");
  else if (q.includes("district 3")) pool = pool.filter((item) => item.district === "District 3");
  if (q.includes("girl") || q.includes("young women")) {
    pool = pool.filter((item) => item.gender === "Girl or young woman");
  }
  if (q.includes("government") || q.includes("ministry")) {
    pool = pool.filter(
      (item) =>
        item.themes.includes("government ownership of Learner Guides") || item.respondent === "government officer",
    );
  }
  if (q.includes("cost") || q.includes("fee") || q.includes("uniform") || q.includes("contribution")) {
    pool = pool.filter((item) => item.themes.includes("cost barriers"));
  }
  if (q.includes("guide")) pool = pool.filter((item) => item.themes.includes("Learner Guide sessions") || item.respondent === "Learner Guide");
  if (q.includes("safe") || q.includes("path") || q.includes("journey") || q.includes("walk")) {
    pool = pool.filter((item) => item.themes.includes("safety on the way to school"));
  }
  if (q.includes("alumni") || q.includes("cama")) {
    pool = pool.filter(
      (item) => item.themes.includes("alumni leadership") || item.respondent === "CAMA member",
    );
  }
  if (q.includes("transition") || q.includes("secondary")) {
    pool = pool.filter((item) => item.themes.includes("transition to secondary"));
  }

  const unique: VoiceItem[] = [];
  const seen = new Set<string>();
  for (const item of pool) {
    if (seen.has(item.translation)) continue;
    seen.add(item.translation);
    unique.push(item);
    if (unique.length === 3) break;
  }

  if (!unique.length) {
    return {
      text: "Nothing in the current synthetic set matches that question closely. " + HINT,
      ids: [],
    };
  }

  const ids = unique.map((item) => item.id);
  const quotes = unique.map((item) => `${item.id}: “${item.translation}”`).join(" ");
  const where = theme ? ` on ${theme}` : "";
  return {
    text: `From the synthetic learning set${where}, ${unique.length} voices illustrate the pattern. ${quotes} Codes are suggestions until a person confirms them on Validate.`,
    ids,
  };
}

function short(theme: Theme) {
  if (theme === "cost barriers") return "cost";
  if (theme === "Learner Guide sessions") return "learner guide";
  if (theme === "safety on the way to school") return "journey";
  if (theme === "government ownership of Learner Guides") return "ownership";
  if (theme === "livelihoods and enterprise") return "livelihood";
  if (theme === "alumni leadership") return "alumni";
  if (theme === "transition to secondary") return "secondary";
  if (theme === "attendance and retention") return "attendance";
  return "wellbeing";
}
