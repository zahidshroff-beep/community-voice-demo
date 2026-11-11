import type { Brief } from "@/data/types";

export async function downloadBrief(brief: Brief) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  const maxW = pageW - margin * 2;
  let y = 64;

  const footer = () => {
    const pages = doc.getNumberOfPages();
    for (let page = 1; page <= pages; page += 1) {
      doc.setPage(page);
      doc.setFillColor(14, 92, 86);
      doc.rect(0, 0, pageW, 8, "F");
      doc.setFont("times", "normal");
      doc.setFontSize(9);
      doc.setTextColor(94, 109, 106);
      doc.text("Prototype, synthetic data. No real learner or CAMA data.", margin, pageH - 28);
      doc.text("Altamont Advisory · prototype for discussion", margin, pageH - 16);
      doc.text(`${page} / ${pages}`, pageW - margin, pageH - 16, { align: "right" });
    }
  };

  const nextPage = () => {
    doc.addPage();
    y = 48;
  };

  const ensure = (height: number) => {
    if (y + height > pageH - 52) nextPage();
  };

  doc.setFont("times", "bold");
  doc.setFontSize(11);
  doc.setTextColor(14, 92, 86);
  doc.text("Community Voice & Learning Intelligence", margin, y);
  y += 22;
  doc.setFont("times", "bold");
  doc.setFontSize(20);
  doc.setTextColor(26, 36, 34);
  const titleLines = doc.splitTextToSize(brief.title, maxW) as string[];
  doc.text(titleLines, margin, y);
  y += titleLines.length * 24;
  doc.setFont("times", "italic");
  doc.setFontSize(11);
  doc.setTextColor(94, 109, 106);
  const sub = doc.splitTextToSize(brief.subtitle, maxW) as string[];
  doc.text(sub, margin, y);
  y += sub.length * 16 + 8;
  doc.setDrawColor(227, 221, 212);
  doc.line(margin, y, pageW - margin, y);
  y += 20;

  for (const section of brief.sections) {
    ensure(48);
    doc.setFont("times", "bold");
    doc.setFontSize(13);
    doc.setTextColor(14, 92, 86);
    doc.text(section.heading, margin, y);
    y += 16;
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    doc.setTextColor(26, 36, 34);
    const lines = doc.splitTextToSize(section.body, maxW) as string[];
    for (const line of lines) {
      ensure(16);
      doc.text(line, margin, y);
      y += 15;
    }
    y += 12;
  }

  footer();
  doc.save(brief.filename);
}
