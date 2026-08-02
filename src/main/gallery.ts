import fsp from "fs/promises";
import path from "path";
import { mcDir } from "./paths";

export type Shot = {
  name: string;
  path: string;
  size: number;
  mtime: number;
};

// Screenshots MC saves during play. Sorted newest first.
export async function listShots(): Promise<Shot[]> {
  const dir = path.join(mcDir(), "screenshots");
  try {
    const files = await fsp.readdir(dir);
    const shots = await Promise.all(
      files
        .filter((f) => /\.(png|jpe?g)$/i.test(f))
        .map(async (f) => {
          const p = path.join(dir, f);
          const st = await fsp.stat(p);
          return { name: f, path: p, size: st.size, mtime: st.mtimeMs };
        })
    );
    return shots.sort((a, b) => b.mtime - a.mtime);
  } catch {
    return [];
  }
}

export async function deleteShot(filename: string): Promise<boolean> {
  const base = path.basename(filename);
  const target = path.join(mcDir(), "screenshots", base);
  try {
    await fsp.unlink(target);
    return true;
  } catch {
    return false;
  }
}
