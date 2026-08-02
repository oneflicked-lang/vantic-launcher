// Talks to vantic.lol for the news feed and the global playtime leaderboard.
// Runs in the main process so there are no browser CORS limits.
const BASE = process.env.VANTIC_API_BASE || "https://vantic.lol";

export type NewsItem = { id: string; title: string; body: string | null; created_at: string };
export type LeaderPlayer = { minecraft_uuid: string; minecraft_name: string; total_seconds: number };

export async function fetchNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch(`${BASE}/api/news`, { headers: { "User-Agent": "VanticLauncher" } });
    if (!res.ok) return [];
    return (await res.json()).news || [];
  } catch {
    return [];
  }
}

export async function fetchLeaderboard(): Promise<LeaderPlayer[]> {
  try {
    const res = await fetch(`${BASE}/api/leaderboard`, { headers: { "User-Agent": "VanticLauncher" } });
    if (!res.ok) return [];
    return (await res.json()).players || [];
  } catch {
    return [];
  }
}

export async function uploadPlaytime(uuid: string, name: string, totalSeconds: number): Promise<void> {
  try {
    await fetch(`${BASE}/api/leaderboard`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": "VanticLauncher" },
      body: JSON.stringify({ uuid, name, totalSeconds }),
    });
  } catch {
    /* offline, ignore */
  }
}
