// Discord Rich Presence for the Vantic launcher.
//
// Uses the app id 1532809916518240406 (registered on the Discord Developer
// Portal for Vantic). The client connects to the local Discord app via IPC,
// so it silently no-ops if Discord isn't running.
//
// eslint-disable-next-line @typescript-eslint/no-var-requires
const RPC = require("discord-rpc");

const CLIENT_ID = "1532809916518240406";
const LARGE_IMAGE = "vantic"; // asset name uploaded on the Discord dev portal
const LARGE_TEXT = "Vantic Launcher";

type State = { text: string; startedAt: number; version?: string };

let client: any = null;
let ready = false;
let enabled = true;
let current: State = { text: "In the launcher", startedAt: Date.now() };

function apply() {
  if (!client || !ready || !enabled) return;
  try {
    const activity: any = {
      details: current.text,
      state: current.version ? `Version ${current.version}` : undefined,
      startTimestamp: current.startedAt,
      largeImageKey: LARGE_IMAGE,
      largeImageText: LARGE_TEXT,
      instance: false,
    };
    client.setActivity(activity).catch(() => undefined);
  } catch {
    /* ignore, Discord may have gone away */
  }
}

function connect() {
  if (client) return;
  try {
    RPC.register(CLIENT_ID);
    client = new RPC.Client({ transport: "ipc" });
    client.on("ready", () => {
      ready = true;
      apply();
    });
    client.login({ clientId: CLIENT_ID }).catch(() => {
      // Discord not running or blocked. Retry in 30s so RPC pops on if the
      // user launches Discord later.
      client = null;
      ready = false;
      setTimeout(connect, 30_000);
    });
  } catch {
    setTimeout(connect, 30_000);
  }
}

export function initRpc(): void {
  connect();
}

export function setEnabled(v: boolean): void {
  enabled = v;
  if (!enabled && client && ready) {
    try {
      client.clearActivity().catch(() => undefined);
    } catch { /* ignore */ }
  } else if (enabled) {
    apply();
  }
}

export function setIdle(): void {
  current = { text: "In the launcher", startedAt: Date.now() };
  apply();
}

export function setPlaying(version: string): void {
  current = { text: "Playing Minecraft", startedAt: Date.now(), version };
  apply();
}
