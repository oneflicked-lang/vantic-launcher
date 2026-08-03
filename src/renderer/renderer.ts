type Auth = { username: string; uuid: string } | null;
type Route = "home" | "profile" | "leaderboard" | "news" | "mods" | "browse" | "packs" | "worlds" | "capes" | "gallery" | "themes" | "discord" | "console" | "settings" | "help" | "servers";
type Shot = { name: string; path: string; size: number; mtime: number; url: string };
type World = { name: string; path: string; iconUrl: string | null; mtime: number; size: number };
type Server = { id: string; name: string; address: string; port: number };
type FolderKind = "mods" | "resourcepacks" | "screenshots" | "saves" | "root";
type Mod = { slug: string; name: string; blurb: string; category: string; defaultOn: boolean; forced?: boolean };
type Pack = { slug: string; name: string; blurb: string; tag: string };
type Stats = { launchCount: number; lastLaunched: number | null; lastVersion: string | null; lastMode: "vanilla" | "optimized" | null };

const LOGO_URL = "../../assets/vanticnobg.png";

const I = {
  play: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="8,5 8,19 20,12"/></svg>`,
  stop: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>`,
  home: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/></svg>`,
  mods: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 8 9 5 9-5"/><path d="M3 8v8l9 5 9-5V8"/></svg>`,
  packs: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>`,
  console: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3"/><path d="M13 15h4"/></svg>`,
  settings: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.5-2.4 1a7 7 0 0 0-2.1-1.2L14 3h-4l-.4 2.5a7 7 0 0 0-2.1 1.2l-2.4-1-2 3.5 2 1.6A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.5 2.4-1a7 7 0 0 0 2.1 1.2L10 21h4l.4-2.5a7 7 0 0 0 2.1-1.2l2.4 1 2-3.5-2-1.6c.1-.4.1-.8.1-1.2z"/></svg>`,
  copy: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>`,
  clear: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M6 6v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6"/></svg>`,
  folder: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`,
  pkg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 8 9 5 9-5"/><path d="M3 8v8l9 5 9-5V8"/></svg>`,
  img: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>`,
  caret: `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 4 3 3 3-3"/></svg>`,
  download: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 19h16"/></svg>`,
  search: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>`,
  gallery: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>`,
  trash: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M6 6v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6"/></svg>`,
  reveal: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`,
  close: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
  world: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18"/><path d="M12 3a15 15 0 0 0 0 18"/></svg>`,
  server: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="2"/><rect x="3" y="14" width="18" height="6" rx="2"/><circle cx="7" cy="7" r="0.6" fill="currentColor"/><circle cx="7" cy="17" r="0.6" fill="currentColor"/></svg>`,
  plus: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
  chip: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/></svg>`,
  spark: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8z"/></svg>`,
  profile: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>`,
  fire: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2s5 4 5 9a5 5 0 0 1-10 0c0-2 1-3 1-3s0 2 2 2c1 0 1-1 1-2 0-3 1-5 1-5z"/></svg>`,
  clock: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
  lock: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>`,
  trophy: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3"/></svg>`,
  news: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h13v14H5a2 2 0 0 1-2-2V6"/><path d="M17 8h3v9a2 2 0 0 1-2 2M7 8h6M7 12h6M7 16h4"/></svg>`,
  palette: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="8.5" cy="10" r="1.2" fill="currentColor"/><circle cx="12" cy="8" r="1.2" fill="currentColor"/><circle cx="15.5" cy="10" r="1.2" fill="currentColor"/><path d="M12 21a3 3 0 0 1 0-6 2 2 0 0 0 2-2"/></svg>`,
  shirt: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3l4 3 4-3 5 4-3 3-2-1v11H8V9L6 10 3 7z"/></svg>`,
  discord: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.3 5.3A17 17 0 0 0 15 4l-.2.4a15.6 15.6 0 0 0-5.6 0L9 4a17 17 0 0 0-4.3 1.3C2.2 9 1.5 12.6 1.9 16.1a17.4 17.4 0 0 0 5.3 2.7l1-1.6a11 11 0 0 1-1.8-.9l.5-.4a12 12 0 0 0 10.4 0l.4.4c-.5.4-1.1.7-1.7.9l1 1.6a17.4 17.4 0 0 0 5.3-2.7c.5-4.1-.5-7.6-2.9-10.8zM9 14.3c-1 0-1.9-1-1.9-2.2s.9-2.2 1.9-2.2 1.9 1 1.9 2.2-.9 2.2-1.9 2.2zm6 0c-1 0-1.9-1-1.9-2.2s.9-2.2 1.9-2.2 1.9 1 1.9 2.2-.9 2.2-1.9 2.2z"/></svg>`,
  help: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 4.5 1.5c0 1.5-2 2-2 3"/><circle cx="12" cy="17" r="0.6" fill="currentColor"/></svg>`,
};

let modQuery = "";
let packQuery = "";

let me: Auth = null;
let running = false;
let accessAllowed = true;
let accessReason = "";
let route: Route = "home";
let modsCatalog: Mod[] = [];
let packsCatalog: Pack[] = [];
let packsInstalled = new Set<string>();
let stats: Stats = { launchCount: 0, lastLaunched: null, lastVersion: null, lastMode: null };
let logLines: string[] = [];
const LOG_CAP = 5000;
let consoleEl: HTMLDivElement | null = null;

function uuidDashes(id: string): string {
  if (id.length !== 32) return id;
  return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`;
}
// mc-heads.net is more reliable than crafatar (which has frequent outages).
const head = (u: string, s: number) => `https://mc-heads.net/avatar/${uuidDashes(u)}/${s}`;
const body = (u: string) => `https://mc-heads.net/body/${uuidDashes(u)}`;

async function boot() {
  wireTitlebar();
  wireGlobal();
  wireLog();
  wireStats();
  wireUpdates();
  me = await window.vantic.auth.current();
  running = await window.vantic.launch.running();
  const [c, p, ip, s] = await Promise.all([
    window.vantic.mods.catalog(),
    window.vantic.packs.catalog(),
    window.vantic.packs.installed(),
    window.vantic.stats.get(),
  ]);
  modsCatalog = c;
  packsCatalog = p;
  packsInstalled = new Set(ip);
  stats = s;
  const settings0 = await window.vantic.settings.get();
  applyTheme(settings0.accent, settings0.accentInk);
  if (me) await refreshAccess();
  applyAuthMode();
  renderAcct();
  navigate("home");
}
boot();

let rainbowTimer: number | null = null;
function applyTheme(accent: string, ink: string) {
  const root = document.documentElement;
  if (rainbowTimer !== null) { clearInterval(rainbowTimer); rainbowTimer = null; }
  if (accent === "rainbow") {
    root.style.setProperty("--accent-ink", "#0a0a0b");
    let hue = 0;
    const tick = () => { hue = (hue + 2) % 360; root.style.setProperty("--accent", `hsl(${hue}, 90%, 62%)`); };
    tick();
    rainbowTimer = window.setInterval(tick, 60);
    return;
  }
  root.style.setProperty("--accent", accent || "#ffffff");
  root.style.setProperty("--accent-ink", ink || "#0a0a0b");
}

// Lightweight confetti burst, no dependencies.
function confetti() {
  const c = document.createElement("canvas");
  c.className = "confetti_layer";
  document.body.appendChild(c);
  const ctx = c.getContext("2d")!;
  const resize = () => { c.width = innerWidth; c.height = innerHeight; };
  resize();
  const colors = ["#ff5c5c", "#5b8cff", "#46dd8b", "#ffd24a", "#ff6bd6", "#4bd6e6", "#ffffff"];
  const parts = Array.from({ length: 160 }, () => ({
    x: innerWidth / 2, y: innerHeight / 3,
    vx: (Math.random() - 0.5) * 16, vy: Math.random() * -14 - 4,
    s: Math.random() * 6 + 3, c: colors[(Math.random() * colors.length) | 0],
    rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
  }));
  let frame = 0;
  const draw = () => {
    frame++;
    ctx.clearRect(0, 0, c.width, c.height);
    for (const p of parts) {
      p.vy += 0.5; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 1.6); ctx.restore();
    }
    if (frame < 140) requestAnimationFrame(draw);
    else c.remove();
  };
  draw();
}

const THEMES: { name: string; accent: string; ink: string }[] = [
  { name: "White", accent: "#ffffff", ink: "#0a0a0b" },
  { name: "Red", accent: "#ff5c5c", ink: "#0a0a0b" },
  { name: "Blue", accent: "#5b8cff", ink: "#0a0a0b" },
  { name: "Green", accent: "#46dd8b", ink: "#0a0a0b" },
  { name: "Purple", accent: "#a06bff", ink: "#0a0a0b" },
  { name: "Orange", accent: "#ff9f45", ink: "#0a0a0b" },
  { name: "Pink", accent: "#ff6bd6", ink: "#0a0a0b" },
  { name: "Cyan", accent: "#4bd6e6", ink: "#0a0a0b" },
  { name: "Gold", accent: "#ffd24a", ink: "#0a0a0b" },
  { name: "Lime", accent: "#c6ff5c", ink: "#0a0a0b" },
  { name: "Rainbow", accent: "rainbow", ink: "#0a0a0b" },
];

async function refreshAccess() {
  const a = await window.vantic.access.check();
  accessAllowed = a.allowed;
  accessReason = a.reason || "";
}

function applyAuthMode() {
  document.body.classList.toggle("logged-out", !me);
  document.body.classList.toggle("locked", !!me && !accessAllowed);
  renderSidebar();
}

function wireTitlebar() {
  document.getElementById("wc_min")!.addEventListener("click", () => window.vantic.win.minimize());
  document.getElementById("wc_max")!.addEventListener("click", () => window.vantic.win.maximizeToggle());
  document.getElementById("wc_close")!.addEventListener("click", () => window.vantic.win.close());
  const ico = document.getElementById("wc_max_ico");
  const paint = (m: boolean) => { if (!ico) return; ico.innerHTML = m
    ? '<rect x="1.5" y="3.5" width="6" height="6" fill="none" stroke="currentColor" stroke-width="1"/><rect x="3.5" y="1.5" width="6" height="6" fill="none" stroke="currentColor" stroke-width="1"/>'
    : '<rect x="0.5" y="0.5" width="9" height="9" fill="none" stroke="currentColor" stroke-width="1"/>'; };
  window.vantic.win.isMaximized().then(paint);
  window.vantic.win.onState((s) => paint(s.maximized));
}

function wireGlobal() {
  document.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const a = t.closest("[data-ext]") as HTMLElement | null;
    if (a) { e.preventDefault(); const u = a.getAttribute("data-ext"); if (u) window.vantic.openExternal(u); }
    document.querySelectorAll(".dd.open").forEach((el) => { if (!el.contains(t)) el.classList.remove("open"); });
  });

  // Global keyboard shortcuts. Ctrl+digit switches tabs, Ctrl+P plays.
  const routes: Route[] = ["home", "profile", "leaderboard", "mods", "packs", "worlds", "capes", "servers", "gallery", "themes"];
  document.addEventListener("keydown", (e) => {
    if (!me) return;
    const tag = (e.target as HTMLElement)?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (!e.ctrlKey && !e.metaKey) return;
    if (/^[1-9]$/.test(e.key)) {
      const i = parseInt(e.key, 10) - 1;
      if (routes[i]) { e.preventDefault(); navigate(routes[i]); }
    } else if (e.key.toLowerCase() === "p") {
      e.preventDefault();
      const play = document.getElementById("play_btn") as HTMLButtonElement | null;
      if (play && !play.disabled) play.click();
      else navigate("home");
    }
  });
}

function wireLog() {
  window.vantic.log.snapshot().then((initial) => {
    logLines = initial.slice(-LOG_CAP);
    if (consoleEl) hydrateConsole();
  });
  window.vantic.log.onLine((line) => {
    logLines.push(line);
    if (logLines.length > LOG_CAP) logLines.splice(0, logLines.length - LOG_CAP);
    if (consoleEl && route === "console") appendConsole(line);
  });
  window.vantic.log.onCleared(() => { logLines = []; if (consoleEl) consoleEl.innerHTML = ""; });
  window.vantic.launch.onExit(() => {
    running = false;
    renderSidebar();
    if (route === "home") renderHome();
    if (route === "console") paintConsoleStatus();
  });
}

function wireStats() {
  window.vantic.stats.onUpdate((s) => { stats = s; if (route === "home") renderHome(); });
}

function wireUpdates() {
  const bar = document.getElementById("update_banner")!;
  const show = (html: string, actions: string) => {
    bar.classList.add("on");
    bar.innerHTML = `<span class="txt">${html}</span><span class="actions">${actions}</span>`;
    const restart = bar.querySelector("#update_restart");
    if (restart) restart.addEventListener("click", () => window.vantic.updates.apply());
    const dismiss = bar.querySelector("#update_dismiss");
    if (dismiss) dismiss.addEventListener("click", () => bar.classList.remove("on"));
  };
  window.vantic.updates.onEvent((e) => {
    if (e.type === "available") show(`<b>Vantic ${escape(e.version)}</b> is downloading in the background.`, `<button class="btn ghost small" id="update_dismiss">Later</button>`);
    else if (e.type === "downloading") show(`Downloading update, ${e.percent}%.`, `<button class="btn ghost small" id="update_dismiss">Hide</button>`);
    else if (e.type === "ready") show(`<b>Vantic is up to date.</b> Restart to apply the new version.`, `<button class="btn small" id="update_restart">Restart now</button><button class="btn ghost small" id="update_dismiss">Later</button>`);
  });
}

function renderAcct() {
  const acct = document.getElementById("acct")!;
  if (!me) { acct.innerHTML = ""; return; }
  acct.innerHTML = `
    <img class="head_avatar" src="${escape(head(me.uuid, 24))}" alt="" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'avatar',innerHTML:'<img src=\\'${LOGO_URL}\\' alt=\\'\\'>'}))" />
    <span>${escape(me.username)}</span>
    <button class="logout" id="logout_btn">Log out</button>
  `;
  document.getElementById("logout_btn")!.addEventListener("click", async () => {
    await window.vantic.auth.logout();
    me = null;
    applyAuthMode();
    renderAcct();
    navigate("home");
  });
}

function renderSidebar() {
  const sidebar = document.getElementById("sidebar")!;
  if (!me || !accessAllowed) { sidebar.innerHTML = ""; return; }
  const sections: { title: string; tabs: { id: Route; label: string; icon: string }[] }[] = [
    { title: "Play", tabs: [
      { id: "home", label: "Home", icon: I.home },
      { id: "profile", label: "Profile", icon: I.profile },
      { id: "leaderboard", label: "Leaderboard", icon: I.trophy },
    ]},
    { title: "Library", tabs: [
      { id: "mods", label: "Mods", icon: I.mods },
      { id: "browse", label: "Browse Mods", icon: I.search },
      { id: "packs", label: "Resource Packs", icon: I.packs },
      { id: "worlds", label: "Worlds", icon: I.world },
      { id: "capes", label: "Capes", icon: I.shirt },
      { id: "gallery", label: "Gallery", icon: I.gallery },
    ]},
    { title: "Community", tabs: [
      { id: "news", label: "News", icon: I.news },
      { id: "servers", label: "Servers", icon: I.server },
      { id: "discord", label: "Discord", icon: I.discord },
    ]},
    { title: "Launcher", tabs: [
      { id: "themes", label: "Themes", icon: I.palette },
      { id: "console", label: "Console", icon: I.console },
      { id: "settings", label: "Settings", icon: I.settings },
      { id: "help", label: "Help", icon: I.help },
    ]},
  ];
  sidebar.innerHTML = sections
    .map((sec) => `
      <div class="side_section">${sec.title}</div>
      ${sec.tabs.map((t) => `
        <div class="tab ${t.id === route ? "active" : ""} ${running && t.id === "home" ? "playing" : ""}" data-route="${t.id}">
          ${t.icon}<span class="label">${t.label}</span><span class="dot"></span>
        </div>`).join("")}`)
    .join("");
  sidebar.querySelectorAll<HTMLElement>(".tab").forEach((el) => el.addEventListener("click", () => navigate(el.dataset.route as Route)));
}

function navigate(r: Route) {
  route = r;
  renderSidebar();
  const main = document.getElementById("app")!;
  main.style.animation = "none"; main.offsetHeight; main.style.animation = "";
  if (!me) return renderLogin();
  if (!accessAllowed) return renderLocked();
  if (r === "home") renderHome();
  else if (r === "profile") renderProfile();
  else if (r === "leaderboard") renderLeaderboard();
  else if (r === "news") renderNewsPage();
  else if (r === "mods") renderMods();
  else if (r === "browse") renderBrowse();
  else if (r === "packs") renderPacks();
  else if (r === "worlds") renderWorlds();
  else if (r === "capes") renderCapes();
  else if (r === "servers") renderServers();
  else if (r === "gallery") renderGallery();
  else if (r === "themes") renderThemes();
  else if (r === "discord") renderDiscord();
  else if (r === "console") renderConsole();
  else if (r === "settings") renderSettings();
  else if (r === "help") renderHelp();
}

function buildDropdown(opts: { label: string; value: string; options: { value: string; label: string; tag?: string }[]; onChange: (v: string) => void }): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "dd";
  const current = opts.options.find((o) => o.value === opts.value);
  wrap.innerHTML = `
    <span class="dd_label">${escape(opts.label)}</span>
    <div class="dd_value">
      <span class="dd_current">${escape(current ? current.label : opts.value)}</span>
      <span class="caret">${I.caret}</span>
    </div>`;
  wrap.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).closest(".dd_menu")) return;
    if (wrap.classList.contains("open")) { wrap.classList.remove("open"); wrap.querySelector(".dd_menu")?.remove(); return; }
    document.querySelectorAll(".dd.open").forEach((el) => { el.classList.remove("open"); el.querySelector(".dd_menu")?.remove(); });
    wrap.classList.add("open");
    const menu = document.createElement("div");
    menu.className = "dd_menu";
    menu.innerHTML = opts.options.map((o) => `
      <div class="dd_item ${o.value === opts.value ? "selected" : ""}" data-v="${escape(o.value)}">
        <span>${escape(o.label)}</span>${o.tag ? `<span class="tag">${escape(o.tag)}</span>` : ""}
      </div>`).join("");
    wrap.appendChild(menu);
    menu.querySelectorAll<HTMLElement>(".dd_item").forEach((el) => el.addEventListener("click", () => {
      const v = el.dataset.v!;
      opts.value = v;
      const sel = opts.options.find((o) => o.value === v);
      wrap.querySelector(".dd_current")!.textContent = sel ? sel.label : v;
      wrap.classList.remove("open");
      menu.remove();
      opts.onChange(v);
    }));
  });
  return wrap;
}

async function renderHome() {
  const app = document.getElementById("app")!;
  const [{ latestRelease, versions }, settings] = await Promise.all([window.vantic.versions.list(), window.vantic.settings.get()]);
  const currentVer = settings.versionId || "1.21.11";
  const optimized = settings.launchMode === "optimized";
  const hasSelected = versions.some((v) => v.id === currentVer);
  const bodyImg = me ? `<img class="body" src="${escape(body(me.uuid))}" alt="" onerror="this.classList.remove('body');this.classList.add('logo_fallback');this.src='${LOGO_URL}'" />` : `<img class="logo_fallback" src="${LOGO_URL}" alt="" />`;
  const lastPlayed = stats.lastLaunched ? relative(stats.lastLaunched) : "never";

  app.innerHTML = `
    <div class="hero">
      <div class="skin_col">${bodyImg}</div>
      <div class="info">
        <div class="greet">
          <h2>Welcome back, ${escape(me!.username)}</h2>
          <span class="sub">Latest release ${escape(latestRelease)}</span>
        </div>
        <div class="online_pill" id="online_pill"><span class="live_dot"></span><span id="online_txt">Checking who's online...</span></div>
        <div class="mode_pill ${optimized ? "" : "vanilla"}">${optimized ? "Optimized" : "Vanilla"}</div>
        <div class="stats_row">
          <div class="stat"><b>${stats.launchCount}</b><span>Launches</span></div>
          <div class="stat"><b>${escape(stats.lastVersion || currentVer)}</b><span>Last version</span></div>
          <div class="stat"><b>${escape(String(settings.enabledMods.length))}</b><span>Mods enabled</span></div>
        </div>
      </div>
    </div>

    <div class="mode_row">
      <div class="mode_card ${optimized ? "on" : ""}" data-mode="optimized">
        <b>Vantic Optimized</b>
        <span>Fabric + VulkanMod + performance stack. Big FPS gains.</span>
      </div>
      <div class="mode_card ${optimized ? "" : "on"}" data-mode="vanilla">
        <b>Vanilla</b>
        <span>Plain Minecraft, no mods. Works on every server.</span>
      </div>
    </div>

    <div class="two_col" id="launch_row"></div>

    <div class="progress" id="prog">
      <div class="label"><span id="prog_label">Preparing...</span><span id="prog_pct"></span></div>
      <div class="bar"><div class="fill" id="prog_fill"></div></div>
    </div>
    <div id="play_err"></div>

    <div class="optimize" id="optimize">
      <div class="opt_head">
        <span class="opt_ic">${I.chip}</span>
        <div class="opt_txt">
          <b>Optimize for your PC</b>
          <span>Vantic scans your hardware and tunes RAM, renderer, and JVM flags for your exact machine.</span>
        </div>
        <button class="btn small" id="scan_btn">${I.spark}<span>Scan my PC</span></button>
      </div>
      <div id="opt_result"></div>
    </div>

    <div style="height: 8px"></div>
    <div class="page-head" style="margin-bottom: 8px">
      <div class="sub">Last played ${escape(lastPlayed)}</div>
    </div>

    <div class="folder_row">
      <button class="folder_btn" data-folder="mods"><span class="fi">${I.pkg}</span><span class="ftxt"><b>Mods folder</b><span>Drop .jar files here</span></span></button>
      <button class="folder_btn" data-folder="resourcepacks"><span class="fi">${I.img}</span><span class="ftxt"><b>Resource packs</b><span>Drop .zip packs here</span></span></button>
      <button class="folder_btn" data-folder="screenshots"><span class="fi">${I.folder}</span><span class="ftxt"><b>Screenshots</b><span>Open the folder</span></span></button>
      <button class="folder_btn" data-folder="saves"><span class="fi">${I.folder}</span><span class="ftxt"><b>Worlds</b><span>Your saves folder</span></span></button>
    </div>

    <div class="news_wrap" id="news_wrap"></div>
  `;

  const versionOptions = [
    ...(hasSelected ? [] : [{ value: currentVer, label: `${currentVer} (custom)`, tag: "custom" }]),
    ...versions.map((v) => ({ value: v.id, label: v.id, tag: v.id === latestRelease ? "latest" : "" })),
  ];
  const dd = buildDropdown({
    label: "Minecraft version", value: currentVer, options: versionOptions,
    onChange: async (v) => {
      const cur = await window.vantic.settings.get();
      await window.vantic.settings.set({ ...cur, versionId: v });
      // Re-sync the mod set to builds for the newly selected version so the
      // mods folder always matches what will launch. No-op in vanilla / running.
      if (cur.launchMode === "optimized" && !running) {
        const prog = document.getElementById("prog") as HTMLDivElement | null;
        const label = document.getElementById("prog_label");
        const pct = document.getElementById("prog_pct");
        const fill = document.getElementById("prog_fill") as HTMLDivElement | null;
        if (prog && label && fill) {
          prog.classList.add("on");
          label.textContent = `Updating mods for ${v}`;
          if (pct) pct.textContent = "";
          fill.style.width = "0%";
        }
        try {
          await window.vantic.mods.sync();
          if (prog && label && fill) {
            label.textContent = `Mods ready for ${v}`;
            fill.style.width = "100%";
            setTimeout(() => { if (route === "home") prog.classList.remove("on"); }, 1200);
          }
        } catch {
          if (prog) prog.classList.remove("on");
        }
      }
    },
  });
  const playBtn = document.createElement("button");
  playBtn.className = "btn lg play_btn" + (running ? " stop" : "");
  playBtn.id = "play_btn";
  playBtn.innerHTML = running ? `${I.stop}<span>Playing</span>` : `${I.play}<span>Play</span>`;
  playBtn.disabled = running;
  const row = document.getElementById("launch_row")!;
  row.appendChild(dd); row.appendChild(playBtn);

  app.querySelectorAll<HTMLElement>(".mode_card").forEach((el) => el.addEventListener("click", async () => {
    if (running) return;
    const mode = el.dataset.mode as "vanilla" | "optimized";
    const cur = await window.vantic.settings.get();
    await window.vantic.settings.set({ ...cur, launchMode: mode });
    renderHome();
  }));

  const prog = document.getElementById("prog") as HTMLDivElement;
  const label = document.getElementById("prog_label")!;
  const pct = document.getElementById("prog_pct")!;
  const fill = document.getElementById("prog_fill") as HTMLDivElement;
  const errEl = document.getElementById("play_err")!;

  window.vantic.launch.onProgress(({ label: l, done, total }) => {
    if (route !== "home") return;
    prog.classList.add("on");
    label.textContent = l;
    const p = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
    pct.textContent = total > 1 ? `${p}%` : "";
    fill.style.width = `${p}%`;
  });

  playBtn.addEventListener("click", async () => {
    if (running) return;
    errEl.innerHTML = "";
    playBtn.disabled = true;
    prog.classList.add("on");
    fill.style.width = "0%";
    label.textContent = "Preparing...";
    pct.textContent = "";
    try {
      await window.vantic.launch.play();
      running = true;
      renderSidebar();
      playBtn.classList.add("stop");
      playBtn.innerHTML = `${I.stop}<span>Playing</span>`;
      playBtn.disabled = true;
    } catch (e: any) {
      playBtn.disabled = false;
      errEl.innerHTML = `<div class="err">${escape(String(e?.message || e))}</div>`;
    }
  });

  app.querySelectorAll<HTMLElement>(".folder_btn").forEach((btn) =>
    btn.addEventListener("click", () => window.vantic.openFolder(btn.dataset.folder as FolderKind)));

  window.vantic.online.count().then((n) => {
    const txt = document.getElementById("online_txt");
    if (txt) txt.textContent = n > 0 ? `${n.toLocaleString()} playing right now` : "Be the first online today";
  });

  window.vantic.news.list().then((items) => {
    const wrap = document.getElementById("news_wrap");
    if (!wrap || items.length === 0) return;
    const when = (iso: string) => relative(new Date(iso).getTime());
    wrap.innerHTML = `
      <div class="graph_head" style="margin-top:20px"><b>${I.news} What's new</b></div>
      ${items.slice(0, 3).map((n) => `
        <div class="news_item">
          <div class="news_top"><b>${escape(n.title)}</b><span>${escape(when(n.created_at))}</span></div>
          ${n.body ? `<p>${escape(n.body)}</p>` : ""}
        </div>`).join("")}`;
  });

  const scanBtn = document.getElementById("scan_btn") as HTMLButtonElement;
  const optResult = document.getElementById("opt_result")!;
  scanBtn.addEventListener("click", async () => {
    scanBtn.disabled = true;
    scanBtn.innerHTML = `<span>Scanning...</span>`;
    optResult.innerHTML = "";
    try {
      const hw = await window.vantic.hardware.scan();
      const r = hw.recommend;
      optResult.innerHTML = `
        <div class="specs">
          <div class="spec"><span>CPU</span><b>${escape(hw.cpu)}</b></div>
          <div class="spec"><span>GPU</span><b>${escape(hw.gpu)}</b></div>
          <div class="spec"><span>Cores</span><b>${hw.cores}</b></div>
          <div class="spec"><span>RAM</span><b>${hw.ramGb} GB</b></div>
        </div>
        <div class="reco">
          <div class="reco_line"><b>Recommended</b>
            <span>${(r.memoryMb / 1024).toFixed(0)} GB RAM · ${r.renderer === "vulkan" ? "VulkanMod" : "Sodium"} · optimized JVM flags</span>
          </div>
          <div class="reco_reason">${escape(r.reason)}</div>
          <button class="btn" id="apply_reco">${I.spark}<span>Apply recommended settings</span></button>
        </div>`;
      document.getElementById("apply_reco")!.addEventListener("click", async () => {
        const btn = document.getElementById("apply_reco") as HTMLButtonElement;
        btn.disabled = true;
        btn.innerHTML = `<span>Applied</span>`;
        await window.vantic.hardware.apply(r);
        optResult.insertAdjacentHTML("beforeend", `<div class="ok" style="margin-top:10px">Settings tuned for your PC. Hit Play.</div>`);
      });
    } catch (e: any) {
      optResult.innerHTML = `<div class="err">${escape(String(e?.message || e))}</div>`;
    } finally {
      scanBtn.disabled = false;
      scanBtn.innerHTML = `${I.spark}<span>Scan my PC</span>`;
    }
  });
}

function renderLogin() {
  const app = document.getElementById("app")!;
  app.innerHTML = `
    <div class="card login">
      <img src="${LOGO_URL}" class="big_logo" alt="" />
      <h1>Sign in with Microsoft</h1>
      <p class="muted">Vantic uses your legitimate Minecraft account. Nothing to install, no fees, no cosmetics store. Sign in and hit Play.</p>
      <button class="btn lg wide" id="login_btn">Sign in with Microsoft</button>
      <div id="err"></div>
    </div>`;
  document.getElementById("login_btn")!.addEventListener("click", async () => {
    const btn = document.getElementById("login_btn") as HTMLButtonElement;
    const errEl = document.getElementById("err")!;
    btn.disabled = true;
    btn.textContent = "Opening Microsoft sign in...";
    errEl.innerHTML = "";
    try {
      const r = await window.vantic.auth.login();
      if (r) {
        me = r;
        await refreshAccess();
        applyAuthMode();
        renderAcct();
        navigate("home");
      } else {
        btn.disabled = false;
        btn.textContent = "Sign in with Microsoft";
        errEl.innerHTML = `<div class="err">You closed the sign in window before finishing.</div>`;
      }
    } catch (e: any) {
      btn.disabled = false;
      btn.textContent = "Sign in with Microsoft";
      errEl.innerHTML = `<div class="err">${escape(String(e?.message || e))}</div>`;
    }
  });
}

function renderLocked() {
  const app = document.getElementById("app")!;
  app.innerHTML = `
    <div class="card login">
      <img src="${LOGO_URL}" class="big_logo" alt="" />
      <h1>Early access only</h1>
      <p class="muted">${escape(accessReason || "This account is not on the Vantic early access list yet.")}</p>
      <button class="btn lg wide" id="recheck_btn">Check again</button>
      <a class="btn ghost lg wide" href="#" data-ext="https://discord.gg/vantic" style="margin-top:10px">Join the Discord</a>
      <div id="lockerr"></div>
    </div>`;
  document.getElementById("recheck_btn")!.addEventListener("click", async () => {
    const btn = document.getElementById("recheck_btn") as HTMLButtonElement;
    btn.disabled = true;
    btn.textContent = "Checking...";
    await refreshAccess();
    applyAuthMode();
    renderAcct();
    navigate("home");
  });
}

async function renderMods() {
  const app = document.getElementById("app")!;
  const settings = await window.vantic.settings.get();
  const enabled = new Set<string>(settings.enabledMods);

  app.innerHTML = `
    <div class="page-head">
      <div><h1>Mods</h1><div class="sub">${modsCatalog.length} free mods from Modrinth. Enabled ones install when you play in Optimized mode.</div></div>
    </div>
    <div class="tool_row">
      <div class="search ${modQuery ? "has_text" : ""}" id="mod_search">
        ${I.search}
        <input type="text" placeholder="Search mods..." id="mod_q" value="${escape(modQuery)}" />
        <button class="clear_x" id="mod_clear">clear</button>
      </div>
      <button class="btn ghost small" id="import_btn">${I.folder}<span>Import</span></button>
      <button class="btn ghost small" data-folder="mods">${I.pkg}<span>Open folder</span></button>
    </div>
    <div id="import_msg"></div>
    <div class="list_grid" id="mods_list"></div>`;

  const listEl = document.getElementById("mods_list")!;
  const searchEl = document.getElementById("mod_search")!;
  const qInput = document.getElementById("mod_q") as HTMLInputElement;

  const paintList = () => {
    const q = modQuery.toLowerCase().trim();
    const filtered = q ? modsCatalog.filter((m) => m.name.toLowerCase().includes(q) || m.blurb.toLowerCase().includes(q) || m.slug.toLowerCase().includes(q)) : modsCatalog;
    if (filtered.length === 0) {
      listEl.innerHTML = `<div style="color: var(--muted); text-align: center; padding: 40px;">No mods match "${escape(modQuery)}".</div>`;
      return;
    }
    listEl.innerHTML = filtered.map((m) => `
      <div class="list_row">
        <div class="info">
          <div class="head">
            <b>${escape(m.name)}</b>
            ${m.forced ? `<span class="badge locked">Always on</span>` : ""}
          </div>
          <span class="blurb">${escape(m.blurb)}</span>
        </div>
        <div class="switch ${enabled.has(m.slug) ? "on" : ""} ${m.forced ? "locked" : ""}" data-slug="${escape(m.slug)}" ${m.forced ? "data-locked=\"1\"" : ""}></div>
      </div>`).join("");
    listEl.querySelectorAll<HTMLElement>(".switch[data-slug]").forEach((sw) => {
      if (sw.dataset.locked) return;
      sw.addEventListener("click", async () => {
        const slug = sw.dataset.slug!;
        const cur = await window.vantic.settings.get();
        const set = new Set(cur.enabledMods);
        if (set.has(slug)) set.delete(slug); else set.add(slug);
        await window.vantic.settings.set({ ...cur, enabledMods: Array.from(set) });
        sw.classList.toggle("on", set.has(slug));
        enabled.clear(); Array.from(set).forEach((s) => enabled.add(s as string));
      });
    });
  };
  paintList();

  qInput.addEventListener("input", () => {
    modQuery = qInput.value;
    searchEl.classList.toggle("has_text", !!modQuery);
    paintList();
  });
  document.getElementById("mod_clear")!.addEventListener("click", () => {
    modQuery = "";
    qInput.value = "";
    searchEl.classList.remove("has_text");
    paintList();
    qInput.focus();
  });

  app.querySelector("[data-folder=mods]")?.addEventListener("click", () => window.vantic.openFolder("mods"));
  document.getElementById("import_btn")!.addEventListener("click", async () => {
    const msg = document.getElementById("import_msg")!;
    msg.innerHTML = "";
    try {
      const r = await window.vantic.importer.fromFolder();
      if (!r) return;
      msg.innerHTML = `<div class="ok">Copied ${r.copied.length} mod(s). ${r.skipped.length ? `Skipped ${r.skipped.length} (already there).` : ""}</div>`;
    } catch (e: any) {
      msg.innerHTML = `<div class="err">${escape(String(e?.message || e))}</div>`;
    }
  });
}

let browseQuery = "";
let browseVersion = "";
async function renderBrowse() {
  const app = document.getElementById("app")!;
  const [settings, { latestRelease, versions }] = await Promise.all([
    window.vantic.settings.get(),
    window.vantic.versions.list(),
  ]);
  // Default the Browse version to whatever the launcher is set to, but let the
  // user override it so they can grab a mod for a different Minecraft version.
  if (!browseVersion) browseVersion = settings.versionId || "1.21.11";

  app.innerHTML = `
    <div class="page-head">
      <div><h1>Browse Mods</h1><div class="sub">Search all of Modrinth and install any Fabric mod. Pick the Minecraft version to install for, then hit Install.</div></div>
    </div>
    <div class="tool_row">
      <div class="search ${browseQuery ? "has_text" : ""}" id="browse_search">
        ${I.search}
        <input type="text" placeholder="Search mods on Modrinth..." id="browse_q" value="${escape(browseQuery)}" />
        <button class="clear_x" id="browse_clear">clear</button>
      </div>
      <div id="browse_ver_slot"></div>
      <button class="btn ghost small" data-folder="mods">${I.pkg}<span>Open folder</span></button>
    </div>
    <div id="browse_msg"></div>
    <div class="list_grid" id="browse_list"><div style="color: var(--muted); padding: 30px; text-align:center;">Loading popular mods...</div></div>`;

  app.querySelector("[data-folder=mods]")?.addEventListener("click", () => window.vantic.openFolder("mods"));

  const listEl = document.getElementById("browse_list")!;
  const qInput = document.getElementById("browse_q") as HTMLInputElement;
  const searchEl = document.getElementById("browse_search")!;

  const fmtDl = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(0)}k` : `${n}`);

  const runSearch = async () => {
    listEl.innerHTML = `<div style="color: var(--muted); padding: 30px; text-align:center;">Searching ${escape(browseVersion)}...</div>`;
    const hits = await window.vantic.browse.search(browseQuery, browseVersion);
    if (hits.length === 0) {
      listEl.innerHTML = `<div style="color: var(--muted); padding: 40px; text-align:center;">No Fabric mods found for ${escape(browseVersion)}.</div>`;
      return;
    }
    listEl.innerHTML = hits
      .map((h) => `
        <div class="browse_row">
          <div class="browse_icon">${h.icon ? `<img src="${escape(h.icon)}" alt="" onerror="this.style.display='none'" />` : I.pkg}</div>
          <div class="info">
            <div class="head"><b>${escape(h.title)}</b><span class="badge">${fmtDl(h.downloads)} downloads</span></div>
            <span class="blurb">${escape(h.description)}</span>
          </div>
          <button class="btn small" data-install="${escape(h.slug)}">${I.download}<span>Install</span></button>
        </div>`)
      .join("");
    listEl.querySelectorAll<HTMLButtonElement>("[data-install]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const slug = btn.dataset.install!;
        const msg = document.getElementById("browse_msg")!;
        msg.innerHTML = "";
        btn.disabled = true; btn.innerHTML = "<span>Installing...</span>";
        const r = await window.vantic.browse.install(slug, browseVersion);
        if (r.ok) {
          btn.innerHTML = "<span>Installed</span>";
          msg.innerHTML = `<div class="ok">Installed ${escape(r.filename || slug)} (${escape(browseVersion)}) into your mods folder.</div>`;
        } else {
          btn.disabled = false; btn.innerHTML = `${I.download}<span>Install</span>`;
          msg.innerHTML = `<div class="err">${escape(r.error || "Install failed.")}</div>`;
        }
      });
    });
  };

  // Version picker: controls both which version we search and which build installs.
  const verOptions = [
    ...(versions.some((v) => v.id === browseVersion) ? [] : [{ value: browseVersion, label: browseVersion, tag: "custom" }]),
    ...versions.map((v) => ({ value: v.id, label: v.id, tag: v.id === latestRelease ? "latest" : "" })),
  ];
  const verDd = buildDropdown({
    label: "For version", value: browseVersion, options: verOptions,
    onChange: (v) => { browseVersion = v; runSearch(); },
  });
  document.getElementById("browse_ver_slot")!.appendChild(verDd);

  runSearch();

  let deb: number | undefined;
  qInput.addEventListener("input", () => {
    browseQuery = qInput.value;
    searchEl.classList.toggle("has_text", !!browseQuery);
    clearTimeout(deb);
    deb = window.setTimeout(runSearch, 400);
  });
  document.getElementById("browse_clear")!.addEventListener("click", () => {
    browseQuery = ""; qInput.value = ""; searchEl.classList.remove("has_text"); runSearch(); qInput.focus();
  });
}

const VANTIC_CAPES: { id: string; name: string; blurb: string }[] = [
  { id: "vantic", name: "Vantic", blurb: "The signature Vantic cape. Clean charcoal with a bright accent stripe." },
];
const CAPE_BASE = "https://vantic.lol/capes";

// Crop the back panel (10x16 at offset 1,1) out of a 64x32 cape texture and
// scale it up crisply, so each card shows a cape shape rather than a flat sheet.
function capePreviewStyle(id: string): string {
  const w = 90, h = 144; // 10:16
  const sw = (64 / 10) * w, sh = (32 / 16) * h;
  const ox = (1 / 10) * w, oy = (1 / 16) * h;
  return `width:${w}px;height:${h}px;background-image:url('${CAPE_BASE}/${id}.png');background-repeat:no-repeat;image-rendering:pixelated;background-size:${sw}px ${sh}px;background-position:-${ox}px -${oy}px;border-radius:6px;`;
}

async function renderCapes() {
  const app = document.getElementById("app")!;
  const settings = await window.vantic.settings.get();
  let selected: string | null = settings.capeId || null;

  app.innerHTML = `
    <div class="page-head">
      <div><h1>Capes</h1><div class="sub">Pick a Vantic cape. It shows in-game in Optimized mode, and on your profile everywhere.</div></div>
    </div>
    <div id="cape_msg"></div>
    <div class="list_grid" id="capes_list"></div>`;

  const listEl = document.getElementById("capes_list")!;
  const msg = document.getElementById("cape_msg")!;

  const paint = () => {
    const none = `
      <div class="cape_card ${selected ? "" : "on"}" data-cape="none">
        <div class="cape_prev none">${I.close}</div>
        <div class="cape_info"><b>No cape</b><span>Show no cape.</span></div>
      </div>`;
    const cards = VANTIC_CAPES.map((c) => `
      <div class="cape_card ${selected === c.id ? "on" : ""}" data-cape="${escape(c.id)}">
        <div class="cape_prev" style="${capePreviewStyle(c.id)}"></div>
        <div class="cape_info"><b>${escape(c.name)}</b><span>${escape(c.blurb)}</span></div>
      </div>`).join("");
    listEl.innerHTML = none + cards;
    listEl.querySelectorAll<HTMLElement>(".cape_card").forEach((card) => {
      card.addEventListener("click", async () => {
        const id = card.dataset.cape!;
        const next = id === "none" ? null : id;
        if (next === selected) return;
        selected = next;
        paint();
        msg.innerHTML = "";
        const r = await window.vantic.capes.set(id);
        if (!r.ok) {
          msg.innerHTML = `<div class="err">${escape(r.error || "Couldn't save your cape. Check your connection.")}</div>`;
        } else {
          msg.innerHTML = `<div class="ok">${next ? "Cape equipped." : "Cape removed."} It applies next time you launch.</div>`;
        }
      });
    });
  };
  paint();
}

async function renderPacks() {
  const app = document.getElementById("app")!;
  packsInstalled = new Set(await window.vantic.packs.installed());

  app.innerHTML = `
    <div class="page-head">
      <div><h1>Resource Packs</h1><div class="sub">Free packs pulled from Modrinth. Enable them inside the game after installing.</div></div>
    </div>
    <div class="tool_row">
      <div class="search ${packQuery ? "has_text" : ""}" id="pack_search">
        ${I.search}
        <input type="text" placeholder="Search packs..." id="pack_q" value="${escape(packQuery)}" />
        <button class="clear_x" id="pack_clear">clear</button>
      </div>
      <button class="btn ghost small" data-folder="resourcepacks">${I.img}<span>Open folder</span></button>
    </div>
    <div id="pack_msg"></div>
    <div class="list_grid" id="packs_list"></div>`;

  const listEl = document.getElementById("packs_list")!;
  const searchEl = document.getElementById("pack_search")!;
  const qInput = document.getElementById("pack_q") as HTMLInputElement;

  const paintList = () => {
    const q = packQuery.toLowerCase().trim();
    const filtered = q ? packsCatalog.filter((p) => p.name.toLowerCase().includes(q) || p.blurb.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q)) : packsCatalog;
    if (filtered.length === 0) {
      listEl.innerHTML = `<div style="color: var(--muted); text-align: center; padding: 40px;">No packs match "${escape(packQuery)}".</div>`;
      return;
    }
    listEl.innerHTML = filtered.map((p) => `
      <div class="list_row">
        <div class="info">
          <div class="head">
            <b>${escape(p.name)}</b>
            <span class="badge">${escape(p.tag)}</span>
          </div>
          <span class="blurb">${escape(p.blurb)}</span>
        </div>
        <div class="pack_actions">
          <button class="btn small" data-install="${escape(p.slug)}">${I.download}<span>Install</span></button>
        </div>
      </div>`).join("");
    listEl.querySelectorAll<HTMLButtonElement>("[data-install]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const slug = btn.dataset.install!;
        const msg = document.getElementById("pack_msg")!;
        msg.innerHTML = "";
        btn.disabled = true;
        btn.innerHTML = `<span>Installing...</span>`;
        const r = await window.vantic.packs.install(slug);
        if (r.ok) {
          btn.innerHTML = `<span>Installed</span>`;
          msg.innerHTML = `<div class="ok">Installed ${escape(r.filename || slug)}. Enable it in Minecraft, Options, Resource Packs.</div>`;
        } else {
          btn.disabled = false;
          btn.innerHTML = `${I.download}<span>Install</span>`;
          msg.innerHTML = `<div class="err">${escape(r.error || "Install failed.")}</div>`;
        }
      });
    });
  };
  paintList();

  qInput.addEventListener("input", () => {
    packQuery = qInput.value;
    searchEl.classList.toggle("has_text", !!packQuery);
    paintList();
  });
  document.getElementById("pack_clear")!.addEventListener("click", () => {
    packQuery = "";
    qInput.value = "";
    searchEl.classList.remove("has_text");
    paintList();
    qInput.focus();
  });

  app.querySelector("[data-folder=resourcepacks]")?.addEventListener("click", () => window.vantic.openFolder("resourcepacks"));
  app.querySelectorAll<HTMLButtonElement>("[data-install]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const slug = btn.dataset.install!;
      const msg = document.getElementById("pack_msg")!;
      msg.innerHTML = "";
      btn.disabled = true;
      btn.innerHTML = `<span>Installing...</span>`;
      const r = await window.vantic.packs.install(slug);
      if (r.ok) {
        btn.innerHTML = `<span>Installed</span>`;
        msg.innerHTML = `<div class="ok">Installed ${escape(r.filename || slug)}. Enable it in Minecraft, Options, Resource Packs.</div>`;
      } else {
        btn.disabled = false;
        btn.innerHTML = `${I.download}<span>Install</span>`;
        msg.innerHTML = `<div class="err">${escape(r.error || "Install failed.")}</div>`;
      }
    });
  });
}

function loadImg(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function openWrapped(pt: { totalSeconds: number; sessions: number; longestSeconds: number; streak: number }) {
  if (!me) return;
  confetti();
  const accent = (getComputedStyle(document.documentElement).getPropertyValue("--accent").trim()) || "#ffffff";

  let rank = 0;
  try {
    const players = await window.vantic.leaderboard.list();
    const myU = me.uuid.replace(/-/g, "").toLowerCase();
    const idx = players.findIndex((p) => p.minecraft_uuid.toLowerCase() === myU);
    rank = idx >= 0 ? idx + 1 : 0;
  } catch { /* offline */ }

  const skinData = await window.vantic.imageDataUrl(`https://mc-heads.net/body/${uuidDashes(me.uuid)}/256`);
  const skinImg = skinData ? await loadImg(skinData) : null;

  const cv = document.createElement("canvas");
  cv.width = 1080; cv.height = 1080;
  const ctx = cv.getContext("2d")!;

  // background
  const g = ctx.createLinearGradient(0, 0, 1080, 1080);
  g.addColorStop(0, "#111114"); g.addColorStop(1, "#0a0a0b");
  ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1080);
  ctx.fillStyle = accent; ctx.globalAlpha = 0.10; ctx.beginPath(); ctx.arc(950, 130, 320, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;

  ctx.fillStyle = accent; ctx.font = "700 34px 'Segoe UI', sans-serif";
  ctx.fillText("VANTIC WRAPPED", 70, 110);
  ctx.fillStyle = "#f5f5f7"; ctx.font = "800 76px 'Segoe UI', sans-serif";
  ctx.fillText(me.username, 70, 200);

  if (skinImg) ctx.drawImage(skinImg, 760, 250, 260, 560);

  const fmtH = (s: number) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };
  const stats: [string, string][] = [
    ["Total played", fmtH(pt.totalSeconds)],
    ["Day streak", `${pt.streak} days`],
    ["Sessions", `${pt.sessions}`],
    ["Longest session", fmtH(pt.longestSeconds)],
    ["Global rank", rank > 0 ? `#${rank}` : "unranked"],
  ];
  let y = 320;
  for (const [label, val] of stats) {
    ctx.fillStyle = "#8a8f9c"; ctx.font = "600 26px 'Segoe UI', sans-serif";
    ctx.fillText(label.toUpperCase(), 70, y);
    ctx.fillStyle = "#ffffff"; ctx.font = "800 60px 'Segoe UI', sans-serif";
    ctx.fillText(val, 70, y + 62);
    y += 128;
  }

  ctx.fillStyle = accent; ctx.font = "700 30px 'Segoe UI', sans-serif";
  ctx.fillText("vantic.lol", 70, 1010);
  ctx.fillStyle = "#6c717d"; ctx.font = "500 24px 'Segoe UI', sans-serif";
  ctx.fillText("free minecraft client", 240, 1010);

  const dataUrl = cv.toDataURL("image/png");

  const box = document.createElement("div");
  box.className = "lightbox";
  box.innerHTML = `
    <div class="lightbox_bar">
      <span class="lightbox_name">Vantic Wrapped</span>
      <button class="lightbox_close">${I.close}</button>
    </div>
    <div class="wrapped_body">
      <img src="${dataUrl}" alt="" class="wrapped_img" />
      <button class="btn lg" id="wrapped_save">Save image to share</button>
    </div>`;
  document.body.appendChild(box);
  box.addEventListener("click", (e) => {
    if (e.target === box || (e.target as HTMLElement).closest(".lightbox_close")) box.remove();
  });
  box.querySelector("#wrapped_save")!.addEventListener("click", async () => {
    const btn = box.querySelector("#wrapped_save") as HTMLButtonElement;
    btn.disabled = true; btn.textContent = "Saved to screenshots";
    await window.vantic.saveWrapped(dataUrl);
  });
}

async function renderLeaderboard() {
  const app = document.getElementById("app")!;
  app.innerHTML = `
    <div class="page-head">
      <div><h1>Leaderboard</h1><div class="sub">Most Minecraft playtime across every Vantic user.</div></div>
    </div>
    <div id="lb_list" class="lb_list"><div style="color: var(--muted); padding: 30px; text-align:center;">Loading...</div></div>`;

  const listEl = document.getElementById("lb_list")!;
  const players = await window.vantic.leaderboard.list();
  if (players.length === 0) {
    listEl.innerHTML = `<div style="color: var(--muted); padding: 40px; text-align:center;">No one on the board yet. Play a session to claim the top spot.</div>`;
    return;
  }
  const fmt = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };
  const myUuid = me ? me.uuid.replace(/-/g, "").toLowerCase() : "";
  listEl.innerHTML = players
    .map((p, i) => {
      const isMe = p.minecraft_uuid.toLowerCase() === myUuid;
      const rankClass = i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "bronze" : "";
      return `
        <div class="lb_row ${isMe ? "me" : ""}">
          <div class="lb_rank ${rankClass}">${i + 1}</div>
          <img class="lb_head" src="https://mc-heads.net/avatar/${escape(p.minecraft_uuid)}/32" alt="" onerror="this.style.visibility='hidden'" />
          <div class="lb_name">${escape(p.minecraft_name)}${isMe ? ' <span class="you">you</span>' : ""}</div>
          <div class="lb_time">${fmt(p.total_seconds)}</div>
        </div>`;
    })
    .join("");
}

async function renderProfile() {
  const app = document.getElementById("app")!;
  if (!me) return;
  const pt = await window.vantic.playtime.get();

  const fmt = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const maxSecs = Math.max(1, ...pt.graph.map((g) => g.seconds));
  const hours = pt.totalSeconds / 3600;
  const milestones = [
    { need: 1, label: "First hour", type: "hours" },
    { need: 5, label: "5 hours", type: "hours" },
    { need: 10, label: "10 hours", type: "hours" },
    { need: 25, label: "25 hours", type: "hours" },
    { need: 50, label: "50 hours", type: "hours" },
    { need: 100, label: "100 hours", type: "hours" },
    { need: 3, label: "3 day streak", type: "streak" },
    { need: 7, label: "7 day streak", type: "streak" },
  ];

  app.innerHTML = `
    <div class="page-head">
      <div><h1>Profile</h1><div class="sub">Your Vantic playtime, tracked locally.</div></div>
      <button class="btn" id="wrapped_btn">${I.spark}<span>Vantic Wrapped</span></button>
    </div>`;
  const headEl = app;
  // reattach the rest below (kept in a second innerHTML assignment for clarity)
  app.insertAdjacentHTML("beforeend", `<div id="profile_body"></div>`);
  document.getElementById("wrapped_btn")!.addEventListener("click", () => openWrapped(pt));
  const bodyHost = document.getElementById("profile_body")!;
  bodyHost.innerHTML = `

    <div class="profile_top">
      <div class="profile_skin"><img src="${escape(body(me.uuid))}" alt="" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'letter',textContent:'${escape((me.username[0]||'?').toUpperCase())}'}))" /></div>
      <div class="profile_info">
        <div class="profile_name">${escape(me.username)}</div>
        <div class="profile_stats">
          <div class="pstat"><span class="pic">${I.clock}</span><b>${fmt(pt.totalSeconds)}</b><span>Total played</span></div>
          <div class="pstat"><span class="pic">${I.fire}</span><b>${pt.streak}</b><span>Day streak</span></div>
          <div class="pstat"><span class="pic">${I.spark}</span><b>${pt.sessions}</b><span>Sessions</span></div>
          <div class="pstat"><span class="pic">${I.clock}</span><b>${fmt(pt.longestSeconds)}</b><span>Longest</span></div>
        </div>
      </div>
    </div>

    <div class="graph_card">
      <div class="graph_head"><b>Last 14 days</b><span>${fmt(pt.weekSeconds)} this week</span></div>
      <div class="graph">
        ${pt.graph.map((g) => `
          <div class="gbar" title="${escape(g.date)}: ${fmt(g.seconds)}">
            <div class="gfill" style="height:${Math.round((g.seconds / maxSecs) * 100)}%"></div>
            <span class="glabel">${escape(g.label)}</span>
          </div>`).join("")}
      </div>
    </div>

    <div class="graph_head" style="margin-top:18px"><b>Milestones</b></div>
    <div class="milestones">
      ${milestones.map((ms) => {
        const val = ms.type === "hours" ? hours : pt.streak;
        const done = val >= ms.need;
        return `<div class="ms ${done ? "done" : ""}">${done ? I.spark : I.lock}<span>${escape(ms.label)}</span></div>`;
      }).join("")}
    </div>
  `;
}

async function renderServers() {
  const app = document.getElementById("app")!;
  app.innerHTML = `
    <div class="page-head">
      <div><h1>Servers</h1><div class="sub">Live status for the servers you save. Ping updates every 20 seconds.</div></div>
    </div>
    <form class="server_add_form" id="add_form">
      <input type="text" id="srv_name" placeholder="Nickname (optional)" maxlength="40" />
      <input type="text" id="srv_addr" placeholder="mc.hypixel.net" required />
      <button class="btn" type="submit">${I.plus}<span>Add</span></button>
    </form>
    <div id="add_err"></div>
    <div class="servers_list" id="servers_list"></div>`;

  const listEl = document.getElementById("servers_list")!;
  const form = document.getElementById("add_form") as HTMLFormElement;
  const nameIn = document.getElementById("srv_name") as HTMLInputElement;
  const addrIn = document.getElementById("srv_addr") as HTMLInputElement;
  const errEl = document.getElementById("add_err")!;

  let servers: Server[] = await window.vantic.servers.list();

  const paint = () => {
    if (servers.length === 0) {
      listEl.innerHTML = `<div style="color: var(--muted); text-align: center; padding: 40px;">No servers saved yet. Add one above to see live ping.</div>`;
      return;
    }
    listEl.innerHTML = servers.map((s) => `
      <div class="server_card" data-id="${escape(s.id)}">
        <div class="server_icon" id="ico_${escape(s.id)}"><span>${escape(s.name.slice(0,1).toUpperCase())}</span></div>
        <div class="server_meta">
          <div class="name_row"><b>${escape(s.name)}</b><span class="addr">${escape(s.address)}${s.port !== 25565 ? ":" + s.port : ""}</span></div>
          <div class="motd" id="motd_${escape(s.id)}">Pinging...</div>
        </div>
        <div class="server_actions">
          <div class="server_stat" id="stat_${escape(s.id)}">
            <span class="players">·</span>
            <span class="ping loading">wait<span class="bar b1"></span><span class="bar b2"></span><span class="bar b3"></span><span class="bar b4"></span></span>
          </div>
          <button class="tile_btn danger" data-remove="${escape(s.id)}" title="Remove">${I.trash}</button>
        </div>
      </div>`).join("");

    listEl.querySelectorAll<HTMLButtonElement>("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.remove!;
        await window.vantic.servers.remove(id);
        servers = servers.filter((x) => x.id !== id);
        paint();
      });
    });
    servers.forEach(pingOne);
  };

  const pingOne = async (s: Server) => {
    const stat = document.getElementById("stat_" + s.id);
    const motd = document.getElementById("motd_" + s.id);
    const ico = document.getElementById("ico_" + s.id);
    if (!stat || !motd) return;
    const r = await window.vantic.servers.ping(s.address, s.port);
    if (!r.ok) {
      stat.innerHTML = `<span class="players">--</span><span class="ping off">${escape(r.error)}<span class="bar b1"></span><span class="bar b2"></span><span class="bar b3"></span><span class="bar b4"></span></span>`;
      motd.textContent = "Offline";
      return;
    }
    const cls = r.latencyMs < 80 ? "good" : r.latencyMs < 200 ? "mid" : "bad";
    const bars = r.latencyMs < 60 ? 4 : r.latencyMs < 150 ? 3 : r.latencyMs < 300 ? 2 : 1;
    const barHtml = [1,2,3,4].map((n) => `<span class="bar b${n}" style="${n > bars ? "opacity:0.25" : ""}"></span>`).join("");
    stat.innerHTML = `<span class="players">${r.players.online.toLocaleString()}/${r.players.max.toLocaleString()}</span><span class="ping ${cls}">${r.latencyMs} ms ${barHtml}</span>`;
    motd.textContent = r.motd || r.version;
    if (r.favicon && ico) ico.innerHTML = `<img src="${escape(r.favicon)}" alt="" />`;
  };

  paint();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errEl.innerHTML = "";
    if (!addrIn.value.trim()) return;
    const added = await window.vantic.servers.add(nameIn.value, addrIn.value);
    servers.push(added);
    nameIn.value = "";
    addrIn.value = "";
    paint();
  });

  // Refresh every 20s while the user is on this page.
  const timer = setInterval(() => { if (route === "servers") servers.forEach(pingOne); else clearInterval(timer); }, 20_000);
}

async function renderWorlds() {
  const app = document.getElementById("app")!;
  app.innerHTML = `
    <div class="page-head">
      <div><h1>Worlds</h1><div class="sub">Every world in your Vantic saves folder.</div></div>
      <div>
        <button class="btn ghost small" data-folder="saves">${I.folder}<span>Open folder</span></button>
      </div>
    </div>
    <div id="worlds_grid" class="worlds_grid"></div>`;

  app.querySelector("[data-folder=saves]")?.addEventListener("click", () => window.vantic.openFolder("saves"));
  const grid = document.getElementById("worlds_grid")!;
  const worlds = await window.vantic.worlds.list();

  if (worlds.length === 0) {
    grid.innerHTML = `
      <div class="gallery_empty">
        <div class="ic">${I.world}</div>
        <b>No worlds yet</b>
        <span>Create one in game and it will show up here.</span>
      </div>`;
    return;
  }

  const paint = (list: World[]) => {
    grid.innerHTML = list.map((w) => {
      const icon = w.iconUrl
        ? `<img src="${escape(w.iconUrl)}" alt="" />`
        : `<div class="world_icon_fallback">${escape(w.name.slice(0, 1).toUpperCase())}</div>`;
      return `
        <div class="world_card" data-name="${escape(w.name)}">
          <div class="world_icon">${icon}</div>
          <div class="world_meta">
            <b>${escape(w.name)}</b>
            <span>${relative(w.mtime)} · ${friendlySize(w.size)}</span>
          </div>
          <div class="world_actions">
            <button class="tile_btn" data-act="reveal" title="Open folder">${I.reveal}</button>
            <button class="tile_btn danger" data-act="delete" title="Delete world">${I.trash}</button>
          </div>
        </div>`;
    }).join("");

    grid.querySelectorAll<HTMLElement>(".world_card").forEach((card) => {
      const name = card.dataset.name!;
      card.querySelector("[data-act=reveal]")!.addEventListener("click", () => window.vantic.worlds.reveal(name));
      card.querySelector("[data-act=delete]")!.addEventListener("click", async () => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
        const ok = await window.vantic.worlds.delete(name);
        if (ok) card.remove();
      });
    });
  };
  paint(worlds);
}

async function renderGallery() {
  const app = document.getElementById("app")!;
  app.innerHTML = `
    <div class="page-head">
      <div><h1>Gallery</h1><div class="sub">Every screenshot you have taken in game. Click any to open, hover to delete.</div></div>
      <div>
        <button class="btn ghost small" data-folder="screenshots">${I.folder}<span>Open folder</span></button>
      </div>
    </div>
    <div id="gallery_grid" class="gallery_grid"></div>`;

  app.querySelector("[data-folder=screenshots]")?.addEventListener("click", () => window.vantic.openFolder("screenshots"));

  const grid = document.getElementById("gallery_grid")!;
  const shots = await window.vantic.gallery.list();

  if (shots.length === 0) {
    grid.innerHTML = `
      <div class="gallery_empty">
        <div class="ic">${I.gallery}</div>
        <b>No screenshots yet</b>
        <span>Take one in Minecraft with F2 and it will show up here.</span>
      </div>`;
    return;
  }

  const renderTiles = (list: Shot[]) => {
    grid.innerHTML = list.map((s) => `
      <div class="tile" data-name="${escape(s.name)}" data-url="${escape(s.url)}">
        <img loading="lazy" src="${escape(s.url)}" alt="" />
        <div class="tile_overlay">
          <div class="tile_meta">
            <b>${escape(s.name)}</b>
            <span>${friendlySize(s.size)} · ${relative(s.mtime)}</span>
          </div>
          <div class="tile_actions">
            <button class="tile_btn" data-act="reveal" title="Show in folder">${I.reveal}</button>
            <button class="tile_btn danger" data-act="delete" title="Delete">${I.trash}</button>
          </div>
        </div>
      </div>`).join("");

    grid.querySelectorAll<HTMLElement>(".tile").forEach((tile) => {
      const name = tile.dataset.name!;
      const url = tile.dataset.url!;
      tile.querySelector("img")!.addEventListener("click", () => openLightbox(url, name));
      tile.querySelector("[data-act=reveal]")!.addEventListener("click", (e) => { e.stopPropagation(); window.vantic.gallery.reveal(name); });
      tile.querySelector("[data-act=delete]")!.addEventListener("click", async (e) => {
        e.stopPropagation();
        const ok = await window.vantic.gallery.delete(name);
        if (ok) tile.remove();
      });
    });
  };
  renderTiles(shots);
}

function openLightbox(url: string, name: string) {
  const existing = document.getElementById("lightbox");
  if (existing) existing.remove();
  const box = document.createElement("div");
  box.id = "lightbox";
  box.className = "lightbox";
  box.innerHTML = `
    <div class="lightbox_bar">
      <span class="lightbox_name">${escape(name)}</span>
      <button class="lightbox_close">${I.close}</button>
    </div>
    <img src="${escape(url)}" alt="" />`;
  document.body.appendChild(box);
  box.addEventListener("click", (e) => {
    if (e.target === box || (e.target as HTMLElement).closest(".lightbox_close")) box.remove();
  });
  document.addEventListener("keydown", function esc(ev) {
    if (ev.key === "Escape") { box.remove(); document.removeEventListener("keydown", esc); }
  });
}

function friendlySize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

async function renderNewsPage() {
  const app = document.getElementById("app")!;
  app.innerHTML = `
    <div class="page-head"><div><h1>News</h1><div class="sub">Updates and announcements from the Vantic team.</div></div></div>
    <div id="news_full"><div style="color: var(--muted); padding: 30px; text-align:center;">Loading...</div></div>`;
  const items = await window.vantic.news.list();
  const el = document.getElementById("news_full")!;
  if (items.length === 0) {
    el.innerHTML = `<div style="color: var(--muted); padding: 40px; text-align:center;">No news yet. Check back soon.</div>`;
    return;
  }
  const when = (iso: string) => relative(new Date(iso).getTime());
  el.innerHTML = items
    .map((n) => `
      <div class="news_item">
        <div class="news_top"><b>${escape(n.title)}</b><span>${escape(when(n.created_at))}</span></div>
        ${n.body ? `<p>${escape(n.body)}</p>` : ""}
      </div>`)
    .join("");
}

function renderHelp() {
  const app = document.getElementById("app")!;
  const faq: { q: string; a: string }[] = [
    { q: "My FPS is still low", a: "Go to Home, click Scan my PC, then Apply recommended settings. Make sure Optimized mode is selected. On a dedicated GPU keep VulkanMod on; on Intel graphics switch to Sodium in the Mods tab." },
    { q: "The game won't launch", a: "Open the Console tab and read the last lines. Most issues are a mod that doesn't support your Minecraft version yet. Try the latest release version, or switch to Vanilla mode to rule mods out." },
    { q: "How do I add my own mods?", a: "Mods tab, Import, pick a folder of .jar files, or click Open folder and drop them in." },
    { q: "Where are my files?", a: "Settings, Game folder. Everything Vantic installs lives under %AppData%\\Vantic." },
    { q: "Does Vantic cost anything?", a: "No. Everything is free forever. There is no paid tier and no store." },
  ];
  const keys: { k: string; d: string }[] = [
    { k: "Ctrl + 1..9", d: "Jump between sidebar tabs" },
    { k: "Ctrl + P", d: "Play instantly" },
    { k: "Esc", d: "Close the screenshot viewer" },
  ];
  app.innerHTML = `
    <div class="page-head"><div><h1>Help</h1><div class="sub">Quick answers and shortcuts. Still stuck? Ask in the Discord.</div></div></div>
    <div class="help_grid">
      <div>
        <div class="graph_head"><b>FAQ</b></div>
        ${faq.map((f) => `<div class="faq_item"><b>${escape(f.q)}</b><p>${escape(f.a)}</p></div>`).join("")}
      </div>
      <div>
        <div class="graph_head"><b>Shortcuts</b></div>
        ${keys.map((k) => `<div class="key_row"><kbd>${escape(k.k)}</kbd><span>${escape(k.d)}</span></div>`).join("")}
        <div class="graph_head" style="margin-top:16px"><b>Links</b></div>
        <button class="btn ghost wide" data-ext="https://discord.gg/vantic" style="margin-bottom:8px">Join the Discord</button>
        <button class="btn ghost wide" data-ext="https://vantic.lol">vantic.lol</button>
      </div>
    </div>`;
}

async function renderThemes() {
  const app = document.getElementById("app")!;
  const s = await window.vantic.settings.get();
  app.innerHTML = `
    <div class="page-head"><div><h1>Themes</h1><div class="sub">Pick an accent color. It restyles the whole launcher instantly.</div></div></div>
    <div class="theme_grid">
      ${THEMES.map((t) => `
        <button class="theme_swatch ${s.accent.toLowerCase() === t.accent.toLowerCase() ? "on" : ""}" data-accent="${t.accent}" data-ink="${t.ink}">
          <span class="dot ${t.accent === "rainbow" ? "rainbow" : ""}" style="${t.accent === "rainbow" ? "" : `background:${t.accent}`}"></span>
          <span class="tname">${t.name}</span>
        </button>`).join("")}
    </div>`;

  app.querySelectorAll<HTMLButtonElement>(".theme_swatch").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const accent = btn.dataset.accent!;
      const ink = btn.dataset.ink!;
      applyTheme(accent, ink);
      const cur = await window.vantic.settings.get();
      await window.vantic.settings.set({ ...cur, accent, accentInk: ink });
      app.querySelectorAll(".theme_swatch").forEach((b) => b.classList.remove("on"));
      btn.classList.add("on");
    });
  });
}

function renderDiscord() {
  const app = document.getElementById("app")!;
  app.innerHTML = `
    <div class="page-head"><div><h1>Discord</h1><div class="sub">Support, updates, giveaways, and the community.</div></div></div>
    <div class="discord_page">
      <iframe title="Vantic Discord" src="https://discord.com/widget?id=1521782292689846324&theme=dark" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
      <button class="btn lg" data-ext="https://discord.gg/vantic">${I.discord}<span>Join the Discord</span></button>
    </div>`;
}

function renderConsole() {
  const app = document.getElementById("app")!;
  app.innerHTML = `
    <div class="page-head"><div><h1>Console</h1><div class="sub">Live output from your Minecraft session.</div></div></div>
    <div class="console_wrap">
      <div class="console_head">
        <span class="status_pill ${running ? "running" : ""}" id="con_status"><span class="d"></span><span>${running ? "Running" : "Idle"}</span></span>
        <div class="btns">
          <button class="btn ghost small" id="copy_btn">${I.copy}<span>Copy</span></button>
          <button class="btn ghost small" id="clear_btn">${I.clear}<span>Clear</span></button>
        </div>
      </div>
      <div class="console" id="console"></div>
    </div>`;
  consoleEl = document.getElementById("console") as HTMLDivElement;
  hydrateConsole();
  document.getElementById("copy_btn")!.addEventListener("click", async () => { try { await navigator.clipboard.writeText(logLines.join("\n")); } catch {} });
  document.getElementById("clear_btn")!.addEventListener("click", async () => { await window.vantic.log.clear(); });
}
function paintConsoleStatus() {
  const el = document.getElementById("con_status"); if (!el) return;
  el.className = `status_pill ${running ? "running" : ""}`;
  el.innerHTML = `<span class="d"></span><span>${running ? "Running" : "Idle"}</span>`;
}
function hydrateConsole() { if (!consoleEl) return; consoleEl.innerHTML = logLines.map(lineHtml).join(""); consoleEl.scrollTop = consoleEl.scrollHeight; }
function appendConsole(line: string) {
  if (!consoleEl) return;
  const wasBottom = consoleEl.scrollTop + consoleEl.clientHeight >= consoleEl.scrollHeight - 40;
  consoleEl.insertAdjacentHTML("beforeend", lineHtml(line));
  if (wasBottom) consoleEl.scrollTop = consoleEl.scrollHeight;
}
function lineHtml(line: string): string {
  let cls = "l";
  if (line.startsWith(">")) cls += " sys";
  else if (/\bERROR\b|Exception|error:/i.test(line)) cls += " err";
  else if (/\bWARN\b|warning:/i.test(line)) cls += " warn";
  else if (/\bINFO\b/i.test(line)) cls += " info";
  return `<span class="${cls}">${escape(line)}\n</span>`;
}

async function renderSettings() {
  const app = document.getElementById("app")!;
  const s = await window.vantic.settings.get();
  app.innerHTML = `
    <div class="page-head"><div><h1>Settings</h1><div class="sub">Saved automatically.</div></div></div>
    <div class="settings_grid">
      <div class="toggle_row"><div class="info"><b>Discord Rich Presence</b><span>Show what you are playing on your Discord profile.</span></div><div class="switch ${s.discordRpc ? "on" : ""}" id="rpc_sw"></div></div>
      <div class="toggle_row"><div class="info"><b>Keep launcher open after launch</b><span>Console keeps updating while you play.</span></div><div class="switch ${s.keepOpen ? "on" : ""}" id="keep_sw"></div></div>
      <div class="toggle_row"><div class="info"><b>Share playtime on leaderboard</b><span>Your name and hours appear on the global leaderboard.</span></div><div class="switch ${s.leaderboard ? "on" : ""}" id="lb_sw"></div></div>
      <button class="folder_btn" data-folder="root"><span class="fi">${I.folder}</span><span class="ftxt"><b>Game folder</b><span>Everything Vantic installs lives here</span></span></button>
    </div>`;
  document.getElementById("rpc_sw")!.addEventListener("click", async () => {
    const cur = await window.vantic.settings.get();
    const nv = !cur.discordRpc;
    await window.vantic.settings.set({ ...cur, discordRpc: nv });
    document.getElementById("rpc_sw")!.classList.toggle("on", nv);
  });
  document.getElementById("keep_sw")!.addEventListener("click", async () => {
    const cur = await window.vantic.settings.get();
    const nv = !cur.keepOpen;
    await window.vantic.settings.set({ ...cur, keepOpen: nv });
    document.getElementById("keep_sw")!.classList.toggle("on", nv);
  });
  document.getElementById("lb_sw")!.addEventListener("click", async () => {
    const cur = await window.vantic.settings.get();
    const nv = !cur.leaderboard;
    await window.vantic.settings.set({ ...cur, leaderboard: nv });
    document.getElementById("lb_sw")!.classList.toggle("on", nv);
  });
  app.querySelector("[data-folder=root]")?.addEventListener("click", () => window.vantic.openFolder("root"));
}

function relative(ts: number): string {
  const d = Date.now() - ts;
  if (d < 60_000) return "just now";
  if (d < 3600_000) return `${Math.floor(d / 60_000)} min ago`;
  if (d < 86_400_000) return `${Math.floor(d / 3600_000)} h ago`;
  return `${Math.floor(d / 86_400_000)} d ago`;
}
function escape(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
