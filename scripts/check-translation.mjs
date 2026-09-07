import fs from "node:fs";
import { execSync } from "node:child_process";

const files = execSync("git ls-files", { encoding: "utf8" })
  .trim()
  .split("\n")
  .filter((file) => file && fs.existsSync(file));

let failed = false;
function fail(file, msg, line) {
  failed = true;
  console.error(line ? `FAIL ${file}:${line}: ${msg}` : `FAIL ${file}: ${msg}`);
}
function read(file) {
  return fs.readFileSync(file, "utf8");
}
function stripFences(text) {
  return text.split("```").filter((_, i) => i % 2 === 0).join("");
}

for (const file of files) {
  if (!file.endsWith(".md")) continue;
  const text = read(file);
  const fences = text.match(/```/g) || [];
  if (fences.length % 2 !== 0) {
    fail(file, "unbalanced fenced code blocks");
  }
  const prose = stripFences(text);
  if (/—|——/.test(prose)) {
    let inFence = false;
    let hitLine = 0;
    for (const [idx, line] of text.split("\n").entries()) {
      const segs = line.split("```");
      let proseLine = "";
      for (let k = 0; k < segs.length; k++) {
        if (!inFence && k % 2 === 0) proseLine += segs[k];
      }
      if (/—|——/.test(proseLine)) {
        hitLine = idx + 1;
        break;
      }
      if ((line.match(/```/g) || []).length % 2 !== 0) inFence = !inFence;
    }
    fail(file, "long dash found outside code fences", hitLine || undefined);
  }
  if (file.endsWith("SKILL.md")) {
    const fm = text.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!fm) {
      fail(file, "missing or malformed YAML frontmatter");
      continue;
    }
    const frontmatter = fm[1];
    const name = frontmatter.match(/^name:\s*(.+)$/m)?.[1]?.trim();
    const description = frontmatter.match(/^description:\s*(.+)$/m)?.[1]?.trim();
    if (!name) fail(file, "missing frontmatter name");
    if (!description) fail(file, "missing frontmatter description");
    if (name && /[㐀-鿿]/.test(name)) {
      fail(file, "frontmatter name should remain an ASCII slug");
    }
  }
  if (file.startsWith("docs/engineering/") || file.startsWith("docs/productivity/")) {
    for (const h of ["它做什么", "何时使用", "常见问题", "达标表现"]) {
      if (!text.includes(h)) {
        fail(file, `missing docs section title ${h}`);
      }
    }
  }
}

const installBlock = read(".agents/install-block.md");
const readme = fs.existsSync("README.md") ? read("README.md") : "";
if (readme && !readme.includes("claude plugins install mattpocock-skills")) {
  fail("README.md", "missing canonical claude plugin install command");
}
if (readme && !readme.includes("npx skills@latest add mattpocock/skills")) {
  fail("README.md", "missing canonical skills.sh install command");
}
if (!installBlock.includes("claude plugins install mattpocock-skills")) {
  fail(".agents/install-block.md", "canonical block lost its source of truth");
}

process.exit(failed ? 1 : 0);
