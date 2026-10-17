import { StrictMode, act } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import anime from "animejs";
import DotGrid from "../../src/components/hero/DotGrid";

// Real Anime.js and real animation frames; only the media preference is mocked.
// This fixture does not emulate the browser's native CSS media query.
export async function runDotGridTests(container, check, hydrationErrors, serverMarkup) {
  const originalMatchMedia = window.matchMedia.bind(window);
  const listeners = new Set();
  let matches = false;
  let root;
  const media = {
    get matches() { return matches; },
    addEventListener: (_event, callback) => listeners.add(callback),
    removeEventListener: (_event, callback) => listeners.delete(callback),
  };
  window.matchMedia = (query) => query === "(prefers-reduced-motion: reduce)"
    ? media : originalMatchMedia(query);
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const wait = (milliseconds = 80) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  const points = () => [...container.querySelectorAll(".dot-point")];
  const active = (nodes) => anime.running.filter((instance) => !instance.paused
    && instance.animations.some((animation) => nodes.includes(animation.animatable.target)));
  const click = (index = 0) => act(() => points()[index].click());
  const preference = (value) => act(() => {
    matches = value;
    listeners.forEach((callback) => callback());
  });
  const mount = (key = 0) => act(() => {
    root ??= createRoot(container);
    root.render(<StrictMode><DotGrid key={key} /></StrictMode>);
  });
  const unmount = () => act(() => { root.unmount(); root = null; });
  const stable = (nodes) => nodes.every((node) => !node.style.transform && !node.style.opacity);

  try {
    container.innerHTML = serverMarkup;
    check("DotGrid SSR: all 500 points visible without inline transforms", () => {
      assert(points().length === 500 && stable(points()), "Unstable SSR grid");
    });
    act(() => {
      root = hydrateRoot(container, <StrictMode><DotGrid /></StrictMode>, {
        onRecoverableError: (error) => hydrationErrors.push(error.message),
      });
    });
    check("DotGrid hydration: no errors and one media subscription", () => {
      assert(!hydrationErrors.length && listeners.size === 1, "Hydration/subscription regression");
    });
    click();
    const original = points();
    check("DotGrid normal click: 500 local targets, original wave duration", () => {
      const waves = active(original);
      assert(waves.length === 1 && waves[0].animatables.length === 500, "Invalid targets");
      assert(waves[0].duration === 3811, "Original corner wave duration changed");
    });
    await wait();
    check("DotGrid real Anime frame writes visible animation styles", () => {
      assert(original.some((point) => point.style.transform), "Wave did not run");
    });
    check("DotGrid repeated clicks replace the wave, never accumulate active instances", () => {
      for (let index = 0; index < 20; index++) {
        click(index);
        assert(active(original).length === 1, "Concurrent wave survived replacement");
      }
    });
    preference(true);
    const reducedStyles = original.map((point) => point.getAttribute("style"));
    await wait();
    check("DotGrid live reduce cancels all waves and clears residual styles", () => {
      assert(active(original).length === 0 && stable(original), "Reduce left motion/styles");
      assert(original.every((point, index) => point.getAttribute("style") === reducedStyles[index]), "Late reduce write");
    });
    click();
    check("DotGrid reduced click is static", () => {
      assert(active(original).length === 0 && stable(original), "Reduced click animated");
    });
    preference(false);
    check("DotGrid inverse preference does not replay a previous wave", () => {
      assert(active(original).length === 0 && stable(original), "Old wave resumed");
    });
    click(132);
    check("DotGrid new normal click works after reduce", () => {
      assert(active(original).length === 1, "Normal interaction did not recover");
    });
    await wait();
    const records = [];
    const observer = new MutationObserver((mutations) => records.push(...mutations));
    original.forEach((point) => observer.observe(point, { attributes: true, attributeFilter: ["style"] }));
    mount(1);
    await wait();
    check("DotGrid language-style remount cancels before detached-node writes", () => {
      assert(!original[0].isConnected && active(original).length === 0, "Old grid still active");
      assert(records.length === 0, "Styles written after old grid detached");
      assert(points().length === 500 && stable(points()) && listeners.size === 1, "Remount regression");
    });
    observer.disconnect();
    check("DotGrid rapid remounts leave only the current wave and subscription", () => {
      for (let key = 2; key < 12; key++) {
        const old = points();
        click(); mount(key);
        assert(active(old).length === 0 && listeners.size === 1, "Remount leaked resources");
      }
    });
    const finalNodes = points();
    click();
    const detachedRecords = [];
    const finalObserver = new MutationObserver((mutations) => detachedRecords.push(...mutations));
    finalNodes.forEach((point) => finalObserver.observe(point, { attributes: true, attributeFilter: ["style"] }));
    unmount();
    // Observe beyond the longest corner wave, including its staggered tail.
    await wait(4000);
    check("DotGrid unmount cancels active targets with zero subsequent style writes", () => {
      assert(active(finalNodes).length === 0 && detachedRecords.length === 0 && listeners.size === 0,
        "Unmount leaked animation/style write/subscription");
    });
    finalObserver.disconnect();
    preference(true); mount(); click();
    await wait();
    check("DotGrid reduce before mount never starts a wave", () => {
      assert(points().length === 500 && stable(points()) && active(points()).length === 0,
        "Reduced initial grid animated");
    });
    unmount(); preference(false);
    act(() => {
      root = createRoot(container);
      root.render(<StrictMode><div><DotGrid /><DotGrid /></div></StrictMode>);
    });
    click();
    check("DotGrid instances isolate targets and cleanup", () => {
      const first = points().slice(0, 500);
      const second = points().slice(500);
      assert(active(first).length === 1 && active(second).length === 0 && stable(second), "Global target leak");
    });
    unmount();
    check("DotGrid final cleanup leaves no subscriptions", () => {
      assert(listeners.size === 0, "Media listener leaked");
    });
  } finally {
    if (root) unmount();
    window.matchMedia = originalMatchMedia;
  }
}
