const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const { createHash } = require("node:crypto");
const ts = require("typescript");

const repo = path.resolve(__dirname, "../..");
const source = ts.createSourceFile("_document.jsx", fs.readFileSync(path.join(repo, "src/pages/_document.jsx"), "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
const expected = [
  "9b8ff4d28b1251830ca2613cc912b987a155de53903d27da1733f2475784a640",
  "e3fe567ecd2c668f867cdf4d7b94a7486f6e3f4ff8ee79edb636490faf15697f",
  "715a523ca0a0b88b3bc310564c421465a74140a69c6d68da5cbe5e906d9e5b80",
  "5be84e549a1d362c668bab2915c70238a43ce0f199b06d9e4e96e3c3782a321e",
];
const expressions = [];
function visit(node) {
  if (ts.isPropertyAssignment(node) && node.name.getText(source) === "__html" && node.initializer.getText(source).includes("JSON.stringify")) {
    expressions.push(node.initializer.getText(source));
  }
  ts.forEachChild(node, visit);
}
visit(source);
assert.equal(expressions.length, 4);
const hash = (data) => createHash("sha256").update(JSON.stringify(data)).digest("hex");
const payload = { text: '</script><script>alert("test")</script><!-- < > &', unicode: "Español 😀", nested: ["</ScRiPt>", "<script>"] };
for (const [index, expression] of expressions.entries()) {
  const serialized = vm.runInNewContext(`(${expression})`, {}, { timeout: 1000 });
  assert.equal(hash(JSON.parse(serialized)), expected[index], "Existing schema values changed");
  // Execute each actual source expression, substituting only its input data.
  // This fails if that expression loses its escaping, including one of four.
  const adversarial = vm.runInNewContext(`(${expression})`, { JSON: { stringify: () => JSON.stringify(payload) } }, { timeout: 1000 });
  assert.equal(adversarial.includes("<"), false, "Raw HTML delimiter survived");
  assert.equal(JSON.stringify(JSON.parse(adversarial)), JSON.stringify(payload), "Escaping changed decoded values");
}
const html = fs.readFileSync(path.join(repo, ".next/server/pages/index.html"), "utf8");
const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
assert.deepEqual(schemas.map(hash), expected, "Built HTML schemas differ from baseline");
console.log("JSON-LD: 4 source schemas, 4 adversarial payload round trips and 4 built HTML schemas pass.");
