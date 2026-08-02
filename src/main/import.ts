import { dialog, BrowserWindow } from "electron";
import fsp from "fs/promises";
import path from "path";
import { mcDir } from "./paths";

// Let the user pick any folder (typically an existing Prism / Modrinth App /
// Lunar profile) and copy every .jar it finds into Vantic's mods folder.
// We only touch files ending in .jar, and we never overwrite an existing
// file with the same name.
export async function importFromFolder(win: BrowserWindow | null): Promise<{ copied: string[]; skipped: string[] } | null> {
  const dst = path.join(mcDir(), "mods");
  await fsp.mkdir(dst, { recursive: true });

  const result = win
    ? await dialog.showOpenDialog(win, { title: "Pick a folder that contains .jar mods", properties: ["openDirectory"] })
    : await dialog.showOpenDialog({ title: "Pick a folder that contains .jar mods", properties: ["openDirectory"] });
  if (result.canceled || !result.filePaths[0]) return null;

  const src = result.filePaths[0];
  const jars = await findJars(src, 4);
  const copied: string[] = [];
  const skipped: string[] = [];
  for (const jar of jars) {
    const name = path.basename(jar);
    const target = path.join(dst, name);
    try {
      await fsp.access(target);
      skipped.push(name);
      continue;
    } catch { /* not present */ }
    try {
      await fsp.copyFile(jar, target);
      copied.push(name);
    } catch {
      skipped.push(name);
    }
  }
  return { copied, skipped };
}

async function findJars(root: string, maxDepth: number): Promise<string[]> {
  const out: string[] = [];
  async function walk(dir: string, depth: number) {
    if (depth < 0) return;
    let entries: import("fs").Dirent[];
    try { entries = await fsp.readdir(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) await walk(p, depth - 1);
      else if (e.isFile() && e.name.toLowerCase().endsWith(".jar")) out.push(p);
    }
  }
  await walk(root, maxDepth);
  return out;
}
