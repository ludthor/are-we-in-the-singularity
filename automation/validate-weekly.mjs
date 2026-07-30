import { readFile } from "node:fs/promises";
import { validateWeeklyContent } from "./weekly-schema.mjs";

const contentUrl = new URL("../content/weekly.json", import.meta.url);
const weekly = JSON.parse(await readFile(contentUrl, "utf8"));

validateWeeklyContent(weekly);
console.log(
  `Validated weekly issue ${weekly.issue} (${weekly.reviewedAt}, ${weekly.verdict}).`,
);
