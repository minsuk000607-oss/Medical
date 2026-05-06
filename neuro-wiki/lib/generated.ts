import fs from "node:fs";
import path from "node:path";
import type { StructuredInsight } from "@/types/wiki";

const INSIGHTS_DIR = path.join(
  process.cwd(),
  "content",
  "generated",
  "insights"
);

export function getGeneratedInsight(
  documentId: string
): StructuredInsight | null {
  const filePath = path.join(INSIGHTS_DIR, `${documentId}.insight.json`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw) as StructuredInsight;
  } catch {
    return null;
  }
}
