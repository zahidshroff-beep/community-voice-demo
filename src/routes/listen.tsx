import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { VoiceItem } from "@/data/types";
import { ChoiceBar } from "@/components/choices";
import { PageIntro } from "@/components/page-intro";
import { Badge, Button, Card } from "@/components/ui";
import { applyChoices, learningItems, safeguardingItems } from "@/lib/metrics";
import { useVoice } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export const Route = createFileRoute("/listen")({
  component: ListenPage,
  head: () => ({ meta: [{ title: "Listen · Community Voice" }] }),
});

const PAGE = 8;

function ListenPage() {
  const choices = useVoice((state) => state.choices);
  const items = applyChoices(learningItems(), choices).slice().reverse();
  const [page, setPage] = useState(0);
  const choiceKey = `${choices.channel}|${choices.respondent}|${choices.district}|${choices.theme}|${choices.gender}|${choices.q}`;
  useEffect(() => {
    setPage(0);
  }, [choiceKey]);
  const start = page * PAGE;
  const visible = items.slice(start, start + PAGE);
  const pages = Math.max(1, Math.ceil(items.length / PAGE));

  return (
    <div>
      <PageIntro
        kicker="Community channels"
        title="Listen"
        lede="Each card is a synthetic voice. Language L is a constructed stand-in so the original can sit beside an English translation. It is not a community language. Notes referred to the safeguarding lead are not shown here."
      />
      <ChoiceBar voices={items.length} />
      <p className="mb-4 text-sm text-muted">
        {safeguardingItems().length} safeguarding notes are hidden from this view and held by the designated lead.
      </p>
      {visible.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">No voices match these choices.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {visible.map((item) => (
            <VoiceCard key={item.id} item={item} />
          ))}
        </div>
      )}
      <div className="mt-4 flex items-center justify-between gap-3">
        <Button variant="secondary" disabled={page === 0} onClick={() => setPage((value) => Math.max(0, value - 1))}>
          Previous
        </Button>
        <p className="text-sm text-muted">
          Page {Math.min(page + 1, pages)} of {pages}
        </p>
        <Button variant="secondary" disabled={start + PAGE >= items.length} onClick={() => setPage((value) => value + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}

function VoiceCard({ item }: { item: VoiceItem }) {
  return (
    <Card>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium tabular-nums">{item.id}</span>
        <span className="text-sm text-muted">{formatDate(item.date)} · Week {item.week}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge tone="teal">{item.channel}</Badge>
        <Badge>{item.respondent}</Badge>
        <Badge>{item.district}</Badge>
        <Badge>{item.gender}</Badge>
        <Badge>{item.ageBand}</Badge>
      </div>
      <p className="mt-3 text-sm text-muted">
        {item.school} · {item.schoolLead} · gathered by {item.gatheredBy}
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs font-medium text-teal">{item.language === "English" ? "English original" : "Language L original"}</p>
          <p className="mt-1 text-sm leading-relaxed">{item.original}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-teal">English translation</p>
          <p className="mt-1 text-sm leading-relaxed">
            {item.language === "English" ? "Recorded in English. The wording is unchanged." : item.translation}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {item.themes.map((theme) => (
          <Badge key={theme} tone="clay">{theme}</Badge>
        ))}
        <Badge>{item.sentiment}</Badge>
      </div>
      <p className="mt-3 text-xs text-muted">Consent {item.consentRef}. Direct identifiers are not held in this view.</p>
    </Card>
  );
}
