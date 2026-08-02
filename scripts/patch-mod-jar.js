// Builds assets/bundled-packs/vantic-menu.zip from the template folder,
// substituting the panorama images with assets/mod-overrides/panorama.png
// if the user provided one.
//
// Runs during `npm run build` before packaging.

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const TEMPLATE = path.join(ROOT, "assets", "bundled-packs", "vantic-menu");
const OVERRIDE = path.join(ROOT, "assets", "mod-overrides", "panorama.png");
const OUT_ZIP = path.join(ROOT, "assets", "bundled-packs", "vantic-menu.zip");
const SEVEN = path.join(ROOT, "node_modules", "7zip-bin", "win", "x64", "7za.exe");

if (!fs.existsSync(TEMPLATE)) {
  console.log("[menu-pack] no template folder, skipping");
  process.exit(0);
}

const bgDir = path.join(TEMPLATE, "assets", "minecraft", "textures", "gui", "title", "background");
fs.mkdirSync(bgDir, { recursive: true });

const source = fs.existsSync(OVERRIDE) ? OVERRIDE : null;
if (!source) {
  console.log("[menu-pack] no panorama.png override, skipping pack build");
  process.exit(0);
}

for (let i = 0; i < 6; i++) {
  fs.copyFileSync(source, path.join(bgDir, `panorama_${i}.png`));
}
console.log(`[menu-pack] copied ${path.basename(source)} into 6 panorama slots`);

fs.rmSync(OUT_ZIP, { force: true });
execFileSync(SEVEN, ["a", "-tzip", OUT_ZIP, "pack.mcmeta", "assets"], { cwd: TEMPLATE, stdio: "inherit" });
console.log("[menu-pack] wrote", OUT_ZIP);
