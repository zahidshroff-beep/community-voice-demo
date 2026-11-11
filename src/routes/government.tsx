import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { voiceData } from "@/data/voice-data";
import { ChoiceBar } from "@/components/choices";
import { SplitBar } from "@/components/charts";
import { PageIntro } from "@/components/page-intro";
import { Button, Card } from "@/components/ui";
import { applyChoices, leadChart, leadComparison, learningItems, quotesFor } from "@/lib/metrics";
import { downloadBrief } from "@/lib/pdf";
import { useVoice } from "@/lib/store";

export const Route = createFileRoute("/government")({
  component: GovernmentPage,
  head: () => ({ meta: [{ title: "Government · Community Voice" }] }),
});

function GovernmentPage() {
  const choices = useVoice((state) => state.choices);
  const items = applyChoices(learningItems(), choices);
  const leads = leadComparison(items);
  const officers = quotesFor(items, "government officer", 2);
  const guides = quotesFor(items, "Learner Guide", 2);
  const brief = voiceData.briefs.find((item) => item.id === "ministry");
  const [busy, setBusy] = useState(false);

  return (
    <div>
      <PageIntro
        kicker="Evidence a ministry can use"
        title="Government scale-up"
        lede="Signals about Learner Guides in government-led schools, set beside CAMFED-led schools. The note is one page, written for a district partner, and it adds to the data the ministry already holds."
      />
      <ChoiceBar voices={items.length} />
      <div className="grid gap-3 md:grid-cols-2">
        {leads.map((lead) => (
          <Card key={lead.lead}>
            <p className="text-sm text-muted">{lead.lead} schools</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums">{lead.voices}</p>
            <p className="text-sm text-muted">{lead.schools} schools in this view</p>
            <dl className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between gap-3"><dt>Mention Learner Guide sessions</dt><dd className="tabular-nums">{lead.sessions}%</dd></div>
              <div className="flex justify-between gap-3"><dt>Speak about government ownership</dt><dd className="tabular-nums">{lead.ownership}%</dd></div>
              <div className="flex justify-between gap-3"><dt>Hopeful or steady tone</dt><dd className="tabular-nums">{lead.hopeful}%</dd></div>
            </dl>
          </Card>
        ))}
      </div>
      <Card className="mt-4">
        <h2 className="text-lg font-semibold">Share of voices, by school leadership</h2>
        <p className="mb-3 text-sm text-muted">Percentages within each group of schools.</p>
        <SplitBar data={leadChart(items)} xKey="metric" keys={["government-led", "CAMFED-led"]} />
      </Card>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <QuoteList title="Government officers" quotes={officers} />
        <QuoteList title="Learner Guides" quotes={guides} />
      </div>
      {brief ? (
        <Card className="mt-4">
          <h2 className="text-lg font-semibold">{brief.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{brief.sections[1]?.body}</p>
          <Button
            className="mt-4"
            disabled={busy}
            onClick={() => {
              setBusy(true);
              void downloadBrief(brief).finally(() => setBusy(false));
            }}
          >
            {busy ? "Preparing PDF…" : "Download evidence for ministry"}
          </Button>
        </Card>
      ) : null}
    </div>
  );
}

function QuoteList({ title, quotes }: { title: string; quotes: { id: string; translation: string; district: string; schoolLead: string }[] }) {
  return (
    <Card>
      <h2 className="text-lg font-semibold">{title}</h2>
      {quotes.length === 0 ? (
        <p className="mt-3 text-sm text-muted">No quotes in this view.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {quotes.map((quote) => (
            <li key={quote.id}>
              <p className="text-sm leading-relaxed">“{quote.translation}”</p>
              <p className="mt-1 text-xs text-muted">{quote.id} · {quote.district} · {quote.schoolLead}</p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
