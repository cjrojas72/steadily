/**
 * Escape a value for CSV — wrap in quotes if it contains commas,
 * quotes, or newlines. Double any existing quotes.
 */
function escapeCsv(value) {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Export an array of normalised transactions to a CSV file and trigger
 * a browser download.
 *
 * @param {Array<{date: string, name: string, category: string, type: string, amount: number}>} transactions
 */
export function exportTransactionsCsv(transactions) {
  const headers = ["Date", "Description", "Category", "Type", "Amount"];

  const rows = transactions.map((t) => [
    escapeCsv(t.date),
    escapeCsv(t.name),
    escapeCsv(t.category),
    escapeCsv(t.type),
    escapeCsv(Math.abs(t.amount).toFixed(2)),
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  // Create blob and trigger download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  const today = new Date().toISOString().split("T")[0];
  link.href = url;
  link.download = `steadily-transactions-${today}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
