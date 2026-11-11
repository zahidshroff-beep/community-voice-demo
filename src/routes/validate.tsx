import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { voiceData } from "@/data/voice-data";
import { ChoiceBar } from "@/components/choices";
import { PageIntro } from "@/components/page-intro";
import { Badge, Button, Card, TextArea, TextInput } from "@/components/ui";
import { applyChoices, learningItems, reviewQueue } from "@/lib/metrics";
import { useVoice } from "@/lib/store";
import { pct } from "@/lib/utils";

export const Route = createFileRoute("/validate")({
  component: ValidatePage,
  head: () => ({ meta: [{ title: "Validate · Community Voice" }] }),
});

function ValidatePage() {
  const choices = useVoice((state) => state.choices);
  const reviews = useVoice((state) => state.reviews);
  const saveReview = useVoice((state) => state.saveReview);
  const queue = reviewQueue(applyChoices(learningItems(), choices));
  const base = voiceData.baseline;
  const accepted = base.accepted + reviews.filter((review) => review.decision === "accept").length;
  const edited = base.edited + reviews.filter((review) => review.decision === "edit").length;
  const rejected = base.rejected + reviews.filter((review) => review.decision === "reject").length;
  const total = accepted + edited + rejected;

  return (
    <div>
      <PageIntro
        kicker="Human in the loop"
        title="Validate"
        lede="AI suggests a code. A CAMA researcher or MEL officer accepts it, edits the wording, or returns it, and can add the context only a person in the community would know."
      />
      <ChoiceBar voices={queue.length} />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-muted">Exact agreement</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums">{pct(accepted, total)}%</p>
          <p className="mt-1 text-xs text-muted">Accepted as suggested, including the prior review log</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Confirmed, with or without an edit</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums">{pct(accepted + edited, total)}%</p>
          <p className="mt-1 text-xs text-muted">{edited} edited · {rejected} returned</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">This session</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums">{reviews.length}</p>
          <p className="mt-1 text-xs text-muted">Decisions you have recorded in this browser</p>
        </Card>
      </div>
      <div className="space-y-4">
        {queue.length === 0 ? (
          <Card><p className="text-sm text-muted">No suggestions in the queue match these choices.</p></Card>
        ) : (
          queue.map((item) => {
            const existing = reviews.find((review) => review.itemId === item.id);
            return (
              <ReviewCard
                key={item.id}
                itemId={item.id}
                district={item.district}
                respondent={item.respondent}
                quote={item.translation}
                codes={item.codes.map((code) => `${code.code} (${Math.round(code.confidence * 100)}%)`).join(" · ")}
                existing={existing?.decision}
                onSave={saveReview}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

function ReviewCard({
  itemId,
  district,
  respondent,
  quote,
  codes,
  existing,
  onSave,
}: {
  itemId: string;
  district: string;
  respondent: string;
  quote: string;
  codes: string;
  existing?: "accept" | "edit" | "reject";
  onSave: (review: { itemId: string; decision: "accept" | "edit" | "reject"; editedCode: string; note: string }) => void;
}) {
  const [note, setNote] = useState("");
  const [editedCode, setEditedCode] = useState("");
  const [editing, setEditing] = useState(false);

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium">{itemId}</span>
        <Badge>{district}</Badge>
        <Badge>{respondent}</Badge>
        {existing ? <Badge tone="teal">Recorded: {existing}</Badge> : <Badge tone="clay">Needs a person</Badge>}
      </div>
      <p className="mt-3 text-sm leading-relaxed">“{quote}”</p>
      <p className="mt-3 text-sm text-muted">Suggested: {codes}</p>
      <TextArea
        className="mt-3"
        placeholder="Context note — what a person close to this voice would want a learning meeting to know"
        value={note}
        onChange={(event) => setNote(event.target.value)}
      />
      {editing ? (
        <TextInput
          className="mt-3"
          placeholder="Edited code, in the reviewer’s words"
          value={editedCode}
          onChange={(event) => setEditedCode(event.target.value)}
        />
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          onClick={() => onSave({ itemId, decision: "accept", editedCode: "", note })}
        >
          Accept
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            if (!editing) {
              setEditing(true);
              return;
            }
            onSave({ itemId, decision: "edit", editedCode: editedCode || codes, note });
          }}
        >
          {editing ? "Save edit" : "Edit code"}
        </Button>
        <Button variant="quiet" onClick={() => onSave({ itemId, decision: "reject", editedCode: "", note })}>
          Return code
        </Button>
      </div>
    </Card>
  );
}
