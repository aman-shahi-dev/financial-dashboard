import { formatDate } from "./formatters";

export const exportToCSV = (transactions) => {
  const headers = ["Date", "Description", "Category", "Type", "Amount"];
  const rows = transactions.map((t) => [
    formatDate(t.date),
    `"${t.description}"`,
    t.category,
    t.type,
    t.type === "expense" ? `-${t.amount}` : t.amount,
  ]);

  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "zorvyn-transactions.csv";
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToJSON = (transactions) => {
  const json = JSON.stringify(transactions, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "zorvyn-transactions.json";
  a.click();
  URL.revokeObjectURL(url);
};
