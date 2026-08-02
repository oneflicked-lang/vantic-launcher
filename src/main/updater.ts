import { BrowserWindow } from "electron";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { autoUpdater } = require("electron-updater");

// Wires electron-updater with a manual UX: the launcher checks on startup
// and every hour, downloads in the background, and posts a message to the
// renderer once the update is ready. The renderer shows a "Restart" button
// which calls back into `applyUpdate` below.
//
// Requires the app to have a `publish` config in package.json (GitHub
// releases work out of the box). If publish isn't configured, updates will
// simply never resolve and no banner will show.

export type UpdateEvent =
  | { type: "checking" }
  | { type: "none" }
  | { type: "available"; version: string }
  | { type: "downloading"; percent: number }
  | { type: "ready"; version: string }
  | { type: "error"; message: string };

export function initUpdater(getWin: () => BrowserWindow | null): void {
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.logger = null;

  const send = (e: UpdateEvent) => {
    const w = getWin();
    if (w) w.webContents.send("update:event", e);
  };

  autoUpdater.on("checking-for-update", () => send({ type: "checking" }));
  autoUpdater.on("update-not-available", () => send({ type: "none" }));
  autoUpdater.on("update-available", (info: any) => send({ type: "available", version: info?.version || "" }));
  autoUpdater.on("download-progress", (p: any) => send({ type: "downloading", percent: Math.round(p?.percent || 0) }));
  autoUpdater.on("update-downloaded", (info: any) => send({ type: "ready", version: info?.version || "" }));
  autoUpdater.on("error", (e: any) => send({ type: "error", message: (e && e.message) || String(e) }));

  const kick = () => autoUpdater.checkForUpdates().catch(() => undefined);
  setTimeout(kick, 2000);
  setInterval(kick, 60 * 60 * 1000);
}

export function applyUpdate(): void {
  try {
    autoUpdater.quitAndInstall(false, true);
  } catch {
    /* nothing to install */
  }
}
