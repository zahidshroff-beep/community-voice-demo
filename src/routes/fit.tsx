import type { ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/page-intro";
import { Button, Card } from "@/components/ui";
import { downloadLearningCsv } from "@/lib/csv";
import { learningItems } from "@/lib/metrics";

export const Route = createFileRoute("/fit")({
  component: FitPage,
  head: () => ({ meta: [{ title: "How it fits · Community Voice" }] }),
});

const CHANNELS = ["WhatsApp", "SMS", "Voice notes", "Surveys", "Interviews"];
const SYSTEMS = ["CAMFED platform", "Dashboards", "CRM"];

function FitPage() {
  return (
    <div>
      <PageIntro
        kicker="Alongside what already works"
        title="How it fits"
        lede="Community channels flow into this learning layer. Confirmed evidence can leave as a CSV or an API export into the CAMFED platform, dashboards and CRM. It adds to those systems. It does not replace them."
      />
      <Card>
        <div className="grid gap-4">
          <Row label="Community channels">
            {CHANNELS.map((channel) => (
              <Node key={channel}>{channel}</Node>
            ))}
          </Row>
          <Arrow />
          <Row label="This layer">
            <Node accent>Listen</Node>
            <Node accent>Suggest codes</Node>
            <Node accent>Human validation</Node>
            <Node accent>Briefs and actions</Node>
          </Row>
          <Arrow label="CSV or API export" />
          <Row label="Systems already in use">
            {SYSTEMS.map((system) => (
              <Node key={system}>{system}</Node>
            ))}
          </Row>
        </div>
      </Card>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Card>
          <h2 className="font-semibold">What it adds</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">A place for community voice, translation beside the original, and a person confirming every code before it becomes a brief.</p>
        </Card>
        <Card>
          <h2 className="font-semibold">What it leaves alone</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">Enrolment records, finance, case management and the dashboards teams already trust stay where they are.</p>
        </Card>
        <Card>
          <h2 className="font-semibold">What it will not do</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">It is not a watch on communities. Safeguarding notes never travel in the learning export.</p>
        </Card>
      </div>
      <Card className="mt-4">
        <h2 className="text-lg font-semibold">Learning export</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          The CSV holds the synthetic learning set only. Referred safeguarding notes are left out. In a live setting the same shape would be available as an API for the CAMFED platform.
        </p>
        <Button className="mt-4" variant="secondary" onClick={() => downloadLearningCsv(learningItems())}>
          Download learning CSV
        </Button>
      </Card>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium tracking-wide text-muted uppercase">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Node({ children, accent = false }: { children: ReactNode; accent?: boolean }) {
  return (
    <span className={accent ? "rounded-full bg-teal px-3 py-2 text-sm text-on-teal" : "rounded-full border border-line bg-paper px-3 py-2 text-sm"}>
      {children}
    </span>
  );
}

function Arrow({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-teal">
      <span aria-hidden className="text-lg leading-none">↓</span>
      {label ? <span>{label}</span> : null}
    </div>
  );
}
