import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const rootDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(rootDir, "..");

function getVersion() {
  try {
    const packageJson = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8"));
    const packageVersion = packageJson.version ?? "0.0.0";
    const shortHash = execSync("git rev-parse --short HEAD", {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    const dirty = execSync("git status --porcelain", {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim()
      ? "*"
      : "";

    return `v${packageVersion} · ${shortHash}${dirty}`;
  } catch {
    return "v0.0.0";
  }
}

process.stdout.write(getVersion());
