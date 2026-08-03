import { contextBridge, ipcRenderer } from "electron";

export type PublicAuth = { username: string; uuid: string } | null;
export type FolderKind = "mods" | "resourcepacks" | "screenshots" | "saves" | "root";
export type Mod = { slug: string; name: string; blurb: string; category: string; defaultOn: boolean; forced?: boolean };
export type Pack = { slug: string; name: string; blurb: string; tag: string };
export type Stats = { launchCount: number; lastLaunched: number | null; lastVersion: string | null; lastMode: "vanilla" | "optimized" | null };
export type UpdateEvent =
  | { type: "checking" }
  | { type: "none" }
  | { type: "available"; version: string }
  | { type: "downloading"; percent: number }
  | { type: "ready"; version: string }
  | { type: "error"; message: string };

const on = <T>(channel: string, cb: (v: T) => void) => {
  const l = (_: unknown, v: T) => cb(v);
  ipcRenderer.on(channel, l);
  return () => ipcRenderer.off(channel, l);
};

const api = {
  win: {
    minimize: () => ipcRenderer.send("win:minimize"),
    maximizeToggle: () => ipcRenderer.send("win:maximize-toggle"),
    close: () => ipcRenderer.send("win:close"),
    isMaximized: (): Promise<boolean> => ipcRenderer.invoke("win:is-maximized"),
    onState: (cb: (s: { maximized: boolean }) => void) => on("win:state", cb),
  },
  auth: {
    current: (): Promise<PublicAuth> => ipcRenderer.invoke("auth:current"),
    login: (): Promise<PublicAuth> => ipcRenderer.invoke("auth:login"),
    logout: (): Promise<boolean> => ipcRenderer.invoke("auth:logout"),
  },
  versions: { list: (): Promise<{ latestRelease: string; versions: Array<{ id: string }> }> => ipcRenderer.invoke("versions:list") },
  settings: {
    get: () => ipcRenderer.invoke("settings:get"),
    set: (s: unknown) => ipcRenderer.invoke("settings:set", s),
  },
  mods: {
    catalog: (): Promise<Mod[]> => ipcRenderer.invoke("mods:catalog"),
    sync: (): Promise<{ skipped: boolean; reason?: string; installed?: string[]; upToDate?: string[]; missing?: string[] }> =>
      ipcRenderer.invoke("mods:sync"),
  },
  access: {
    check: (): Promise<{ allowed: boolean; reason?: string }> => ipcRenderer.invoke("access:check"),
  },
  hardware: {
    scan: (): Promise<{
      cpu: string; cores: number; ramGb: number; gpu: string;
      recommend: { memoryMb: number; renderer: "vulkan" | "sodium"; reason: string; optimizedFlags: boolean };
    }> => ipcRenderer.invoke("hardware:scan"),
    apply: (rec: unknown) => ipcRenderer.invoke("hardware:apply", rec),
  },
  packs: {
    catalog: (): Promise<Pack[]> => ipcRenderer.invoke("packs:catalog"),
    installed: (): Promise<string[]> => ipcRenderer.invoke("packs:installed"),
    install: (slug: string) => ipcRenderer.invoke("packs:install", slug),
  },
  importer: {
    fromFolder: (): Promise<{ copied: string[]; skipped: string[] } | null> => ipcRenderer.invoke("import:folder"),
  },
  stats: {
    get: (): Promise<Stats> => ipcRenderer.invoke("stats:get"),
    onUpdate: (cb: (s: Stats) => void) => on("stats:update", cb),
  },
  playtime: {
    get: (): Promise<{
      totalSeconds: number; sessions: number; longestSeconds: number; streak: number; weekSeconds: number;
      graph: { label: string; date: string; seconds: number }[];
    }> => ipcRenderer.invoke("playtime:get"),
  },
  news: {
    list: (): Promise<Array<{ id: string; title: string; body: string | null; created_at: string }>> =>
      ipcRenderer.invoke("news:list"),
  },
  leaderboard: {
    list: (): Promise<Array<{ minecraft_uuid: string; minecraft_name: string; total_seconds: number }>> =>
      ipcRenderer.invoke("leaderboard:list"),
  },
  online: { count: (): Promise<number> => ipcRenderer.invoke("online:count") },
  capes: {
    set: (capeId: string): Promise<{ ok: boolean; error?: string }> => ipcRenderer.invoke("cape:set", capeId),
  },
  imageDataUrl: (url: string): Promise<string | null> => ipcRenderer.invoke("image:dataurl", url),
  saveWrapped: (dataUrl: string): Promise<string | null> => ipcRenderer.invoke("wrapped:save", dataUrl),
  browse: {
    search: (query: string, version?: string): Promise<Array<{ slug: string; title: string; description: string; icon: string | null; downloads: number; author: string }>> =>
      ipcRenderer.invoke("mods:search", query, version),
    install: (slug: string, version?: string): Promise<{ ok: boolean; filename?: string; error?: string }> =>
      ipcRenderer.invoke("mods:install", slug, version),
  },
  gallery: {
    list: (): Promise<Array<{ name: string; path: string; size: number; mtime: number; url: string }>> =>
      ipcRenderer.invoke("gallery:list"),
    delete: (filename: string): Promise<boolean> => ipcRenderer.invoke("gallery:delete", filename),
    reveal: (filename: string) => ipcRenderer.invoke("gallery:reveal", filename),
  },
  worlds: {
    list: (): Promise<Array<{ name: string; path: string; iconUrl: string | null; mtime: number; size: number }>> =>
      ipcRenderer.invoke("worlds:list"),
    delete: (name: string): Promise<boolean> => ipcRenderer.invoke("worlds:delete", name),
    reveal: (name: string) => ipcRenderer.invoke("worlds:reveal", name),
  },
  servers: {
    list: (): Promise<Array<{ id: string; name: string; address: string; port: number }>> => ipcRenderer.invoke("servers:list"),
    add: (name: string, address: string) => ipcRenderer.invoke("servers:add", name, address),
    remove: (id: string) => ipcRenderer.invoke("servers:remove", id),
    ping: (host: string, port: number): Promise<
      | { ok: true; latencyMs: number; motd: string; version: string; players: { online: number; max: number }; favicon: string | null }
      | { ok: false; error: string }
    > => ipcRenderer.invoke("servers:ping", host, port),
  },
  updates: {
    apply: () => ipcRenderer.invoke("update:apply"),
    onEvent: (cb: (e: UpdateEvent) => void) => on("update:event", cb),
  },
  launch: {
    play: () => ipcRenderer.invoke("launch:play"),
    running: (): Promise<boolean> => ipcRenderer.invoke("launch:running"),
    onProgress: (cb: (p: { label: string; done: number; total: number }) => void) => on("launch:progress", cb),
    onExit: (cb: (p: { code: number | null }) => void) => on("launch:exit", cb),
  },
  log: {
    snapshot: (): Promise<string[]> => ipcRenderer.invoke("log:snapshot"),
    clear: (): Promise<boolean> => ipcRenderer.invoke("log:clear"),
    onLine: (cb: (line: string) => void) => on("log:line", cb),
    onCleared: (cb: () => void) => on("log:cleared", cb as any),
  },
  openExternal: (url: string) => ipcRenderer.invoke("open:external", url),
  openFolder: (which: FolderKind) => ipcRenderer.invoke("open:folder", which),
};

contextBridge.exposeInMainWorld("vantic", api);

declare global { interface Window { vantic: typeof api } }
