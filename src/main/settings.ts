import fs from "fs/promises";
import { settingsFile } from "./paths";
import { MOD_CATALOG } from "./mods";

export type LaunchMode = "vanilla" | "optimized";
export type Settings = {
  versionId: string | null;
  memoryMb: number;
  discordRpc: boolean;
  keepOpen: boolean;
  launchMode: LaunchMode;
  enabledMods: string[];
  optimizedFlags: boolean;
  leaderboard: boolean;
  accent: string;
  accentInk: string;
  capeId: string | null;
  schema: number;
};

const SCHEMA = 6;

const CATALOG_SLUGS = new Set(MOD_CATALOG.map((m) => m.slug));
const FORCED_MODS = MOD_CATALOG.filter((m) => m.forced).map((m) => m.slug);
const DEFAULT_MODS = MOD_CATALOG.filter((m) => m.defaultOn).map((m) => m.slug);

const DEFAULTS: Settings = {
  versionId: "1.21.11",
  memoryMb: 4096,
  discordRpc: true,
  keepOpen: true,
  launchMode: "optimized",
  enabledMods: DEFAULT_MODS,
  optimizedFlags: true,
  leaderboard: true,
  accent: "#ffffff",
  accentInk: "#0a0a0b",
  capeId: null,
  schema: SCHEMA,
};

function sanitize(list: string[]): string[] {
  const set = new Set(list.filter((s) => CATALOG_SLUGS.has(s)));
  for (const f of FORCED_MODS) set.add(f);
  return Array.from(set);
}

export async function loadSettings(): Promise<Settings> {
  try {
    const raw = await fs.readFile(settingsFile(), "utf8");
    const parsed = { ...DEFAULTS, ...JSON.parse(raw) };
    if (parsed.schema !== SCHEMA) {
      parsed.enabledMods = DEFAULT_MODS;
      parsed.schema = SCHEMA;
    }
    parsed.enabledMods = sanitize(parsed.enabledMods);
    return parsed;
  } catch {
    return { ...DEFAULTS, enabledMods: sanitize(DEFAULT_MODS) };
  }
}

export async function saveSettings(s: Settings): Promise<void> {
  const next = { ...s, schema: SCHEMA, enabledMods: sanitize(s.enabledMods) };
  await fs.writeFile(settingsFile(), JSON.stringify(next, null, 2), "utf8");
}
