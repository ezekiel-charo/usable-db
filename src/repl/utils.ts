import { TableRow } from "../core/types";

export function formatTable(rows: TableRow[]): string {
  if (rows.length === 0) return "(0 rows)";

  const columns = Object.keys(rows[0]!);
  let output = columns.join(" | ") + "\n";
  output += columns.map(() => "---").join("-+-") + "\n";

  rows.forEach((row) => {
    output += columns.map((col) => row[col]).join(" | ") + "\n";
  });

  return output + `(${rows.length} rows)`;
}
