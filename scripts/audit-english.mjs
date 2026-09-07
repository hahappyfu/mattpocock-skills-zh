import fs from "node:fs";
import { execSync } from "node:child_process";

const ALLOW = new Set([
  "TDD", "PRD", "ADR", "DDD", "API", "CLI", "CI", "CD",
  "GitHub", "Claude", "Codex", "Obsidian", "Husky", "Prettier",
  "red-green-refactor", "mock", "refactor", "README", "LICENSE",
  "SKILL", "MIT", "YAML", "JSON", "TOML",
]);

const DIRTY = ["有人境", "纸质记录", "调用 Skill 工具两次"];

const files = execSync("git ls-files", { encoding: "utf8" })
  .trim()
  .split("\n")
  .filter((f) => f && f.endsWith(".md") && fs.existsSync(f));

let failed = false;
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  for (const word of DIRTY) {
    if (text.includes(word)) {
      failed = true;
      console.error(`DIRTY ${file}: found ${word}`);
    }
  }
  const prose = text.split("```").filter((_, i) => i % 2 === 0).join("\n");
  for (const line of prose.split("\n")) {
    if (line.startsWith("---")) continue;
    if (/^name:/.test(line)) continue;
    if (/https?:\/\//.test(line)) continue;
    const words = line.match(/[A-Za-z]{4,}/g) || [];
    const unknown = words.filter((w) => !ALLOW.has(w));
    if (unknown.length >= 8) {
      console.error(`REVIEW ${file}: ${unknown.slice(0, 8).join(", ")}`);
    }
  }
}

process.exit(failed ? 1 : 0);
