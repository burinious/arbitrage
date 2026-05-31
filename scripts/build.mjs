import { cpSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const path of ["index.html", "manifest.webmanifest", "sw.js", "assets", "src"]) {
  cpSync(join(root, path), join(dist, path), { recursive: true });
}

console.log("Static app built to dist/");
