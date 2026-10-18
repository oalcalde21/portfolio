// Differential check: record with the baseline lock, compare with the candidate.
// Uses only dependencies already present in this repository's lockfile.
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const { createRequire } = require("node:module");
const postcss = require("postcss");
const tailwindRequire = createRequire(require.resolve("tailwindcss/package.json"));
const parser = tailwindRequire("postcss-selector-parser");
const tailwind = require("tailwindcss");
const loadConfig = require("tailwindcss/loadConfig");

const [mode, evidenceDirectory] = process.argv.slice(2);
assert.ok(["record", "compare"].includes(mode) && evidenceDirectory,
  "Usage: node tests/security/parser-compat.cjs record|compare <evidence-directory>");
const root = process.cwd();
const evidence = path.resolve(evidenceDirectory);
const baselineFile = path.join(evidence, "baseline.json");
const version = tailwindRequire("postcss-selector-parser/package.json").version;
assert.equal(version, mode === "record" ? "6.1.4" : "7.1.6");
assert.equal(require("tailwindcss/package.json").version, "3.4.19");
assert.equal(require("postcss-nested/package.json").version, "6.2.0");

function sha(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function cssMetadata(entry) {
  return { file: entry.file, bytes: entry.bytes, sha256: entry.sha256 };
}

function filesIn(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? filesIn(file) : [file];
  }).sort();
}

// Compare meaning and order, excluding comments, formatting and source offsets.
// Keep declarations and at-rule parameters exact to avoid hiding cascade changes.
function cssTree(node) {
  const result = { type: node.type };
  if (node.type === "rule") result.selector = parser().processSync(node.selector, { lossless: false });
  if (node.type === "atrule") Object.assign(result, { name: node.name, params: node.params });
  if (node.type === "decl") Object.assign(result, {
    prop: node.prop, value: node.value, important: !!node.important,
  });
  if (node.nodes) result.nodes = node.nodes.filter((child) => child.type !== "comment").map(cssTree);
  return result;
}

function selectorTree(node) {
  const result = { type: node.type };
  for (const key of ["value", "namespace", "attribute", "operator", "insensitive", "quoteMark"]) {
    if (node[key] !== undefined) result[key] = node[key];
  }
  if (node.nodes) result.nodes = node.nodes.map(selectorTree);
  return result;
}

function exerciseSelector(input) {
  const ast = parser().astSync(input);
  const prefixed = ast.clone();
  prefixed.walkClasses((node) => { node.value = `probe-${node.value}`; });
  const nested = ast.clone();
  nested.walkNesting((node) => node.replaceWith(parser.className({ value: "probe-card" })));
  return {
    input,
    lossless: parser().processSync(input),
    compact: parser().processSync(input, { lossless: false }),
    ast: selectorTree(ast),
    prefixed: prefixed.toString(),
    nesting: nested.toString(),
  };
}

const extraSelectors = [
  '.md\\:hover\\:text-green-400:hover',
  '.focus-visible\\:ring-2:focus-visible',
  '.group:hover .group-hover\\:rotate-2',
  '.peer:checked ~ .peer-checked\\:block',
  '[data-paused="true"] .typewriter-cursor::after',
  ':is(.audit-card, #hero) > :not([hidden]):first-child',
  ':where(.audit-card):has(> button:focus-visible) + a[href^="https"]',
  'dialog[open]::backdrop, .audit-card:nth-child(2n + 1)',
  '.dark .md\\:focus-visible\\:bg-zinc-900:focus-visible',
  '&:hover > span, &:focus-visible::before',
  ':merge(.group):focus-within .audit-card',
  '.w-\\[calc\\(100\\%-2rem\\)\\] > svg:not(:root)',
];

async function snapshot(corpus) {
  const cssFiles = filesIn(path.join(root, ".next/static/css")).filter((file) => file.endsWith(".css"));
  assert.ok(cssFiles.length, "Run a production build first");
  const realSelectors = new Set();
  const css = cssFiles.map((file) => {
    const bytes = fs.readFileSync(file, "utf8");
    const tree = postcss.parse(bytes);
    tree.walkRules((rule) => {
      if (!/keyframes$/i.test(rule.parent.name || "")) realSelectors.add(rule.selector);
    });
    return { file: path.basename(file), bytes: Buffer.byteLength(bytes), sha256: sha(bytes), semantic: cssTree(tree) };
  });
  const selectors = corpus || [...new Set([...realSelectors, ...extraSelectors])].sort();
  const config = loadConfig(path.join(root, "tailwind.config.js"));
  const fixtureClasses = [
    "audit-card", "audit-child", "md:hover:text-green-400", "focus-visible:ring-2",
    "group-hover:rotate-2", "peer-checked:block", "sm:focus-visible:bg-zinc-900",
    "motion-reduce:transform-none", "dark:md:hover:text-white", "[&>svg]:h-4",
    "aria-expanded:block", "data-[state=open]:opacity-100", "supports-[display:grid]:grid",
    "before:content-['x']", "first:mt-0", "hover:[&>span]:text-green-400",
  ].join(" ");
  const fixtureSource = fs.readFileSync(path.join(root, "src/styles/globals.css"), "utf8") + `
@layer components {
  .audit-card {
    @apply text-zinc-300;
    &:hover, &:focus-visible { @apply text-green-400; }
    & > .audit-child:not([hidden]) { @apply px-4; }
    @media (min-width: 768px) { &:focus-within { @apply ring-2; } }
    &::before { content: "probe"; }
  }
}`;
  const fixture = await postcss([tailwind({
    ...config, content: [...config.content, { raw: `<div class="${fixtureClasses}"></div>`, extension: "html" }],
  })]).process(fixtureSource, { from: undefined, map: false });
  for (const expected of [":hover", ":focus-visible", "min-width: 768px", "prefers-reduced-motion", "data-state", "::before"]) {
    assert.ok(fixture.css.includes(expected), `Fixture must cover ${expected}`);
  }
  const consumers = {};
  for (const name of ["tailwindcss", "postcss-nested"]) {
    const consumerRequire = createRequire(require.resolve(`${name}/package.json`));
    consumers[name] = consumerRequire("postcss-selector-parser/package.json").version;
    assert.equal(consumers[name], version, `Both consumers must resolve ${version}`);
  }
  // Match Tailwind's existing CommonJS/default interop, rather than requiring
  // the private helper to keep its v6 module.exports shape.
  const unescModule = tailwindRequire("postcss-selector-parser/dist/util/unesc");
  const unesc = unescModule.__esModule ? unescModule.default : unescModule;
  assert.equal(typeof unesc, "function");
  assert.equal(unesc("hover\\:text-green-400"), "hover:text-green-400");
  return {
    parser: version, consumers, realSelectorCount: realSelectors.size,
    selectors: selectors.map(exerciseSelector), css,
    fixture: { sha256: sha(fixture.css), semantic: cssTree(postcss.parse(fixture.css)) },
  };
}

(async () => {
  fs.mkdirSync(evidence, { recursive: true });
  const baseline = mode === "compare" ? JSON.parse(fs.readFileSync(baselineFile, "utf8")) : null;
  const current = await snapshot(baseline?.selectors.map((entry) => entry.input));
  const output = path.join(evidence, mode === "record" ? "baseline.json" : "candidate.json");
  fs.writeFileSync(output, JSON.stringify(current, null, 2));
  if (baseline) {
    assert.deepEqual(current.selectors, baseline.selectors, "Selector AST/serialization/mutations differ");
    assert.deepEqual(current.css.map((entry) => entry.semantic), baseline.css.map((entry) => entry.semantic), "Production CSS cascade differs");
    assert.deepEqual(current.fixture.semantic, baseline.fixture.semantic, "Nesting/variants fixture cascade differs");
    assert.deepEqual(current.css.map(cssMetadata), baseline.css.map(cssMetadata), "Production CSS bytes or filenames differ: investigate before publishing");
    assert.equal(current.fixture.sha256, baseline.fixture.sha256, "Fixture bytes differ");
  }
  console.log(JSON.stringify({
    mode, parser: version, consumers: current.consumers,
    realSelectors: current.realSelectorCount, corpus: current.selectors.length,
    productionCss: current.css.map(cssMetadata),
    fixtureSha256: current.fixture.sha256, result: "PASS",
  }, null, 2));
})().catch((error) => { console.error(error); process.exitCode = 1; });
