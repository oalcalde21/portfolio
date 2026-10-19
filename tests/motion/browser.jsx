import { StrictMode, act } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { MotionCase } from "./Case";
import { runDotGridTests } from "./dotgrid";
import { runNavigationTests } from "./navigation";
import { runModalTests } from "./modal";

// Isolated unit fixture. This mock does NOT change native CSS media queries.
const nativeMatchMedia = window.matchMedia.bind(window);
const nativeReduce = nativeMatchMedia("(prefers-reduced-motion: reduce)").matches;
const nativeSetTimeout = window.setTimeout;
const nativeClearTimeout = window.clearTimeout;
const listeners = new Set();
let matches = false;
const media = {
  get matches() { return matches; },
  addEventListener: (_event, callback) => listeners.add(callback),
  removeEventListener: (_event, callback) => listeners.delete(callback),
};

let now = 0;
let nextId = 0;
const timers = new Map();
const results = [];
const hydrationErrors = [];
let root;
const container = document.getElementById("case");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function check(name, assertion) {
  assertion();
  results.push({ name, passed: true });
}

function advance(ms) {
  const target = now + ms;
  let count = 0;
  while (true) {
    const next = [...timers].sort((a, b) => a[1].at - b[1].at)[0];
    if (!next || next[1].at > target) break;
    assert(++count < 10000, "Timer loop did not settle");
    now = next[1].at;
    timers.delete(next[0]);
    act(() => next[1].callback());
  }
  now = target;
}

function setPreference(value) {
  act(() => {
    matches = value;
    listeners.forEach((callback) => callback());
  });
}

const text = () => document.querySelector(".typewriter-animated").textContent.slice(0, -1);
const stableText = () => document.querySelector(".sr-only").textContent;
const click = (id) => act(() => document.getElementById(id).click());
const mount = () => act(() => {
  root = createRoot(container);
  root.render(<StrictMode><MotionCase /></StrictMode>);
});
const unmount = () => act(() => root.unmount());

async function run() {
  document.getElementById("run").disabled = true;
  window.IS_REACT_ACT_ENVIRONMENT = true;
  window.matchMedia = (query) => query === "(prefers-reduced-motion: reduce)" ? media : nativeMatchMedia(query);
  window.setTimeout = (callback, delay = 0) => {
    timers.set(++nextId, { callback, at: now + delay });
    return nextId;
  };
  window.clearTimeout = (id) => timers.delete(id);

  try {
    check("SSR: deterministic unknown preference and both complete roles", () => {
      assert(container.querySelector('[data-preference="null"]'), "Server snapshot should be unknown");
      assert(stableText() === "Senior IT Support / Freelance Web Developer", "Incomplete server heading");
    });
    act(() => {
      root = hydrateRoot(container, <StrictMode><MotionCase /></StrictMode>, {
        onRecoverableError: (error) => hydrationErrors.push(error.message),
      });
    });
    check("Hydration and StrictMode: one listener and one timer", () => {
      assert(hydrationErrors.length === 0, hydrationErrors.join("\n"));
      assert(listeners.size === 1 && timers.size === 1, "Duplicate subscription/timer");
      assert(document.querySelector('[data-preference="false"]'), "Client snapshot not read");
    });
    check("Typing waits 100 ms per character", () => {
      advance(99); assert(text() === "> ", "Typed too soon");
      advance(1); assert(text() === "> S", "First character missing");
      advance(100); assert(text() === "> Se", "Second character missing");
    });
    const stableHeading = stableText();
    check("Pause writing cancels its timer and keeps its frame", () => {
      click("pause"); const frozen = text();
      assert(timers.size === 0, "Writing timer survived pause");
      advance(10000); assert(text() === frozen, "Paused text changed");
      assert(document.querySelector('.typewriter-cursor[data-paused="true"]'), "Cursor pause flag missing");
    });
    check("Resume writing keeps the same role and next character", () => {
      click("pause"); advance(100);
      assert(text() === "> Sen", "Resume skipped a frame or role");
      assert(stableText() === stableHeading, "Accessible heading changed per character");
    });
    while (text() !== "> Senior IT Support") advance(100);
    check("Complete role holds for 2100 ms", () => {
      advance(2099); assert(text() === "> Senior IT Support", "Hold ended early");
    });
    check("Pause during hold leaves no callback behind", () => {
      click("pause"); advance(10000);
      assert(timers.size === 0 && text() === "> Senior IT Support", "Hold callback survived pause");
    });
    check("Resume hold, then delete at 50 ms", () => {
      click("pause"); advance(2100);
      advance(49); assert(text() === "> Senior IT Support", "Deleted too soon");
      advance(1); assert(text() === "> Senior IT Suppor", "Deletion interval changed");
    });
    check("Pause and resume during deletion do not skip role", () => {
      click("pause"); const frozen = text(); advance(10000);
      assert(timers.size === 0 && text() === frozen, "Deletion continued during pause");
      click("pause"); advance(50); assert(text() === "> Senior IT Suppo", "Deletion resume jumped");
    });
    check("Empty frame advances to the second existing role", () => {
      while (text() !== "> ") advance(50);
      advance(50); advance(100); assert(text() === "> F", "Second role not reached");
    });
    check("Simulated reduce during typing cancels timers", () => {
      setPreference(true); const frozen = text();
      assert(timers.size === 0, "Timer survived reduced preference");
      advance(10000); assert(text() === frozen, "Reduced preference still types");
      assert(document.querySelector(".typewriter-static").textContent === stableHeading, "Static roles missing");
    });
    check("Inverse preference resumes from coherent frame", () => {
      setPreference(false); advance(100); assert(text() === "> Fr", "Preference change skipped role");
    });
    check("Manual pause persists across both preference changes", () => {
      click("pause"); const frozen = text();
      setPreference(true); setPreference(false); advance(10000);
      assert(timers.size === 0 && text() === frozen, "Preference reset manual pause");
    });
    check("Paused EN/ES remount shows complete translated primary role", () => {
      click("language"); advance(10000);
      assert(text() === "> Soporte IT Senior", "Paused translation is empty or wrong");
      assert(stableText() === "Soporte IT Senior / Desarrollador Web Freelance", "Incomplete translated heading");
      assert(timers.size === 0 && listeners.size === 1, "Remount leaked timer/listener");
    });
    check("Rapid language changes preserve pause and cleanup", () => {
      for (let index = 0; index < 10; index++) click("language");
      assert(timers.size === 0 && listeners.size === 1, "Rapid changes leaked resources");
    });
    check("Unmount while paused removes the subscription", () => {
      unmount(); assert(timers.size === 0 && listeners.size === 0, "Unmount did not clean up");
    });
    check("Simulated reduce active before mount never starts typing", () => {
      setPreference(true); mount();
      assert(timers.size === 0 && listeners.size === 1, "Reduced mount started timer");
      advance(10000); assert(text() === "> ", "Hidden animated frame advanced");
    });
    check("Unmount during writing and hold leaves no timers", () => {
      setPreference(false); advance(100); unmount();
      assert(timers.size === 0 && listeners.size === 0, "Writing timer leaked");
      mount(); advance(1700); unmount();
      assert(timers.size === 0 && listeners.size === 0, "Hold timer leaked");
    });
    check("Unmount during deletion cancels its callback", () => {
      mount(); advance(1700 + 2100 + 50);
      assert(text() === "> Senior IT Suppor", "Expected deletion phase");
      unmount(); assert(timers.size === 0 && listeners.size === 0, "Deletion timer leaked");
    });
    check("Rapid language remounts keep exactly one active timer", () => {
      mount(); advance(200);
      for (let index = 0; index < 10; index++) click("language");
      assert(timers.size === 1 && listeners.size === 1, "Active remount duplicated resources");
      advance(100); assert(text() === "> S", "Old-language callback survived");
      unmount(); assert(timers.size === 0 && listeners.size === 0, "Active remount leaked");
    });
    check("Repeated StrictMode mounts have no duplicate timers", () => {
      for (let index = 0; index < 10; index++) {
        mount(); assert(timers.size === 1 && listeners.size === 1, "Duplicate on mount");
        unmount(); assert(timers.size === 0 && listeners.size === 0, "Leak on unmount");
      }
    });
  } catch (error) {
    results.push({ name: error.message, passed: false });
  } finally {
    if (container.childNodes.length && root) unmount();
    window.matchMedia = nativeMatchMedia;
    window.setTimeout = nativeSetTimeout;
    window.clearTimeout = nativeClearTimeout;
  }

  try {
    const dotContainer = document.getElementById("dot-case");
    await runDotGridTests(dotContainer, check, hydrationErrors, dotContainer.innerHTML);
  } catch (error) {
    results.push({ name: error.message, passed: false });
  }

  try {
    await runNavigationTests(check);
  } catch (error) {
    results.push({ name: error.message, passed: false });
  }

  try {
    await runModalTests(check, hydrationErrors);
  } catch (error) {
    results.push({ name: error.message, passed: false });
  }

  const report = { simulated: true, nativeReduce, hydrationErrors, results, pendingTimers: timers.size, listeners: listeners.size };
  document.getElementById("results").textContent = JSON.stringify(report, null, 2);
  await fetch("/results", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(report) });
}

document.getElementById("run").addEventListener("click", run);
