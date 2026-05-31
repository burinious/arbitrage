import { cpSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const vercelOutput = join(root, ".vercel", "output");
const vercelStatic = join(vercelOutput, "static");

rmSync(dist, { recursive: true, force: true });
rmSync(vercelOutput, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
mkdirSync(vercelStatic, { recursive: true });

for (const path of ["index.html", "manifest.webmanifest", "sw.js", "assets", "src"]) {
  cpSync(join(root, path), join(dist, path), { recursive: true });
  cpSync(join(root, path), join(vercelStatic, path), { recursive: true });
}

console.log("Static app built to dist/ and .vercel/output/static/");
