import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface DiaryEntry {
  title: string;
  activity_type: string;
  description: string | null;
  date: string;
  expense_amount: number | null;
  income_amount: number | null;
  expense_currency: string;
}

const ACTIVITY_LABELS: Record<string, string> = {
  planting: "Planting",
  fertilizing: "Fertilizing",
  harvesting: "Harvesting",
  expense: "Expense",
  irrigation: "Irrigation",
  pest_control: "Pest Control",
  general: "General",
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export function exportCSV(entries: DiaryEntry[]) {
  const header = "Date,Activity,Title,Description,Expense (₹),Income (₹)";
  const rows = entries.map((e) =>
    [
      formatDate(e.date),
      ACTIVITY_LABELS[e.activity_type] || e.activity_type,
      `"${(e.title || "").replace(/"/g, '""')}"`,
      `"${(e.description || "").replace(/"/g, '""')}"`,
      e.expense_amount ?? "",
      e.income_amount ?? "",
    ].join(",")
  );

  const csv = [header, ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `farm-diary-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportPDF(entries: DiaryEntry[], totalExpenses: number, totalIncome: number = 0) {
  const doc = new jsPDF();
  const profit = totalIncome - totalExpenses;
  const pageWidth = doc.internal.pageSize.getWidth();

  // — Header band —
  doc.setFillColor(34, 120, 60);
  doc.rect(0, 0, pageWidth, 36, "F");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("KisanSeva Farm Diary", 14, 18);
  doc.setFontSize(9);
  doc.setTextColor(220, 255, 220);
  doc.text(`Generated on ${formatDate(new Date().toISOString())}  |  ${entries.length} ${entries.length === 1 ? "entry" : "entries"}`, 14, 28);

  // — Summary cards row —
  const margin = 14;
  const usableWidth = pageWidth - margin * 2;
  const cardY = 44;
  const cardH = 22;
  const cardGap = 3;
  const cardW = (usableWidth - cardGap * 3) / 4;
  const cards = [
    { label: "Total Entries", value: `${entries.length}`, bg: [240, 249, 255] },
    { label: "Total Expenses", value: `₹${totalExpenses.toLocaleString()}`, bg: [255, 240, 240] },
    { label: "Total Income", value: `₹${totalIncome.toLocaleString()}`, bg: [240, 255, 240] },
    { label: profit >= 0 ? "Net Profit" : "Net Loss", value: `${profit >= 0 ? "+" : "-"}₹${Math.abs(profit).toLocaleString()}`, bg: profit >= 0 ? [230, 255, 230] : [255, 230, 230] },
  ];

  cards.forEach((card, i) => {
    const x = 14 + i * (cardW + 4);
    doc.setFillColor(card.bg[0], card.bg[1], card.bg[2]);
    doc.roundedRect(x, cardY, cardW, cardH, 3, 3, "F");
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text(card.label, x + cardW / 2, cardY + 8, { align: "center" });
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    doc.text(card.value, x + cardW / 2, cardY + 17, { align: "center" });
  });

  // — Activity breakdown —
  const breakdownY = cardY + cardH + 10;
  const activityCounts: Record<string, { count: number; expense: number; income: number }> = {};
  entries.forEach((e) => {
    if (!activityCounts[e.activity_type]) activityCounts[e.activity_type] = { count: 0, expense: 0, income: 0 };
    activityCounts[e.activity_type].count++;
    activityCounts[e.activity_type].expense += e.expense_amount || 0;
    activityCounts[e.activity_type].income += e.income_amount || 0;
  });

  doc.setFontSize(11);
  doc.setTextColor(34, 120, 60);
  doc.text("Activity Summary", 14, breakdownY);

  const summaryData = Object.entries(activityCounts).map(([type, data]) => [
    ACTIVITY_LABELS[type] || type,
    `${data.count}`,
    data.expense ? `₹${data.expense.toLocaleString()}` : "—",
    data.income ? `₹${data.income.toLocaleString()}` : "—",
  ]);

  autoTable(doc, {
    startY: breakdownY + 4,
    head: [["Activity", "Count", "Expenses", "Income"]],
    body: summaryData,
    styles: { fontSize: 8, cellPadding: 2.5 },
    headStyles: { fillColor: [34, 120, 60], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [248, 252, 248] },
    columnStyles: {
      1: { halign: "center", cellWidth: 18 },
      2: { halign: "right", cellWidth: 28 },
      3: { halign: "right", cellWidth: 28 },
    },
    theme: "grid",
    tableWidth: pageWidth - 28,
    margin: { left: 14 },
  });

  // — Detailed entries table —
  const detailY = (doc as any).lastAutoTable?.finalY + 10 || breakdownY + 50;
  doc.setFontSize(11);
  doc.setTextColor(34, 120, 60);
  doc.text("Detailed Entries", 14, detailY);

  autoTable(doc, {
    startY: detailY + 4,
    head: [["#", "Date", "Activity", "Title", "Description", "Expense (₹)", "Income (₹)"]],
    body: entries.map((e, i) => [
      `${i + 1}`,
      formatDate(e.date),
      ACTIVITY_LABELS[e.activity_type] || e.activity_type,
      e.title,
      e.description || "—",
      e.expense_amount ? `₹${e.expense_amount.toLocaleString()}` : "—",
      e.income_amount ? `₹${e.income_amount.toLocaleString()}` : "—",
    ]),
    styles: { fontSize: 8, cellPadding: 2.5 },
    headStyles: { fillColor: [34, 120, 60], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [248, 252, 248] },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 24 },
      2: { cellWidth: 22 },
      4: { cellWidth: 42 },
      5: { cellWidth: 22, halign: "right" },
      6: { cellWidth: 22, halign: "right" },
    },
    theme: "grid",
    tableWidth: pageWidth - 28,
    margin: { left: 14 },
  });

  // — Footer on every page —
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFillColor(245, 245, 245);
    doc.rect(0, pageHeight - 12, pageWidth, 12, "F");
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text("KisanSeva — Farm Diary", 14, pageHeight - 4);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 14, pageHeight - 4, { align: "right" });
  }

  doc.save(`farm-diary-${new Date().toISOString().split("T")[0]}.pdf`);
}
