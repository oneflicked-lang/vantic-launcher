import fs from "fs/promises";
import path from "path";
import { root } from "./paths";

// Small locally stored counters so Home can show "you have launched X times,
// last played Y". Nothing is uploaded anywhere.
export type Stats = {
  launchCount: number;
  lastLaunched: number | null;   // epoch ms
  lastVersion: string | null;
  lastMode: "vanilla" | "optimized" | null;
};

const DEFAULTS: Stats = {
  launchCount: 0,
  lastLaunched: null,
  lastVersion: null,
  lastMode: null,
};

function file(): string {
  return path.join(root(), "stats.json");
}

export async function loadStats(): Promise<Stats> {
  try {
    const raw = await fs.readFile(file(), "utf8");
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

export async function bumpLaunch(version: string, mode: "vanilla" | "optimized"): Promise<Stats> {
  const cur = await loadStats();
  const next: Stats = {
    launchCount: cur.launchCount + 1,
    lastLaunched: Date.now(),
    lastVersion: version,
    lastMode: mode,
  };
  await fs.writeFile(file(), JSON.stringify(next, null, 2), "utf8");
  return next;
}
