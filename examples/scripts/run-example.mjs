import { spawnSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const repoRootDir = path.resolve(rootDir, "..");
const distDir = path.join(repoRootDir, "dist");
const tsconfigPath = path.join(rootDir, "tsconfig.run.json");

function printUsage() {
  console.error("Usage: npm run example <file-or-name> [args...]");
  console.error("Examples:");
  console.error("  npm run example indexer_client/01-health-check.ts");
  console.error("  npm run example 01-health-check.ts");
}

function ensureDist() {
  try {
    if (statSync(distDir).isDirectory()) return;
  } catch {
    // fall through to build
  }

  console.error("dist/ not found; running npm run build...");
  const { status } = spawnSync("npm", ["run", "build"], {
    cwd: repoRootDir,
    stdio: "inherit",
  });
  if (status !== 0) process.exit(1);
}

function isFile(p) {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
}

const [input, ...restArgs] = process.argv.slice(2);
if (!input) {
  printUsage();
  process.exit(1);
}

ensureDist();

const inputHasPathSep = input.includes("/") || input.includes(path.sep);
const cwd = process.cwd();

let resolvedPath = null;
for (const p of [path.resolve(cwd, input), path.resolve(rootDir, input)]) {
  if (p.endsWith(".ts") && isFile(p)) {
    resolvedPath = p;
    break;
  }
}

if (!resolvedPath && !inputHasPathSep) {
  const dirs = readdirSync(rootDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => path.join(rootDir, e.name));
  const matches = [];
  for (const dir of dirs) {
    const candidate = path.join(dir, input);
    if (isFile(candidate)) matches.push(path.relative(rootDir, candidate));
  }

  if (matches.length === 1) {
    resolvedPath = path.join(rootDir, matches[0]);
  } else if (matches.length > 1) {
    console.error(`Ambiguous example name "${input}". Matches:`);
    for (const m of matches) console.error(`  - ${m}`);
    process.exit(1);
  }
}

if (!resolvedPath) {
  console.error(`Example not found: ${input}`);
  printUsage();
  process.exit(1);
}

const { status } = spawnSync(
  "tsx",
  ["--tsconfig", tsconfigPath, resolvedPath, ...restArgs],
  { stdio: "inherit" }
);

process.exit(status ?? 1);
