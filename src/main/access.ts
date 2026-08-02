// Early access gate. The launcher asks vantic.lol whether the signed-in
// Minecraft account is allowed. Because this checks the real MC UUID, sharing
// the installer does nothing: a different account is still blocked. When early
// access ends, the website flips EARLY_ACCESS off and everyone passes.
const ACCESS_URL = process.env.VANTIC_ACCESS_URL || "https://vantic.lol/api/access";

export type AccessResult = { allowed: boolean; reason?: string };

export async function checkAccess(uuid: string, name: string): Promise<AccessResult> {
  try {
    const url = `${ACCESS_URL}?uuid=${encodeURIComponent(uuid)}&name=${encodeURIComponent(name)}`;
    const res = await fetch(url, { headers: { "User-Agent": "VanticLauncher" } });
    if (!res.ok) return { allowed: false, reason: "Early access check failed. Try again in a moment." };
    const d = (await res.json()) as AccessResult;
    return { allowed: !!d.allowed, reason: d.reason };
  } catch {
    return { allowed: false, reason: "Couldn't reach the Vantic servers. Check your connection and retry." };
  }
}
