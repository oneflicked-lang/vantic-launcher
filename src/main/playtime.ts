import fs from "fs/promises";
import path from "path";
import { root } from "./paths";

// Per-day playtime tracking, stored locally. Powers the Profile dashboard:
// total hours, day streak, longest session, and a recent activity graph.
type Store = {
  days: Record<string, number>; // "YYYY-MM-DD" -> seconds
  totalSeconds: number;
  sessions: number;
  longestSeconds: number;
  firstLaunch: number | null;
};

const DEFAULTS: Store = { days: {}, totalSeconds: 0, sessions: 0, longestSeconds: 0, firstLaunch: null };

function file(): string {
  return path.join(root(), "playtime.json");
}

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

async function load(): Promise<Store> {
  try {
    return { ...DEFAULTS, ...JSON.parse(await fs.readFile(file(), "utf8")) };
  } catch {
    return { ...DEFAULTS };
  }
}

export async function recordSession(seconds: number): Promise<void> {
  if (!Number.isFinite(seconds) || seconds < 5) return; // ignore instant crashes
  const s = await load();
  const key = dayKey(new Date());
  s.days[key] = (s.days[key] || 0) + seconds;
  s.totalSeconds += seconds;
  s.sessions += 1;
  s.longestSeconds = Math.max(s.longestSeconds, seconds);
  if (!s.firstLaunch) s.firstLaunch = Date.now();
  await fs.writeFile(file(), JSON.stringify(s, null, 2), "utf8");
}

export type PlaytimeSummary = {
  totalSeconds: number;
  sessions: number;
  longestSeconds: number;
  streak: number;
  weekSeconds: number;
  graph: { label: string; date: string; seconds: number }[];
};

export async function summary(): Promise<PlaytimeSummary> {
  const s = await load();

  const graph: PlaytimeSummary["graph"] = [];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  let weekSeconds = 0;
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = dayKey(d);
    const secs = s.days[key] || 0;
    if (i < 7) weekSeconds += secs;
    graph.push({ label: dayNames[d.getDay()], date: key, seconds: secs });
  }

  // Streak: consecutive days up to today with any playtime.
  let streak = 0;
  for (let i = 0; i < 400; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    if ((s.days[dayKey(d)] || 0) > 0) streak++;
    else break;
  }

  return {
    totalSeconds: s.totalSeconds,
    sessions: s.sessions,
    longestSeconds: s.longestSeconds,
    streak,
    weekSeconds,
    graph,
  };
}
