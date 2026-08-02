import fs from "fs/promises";
import path from "path";
import { root } from "./paths";

export type Server = { id: string; name: string; address: string; port: number };

function file(): string {
  return path.join(root(), "servers.json");
}

export async function loadServers(): Promise<Server[]> {
  try {
    const raw = await fs.readFile(file(), "utf8");
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr;
    return [];
  } catch {
    return [];
  }
}

export async function saveServers(list: Server[]): Promise<void> {
  await fs.writeFile(file(), JSON.stringify(list, null, 2), "utf8");
}

export function parseAddress(input: string): { host: string; port: number } {
  const trimmed = input.trim();
  const colon = trimmed.lastIndexOf(":");
  if (colon > 0 && /^\d+$/.test(trimmed.slice(colon + 1))) {
    return { host: trimmed.slice(0, colon), port: parseInt(trimmed.slice(colon + 1), 10) };
  }
  return { host: trimmed, port: 25565 };
}
