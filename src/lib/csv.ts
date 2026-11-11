import type { VoiceItem } from "@/data/types";
import { csvCell } from "@/lib/utils";

export function downloadLearningCsv(items: VoiceItem[]) {
  const headers = [
    "id",
    "week",
    "date",
    "channel",
    "respondent",
    "age_band",
    "gender",
    "district",
    "school_code",
    "school_lead",
    "language",
    "original",
    "english",
    "themes",
    "sentiment",
    "gathered_by",
    "consent_ref",
  ];
  const lines = [headers.join(",")];
  for (const item of items) {
    if (item.safeguarding) continue;
    lines.push(
      [
        item.id,
        item.week,
        item.date,
        item.channel,
        item.respondent,
        item.ageBand,
        item.gender,
        item.district,
        item.school,
        item.schoolLead,
        item.language,
        item.original,
        item.translation,
        item.themes.join(" | "),
        item.sentiment,
        item.gatheredBy,
        item.consentRef,
      ]
        .map(csvCell)
        .join(","),
    );
  }
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "community-voice-learning-set.csv";
  link.click();
  URL.revokeObjectURL(url);
}
