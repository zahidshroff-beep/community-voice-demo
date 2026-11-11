import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChoiceBar } from "@/components/choices";
import { PageIntro } from "@/components/page-intro";
import { Badge, Button, Card, TextArea } from "@/components/ui";
import { askEvidence } from "@/lib/ask";
import { applyChoices, clusters, learningItems } from "@/lib/metrics";
import { useVoice } from "@/lib/store";

export const Route = createFileRoute("/analyse")({
  component: AnalysePage,
  head: () => ({ meta: [{ title: "Analyse · Community Voice" }] }),
});

function AnalysePage() {
  const choices = useVoice((state) => state.choices);
  const items = applyChoices(learningItems(), choices);
  const groups = clusters(items);
  const [question, setQuestion] = useState("What are girls and young women saying about cost barriers in District 2?");
  const [answer, setAnswer] = useState<ReturnType<typeof askEvidence> | null>(null);

  return (
    <div>
      <PageIntro
        kicker="Suggested codes"
        title="Analyse"
        lede="Themes cluster similar voices. Each code is a suggestion with a confidence score and example quotes. A CAMA researcher or MEL officer confirms, edits or returns it on Validate."
      />
      <ChoiceBar voices={items.length} />
      <div className="space-y-4">
        {groups.map((group) => (
          <Card key={group.theme}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg font-semibold capitalize">{group.theme}</h2>
              <p className="text-sm text-muted">{group.count} voices</p>
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              {group.codes.map((code) => (
                <div key={code.code} className="rounded-xl bg-paper p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium">{code.code}</p>
                    <Badge tone="teal">{code.confidence}%</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted">AI-suggested · awaiting a person</p>
                  <ul className="mt-3 space-y-2">
                    {code.quotes.map((quote) => (
                      <li key={quote.id} className="text-sm leading-relaxed text-ink">
                        “{quote.translation}”
                        <span className="mt-1 block text-xs text-muted">{quote.id} · {quote.district}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-4" >
        <div id="ask">
          <h2 className="text-lg font-semibold">Ask the evidence</h2>
          <p className="mt-1 text-sm text-muted">
            Answers stay inside the synthetic learning set and cite voice IDs. No external model is connected.
          </p>
          <TextArea className="mt-3" value={question} onChange={(event) => setQuestion(event.target.value)} />
          <Button className="mt-3" onClick={() => setAnswer(askEvidence(question, items))}>
            Ask
          </Button>
          {answer ? (
            <div className="mt-4 rounded-xl bg-teal-soft p-4 text-sm leading-relaxed text-ink">
              <p>{answer.text}</p>
              {answer.ids.length > 0 ? <p className="mt-2 text-xs text-teal-deep">Cited: {answer.ids.join(", ")}</p> : null}
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
