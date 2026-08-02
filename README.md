# Vantic Launcher

A free, no-frills Minecraft launcher (like Prism) — press Play and it launches.
No paid tier, no store, no cosmetics.

- **Framework:** Electron + TypeScript
- **Auth:** Real Microsoft account OAuth (device-code flow)
- **Assets:** Downloads vanilla Minecraft + a bundled Adoptium Java 21 runtime on first launch
- **Target:** Windows x64

You do NOT need Minecraft already installed. You DO need a real Microsoft account
that owns Minecraft: Java Edition.

---

## 1. Prerequisites

- Node.js 20+ (https://nodejs.org)
- Windows x64 (packaging targets Windows; other platforms are trivial to add later)

```bash
npm install
```

## 2. Register your Microsoft (Azure AD) app - REQUIRED

Microsoft requires every legitimate launcher to have its own Azure app ID.
It is free and takes ~5 minutes.

1. Go to https://portal.azure.com → **Microsoft Entra ID** → **App registrations** → **New registration**.
2. Name it `Vantic Launcher` (or anything you want). Under "Supported account types" pick **Personal Microsoft accounts only**. Leave Redirect URI blank. Click **Register**.
3. On the app's overview page, copy the **Application (client) ID** — that's your MSA client ID.
4. Left sidebar → **Authentication** → scroll to **Advanced settings** → set **Allow public client flows** to **Yes**. Save.
5. Left sidebar → **API permissions** → **Add a permission** → **Microsoft Graph** → **Delegated** → search for and add `XboxLive.signin` and `offline_access`. Grant admin consent (optional).

Then set your client ID either as an env var at build time:

```powershell
$env:VANTIC_MSA_CLIENT_ID = "your-client-id-from-step-3"
```

...or hard-code it in `src/main/config.ts` (`MSA_CLIENT_ID`).

## 3. Run it

```bash
npm run dev
```

This builds the TypeScript, then launches Electron. On first run:

1. Click **Sign in with Microsoft**.
2. It shows a code (e.g. `ABCD-EFGH`). Open the URL it shows, paste the code, approve the app.
3. The launcher pulls your Minecraft profile from Mojang's servers.
4. Pick a version, hit **Play**. First launch downloads Java (~50 MB) and the Minecraft client + assets (~200 MB) into `%APPDATA%\Vantic`. Second launch is instant.

## 4. Package a Windows installer

```bash
npm run pack
```

The installer lands in `release/`. It's built with `electron-builder` (NSIS
per-user installer). To ship a signed build, add code-signing config under
`build.win` in `package.json`.

## 5. Layout

```
launcher/
├── package.json            # scripts + electron-builder config
├── tsconfig.json
├── scripts/copy-static.js  # copies index.html + style.css into dist/
├── src/
│   ├── main/               # runs in Node/Electron main process
│   │   ├── index.ts        # window + IPC handlers
│   │   ├── auth.ts         # MSA -> XBL -> XSTS -> MC login chain
│   │   ├── downloader.ts   # Mojang manifest, libs, natives, assets
│   │   ├── jre.ts          # Adoptium Temurin 21 install
│   │   ├── launcher.ts     # javaw arg construction + spawn
│   │   ├── settings.ts     # version + RAM persistence
│   │   ├── paths.ts        # %APPDATA%\Vantic layout
│   │   ├── config.ts       # Azure client ID + constants
│   │   └── net.ts          # fetch/download helpers w/ SHA-1 verify
│   ├── preload/            # thin bridge exposing window.vantic to renderer
│   │   └── index.ts
│   └── renderer/           # the UI itself (plain HTML/CSS/TS, no framework)
│       ├── index.html
│       ├── style.css
│       └── renderer.ts
└── assets/                 # logos used in-app + packaged icon
```

## 6. What's on disk after first launch

Everything under `%APPDATA%\Vantic` — cleanly removable:

```
%APPDATA%\Vantic\
├── auth.json               # saved MSA + MC tokens (delete = force re-login)
├── settings.json           # version + RAM
├── runtime\jdk-21.x.x\     # bundled JRE
└── minecraft\              # standard MC-style layout
    ├── versions\<id>\      # .jar + .json per version
    ├── libraries\          # all .jar dependencies
    ├── assets\             # index + objects
    └── natives\<id>\       # extracted .dll files for LWJGL
```

## 7. What's next (not built yet)

- Optional Fabric loader + built-in performance mods (Sodium/Lithium/etc)
- Auto-update (electron-updater against GitHub releases)
- Linux / macOS packaging
- More detailed download progress (per-file % vs coarse label)

## 8. Troubleshooting

| Symptom | Fix |
|---|---|
| "Device code request failed: 400 invalid_client" | Your Azure client ID is wrong or the app doesn't have public client flows enabled. Re-check step 2. |
| "XSTS auth failed" with `XErr: 2148916233` | The Microsoft account has never logged into Xbox. Sign in once at xbox.com to create the profile, then retry. |
| "This Microsoft account doesn't own Minecraft: Java Edition." | Exactly what it says. Buy or claim Java Edition at minecraft.net. |
| Game crashes on launch | Check `%APPDATA%\Vantic\logs\game-*.log` — the full stdout/stderr of javaw is captured there. |
