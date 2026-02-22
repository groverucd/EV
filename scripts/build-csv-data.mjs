import { readFileSync, writeFileSync } from "fs";

// Read CSV
const csv = readFileSync("user_read_only_context/text_attachments/fleet_recommendations-8g1wF.csv", "utf-8");
const lines = csv.trim().split("\n").slice(1); // skip header

// Parse into compact objects
const rows = lines.map((line) => {
  const cols = line.split(",");
  return {
    id: cols[0],
    fp: parseFloat(cols[1]),    // failure_probability_%
    tc: cols[6],                // top_cause
    act: cols[8],               // recommended_action
    sav: parseFloat(cols[9]),   // estimated_savings_usd
    temp: parseFloat(cols[10]), // temperature
    volt: parseFloat(cols[11]), // voltage
    uh: parseFloat(cols[12]),   // usage_hours
    ec: parseInt(cols[13], 10), // error_count
  };
});

console.log(`Parsed ${rows.length} CSV rows`);

// Build TS source
const tsLines = rows.map(
  (r) =>
    `{id:"${r.id}",fp:${r.fp},tc:"${r.tc}",act:"${r.act.replace(/"/g, '\\"')}",sav:${r.sav},temp:${r.temp},volt:${r.volt},uh:${r.uh},ec:${r.ec}}`
);

const output = `// Auto-generated from fleet_recommendations CSV (${rows.length} rows)
// Do not edit manually
export interface CsvCharger {
  id: string;
  fp: number;   // failure_probability_%
  tc: string;   // top_cause
  act: string;  // recommended_action
  sav: number;  // estimated_savings_usd
  temp: number; // temperature
  volt: number; // voltage
  uh: number;   // usage_hours
  ec: number;   // error_count
}

export const CSV_CHARGERS: CsvCharger[] = [
${tsLines.join(",\n")}
];
`;

writeFileSync("lib/csv-chargers.ts", output);
console.log(`Wrote lib/csv-chargers.ts with ${rows.length} entries`);
