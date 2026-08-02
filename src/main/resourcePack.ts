import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { mcDir } from "./paths";

// Vantic ships a fully vanilla title screen. Earlier builds injected a
// custom client jar and a menu resource pack; this removes any leftovers so
// upgrading users get the clean vanilla menu back.
const LEGACY_MODS = ["vantic-client-0.1.0.jar"];
const LEGACY_PACK = "vantic-menu.zip";

export async function cleanupLegacy(): Promise<string[]> {
  const removed: string[] = [];

  const modsDir = path.join(mcDir(), "mods");
  for (const name of LEGACY_MODS) {
    const p = path.join(modsDir, name);
    if (fs.existsSync(p)) {
      try { await fsp.unlink(p); removed.push(name); } catch {}
    }
  }

  const packPath = path.join(mcDir(), "resourcepacks", LEGACY_PACK);
  if (fs.existsSync(packPath)) {
    try { await fsp.unlink(packPath); removed.push(LEGACY_PACK); } catch {}
  }
  await stripPackFromOptions(`file/${LEGACY_PACK}`);

  return removed;
}

async function stripPackFromOptions(entry: string): Promise<void> {
  const file = path.join(mcDir(), "options.txt");
  let text: string;
  try { text = await fsp.readFile(file, "utf8"); } catch { return; }
  const lines = text.split(/\r?\n/);
  const key = "resourcePacks:";
  const idx = lines.findIndex((l) => l.startsWith(key));
  if (idx === -1) return;
  try {
    const arr: string[] = JSON.parse(lines[idx].slice(key.length).trim());
    const next = arr.filter((e) => e !== entry);
    lines[idx] = `${key}${JSON.stringify(next)}`;
    await fsp.writeFile(file, lines.join("\n"), "utf8");
  } catch { /* leave options alone if it doesn't parse */ }
}
