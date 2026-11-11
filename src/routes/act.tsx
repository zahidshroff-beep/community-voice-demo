import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { voiceData } from "@/data/voice-data";
import type { ActionRow } from "@/data/types";
import { PageIntro } from "@/components/page-intro";
import { Badge, Button, Card, Select } from "@/components/ui";
import { downloadBrief } from "@/lib/pdf";
import { useVoice } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export const Route = createFileRoute("/act")({
  component: ActPage,
  head: () => ({ meta: [{ title: "Act · Community Voice" }] }),
});

const STATUSES: ActionRow["status"][] = ["Agreed", "In motion", "Not yet started", "Closed"];

function ActPage() {
  const actionStatus = useVoice((state) => state.actionStatus);
  const setActionStatus = useVoice((state) => state.setActionStatus);
  const [busy, setBusy] = useState<string | null>(null);
  const briefs = voiceData.briefs.filter((brief) => brief.id !== "ministry");

  return (
    <div>
      <PageIntro
        kicker="From voice to a decision"
        title="Act"
        lede="Briefs are drafted from the synthetic evidence so a learning meeting has something to read. A person still chooses the decision, the owner and the date."
      />
      <div className="grid gap-3 md:grid-cols-2">
        {briefs.map((brief) => (
          <Card key={brief.id} className={brief.id === "early-warning" ? "border-l-4 border-l-clay" : undefined}>
            <h2 id={brief.id} className="text-lg font-semibold">{brief.title}</h2>
            <p className="mt-1 text-sm text-muted">{brief.subtitle}</p>
            <p className="mt-3 text-sm leading-relaxed">{brief.sections[0]?.body}</p>
            <Button
              className="mt-4"
              variant={brief.id === "early-warning" ? "clay" : "primary"}
              disabled={busy === brief.id}
              onClick={() => {
                setBusy(brief.id);
                void downloadBrief(brief).finally(() => setBusy(null));
              }}
            >
              {busy === brief.id ? "Preparing PDF…" : "Download PDF"}
            </Button>
          </Card>
        ))}
      </div>

      <Card className="mt-4">
        <h2 className="text-lg font-semibold">Action tracker</h2>
        <p className="mt-1 mb-4 text-sm text-muted">Each insight keeps the decision, the owner, the due date and the status.</p>
        <div className="space-y-4">
          {voiceData.actions.map((action) => {
            const status = actionStatus[action.id] ?? action.status;
            return (
              <article key={action.id} className="rounded-xl border border-line p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="teal">{action.id}</Badge>
                  <Badge tone={status === "In motion" ? "clay" : "neutral"}>{status}</Badge>
                </div>
                <p className="mt-3 font-medium">{action.insight}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{action.decision}</p>
                <div className="mt-3 flex flex-wrap items-end gap-3">
                  <p className="text-sm">
                    <span className="text-muted">Owner · </span>
                    {action.owner}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted">Due · </span>
                    {formatDate(action.due)}
                  </p>
                  <label className="text-xs font-medium text-muted">
                    Status
                    <Select
                      className="mt-1 block"
                      value={status}
                      onChange={(event) => setActionStatus(action.id, event.target.value as ActionRow["status"])}
                    >
                      {STATUSES.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </Select>
                  </label>
                </div>
              </article>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
