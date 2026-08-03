import { app, BrowserWindow, ipcMain, shell } from "electron";
import path from "path";
import fs from "fs";
import { login, logout, resume, currentMclc } from "./auth";
import { launch } from "./launcher";
import { getManifest } from "./versions";
import { loadSettings, saveSettings, Settings } from "./settings";
import { initRpc, setEnabled as setRpcEnabled, setIdle, setPlaying } from "./rpc";
import { mcDir } from "./paths";
import { MOD_CATALOG, syncMods, searchModrinth, installMod, ensureCapeProviderConfig } from "./mods";
import { PACK_CATALOG, installPack, installedPacks } from "./packs";
import { ensureFabric } from "./fabric";
import { loadStats, bumpLaunch } from "./stats";
import { importFromFolder } from "./import";
import { initUpdater, applyUpdate } from "./updater";
import { humanize } from "./errors";
import { listShots, deleteShot } from "./gallery";
import { pathToFileURL } from "url";
import { listWorlds, deleteWorld } from "./worlds";
import { cleanupLegacy } from "./resourcePack";
import { scanHardware, AIKAR_FLAGS, Recommendation } from "./hardware";
import { checkAccess } from "./access";
import { recordSession, summary as playtimeSummary } from "./playtime";
import { fetchNews, fetchLeaderboard, uploadPlaytime, postHeartbeat, fetchOnline, imageDataUrl, setCape } from "./community";
import { applyFastOptions } from "./gameOptions";
import { loadServers, saveServers, parseAddress, Server } from "./servers";
import { pingServer } from "./serverPing";
import crypto from "crypto";

let win: BrowserWindow | null = null;

const LOG_CAP = 5000;
const logBuffer: string[] = [];
function pushLog(line: string) {
  logBuffer.push(line);
  if (logBuffer.length > LOG_CAP) logBuffer.splice(0, logBuffer.length - LOG_CAP);
  win?.webContents.send("log:line", line);
}

function createWindow() {
  win = new BrowserWindow({
    width: 1080,
    height: 700,
    minWidth: 960,
    minHeight: 600,
    backgroundColor: "#0a0a0b",
    autoHideMenuBar: true,
    frame: false,
    title: "Vantic",
    icon: path.join(__dirname, "..", "..", "assets", "vanticnobg.png"),
    webPreferences: {
      preload: path.join(__dirname, "..", "preload", "index.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });
  win.loadFile(path.join(__dirname, "..", "renderer", "index.html"));
  win.on("maximize", () => win?.webContents.send("win:state", { maximized: true }));
  win.on("unmaximize", () => win?.webContents.send("win:state", { maximized: false }));
}

app.whenReady().then(async () => {
  createWindow();
  const s = await loadSettings();
  if (s.discordRpc) initRpc();
  setRpcEnabled(s.discordRpc);
  setIdle();
  initUpdater(() => win);
});

app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });

// window
ipcMain.on("win:minimize", () => win?.minimize());
ipcMain.on("win:maximize-toggle", () => { if (!win) return; win.isMaximized() ? win.unmaximize() : win.maximize(); });
ipcMain.on("win:close", () => win?.close());
ipcMain.handle("win:is-maximized", () => !!win?.isMaximized());

// auth
ipcMain.handle("auth:current", async () => resume());
ipcMain.handle("auth:login", async () => login());
ipcMain.handle("auth:logout", async () => { await logout(); return true; });

// misc
ipcMain.handle("open:external", (_e, url: string) => {
  if (typeof url === "string" && /^https?:\/\//.test(url)) shell.openExternal(url);
});
ipcMain.handle("open:folder", async (_e, which: "mods" | "resourcepacks" | "screenshots" | "saves" | "root") => {
  const map: Record<string, string> = {
    mods: path.join(mcDir(), "mods"),
    resourcepacks: path.join(mcDir(), "resourcepacks"),
    screenshots: path.join(mcDir(), "screenshots"),
    saves: path.join(mcDir(), "saves"),
    root: mcDir(),
  };
  const target = map[which] || mcDir();
  fs.mkdirSync(target, { recursive: true });
  await shell.openPath(target);
  return true;
});

// versions
ipcMain.handle("versions:list", async () => {
  const m = await getManifest();
  return { latestRelease: m.latest.release, versions: m.versions.filter((v) => v.type === "release").slice(0, 60) };
});

// settings
ipcMain.handle("settings:get", async () => loadSettings());
ipcMain.handle("settings:set", async (_e, s: Settings) => {
  await saveSettings(s);
  setRpcEnabled(s.discordRpc);
  if (s.discordRpc) initRpc();
  return s;
});

// log
ipcMain.handle("log:snapshot", async () => logBuffer.slice());
ipcMain.handle("log:clear", async () => { logBuffer.length = 0; win?.webContents.send("log:cleared"); return true; });

// mods + packs
ipcMain.handle("mods:catalog", async () => MOD_CATALOG);
ipcMain.handle("mods:search", async (_e, query: string, version?: string) => {
  const s = await loadSettings();
  return searchModrinth(query, version || s.versionId || "1.21.11");
});
ipcMain.handle("mods:install", async (_e, slug: string, version?: string) => {
  const s = await loadSettings();
  return installMod(slug, version || s.versionId || "1.21.11");
});

// Re-sync the enabled mods to match the currently selected Minecraft version.
// Called when the user changes their version so the mods folder always holds
// builds for the version they will actually launch. No-op in vanilla mode and
// while the game is running.
ipcMain.handle("mods:sync", async (evt) => {
  if (running) return { skipped: true as const, reason: "running" };
  const s = await loadSettings();
  if (s.launchMode !== "optimized") return { skipped: true as const, reason: "vanilla" };
  const chosen = s.versionId || "1.21.11";
  const assetsRoot = path.join(__dirname, "..", "..", "assets");
  const r = await syncMods(chosen, s.enabledMods, assetsRoot, (msg, done, total) =>
    evt.sender.send("launch:progress", { label: msg, done, total })
  );
  return { skipped: false as const, installed: r.installed, upToDate: r.skipped, missing: r.missing };
});

// early access
ipcMain.handle("access:check", async () => {
  const a = currentMclc();
  if (!a) return { allowed: false, reason: "Not logged in." };
  return checkAccess(a.uuid, a.name);
});

// hardware scan + one-click optimize
ipcMain.handle("hardware:scan", async () => scanHardware());
ipcMain.handle("hardware:apply", async (_e, rec: Recommendation) => {
  const s = await loadSettings();
  const set = new Set(s.enabledMods);
  const SODIUM = ["sodium", "indium", "sodium-extra"];
  if (rec.renderer === "sodium") {
    set.delete("vulkanmod");
    SODIUM.forEach((m) => set.add(m));
  } else {
    SODIUM.forEach((m) => set.delete(m));
    set.add("vulkanmod");
  }
  const next = {
    ...s,
    memoryMb: rec.memoryMb,
    optimizedFlags: rec.optimizedFlags,
    launchMode: "optimized" as const,
    enabledMods: Array.from(set),
  };
  await saveSettings(next);
  return next;
});
ipcMain.handle("packs:catalog", async () => PACK_CATALOG);
ipcMain.handle("packs:installed", async () => installedPacks());
ipcMain.handle("packs:install", async (_e, slug: string) => {
  const s = await loadSettings();
  return installPack(slug, s.versionId || "1.21.11");
});
ipcMain.handle("import:folder", async () => importFromFolder(win));

// stats
ipcMain.handle("stats:get", async () => loadStats());
ipcMain.handle("playtime:get", async () => playtimeSummary());
ipcMain.handle("news:list", async () => fetchNews());
ipcMain.handle("leaderboard:list", async () => fetchLeaderboard());
ipcMain.handle("cape:set", async (_e, capeId: string) => {
  const auth = currentMclc();
  if (!auth) return { ok: false as const, error: "Not logged in." };
  const s = await loadSettings();
  await saveSettings({ ...s, capeId: capeId && capeId !== "none" ? capeId : null });
  const ok = await setCape(auth.uuid, capeId || "none");
  return { ok };
});
ipcMain.handle("online:count", async () => fetchOnline());
ipcMain.handle("image:dataurl", async (_e, url: string) => imageDataUrl(url));

// Save a Vantic Wrapped card (data URL from a canvas) to disk and reveal it.
ipcMain.handle("wrapped:save", async (_e, dataUrl: string) => {
  try {
    const b64 = dataUrl.replace(/^data:image\/png;base64,/, "");
    const dir = path.join(mcDir(), "screenshots");
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `vantic-wrapped-${Date.now()}.png`);
    fs.writeFileSync(file, Buffer.from(b64, "base64"));
    shell.showItemInFolder(file);
    return file;
  } catch {
    return null;
  }
});

// servers
ipcMain.handle("servers:list", async () => loadServers());
ipcMain.handle("servers:add", async (_e, name: string, address: string) => {
  const list = await loadServers();
  const { host, port } = parseAddress(address);
  const s: Server = { id: crypto.randomBytes(6).toString("hex"), name: name.trim() || host, address: host, port };
  list.push(s);
  await saveServers(list);
  return s;
});
ipcMain.handle("servers:remove", async (_e, id: string) => {
  const list = (await loadServers()).filter((s) => s.id !== id);
  await saveServers(list);
  return true;
});
ipcMain.handle("servers:ping", async (_e, host: string, port: number) => pingServer(host, port));

// worlds
ipcMain.handle("worlds:list", async () => {
  const worlds = await listWorlds();
  return worlds.map((w) => ({ ...w }));
});
ipcMain.handle("worlds:delete", async (_e, name: string) => deleteWorld(name));
ipcMain.handle("worlds:reveal", async (_e, name: string) => {
  const p = path.join(mcDir(), "saves", path.basename(name));
  shell.openPath(p);
});

// gallery
ipcMain.handle("gallery:list", async () => {
  const shots = await listShots();
  return shots.map((s) => ({ ...s, url: pathToFileURL(s.path).href }));
});
ipcMain.handle("gallery:delete", async (_e, filename: string) => deleteShot(filename));
ipcMain.handle("gallery:reveal", async (_e, filename: string) => {
  const base = path.basename(filename);
  const p = path.join(mcDir(), "screenshots", base);
  shell.showItemInFolder(p);
});

// updater
ipcMain.handle("update:apply", () => applyUpdate());

// launch
let running = false;
ipcMain.handle("launch:running", async () => running);
ipcMain.handle("launch:play", async (evt) => {
  if (running) throw new Error("Minecraft is already running.");
  const auth = currentMclc();
  if (!auth) throw new Error("Not logged in.");

  const access = await checkAccess(auth.uuid, auth.name);
  if (!access.allowed) {
    running = false;
    throw new Error(access.reason || "You do not have early access yet.");
  }

  const settings = await loadSettings();
  const chosen = settings.versionId || "1.21.11";
  const optimized = settings.launchMode === "optimized";

  pushLog(`> Launching Minecraft ${chosen} (${optimized ? "optimized" : "vanilla"})`);
  running = true;
  setPlaying(chosen);

  const removed = await cleanupLegacy();
  if (removed.length) pushLog(`> Removed legacy files: ${removed.join(", ")}`);

  let customVersion: string | undefined;
  try {
    if (optimized) {
      pushLog(`> Installing Fabric loader for ${chosen}`);
      customVersion = await ensureFabric(chosen);
      pushLog(`> Fabric ready: ${customVersion}`);
      pushLog(`> Syncing ${settings.enabledMods.length} mods from Modrinth`);
      const assetsRoot = path.join(__dirname, "..", "..", "assets");
      const r = await syncMods(chosen, settings.enabledMods, assetsRoot, (msg, done, total) => evt.sender.send("launch:progress", { label: msg, done, total }));
      if (r.bundled.length) pushLog(`> Bundled: ${r.bundled.join(", ")}`);
      pushLog(`> Mods synced: ${r.installed.length} installed, ${r.skipped.length} up to date` + (r.missing.length ? `, ${r.missing.length} unavailable for ${chosen}` : ""));
      if (r.missing.length) pushLog(`> Missing: ${r.missing.join(", ")}. They may not support ${chosen} yet.`);
      if (settings.enabledMods.includes("cape-provider")) {
        try {
          // Use the canonical www host: the apex vantic.lol 308-redirects to
          // www, and Cape Provider does not follow redirects when fetching.
          await ensureCapeProviderConfig(process.env.VANTIC_API_BASE || "https://www.vantic.lol");
          pushLog("> Vantic capes configured.");
        } catch (e: any) {
          pushLog(`> Cape config skipped: ${e?.message || e}`);
        }
      }
      const applied = await applyFastOptions();
      if (applied) pushLog("> Applied FPS-optimized video settings.");
    }
  } catch (e: any) {
    running = false;
    setIdle();
    const msg = humanize(e);
    pushLog(`> Setup failed: ${msg}`);
    evt.sender.send("launch:exit", { code: 1 });
    throw new Error(msg);
  }

  const stats = await bumpLaunch(chosen, settings.launchMode);
  evt.sender.send("stats:update", stats);

  const sessionStart = Date.now();
  postHeartbeat(auth.uuid);
  const heartbeat = setInterval(() => postHeartbeat(auth.uuid), 60_000);

  launch(
    {
      auth,
      versionNumber: chosen,
      memoryMb: settings.memoryMb,
      customVersion,
      jvmArgs: settings.optimizedFlags ? AIKAR_FLAGS : undefined,
    },
    {
      progress: (label, done, total) => evt.sender.send("launch:progress", { label, done, total }),
      log: (line) => pushLog(line),
      exit: async (code) => {
        running = false;
        setIdle();
        clearInterval(heartbeat);
        pushLog(`> Minecraft exited with code ${code}`);
        await recordSession((Date.now() - sessionStart) / 1000);
        if (settings.leaderboard) {
          const pt = await playtimeSummary();
          uploadPlaytime(auth.uuid, auth.name, pt.totalSeconds);
        }
        evt.sender.send("launch:exit", { code });
      },
    }
  );
  return { versionId: chosen, mode: settings.launchMode };
});
