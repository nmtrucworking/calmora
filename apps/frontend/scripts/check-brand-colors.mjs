import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const sourceRoot = fileURLToPath(new URL("../src/", import.meta.url));
const allowedExtensions = new Set([".css", ".ts", ".tsx"]);
const excludedSegments = [
  "features/admin/",
  "features/landing/three/",
  "shared/styles/tokens/",
];
const hexPattern = /#[0-9a-fA-F]{3,8}\b/g;

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collect(path);
    return allowedExtensions.has(extname(entry.name)) ? [path] : [];
  }));
  return nested.flat();
}

const files = await collect(sourceRoot);
const violations = [];

for (const file of files) {
  const normalized = relative(sourceRoot, file).replaceAll("\\", "/");
  if (excludedSegments.some((segment) => normalized.startsWith(segment))) continue;
  const content = await readFile(file, "utf8");
  content.split(/\r?\n/).forEach((line, index) => {
    const matches = line.match(hexPattern);
    if (matches) violations.push(`${normalized}:${index + 1} ${matches.join(", ")}`);
  });
}

if (violations.length) {
  console.error("Brand colors must use semantic tokens outside approved 3D/admin scopes:\n" + violations.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Brand color token check passed.");
}
