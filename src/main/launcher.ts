import { EventEmitter } from "events";
import { mcDir } from "./paths";
import type { Mclc } from "./auth";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Client } = require("minecraft-launcher-core");

// minecraft-launcher-core (mclc) handles everything: downloads the version
// json, client jar, libraries, natives, asset index, and every asset; extracts
// natives; builds the JVM command line; and spawns java. We just hand it the
// auth object from msmc, a version id, and a settings blob.
//
// For Fabric launches, we pass `version.custom` = the fabric loader version
// id (e.g. "fabric-loader-0.16.9-1.21.11"). mclc reads the JSON we already
// wrote to versions/<id>/<id>.json in `ensureFabric` and merges it with the
// vanilla version manifest.

export type LaunchOptions = {
  auth: Mclc;
  versionNumber: string;    // e.g. "1.21.11"
  memoryMb: number;
  customVersion?: string;   // e.g. "fabric-loader-0.16.9-1.21.11" for Fabric
  jvmArgs?: string[];       // extra JVM flags (Aikar's), passed to mclc customArgs
};

export type LaunchEvents = {
  progress: (label: string, done: number, total: number) => void;
  log: (line: string) => void;
  exit: (code: number | null) => void;
};

export function launch(opts: LaunchOptions, on: Partial<LaunchEvents> = {}): EventEmitter {
  const launcher = new Client();

  launcher.on("progress", (p: { type: string; task: number; total: number }) => {
    on.progress?.(p.type, p.task, p.total);
  });
  launcher.on("data", (chunk: unknown) => {
    const text = typeof chunk === "string" ? chunk : String(chunk);
    for (const line of text.split(/\r?\n/)) {
      if (line.length > 0) on.log?.(line);
    }
  });
  launcher.on("debug", (line: string) => {
    on.log?.(`[launcher] ${line}`);
  });
  launcher.on("close", (code: number | null) => {
    on.exit?.(code);
  });

  const version: any = {
    number: opts.versionNumber,
    type: "release",
  };
  if (opts.customVersion) version.custom = opts.customVersion;

  launcher.launch({
    authorization: opts.auth,
    root: mcDir(),
    version,
    memory: {
      max: `${opts.memoryMb}M`,
      min: `${Math.min(opts.memoryMb, 1024)}M`,
    },
    customArgs: opts.jvmArgs && opts.jvmArgs.length ? opts.jvmArgs : undefined,
    overrides: { maxSockets: 16 },
  });

  return launcher;
}
