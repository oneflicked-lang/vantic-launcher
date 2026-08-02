import fs from "fs/promises";
import { authFile } from "./paths";
import { humanize } from "./errors";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Auth } = require("msmc");

export type SavedAccount = { refresh: string; name: string; uuid: string };
export type PublicAuth = { username: string; uuid: string } | null;
export type Mclc = {
  access_token: string;
  client_token: string;
  uuid: string;
  name: string;
  user_properties: string;
  meta?: { type: string; xuid?: string; demo?: boolean };
};

let mclcCache: Mclc | null = null;
const authManager = new Auth("select_account");

export function currentMclc(): Mclc | null { return mclcCache; }

async function finish(xbox: any): Promise<PublicAuth> {
  const mc = await xbox.getMinecraft();
  if (!mc || !mc.profile) throw new Error("That Microsoft account doesn't own Minecraft: Java Edition.");
  mclcCache = mc.mclc();
  const saved: SavedAccount = { refresh: xbox.save(), name: mc.profile.name, uuid: mc.profile.id };
  await fs.writeFile(authFile(), JSON.stringify(saved), "utf8");
  return { username: mc.profile.name, uuid: mc.profile.id };
}

// Returns null if the user cancelled, throws only on real errors.
export async function login(): Promise<PublicAuth> {
  try {
    const xbox = await authManager.launch("electron");
    return await finish(xbox);
  } catch (e: any) {
    const raw = (e && (e.message || e.reason || e.name)) || String(e);
    if (raw === "error.gui.closed" || raw === "error.auth.microsoft.userDidNotSignIn") return null;
    throw new Error(humanize(e));
  }
}

export async function resume(): Promise<PublicAuth> {
  const raw = await fs.readFile(authFile(), "utf8").catch(() => null);
  if (!raw) return null;
  let saved: SavedAccount;
  try { saved = JSON.parse(raw); } catch { return null; }
  try {
    const xbox = await authManager.refresh(saved.refresh);
    return await finish(xbox);
  } catch {
    await logout();
    return null;
  }
}

export async function logout(): Promise<void> {
  mclcCache = null;
  try { await fs.unlink(authFile()); } catch {}
}
