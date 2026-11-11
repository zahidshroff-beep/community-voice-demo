import { createFileRoute, Link } from "@tanstack/react-router";
import { voiceData } from "@/data/voice-data";
import { ChoiceBar } from "@/components/choices";
import { CoverageChart, TrendChart } from "@/components/charts";
import { PageIntro } from "@/components/page-intro";
import { Badge, Card } from "@/components/ui";
import {
  applyChoices,
  costSignal,
  districtCoverage,
  districtMax,
  emergingSignals,
  heatmap,
  learningItems,
  safeguardingItems,
  summary,
  themeTrend,
  trendKeys,
} from "@/lib/metrics";
import { useVoice } from "@/lib/store";

export const Route = createFileRoute("/")({
  component: PulsePage,
  head: () => ({ meta: [{ title: "Pulse · Community Voice" }] }),
});

function PulsePage() {
  const choices = useVoice((state) => state.choices);
  const items = applyChoices(learningItems(), choices);
  const stats = summary(items);
  const coverage = districtCoverage(items);
  const signal = costSignal(items);
  const signals = emergingSignals(items);
  const heat = heatmap(items);
  const max = districtMax(heat.cells);
  const referred = safeguardingItems().length;

  return (
    <div>
      <PageIntro
        kicker={`${voiceData.country} · ${voiceData.windowLabel}`}
        title="Pulse"
        lede="A learning view of what communities have said over twelve weeks. People confirm the codes. This layer listens, it does not replace the systems already in use."
      />
      <ChoiceBar voices={items.length} />
      {items.length === 0 ? (
        <Empty />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi label="Voices heard" value={String(stats.voices)} note={`${stats.schools} of 40 schools in this view`} />
            <Kpi label="From girls and young women" value={`${stats.girlsPct}%`} note="Share of voices in view" />
            <Kpi label="Gathered by CAMA researchers" value={`${stats.camaPct}%`} note="Community researchers, not only staff" />
            <Kpi label="Referred out of this view" value={String(referred)} note="With the safeguarding lead" />
          </div>

          <Card className="mt-4 border-l-4 border-l-clay">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-clay">Early signal · District 2</p>
                <h2 className="mt-1 text-xl font-semibold">Cost-barrier mentions have risen</h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
                  In the voices currently in view, District 2 named cost barriers {signal.late} times in weeks 9–12, after {signal.early} times in the first eight weeks. That is about {signal.lift}× the earlier weekly pace. Exam contributions, uniforms and transport are the words families use. This is a prompt for a learning circle, not a conclusion.
                </p>
              </div>
              <Link to="/act" className="inline-flex h-11 items-center rounded-full bg-clay px-4 text-sm font-medium text-on-teal">
                Open the alert
              </Link>
            </div>
          </Card>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <h2 className="text-lg font-semibold">Theme trend over 12 weeks</h2>
              <p className="mb-4 text-sm text-muted">Counts of voices naming each theme. A theme choice narrows the lines.</p>
              <TrendChart data={themeTrend(items, choices.theme)} keys={trendKeys(choices.theme)} />
            </Card>
            <Card>
              <h2 className="text-lg font-semibold">Emerging this week</h2>
              <p className="mb-4 text-sm text-muted">Week 12 compared with the average of weeks 8–11.</p>
              <ol className="space-y-4">
                {signals.map((signalRow, index) => (
                  <li key={signalRow.theme}>
                    <p className="text-xs font-medium text-teal">Signal {index + 1}</p>
                    <p className="font-medium capitalize">{signalRow.theme}</p>
                    <p className="text-sm text-muted">
                      {signalRow.latest} voices this week · {signalRow.delta >= 0 ? "+" : ""}
                      {signalRow.delta} versus the recent weekly average
                    </p>
                  </li>
                ))}
              </ol>
            </Card>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Card>
              <h2 className="text-lg font-semibold">Coverage by district</h2>
              <ul className="mb-3 space-y-1 text-sm text-muted">
                {coverage.map((row) => (
                  <li key={row.district}>
                    {row.district}: {row.heard} of {row.schoolCount} schools · {row.voices} voices
                  </li>
                ))}
              </ul>
              <CoverageChart data={coverage.map((row) => ({ district: row.district, voices: row.voices }))} />
            </Card>
            <Card>
              <h2 className="text-lg font-semibold">District heatmap</h2>
              <p className="mb-3 text-sm text-muted">Deeper teal means more voices on that theme.</p>
              <div className="max-w-full overflow-x-auto">
                <table className="w-full min-w-[32rem] border-separate border-spacing-1 text-left text-xs">
                  <thead>
                    <tr>
                      <th className="p-1 font-medium text-muted" />
                      {heat.districts.map((district) => (
                        <th key={district} className="p-1 font-medium text-muted">
                          {district.replace("District ", "D")}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {heat.themes.map((theme, themeIndex) => (
                      <tr key={theme}>
                        <th className="max-w-40 p-1 font-medium text-ink">{theme}</th>
                        {heat.districts.map((district, districtIndex) => {
                          const count = heat.cells[districtIndex]?.[themeIndex] ?? 0;
                          const strength = count / max;
                          return (
                            <td key={district} className="p-0">
                              <div
                                className="rounded-md px-2 py-2 text-center tabular-nums"
                                style={{
                                  background: `rgba(14, 92, 86, ${0.08 + strength * 0.82})`,
                                  color: strength > 0.55 ? "#f4f7f6" : "#1a2422",
                                }}
                              >
                                {count}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
          <p className="mt-4 text-sm text-muted">
            <Badge tone="teal">Human in the loop</Badge>
            <span className="ml-2">Suggested codes wait on Validate before they travel into a brief.</span>
          </p>
        </>
      )}
    </div>
  );
}

function Kpi({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <Card>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-ink">{value}</p>
      <p className="mt-2 text-sm text-muted">{note}</p>
    </Card>
  );
}

function Empty() {
  return <Card><p className="text-sm text-muted">No voices match these choices. Show all voices to widen the view.</p></Card>;
}
