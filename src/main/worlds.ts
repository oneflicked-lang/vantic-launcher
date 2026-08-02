import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { pathToFileURL } from "url";
import { mcDir } from "./paths";

export type World = {
  name: string;
  path: string;
  iconUrl: string | null;
  mtime: number;
  size: number;
};

// Every folder under saves/ that contains a level.dat is a Minecraft world.
export async function listWorlds(): Promise<World[]> {
  const savesDir = path.join(mcDir(), "saves");
  try {
    const entries = await fsp.readdir(savesDir, { withFileTypes: true });
    const out: World[] = [];
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      const folder = path.join(savesDir, e.name);
      const levelDat = path.join(folder, "level.dat");
      if (!fs.existsSync(levelDat)) continue;
      const st = await fsp.stat(levelDat).catch(() => null);
      const iconPath = path.join(folder, "icon.png");
      const hasIcon = fs.existsSync(iconPath);
      out.push({
        name: e.name,
        path: folder,
        iconUrl: hasIcon ? pathToFileURL(iconPath).href : null,
        mtime: st ? st.mtimeMs : 0,
        size: await folderSize(folder),
      });
    }
    return out.sort((a, b) => b.mtime - a.mtime);
  } catch {
    return [];
  }
}

async function folderSize(dir: string): Promise<number> {
  let total = 0;
  async function walk(d: string) {
    let entries: import("fs").Dirent[];
    try { entries = await fsp.readdir(d, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) await walk(p);
      else {
        try { const s = await fsp.stat(p); total += s.size; } catch {}
      }
    }
  }
  await walk(dir);
  return total;
}

export async function deleteWorld(name: string): Promise<boolean> {
  const base = path.basename(name);
  const target = path.join(mcDir(), "saves", base);
  const check = path.join(target, "level.dat");
  if (!fs.existsSync(check)) return false;
  try {
    await fsp.rm(target, { recursive: true, force: true });
    return true;
  } catch {
    return false;
  }
}
