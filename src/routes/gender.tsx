import { createFileRoute } from "@tanstack/react-router";
import { ChoiceBar } from "@/components/choices";
import { SplitBar } from "@/components/charts";
import { PageIntro } from "@/components/page-intro";
import { Card } from "@/components/ui";
import { ageByGender, applyChoices, genderSplit, girlQuotes, learningItems } from "@/lib/metrics";
import { useVoice } from "@/lib/store";

export const Route = createFileRoute("/gender")({
  component: GenderPage,
  head: () => ({ meta: [{ title: "Gender lens · Community Voice" }] }),
});

function GenderPage() {
  const choices = useVoice((state) => state.choices);
  const items = applyChoices(learningItems(), choices);
  const split = genderSplit(items);
  const quotes = girlQuotes(items);

  return (
    <div>
      <PageIntro
        kicker="Accountability to girls and young women"
        title="Gender lens"
        lede="The same evidence, read by gender and age band. The panel below stays with what girls and young women are actually saying."
      />
      <ChoiceBar voices={items.length} />
      <div className="grid gap-3 md:grid-cols-3">
        {split.map((row) => (
          <Card key={row.gender}>
            <p className="text-sm text-muted">{row.gender}</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums">{row.share}%</p>
            <p className="mt-1 text-sm text-muted">{row.voices} voices</p>
            <dl className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between gap-3"><dt>Hopeful tone</dt><dd className="tabular-nums">{row.hopeful}%</dd></div>
              <div className="flex justify-between gap-3"><dt>Naming cost</dt><dd className="tabular-nums">{row.cost}%</dd></div>
              <div className="flex justify-between gap-3"><dt>Naming transition</dt><dd className="tabular-nums">{row.transition}%</dd></div>
            </dl>
          </Card>
        ))}
      </div>
      <Card className="mt-4">
        <h2 className="text-lg font-semibold">Voices by age band and gender</h2>
        <p className="mb-3 text-sm text-muted">Counts in the current listening choices.</p>
        <SplitBar
          data={ageByGender(items)}
          xKey="age"
          keys={["Girl or young woman", "Boy or young man", "Not stated"]}
        />
      </Card>
      <Card className="mt-4 border-l-4 border-l-teal">
        <h2 className="text-lg font-semibold">What girls and young women are telling us</h2>
        {quotes.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No voices from girls and young women in this view.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {quotes.map((quote) => (
              <li key={quote.id}>
                <p className="text-sm leading-relaxed">“{quote.translation}”</p>
                <p className="mt-1 text-xs text-muted">
                  {quote.id} · {quote.ageBand} · {quote.district} · {quote.themes[0]}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
