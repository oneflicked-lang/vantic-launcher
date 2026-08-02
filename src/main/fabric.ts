import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import https from "https";
import { versionsDir } from "./paths";

// Install a Fabric loader version by fetching its "profile JSON" from
// fabricmc.net and dropping it into versions/<id>/<id>.json where
// minecraft-launcher-core knows to find it. Returns the version id string to
// hand back to mclc as `version.custom`.
//
// Old Vantic hardcoded a specific loader version; instead we ask fabricmc.net
// for the latest stable loader for the requested MC version so this keeps
// working forever without updates.

const META = "https://meta.fabricmc.net/v2";

type FabricLoader = { loader: { version: string; stable: boolean } };

function getJson<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "VanticLauncher/0.5" } }, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`GET ${url} -> ${res.statusCode}`));
          return;
        }
        const chunks: Buffer[] = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          try {
            resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")) as T);
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

export async function ensureFabric(mcVersion: string): Promise<string> {
  // 1) Find the latest stable Fabric loader that supports this MC version.
  const loaders = await getJson<FabricLoader[]>(`${META}/versions/loader/${encodeURIComponent(mcVersion)}`);
  const stable = loaders.find((l) => l.loader.stable) || loaders[0];
  if (!stable) throw new Error(`No Fabric loader available for Minecraft ${mcVersion}.`);
  const loaderVersion = stable.loader.version;

  const id = `fabric-loader-${loaderVersion}-${mcVersion}`;
  const dir = path.join(versionsDir(), id);
  const file = path.join(dir, `${id}.json`);
  if (fs.existsSync(file)) return id;

  await fsp.mkdir(dir, { recursive: true });
  const profile = await getJson<any>(
    `${META}/versions/loader/${encodeURIComponent(mcVersion)}/${encodeURIComponent(loaderVersion)}/profile/json`
  );
  await fsp.writeFile(file, JSON.stringify(profile), "utf8");
  return id;
}
