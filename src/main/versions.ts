import https from "https";

// Small helper to fetch Mojang's public version manifest so the launcher can
// show a version picker. mclc does its own downloading once we hand it a
// version id, so this is UI only.
const MANIFEST_URL = "https://piston-meta.mojang.com/mc/game/version_manifest_v2.json";

export type ManifestVersion = { id: string; type: string; releaseTime: string };
export type Manifest = { latest: { release: string }; versions: ManifestVersion[] };

let cache: Manifest | null = null;

export async function getManifest(): Promise<Manifest> {
  if (cache) return cache;
  const buf = await new Promise<Buffer>((resolve, reject) => {
    https
      .get(MANIFEST_URL, { headers: { "User-Agent": "VanticLauncher/0.2" } }, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Manifest fetch failed: ${res.statusCode}`));
          return;
        }
        const chunks: Buffer[] = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
        res.on("error", reject);
      })
      .on("error", reject);
  });
  cache = JSON.parse(buf.toString("utf8")) as Manifest;
  return cache;
}
