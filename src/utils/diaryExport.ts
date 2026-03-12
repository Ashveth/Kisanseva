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

  doc.setFontSize(20);
  doc.setTextColor(34, 120, 60);
  doc.text("Farm Diary Report", 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(
    `Generated on ${formatDate(new Date().toISOString())}  •  ${entries.length} entries  •  Expenses: ₹${totalExpenses.toLocaleString()}  •  Income: ₹${totalIncome.toLocaleString()}  •  ${profit >= 0 ? "Profit" : "Loss"}: ₹${Math.abs(profit).toLocaleString()}`,
    14,
    30
  );

  autoTable(doc, {
    startY: 38,
    head: [["Date", "Activity", "Title", "Description", "Expense (₹)", "Income (₹)"]],
    body: entries.map((e) => [
      formatDate(e.date),
      ACTIVITY_LABELS[e.activity_type] || e.activity_type,
      e.title,
      e.description || "—",
      e.expense_amount ? `₹${e.expense_amount.toLocaleString()}` : "—",
      e.income_amount ? `₹${e.income_amount.toLocaleString()}` : "—",
    ]),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [34, 120, 60], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 250, 245] },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 24 },
      3: { cellWidth: 45 },
      4: { cellWidth: 22, halign: "right" },
      5: { cellWidth: 22, halign: "right" },
    },
  });

  doc.save(`farm-diary-${new Date().toISOString().split("T")[0]}.pdf`);
}
