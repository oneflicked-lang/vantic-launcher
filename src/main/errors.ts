// Turn cryptic msmc / mclc / node errors into a sentence the user can act on.
export function humanize(err: unknown): string {
  if (!err) return "Something went wrong.";
  const raw =
    typeof err === "string"
      ? err
      : (err as any).message || (err as any).reason || (err as any).name || String(err);

  const map: Record<string, string> = {
    "error.gui.closed": "You closed the sign in window before finishing.",
    "error.auth.microsoft.userDidNotSignIn": "You did not finish signing in with Microsoft.",
    "error.auth.xsts.child.needsAdult": "That Microsoft account belongs to a child and needs a parent to add it to a Microsoft Family group first.",
    "error.auth.xsts.notFound": "That Microsoft account has no Xbox profile. Sign in once at xbox.com to create one.",
    "error.gui.request": "The sign in window failed to open. Close Vantic and try again.",
    "error.auth.microsoft.noProfile": "That account does not own Minecraft: Java Edition.",
  };
  if (map[raw]) return map[raw];

  if (raw.includes("ENOTFOUND") || raw.includes("EAI_AGAIN"))
    return "You look offline. Check your internet and try again.";
  if (raw.includes("ECONNRESET") || raw.includes("ETIMEDOUT"))
    return "Network connection dropped. Try again.";
  if (raw.startsWith("GET ") && raw.includes(" -> "))
    return "A download failed. Try again in a moment.";
  if (/AADSTS700038|AADSTS7000215|unauthorized_client/i.test(raw))
    return "Microsoft rejected the launcher's app id. Vantic needs an update.";
  if (/No Fabric loader/i.test(raw))
    return `Fabric does not support this Minecraft version yet. Try a different version or launch in Vanilla mode.`;
  return raw;
}
