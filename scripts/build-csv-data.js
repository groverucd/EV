import { readFileSync, writeFileSync } from "fs";

const csv = readFileSync(
  "user_read_only_context/text_attachments/fleet_recommendations-8g1wF.csv",
  "utf-8"
);
const lines = csv.trim().split("\n").slice(1);

const rows = lines.map((line) => {
  const cols = line.split(",");
  return {
    id: cols[0],
    fp: parseFloat(cols[1]),
    tc: cols[6],
    act: cols[8],
    sav: parseFloat(cols[9]),
    temp: parseFloat(cols[10]),
    volt: parseFloat(cols[11]),
    uh: parseFloat(cols[12]),
    ec: parseInt(cols[13], 10),
  };
});

console.log(`Parsed ${rows.length} CSV rows`);

const tsLines = rows.map(
  (r) =>
    `{id:"${r.id}",fp:${r.fp},tc:"${r.tc}",act:"${r.act.replace(/"/g, '\\"')}",sav:${r.sav},temp:${r.temp},volt:${r.volt},uh:${r.uh},ec:${r.ec}}`
);

const output = `// Auto-generated from fleet_recommendations CSV — ${rows.length} rows
// Do not edit manually

export interface CsvCharger {
  id: string;
  fp: number;
  tc: string;
  act: string;
  sav: number;
  temp: number;
  volt: number;
  uh: number;
  ec: number;
}

export const CSV_CHARGERS: CsvCharger[] = [
${tsLines.join(",\n")}
];
`;

writeFileSync("/vercel/share/v0-project/lib/csv-chargers.ts", output);
console.log(`Wrote lib/csv-chargers.ts with ${rows.length} entries`);
