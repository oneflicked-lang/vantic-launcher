import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { mcDir } from "./paths";

// Writes an FPS-focused options.txt the first time Optimized mode launches.
// This is the biggest single FPS win: vanilla defaults (render distance 12,
// fancy graphics, clouds, full particles) are heavy. We apply a fast profile
// once, tracked by a marker so we never stomp the user's later tweaks.
const MARKER = ".vantic-fastoptions-v1";

const PROFILE: Record<string, string> = {
  enableVsync: "false",
  maxFps: "260",
  renderDistance: "8",
  simulationDistance: "6",
  graphicsMode: "0",        // fast
  ao: "false",              // ambient occlusion off
  renderClouds: "false",
  particles: "2",           // minimal
  entityShadows: "false",
  mipmapLevels: "0",
  biomeBlendRadius: "0",
  entityDistanceScaling: "0.75",
  fullscreen: "true",
};

export async function applyFastOptions(): Promise<boolean> {
  const dir = mcDir();
  const marker = path.join(dir, MARKER);
  if (fs.existsSync(marker)) return false;

  const optFile = path.join(dir, "options.txt");
  let lines: string[] = [];
  try {
    lines = (await fsp.readFile(optFile, "utf8")).split(/\r?\n/);
  } catch {
    lines = [];
  }

  const setKey = (key: string, val: string) => {
    const i = lines.findIndex((l) => l.startsWith(key + ":"));
    if (i >= 0) lines[i] = `${key}:${val}`;
    else lines.push(`${key}:${val}`);
  };
  for (const [k, v] of Object.entries(PROFILE)) setKey(k, v);

  try {
    await fsp.writeFile(optFile, lines.filter((l) => l.length > 0).join("\n") + "\n", "utf8");
    await fsp.writeFile(marker, "1", "utf8");
    return true;
  } catch {
    return false;
  }
}
