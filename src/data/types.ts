export const THEMES = [
  "attendance and retention",
  "transition to secondary",
  "cost barriers",
  "Learner Guide sessions",
  "wellbeing",
  "safety on the way to school",
  "livelihoods and enterprise",
  "government ownership of Learner Guides",
  "alumni leadership",
] as const;

export type Theme = (typeof THEMES)[number];

export const CHANNELS = ["WhatsApp", "SMS", "voice note", "survey", "interview"] as const;
export type Channel = (typeof CHANNELS)[number];

export const RESPONDENTS = [
  "learner",
  "CAMA member",
  "Learner Guide",
  "teacher",
  "parent",
  "government officer",
] as const;
export type Respondent = (typeof RESPONDENTS)[number];

export const AGE_BANDS = ["Under 15", "15–17", "18–24", "25–34", "35 and over"] as const;
export type AgeBand = (typeof AGE_BANDS)[number];

export const GENDERS = ["Girl or young woman", "Boy or young man", "Not stated"] as const;
export type Gender = (typeof GENDERS)[number];

export const DISTRICTS = ["District 1", "District 2", "District 3"] as const;
export type District = (typeof DISTRICTS)[number];

export const SENTIMENTS = ["hopeful", "concerned", "mixed", "steady"] as const;
export type Sentiment = (typeof SENTIMENTS)[number];

export const GATHERED_BY = [
  "CAMA researcher",
  "Learner Guide",
  "MEL officer",
  "school focal point",
] as const;
export type GatheredBy = (typeof GATHERED_BY)[number];

export interface VoiceCode {
  code: string;
  confidence: number;
  theme: Theme;
}

export interface VoiceItem {
  id: string;
  week: number;
  date: string;
  channel: Channel;
  respondent: Respondent;
  ageBand: AgeBand;
  gender: Gender;
  district: District;
  school: string;
  schoolLead: "CAMFED-led" | "government-led";
  language: "English" | "Language L";
  original: string;
  translation: string;
  themes: Theme[];
  codes: VoiceCode[];
  sentiment: Sentiment;
  safeguarding: boolean;
  consentRef: string;
  gatheredBy: GatheredBy;
}

export interface School {
  code: string;
  district: District;
  lead: "CAMFED-led" | "government-led";
}

export interface ConsentRow {
  id: string;
  date: string;
  channel: Channel;
  respondent: Respondent;
  scope: string;
  status: "Granted";
  retention: string;
}

export interface AuditEvent {
  at: string;
  actor: string;
  event: string;
}

export interface ActionRow {
  id: string;
  insight: string;
  decision: string;
  owner: string;
  due: string;
  status: "Agreed" | "In motion" | "Not yet started" | "Closed";
}

export interface BriefSection {
  heading: string;
  body: string;
}

export interface Brief {
  id: string;
  title: string;
  subtitle: string;
  filename: string;
  sections: BriefSection[];
}

export interface ReviewerBaseline {
  accepted: number;
  edited: number;
  rejected: number;
}

export interface VoiceData {
  country: string;
  windowLabel: string;
  schools: School[];
  items: VoiceItem[];
  consentLog: ConsentRow[];
  baseline: ReviewerBaseline;
  actions: ActionRow[];
  briefs: Brief[];
}
