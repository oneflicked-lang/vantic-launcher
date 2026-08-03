import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import https from "https";
import { mcDir } from "./paths";

export type ModDef = {
  slug: string;
  name: string;
  blurb: string;
  category: "renderer" | "fps" | "memory" | "chunks" | "lib" | "cosmetic";
  defaultOn: boolean;
  forced?: boolean;
};

// Strictly performance. Every entry raises FPS, lowers memory, smooths chunk
// loading, or is a library a performance mod requires. No zoom, gamma, HUD,
// maps, or other QoL. Libraries are marked and kept on so the perf mods that
// depend on them do not crash the game.
export const MOD_CATALOG: ModDef[] = [
  { slug: "sodium",               name: "Sodium",               blurb: "The proven FPS mod. Rewrites chunk rendering for a big, reliable boost on every GPU.", category: "renderer", defaultOn: true },
  { slug: "sodium-extra",         name: "Sodium Extra",         blurb: "Extra FPS toggles: cut fog, particles, clouds, and weather.",                    category: "renderer", defaultOn: true },
  { slug: "indium",               name: "Indium",               blurb: "Rendering API layer Sodium needs for some mods to draw correctly.",              category: "renderer", defaultOn: true },
  { slug: "reeses-sodium-options",name: "Reese's Sodium Options",blurb: "Cleaner in-game menu to tune every Sodium setting for more FPS.",                category: "renderer", defaultOn: true },
  { slug: "fabric-api",           name: "Fabric API",           blurb: "Required by most performance mods.",                                             category: "lib",      defaultOn: true, forced: true },
  { slug: "cloth-config",         name: "Cloth Config",         blurb: "Config library several performance mods depend on.",                             category: "lib",      defaultOn: true, forced: true },
  { slug: "yacl",                 name: "YACL",                 blurb: "Config library several performance mods depend on.",                             category: "lib",      defaultOn: true, forced: true },
  { slug: "lithium",              name: "Lithium",              blurb: "Rewrites game logic and physics. Higher, steadier tick rate.",                   category: "fps",      defaultOn: true },
  { slug: "ferrite-core",         name: "FerriteCore",          blurb: "Cuts RAM usage sharply with no gameplay change.",                                category: "memory",   defaultOn: true },
  { slug: "memoryleakfix",        name: "Memory Leak Fix",      blurb: "Patches leaks that drag down long sessions.",                                    category: "memory",   defaultOn: true },
  { slug: "immediatelyfast",      name: "ImmediatelyFast",      blurb: "Speeds up the HUD, text, and menu renderer. Big frame time win.",                category: "fps",      defaultOn: true },
  { slug: "exordium",             name: "Exordium",             blurb: "Caps GUI redraws so the HUD stops eating frames.",                               category: "fps",      defaultOn: true },
  { slug: "entityculling",        name: "Entity Culling",       blurb: "Skips rendering entities you cannot see.",                                       category: "fps",      defaultOn: true },
  { slug: "moreculling",          name: "More Culling",         blurb: "Culls block faces the game normally wastes time drawing.",                       category: "fps",      defaultOn: true },
  { slug: "cull-less-leaves",     name: "Cull Less Leaves",     blurb: "Renders fewer leaf faces. Big win near forests.",                                category: "fps",      defaultOn: true },
  { slug: "particle-cull",        name: "Particle Culling",     blurb: "Stops offscreen particles from costing frames.",                                 category: "fps",      defaultOn: true },
  { slug: "entity-view-distance", name: "Entity View Distance", blurb: "Separate, lower entity render distance for more FPS.",                            category: "fps",      defaultOn: true },
  { slug: "modernfix",            name: "ModernFix",            blurb: "Memory and rendering optimizations bundled together.",                           category: "fps",      defaultOn: true },
  { slug: "badoptimizations",     name: "BadOptimizations",     blurb: "Optimizes sound, particles, and rendering paths.",                               category: "fps",      defaultOn: true },
  { slug: "dynamic-fps",          name: "Dynamic FPS",          blurb: "Throttles FPS when the window is not focused so the GPU rests.",                  category: "fps",      defaultOn: true },
  { slug: "krypton",              name: "Krypton",              blurb: "Faster network stack. Less lag from packet handling.",                           category: "fps",      defaultOn: true },
  { slug: "vmp-fabric",           name: "Very Many Players",    blurb: "Tick and chunk throughput optimizations. Helps everywhere.",                     category: "chunks",   defaultOn: true },
  { slug: "noisium",              name: "Noisium",              blurb: "Speeds up world generation.",                                                    category: "chunks",   defaultOn: true },
  { slug: "threadtweak",          name: "ThreadTweak",          blurb: "Tunes chunk generation threads for your CPU.",                                    category: "chunks",   defaultOn: true },
  { slug: "smoothboot",           name: "Smooth Boot",          blurb: "Balances CPU threads so the game boots without lag spikes.",                      category: "fps",      defaultOn: true },
  { slug: "silicon",              name: "Silicon",              blurb: "Optimizes math and block position handling under the hood.",                     category: "fps",      defaultOn: true },
  { slug: "fpsdisplay",           name: "FPS Counter",          blurb: "Clean FPS counter overlay in the corner. See your framerate at a glance.",       category: "fps",      defaultOn: true },
  { slug: "servercore",           name: "ServerCore",           blurb: "Server side tick optimizations. Helps singleplayer too.",                         category: "fps",      defaultOn: true },
  { slug: "consumable-optimizer", name: "Consumable Optimizer", blurb: "Reduces lag from crystal, splash, and consumable spam.",                          category: "fps",      defaultOn: true },
  { slug: "packetfixer",          name: "Packet Fixer",         blurb: "Stops oversized packets from freezing or lagging you out.",                       category: "fps",      defaultOn: true },
  // Renders Vantic capes in-game. Reads each player's chosen cape from the
  // Vantic API (see ensureCapeProviderConfig). Lightweight, client-side.
  { slug: "cape-provider",        name: "Vantic Capes",         blurb: "Shows Vantic capes in-game. Pick yours on the Capes page.",                       category: "cosmetic", defaultOn: true },
  // Experimental Vulkan renderer. Off by default. Can be faster on some modern
  // GPUs but is unstable and sometimes slower than Sodium. Turn Sodium OFF
  // before enabling this, the two renderers conflict.
  { slug: "vulkanmod",            name: "VulkanMod (experimental)", blurb: "Vulkan renderer. Only try if Sodium isn't enough. Disable Sodium first, they conflict.", category: "renderer", defaultOn: false },
];

export const BUNDLED_MODS: string[] = [];

const UA = "VanticLauncher/1.5 (contact@vantic.lol)";

function getJson<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": UA } }, (res) => {
      if (res.statusCode !== 200) return reject(new Error(`GET ${url} -> ${res.statusCode}`));
      const chunks: Buffer[] = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => { try { resolve(JSON.parse(Buffer.concat(chunks).toString("utf8"))); } catch (e) { reject(e); } });
      res.on("error", reject);
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

type MrVersion = { id: string; version_number: string; files: { url: string; filename: string; primary: boolean }[]; loaders: string[]; game_versions: string[] };

async function resolveVersion(slug: string, mcVersion: string): Promise<MrVersion | null> {
  const url = `https://api.modrinth.com/v2/project/${encodeURIComponent(slug)}/version?loaders=${encodeURIComponent(`["fabric"]`)}&game_versions=${encodeURIComponent(`["${mcVersion}"]`)}`;
  try {
    const versions = await getJson<MrVersion[]>(url);
    return versions[0] || null;
  } catch {
    return null;
  }
}

async function copyBundled(assetsRoot: string): Promise<string[]> {
  const src = path.join(assetsRoot, "bundled-mods");
  const dst = path.join(mcDir(), "mods");
  const copied: string[] = [];
  try {
    const entries = await fsp.readdir(src);
    for (const name of entries) {
      if (!name.toLowerCase().endsWith(".jar")) continue;
      const from = path.join(src, name);
      const to = path.join(dst, name);
      try {
        const [srcStat, dstStat] = await Promise.all([fsp.stat(from), fsp.stat(to).catch(() => null)]);
        if (dstStat && dstStat.size === srcStat.size) { copied.push(name); continue; }
        await fsp.copyFile(from, to);
        copied.push(name);
      } catch {}
    }
  } catch {
    /* no bundled-mods folder, fine */
  }
  return copied;
}

// Ensure the Cape Provider mod is configured to fetch Vantic capes. $idNoHyphen
// is substituted per-rendered-player, so every player's chosen Vantic cape
// shows. Merges into any existing config so we never clobber the user's other
// providers; missing top-level fields are filled in by the mod's own defaults.
export async function ensureCapeProviderConfig(apiBase: string): Promise<void> {
  const dir = path.join(mcDir(), "config", "cape-provider");
  const file = path.join(dir, "config.json");
  await fsp.mkdir(dir, { recursive: true });

  let cfg: any = {};
  try { cfg = JSON.parse(await fsp.readFile(file, "utf8")); } catch { cfg = {}; }
  if (!Array.isArray(cfg.remoteCustomProviders)) cfg.remoteCustomProviders = [];

  const provider = {
    id: "vantic",
    name: "Vantic",
    // Use $id (hyphenated UUID) not $idNoHyphen: the mod replaces "$id" before
    // "$idNoHyphen", and since "$idNoHyphen" contains "$id" it gets mangled into
    // "<uuid>NoHyphen". Our API strips dashes server-side, so $id resolves fine.
    uriTemplate: `${apiBase.replace(/\/+$/, "")}/api/cape/$id`,
  };
  cfg.remoteCustomProviders = cfg.remoteCustomProviders.filter((p: any) => p && p.id !== "vantic");
  cfg.remoteCustomProviders.unshift(provider);

  // A provider only renders if it is ALSO in activeProviderIds. Make Vantic the
  // active provider so every player's chosen Vantic cape shows (and we don't
  // pull capes from the mod's default third-party service).
  cfg.activeProviderIds = ["vantic"];

  await fsp.writeFile(file, JSON.stringify(cfg, null, 2), "utf8");
}

export type SearchHit = { slug: string; title: string; description: string; icon: string | null; downloads: number; author: string };

// Search all of Modrinth for Fabric mods compatible with the given MC version.
// Empty query returns the most downloaded ones.
export async function searchModrinth(query: string, mcVersion: string): Promise<SearchHit[]> {
  const facets = `[["project_type:mod"],["categories:fabric"],["versions:${mcVersion}"]]`;
  const index = query.trim() ? "relevance" : "downloads";
  const url = `https://api.modrinth.com/v2/search?limit=30&index=${index}&query=${encodeURIComponent(query)}&facets=${encodeURIComponent(facets)}`;
  try {
    const data = await getJson<{ hits: any[] }>(url);
    return (data.hits || []).map((h) => ({
      slug: h.slug,
      title: h.title,
      description: h.description,
      icon: h.icon_url || null,
      downloads: h.downloads || 0,
      author: h.author || "",
    }));
  } catch {
    return [];
  }
}

// Install one mod by slug into the mods folder for the given MC version.
export async function installMod(slug: string, mcVersion: string): Promise<{ ok: boolean; filename?: string; error?: string }> {
  const modsDir = path.join(mcDir(), "mods");
  await fsp.mkdir(modsDir, { recursive: true });
  const ver = await resolveVersion(slug, mcVersion);
  if (!ver) return { ok: false, error: `No Fabric build for ${mcVersion}.` };
  const primary = ver.files.find((f) => f.primary) || ver.files[0];
  if (!primary) return { ok: false, error: "No downloadable file." };
  try {
    await download(primary.url, path.join(modsDir, primary.filename));
    return { ok: true, filename: primary.filename };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Download failed." };
  }
}

export async function syncMods(
  mcVersion: string,
  enabledSlugs: string[],
  assetsRoot: string,
  onProgress: (msg: string, done: number, total: number) => void
): Promise<{ installed: string[]; skipped: string[]; missing: string[]; bundled: string[] }> {
  const modsDir = path.join(mcDir(), "mods");
  await fsp.mkdir(modsDir, { recursive: true });

  const stateFile = path.join(mcDir(), ".vantic-managed-mods.json");
  const managed: Record<string, string> = await fsp.readFile(stateFile, "utf8").then((s) => JSON.parse(s)).catch(() => ({}));

  const wanted = new Set(enabledSlugs);
  const installed: string[] = [], skipped: string[] = [], missing: string[] = [];

  for (const [slug, filename] of Object.entries(managed)) {
    if (wanted.has(slug)) continue;
    try { await fsp.unlink(path.join(modsDir, filename)); } catch {}
    delete managed[slug];
  }

  let i = 0;
  for (const slug of enabledSlugs) {
    i++;
    onProgress(`Resolving ${slug}`, i, enabledSlugs.length);
    const ver = await resolveVersion(slug, mcVersion);
    if (!ver) { missing.push(slug); continue; }
    const primary = ver.files.find((f) => f.primary) || ver.files[0];
    if (!primary) { missing.push(slug); continue; }
    const dest = path.join(modsDir, primary.filename);
    if (fs.existsSync(dest) && managed[slug] === primary.filename) { skipped.push(slug); continue; }
    if (managed[slug] && managed[slug] !== primary.filename) {
      try { await fsp.unlink(path.join(modsDir, managed[slug])); } catch {}
    }
    onProgress(`Downloading ${primary.filename}`, i, enabledSlugs.length);
    try {
      await download(primary.url, dest);
      managed[slug] = primary.filename;
      installed.push(slug);
    } catch {
      missing.push(slug);
    }
  }

  await fsp.writeFile(stateFile, JSON.stringify(managed, null, 2), "utf8");
  const bundled = await copyBundled(assetsRoot);
  return { installed, skipped, missing, bundled };
}
