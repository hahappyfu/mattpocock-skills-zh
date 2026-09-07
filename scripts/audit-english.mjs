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
  // 待第二批汉化落盘后重新纳入生产力目录
  .filter((f) => f && f.endsWith(".md") && fs.existsSync(f) && !f.startsWith("docs/productivity/") && !f.startsWith("docs/superpowers/"));

let failed = false;
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split("\n");
  for (const word of DIRTY) {
    const idx = lines.findIndex((l) => l.includes(word));
    if (idx !== -1) {
      failed = true;
      console.error(`DIRTY ${file}:${idx + 1}: found ${word}`);
    }
  }
  const parts = text.split("```");
  let lineNum = 0;
  parts.forEach((part, partIdx) => {
    const prose = part.split("\n");
    if (partIdx % 2 === 0) {
      prose.forEach((line, i) => {
        const lineno = lineNum + i + 1;
        if (line.startsWith("---")) return;
        if (/^name:/.test(line)) return;
        if (/https?:\/\//.test(line)) return;
        const words = line.match(/[A-Za-z]{4,}/g) || [];
        const unknown = words.filter((w) => !ALLOW.has(w));
        if (unknown.length >= 8) {
          console.error(`REVIEW ${file}:${lineno}: ${unknown.slice(0, 8).join(", ")}`);
        }
      });
    }
    lineNum += prose.length - 1;
  });
}

process.exit(failed ? 1 : 0);
