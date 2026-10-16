const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const http = require("node:http");
const assert = require("node:assert/strict");
const ts = require("typescript");
const React = require("react");
const { renderToString } = require("react-dom/server");
const webpackPackage = require("next/dist/compiled/webpack/webpack");

// Reuse only compilers already pinned by the existing lockfile.
webpackPackage.init?.();
const repo = path.resolve(__dirname, "../..");
const output = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-motion-"));
const loader = path.join(output, "jsx-loader.cjs");
fs.writeFileSync(loader, `const ts = require(${JSON.stringify(require.resolve("typescript"))});
module.exports = function(source) { return ts.transpileModule(source, {compilerOptions: {
jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020
}}).outputText; };`);

const originalJs = require.extensions[".js"];
const originalJsx = require.extensions[".jsx"];
function loadSource(module, filename) {
  if (!filename.startsWith(path.join(repo, "src")) && !filename.startsWith(__dirname)) {
    return originalJs(module, filename);
  }
  const result = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  module._compile(result.outputText, filename);
}
require.extensions[".js"] = loadSource;
require.extensions[".jsx"] = loadSource;
const { MotionCase } = require("./Case.jsx");
const markup = renderToString(React.createElement(React.StrictMode, null, React.createElement(MotionCase)));
require.extensions[".js"] = originalJs;
if (originalJsx) require.extensions[".jsx"] = originalJsx;
else delete require.extensions[".jsx"];
assert.match(markup, /data-preference="null"/);
assert.match(markup, /Senior IT Support \/ Freelance Web Developer/);

webpackPackage.webpack({
  mode: "development",
  devtool: false,
  entry: path.join(__dirname, "browser.jsx"),
  output: { path: output, filename: "tests.js" },
  resolve: { extensions: [".jsx", ".js"] },
  module: { rules: [{ test: /\.jsx?$/, exclude: /node_modules/, use: loader }] },
}, (error, stats) => {
  if (error || stats.hasErrors()) {
    console.error(error || stats.toString({ all: false, errors: true }));
    process.exitCode = 1;
    return;
  }
  const server = http.createServer((request, response) => {
    if (request.url === "/tests.js") {
      response.writeHead(200, { "content-type": "application/javascript" });
      response.end(fs.readFileSync(path.join(output, "tests.js")));
    } else if (request.url === "/results" && request.method === "POST") {
      let body = "";
      request.on("data", (chunk) => { body += chunk; });
      request.on("end", () => {
        const result = JSON.parse(body);
        fs.writeFileSync(path.join(output, "results.json"), JSON.stringify(result, null, 2));
        console.log(JSON.stringify(result, null, 2));
        console.log(`Evidence: ${path.join(output, "results.json")}`);
        process.exitCode = result.results.every((test) => test.passed) && !result.hydrationErrors.length ? 0 : 1;
        response.end("Recorded");
        server.close();
      });
    } else if (request.url === "/") {
      response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      response.end(`<!doctype html><html lang="en"><head><title>Controlled motion tests</title></head>
<body><h1>Controlled motion tests</h1><p>SIMULATION ONLY. Native media/CSS and real reduced-motion QA remain separate.</p>
<button id="run">Run controlled tests</button><div id="case">${markup}</div><pre id="results">Not run</pre><script src="/tests.js"></script></body></html>`);
    } else if (request.url === "/favicon.ico") {
      response.writeHead(204); response.end();
    } else {
      response.writeHead(404); response.end();
    }
  });
  server.listen(3113, "127.0.0.1", () => console.log("Open http://127.0.0.1:3113 and press Run controlled tests. This is NOT native reduced-motion emulation."));
});
