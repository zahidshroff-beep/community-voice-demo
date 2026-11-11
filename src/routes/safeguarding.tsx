import { createFileRoute } from "@tanstack/react-router";
import { voiceData } from "@/data/voice-data";
import { PageIntro } from "@/components/page-intro";
import { Badge, Button, Card } from "@/components/ui";
import { safeguardingItems } from "@/lib/metrics";
import { useVoice } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export const Route = createFileRoute("/safeguarding")({
  component: SafeguardingPage,
  head: () => ({ meta: [{ title: "Safeguarding · Community Voice" }] }),
});

function SafeguardingPage() {
  const leadOpen = useVoice((state) => state.leadOpen);
  const setLeadOpen = useVoice((state) => state.setLeadOpen);
  const caseStatus = useVoice((state) => state.caseStatus);
  const auditExtra = useVoice((state) => state.auditExtra);
  const advanceCase = useVoice((state) => state.advanceCase);
  const cases = safeguardingItems();

  return (
    <div>
      <PageIntro
        kicker="Care before analysis"
        title="Safeguarding and consent"
        lede="Flagged voices go to a designated safeguarding lead. They are hidden from Listen, Pulse, Analyse and the other learning views. What remains for learning is a count, not the note."
      />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-muted">Referred notes</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums">{cases.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Visible to analysts</p>
          <p className="mt-1 text-3xl font-semibold">None</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Consent rows in the log</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums">{voiceData.consentLog.length}</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold">Anonymisation</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Illustration only — this is not a record. A direct name and a school name are removed before any learning view. What remains is a respondent type, an age band, a gender, a district and a school code.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl bg-paper p-4 text-sm">
            <p className="text-xs font-medium text-muted">Before the learning view</p>
            <p className="mt-2 line-through decoration-clay">[given name] · [school name]</p>
          </div>
          <div className="rounded-xl bg-teal-soft p-4 text-sm">
            <p className="text-xs font-medium text-teal-deep">What analysts see</p>
            <p className="mt-2">Learner · Girl or young woman · 15–17 · District 2 · S-18</p>
          </div>
        </div>
      </Card>

      <Card className="mt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Referral workflow</h2>
            <p className="mt-1 text-sm text-muted">
              {leadOpen
                ? "Safeguarding lead workspace. Notes are visible only in this workspace."
                : "Learning-team view. Note text stays hidden."}
            </p>
          </div>
          <Button variant={leadOpen ? "secondary" : "primary"} onClick={() => setLeadOpen(!leadOpen)}>
            {leadOpen ? "Return to learning-team view" : "Open safeguarding lead workspace"}
          </Button>
        </div>
        <div className="mt-4 space-y-4">
          {cases.map((item) => {
            const status = caseStatus[item.id] ?? "With safeguarding lead";
            const audit = [
              { at: item.date, actor: "Channel intake", event: "Voice received. Consent reference checked." },
              { at: item.date, actor: "Minimisation", event: "Direct identifiers removed before any learning view." },
              { at: item.date, actor: "Routing", event: "Flagged for the safeguarding lead and hidden from analysts." },
              ...(auditExtra[item.id] ?? []),
            ];
            return (
              <article key={item.id} className="rounded-xl border border-line p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{item.id}</span>
                  <Badge tone="clay">{status}</Badge>
                  <Badge>{item.district}</Badge>
                  <Badge>{item.school}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted">{formatDate(item.date)} · {item.channel} · consent {item.consentRef}</p>
                {leadOpen ? (
                  <p className="mt-3 text-sm leading-relaxed">{item.translation}</p>
                ) : (
                  <p className="mt-3 text-sm text-muted">Note hidden in the learning-team view.</p>
                )}
                <ol className="mt-3 space-y-1 text-xs text-muted">
                  {audit.map((event, index) => (
                    <li key={`${item.id}-${index}`}>
                      {event.at} · {event.actor} · {event.event}
                    </li>
                  ))}
                </ol>
                {leadOpen ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => advanceCase(item.id, "Acknowledged by lead", "Lead acknowledged the referral.")}
                    >
                      Acknowledge
                    </Button>
                    <Button
                      variant="quiet"
                      onClick={() =>
                        advanceCase(
                          item.id,
                          "Closed — pattern only",
                          "Closed. Only an anonymised pattern may return to learning.",
                        )
                      }
                    >
                      Close — pattern only
                    </Button>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </Card>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Consent</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">Every voice carries a consent reference. Scope is learning and adaptation, not identification. Consent can be withdrawn, and the voice leaves the learning set.</p>
        </Card>
        <Card>
          <h2 className="font-semibold">Minimisation</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">Names, precise locations and free-text identifiers are removed before analysts see a card. School codes stand in for school names.</p>
        </Card>
        <Card>
          <h2 className="font-semibold">Retention</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">Learning records in this prototype are shown with a 24-month life, then aggregate only. Safeguarding notes stay with the lead and are not copied into briefs.</p>
        </Card>
        <Card>
          <h2 className="font-semibold">Access roles</h2>
          <ul className="mt-2 space-y-1 text-sm text-muted">
            <li>CAMA researcher — listen and validate</li>
            <li>MEL officer — learning views, not case text</li>
            <li>Safeguarding lead — flagged notes only</li>
            <li>Government partner — aggregate evidence note</li>
          </ul>
        </Card>
      </div>

      <Card className="mt-4">
        <h2 className="text-lg font-semibold">Consent log</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="text-xs text-muted">
              <tr>
                <th className="py-2 pr-3 font-medium">Reference</th>
                <th className="py-2 pr-3 font-medium">Date</th>
                <th className="py-2 pr-3 font-medium">Channel</th>
                <th className="py-2 pr-3 font-medium">Respondent</th>
                <th className="py-2 pr-3 font-medium">Scope</th>
                <th className="py-2 font-medium">Retention</th>
              </tr>
            </thead>
            <tbody>
              {voiceData.consentLog.map((row) => (
                <tr key={row.id} className="border-t border-line">
                  <td className="py-2 pr-3">{row.id}</td>
                  <td className="py-2 pr-3">{formatDate(row.date)}</td>
                  <td className="py-2 pr-3">{row.channel}</td>
                  <td className="py-2 pr-3">{row.respondent}</td>
                  <td className="py-2 pr-3">{row.scope}</td>
                  <td className="py-2">{row.retention}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
