import { StrictMode, act } from "react";
import { createRoot } from "react-dom/client";
import { LanguageProvider, useLanguage } from "../../src/context/LanguageContext";
import { SideBar } from "../../src/components/nav/SideBar";

function NavigationCase({ pageKey }) {
  const { toggleLanguage } = useLanguage();
  return <>
    <SideBar />
    <button id="nav-language" onClick={toggleLanguage}>Language</button>
    <main id="main-content">
      <header style={{ height: 72 }} />
      <div key={pageKey}>
        {["about", "projects", "experience", "contact"].map((id) => <section className="section-wrapper" key={id} id={id} />)}
      </div>
    </main>
  </>;
}

// Actual React, MutationObserver and animation frames. Only section geometry,
// scroll position and media preference are controlled; this is not native QA.
export async function runNavigationTests(check) {
  const host = document.createElement("div");
  document.body.append(host);
  const originalMedia = window.matchMedia;
  const originalScroll = Object.getOwnPropertyDescriptor(window, "scrollY");
  const originalAdd = window.addEventListener;
  const originalRemove = window.removeEventListener;
  const NativeObserver = window.MutationObserver;
  const subscriptions = new Set();
  const observers = new Set();
  const listeners = { scroll: new Set(), resize: new Set() };
  let scroll = 0;
  let top = 200;
  let root;
  let mediaReduce = true;
  const media = {
    get matches() { return mediaReduce; },
    addEventListener: (_type, callback) => subscriptions.add(callback),
    removeEventListener: (_type, callback) => subscriptions.delete(callback),
  };
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const settle = () => act(async () => { await new Promise((resolve) => setTimeout(resolve, 80)); });
  const active = () => host.querySelector("nav [aria-current=location]")?.getAttribute("href") || "";
  const geometry = () => {
    host.querySelectorAll(".section-wrapper").forEach((section, index) => {
      section.getBoundingClientRect = () => ({ top: top + index * 600 });
    });
  };
  const position = async (value) => {
    top = value;
    act(() => window.dispatchEvent(new Event("scroll")));
    await settle();
  };
  window.matchMedia = (query) => query === "(prefers-reduced-motion: reduce)"
    ? media : originalMedia.call(window, query);
  Object.defineProperty(window, "scrollY", { configurable: true, get: () => scroll });
  window.addEventListener = function (type, callback, options) {
    // Framer keeps a shared resize listener; count this component's pair only.
    if (callback.name === "scheduleUpdate") listeners[type]?.add(callback);
    return originalAdd.call(this, type, callback, options);
  };
  window.removeEventListener = function (type, callback, options) {
    if (callback.name === "scheduleUpdate") listeners[type]?.delete(callback);
    return originalRemove.call(this, type, callback, options);
  };
  window.MutationObserver = class extends NativeObserver {
    observe(...args) { observers.add(this); return super.observe(...args); }
    disconnect() { observers.delete(this); return super.disconnect(); }
  };
  const render = (pageKey) => act(() => {
    root.render(<StrictMode><LanguageProvider><NavigationCase pageKey={pageKey} /></LanguageProvider></StrictMode>);
  });
  try {
    root = createRoot(host);
    render(0);
    geometry();
    await settle();
    check("Navigation: hero has no falsely current section", () => assert(active() === "", "Incorrect initial section"));
    for (const [index, id] of ["about", "projects", "experience", "contact"].entries()) {
      await position(72 - index * 600);
      check(`Navigation: reading line selects ${id}`, () => assert(active() === `#${id}`, "Incorrect reading section"));
    }
    // Model AnimatePresence: the language changes before old nodes are removed.
    act(() => host.querySelector("#nav-language").click());
    await settle();
    render(1);
    top = -1128;
    geometry();
    await settle();
    check("Navigation: delayed language remount binds the new sections", () => {
      assert(active() === "#experience", "Still tracking outgoing nodes");
      assert(host.querySelector("nav").getAttribute("aria-label") === "Navegación principal", "Untranslated navigation name");
    });
    for (let key = 2; key < 7; key++) {
      act(() => host.querySelector("#nav-language").click());
      render(key);
      geometry();
      await settle();
    }
    check("Navigation: repeated language remounts keep one observer and listener pair", () => {
      assert(observers.size === 1 && listeners.scroll.size === 1 && listeners.resize.size === 1,
        JSON.stringify({ observers: observers.size, scroll: [...listeners.scroll].map((fn) => fn.name), resize: [...listeners.resize].map((fn) => fn.name) }));
      assert(active() === "#experience", "Selection lost after remounts");
    });
    mediaReduce = false;
    act(() => subscriptions.forEach((callback) => callback()));
    await position(-528);
    check("Navigation: preference change preserves tracking", () => assert(active() === "#projects", "Preference broke tracking"));
    mediaReduce = true;
    act(() => subscriptions.forEach((callback) => callback()));
    await position(72);
    check("Navigation: returning to reduce preserves tracking", () => assert(active() === "#about", "Reduce broke tracking"));
    scroll = document.documentElement.scrollHeight;
    await position(200);
    check("Navigation: document bottom selects the final short section", () => assert(active() === "#contact", "Bottom section not current"));
    act(() => window.dispatchEvent(new Event("scroll")));
    act(() => root.unmount());
    root = null;
    await settle();
    check("Navigation: unmount clears observer, scroll/resize and preference subscriptions", () => {
      assert(!observers.size && !listeners.scroll.size && !listeners.resize.size && !subscriptions.size, "Resources survived unmount");
    });
  } finally {
    if (root) act(() => root.unmount());
    window.matchMedia = originalMedia;
    window.addEventListener = originalAdd;
    window.removeEventListener = originalRemove;
    window.MutationObserver = NativeObserver;
    if (originalScroll) Object.defineProperty(window, "scrollY", originalScroll);
    else delete window.scrollY;
    host.remove();
  }
}
