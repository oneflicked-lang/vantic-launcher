import path from "path";
import fs from "fs";
import { app } from "electron";

// All Vantic launcher data lives under %APPDATA%\Vantic (Windows).
// Vanilla Minecraft's own layout is preserved inside `minecraft/` so anything
// familiar with a normal .minecraft install can drop in later.
export function root(): string {
  const dir = path.join(app.getPath("appData"), "Vantic");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export const mcDir = () => ensure(path.join(root(), "minecraft"));
export const versionsDir = () => ensure(path.join(mcDir(), "versions"));
export const librariesDir = () => ensure(path.join(mcDir(), "libraries"));
export const assetsDir = () => ensure(path.join(mcDir(), "assets"));
export const nativesDir = (versionId: string) =>
  ensure(path.join(mcDir(), "natives", versionId));
export const jreDir = () => ensure(path.join(root(), "runtime"));
export const authFile = () => path.join(root(), "auth.json");
export const settingsFile = () => path.join(root(), "settings.json");
export const logsDir = () => ensure(path.join(root(), "logs"));

function ensure(p: string) {
  fs.mkdirSync(p, { recursive: true });
  return p;
}
