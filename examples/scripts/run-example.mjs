import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const repoRootDir = path.resolve(rootDir, "..");
const distDir = path.join(repoRootDir, "dist");
const tsconfigPath = path.join(rootDir, "tsconfig.run.json");

function printUsage() {
  console.error(`Usage: npm run example <file-or-name> [args...]
Examples:
  npm run example indexer_client/01-health-check.ts
  npm run example 01-health-check.ts`);
}

function ensureDist() {
  if (existsSync(distDir) && statSync(distDir).isDirectory()) return;

  console.error(`Error: dist/ folder not found. Please build the project first by running 'npm run build' from the repository root (${repoRootDir})`);
  process.exit(1);
}

function isFile(p) {
  return existsSync(p) && statSync(p).isFile();
}

const [input, ...restArgs] = process.argv.slice(2);
if (!input) {
  printUsage();
  process.exit(1);
}

ensureDist();

const inputHasPathSep = input.includes("/") || input.includes(path.sep);
const cwd = process.cwd();

let resolvedPath = [path.resolve(cwd, input), path.resolve(rootDir, input)]
  .find((p) => p.endsWith(".ts") && isFile(p));

if (!resolvedPath && !inputHasPathSep) {
  const matches = readdirSync(rootDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => path.join(rootDir, e.name, input))
    .filter(isFile)
    .map((p) => path.relative(rootDir, p));

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
