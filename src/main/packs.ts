import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import https from "https";
import { mcDir } from "./paths";

export type PackDef = { slug: string; name: string; blurb: string; tag: string };

// PvP-focused pack list. Clean, low res, high visibility. No realistic PBR,
// no ambient shaders, no fantasy overhauls.
export const PACK_CATALOG: PackDef[] = [
  { slug: "faithful-32x",           name: "Faithful 32x",            blurb: "Vanilla but crisper. The classic higher resolution vanilla pack.", tag: "32x" },
  { slug: "vanilla-tweaks-32x",     name: "Vanilla Tweaks",          blurb: "Small quality of life tweaks stacked into a pack.",                tag: "16x" },
  { slug: "bare-bones",             name: "Bare Bones",              blurb: "Simplified vanilla textures. Cleaner reads in PvP.",               tag: "16x" },
  { slug: "glimmer",                name: "Glimmer",                 blurb: "Bright, saturated vanilla take.",                                  tag: "16x" },
  { slug: "unique-dark",            name: "Unique Dark",             blurb: "Cohesive dark UI and blocks.",                                     tag: "16x" },
  { slug: "xali-s-enhanced-vanilla",name: "Xali's Enhanced Vanilla", blurb: "Sharper vanilla with subtle detail. No overhauls.",                tag: "32x" },
];

const UA = "VanticLauncher/1.0";

function getJson<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": UA } }, (res) => {
      if (res.statusCode !== 200) return reject(new Error(`GET ${url} -> ${res.statusCode}`));
      const chunks: Buffer[] = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => { try { resolve(JSON.parse(Buffer.concat(chunks).toString("utf8"))); } catch (e) { reject(e); } });
    }).on("error", reject);
  });
}

function download(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { "User-Agent": UA } }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return download(res.headers.location, dest).then(resolve, reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`GET ${url} -> ${res.statusCode}`));
      const out = fs.createWriteStream(dest);
      res.pipe(out);
      out.on("finish", () => out.close((err) => (err ? reject(err) : resolve())));
      out.on("error", reject);
    });
    req.on("error", reject);
  });
}

export async function installPack(slug: string, mcVersion: string): Promise<{ ok: boolean; filename?: string; error?: string }> {
  const rpDir = path.join(mcDir(), "resourcepacks");
  await fsp.mkdir(rpDir, { recursive: true });

  const meta = await getJson<{ project_type: string }>(`https://api.modrinth.com/v2/project/${encodeURIComponent(slug)}`).catch(() => null);
  if (!meta) return { ok: false, error: "Pack not found on Modrinth." };
  const versions = await getJson<any[]>(`https://api.modrinth.com/v2/project/${encodeURIComponent(slug)}/version?loaders=${encodeURIComponent(`["minecraft"]`)}&game_versions=${encodeURIComponent(`["${mcVersion}"]`)}`).catch(() => []);
  const ver = versions[0];
  if (!ver) return { ok: false, error: `No compatible version for ${mcVersion}.` };
  const file = (ver.files.find((f: any) => f.primary) || ver.files[0]);
  if (!file) return { ok: false, error: "Pack has no downloadable file." };

  const dest = path.join(rpDir, file.filename);
  try {
    await download(file.url, dest);
    return { ok: true, filename: file.filename };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Download failed." };
  }
}

export async function installedPacks(): Promise<string[]> {
  const rpDir = path.join(mcDir(), "resourcepacks");
  try {
    const files = await fsp.readdir(rpDir);
    return files.filter((f) => f.endsWith(".zip"));
  } catch {
    return [];
  }
}
