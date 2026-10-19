import { StrictMode, act } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { ModalCase } from "./ModalCase";

// Real React hydration, MutationObserver and native dialog. Media preference is
// controlled for repeatability; this does not certify native reduced-motion QA.
export async function runModalTests(check, hydrationErrors) {
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const media = window.matchMedia;
  const subscriptions = new Set();
  let reduce = true;
  window.matchMedia = (query) => query === "(prefers-reduced-motion: reduce)" ? {
    matches: reduce,
    addEventListener: (_event, callback) => subscriptions.add(callback),
    removeEventListener: (_event, callback) => subscriptions.delete(callback),
  } : media.call(window, query);
  const target = document.createElement("div");
  target.id = "root";
  const host = document.getElementById("modal-closed");
  const openHost = document.getElementById("modal-open");
  const previousOverflow = document.body.style.overflowY;
  const previousPadding = document.body.style.paddingRight;
  let root;
  const settle = () => act(async () => { await new Promise((resolve) => setTimeout(resolve, 40)); });
  const close = () => act(() => target.querySelector("dialog button").click());
  const open = () => act(() => host.querySelector("button").click());
  try {
    check("Modal SSR: closed and initially open both omit portal markup", () => {
      assert(!host.querySelector("dialog") && !openHost.querySelector("dialog"), "Server rendered a portal");
    });
    act(() => { root = hydrateRoot(openHost, <StrictMode><ModalCase initiallyOpen /></StrictMode>, {
      onRecoverableError: (error) => hydrationErrors.push(error.message),
    }); });
    await settle();
    check("Modal hydration: absent target stays safe and unlocked", () => {
      assert(!document.querySelector("dialog") && document.body.style.overflowY === previousOverflow, "Missing target locked document");
    });
    document.body.append(target);
    await settle();
    check("Modal: late target opens initial dialog without hydration errors", () => {
      assert(target.querySelector("dialog")?.open && hydrationErrors.length === 0, "Initial opening/hydration failed");
      assert(document.activeElement === target.querySelector("dialog button"), "Initial focus missing");
    });
    const initialOpener = openHost.querySelector("button");
    close();
    check("Modal: close restores focus and scroll styles", () => {
      assert(!target.querySelector("dialog") && document.activeElement === initialOpener, "Focus not restored");
      assert(document.body.style.overflowY === previousOverflow && document.body.style.paddingRight === previousPadding, "Scroll styles leaked");
    });
    act(() => root.unmount());
    act(() => { root = hydrateRoot(host, <StrictMode><ModalCase /></StrictMode>, {
      onRecoverableError: (error) => hydrationErrors.push(error.message),
    }); });
    open();
    check("Modal: closed hydration can open with accessible name", () => {
      const dialog = target.querySelector("dialog");
      assert(dialog?.open && document.getElementById(dialog.getAttribute("aria-labelledby"))?.textContent === "SSR project", "Dialog name/open failed");
    });
    check("Modal: Tab and Shift+Tab wrap at boundaries", () => {
      const dialog = target.querySelector("dialog");
      const first = dialog.querySelector("button");
      const last = dialog.querySelector("a");
      last.focus();
      act(() => last.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true })));
      assert(document.activeElement === first, "Forward focus escaped");
      act(() => first.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true, cancelable: true })));
      assert(document.activeElement === last, "Reverse focus escaped");
    });
    act(() => target.querySelector("dialog").dispatchEvent(new Event("cancel", { cancelable: true })));
    check("Modal: Escape cancel event closes and restores opener", () => {
      assert(!target.querySelector("dialog") && document.activeElement === host.querySelector("button"), "Cancel failed");
    });
    open();
    act(() => target.querySelector("dialog > div").click());
    check("Modal: backdrop closes", () => assert(!target.querySelector("dialog"), "Backdrop failed"));
    open();
    act(() => { reduce = false; subscriptions.forEach((callback) => callback()); });
    act(() => { reduce = true; subscriptions.forEach((callback) => callback()); });
    await settle();
    check("Modal: simulated live reduce settles card in final position", () => {
      const card = target.querySelector("dialog > div > div");
      assert(card.style.opacity === "1" && (!card.style.transform || card.style.transform === "none"), "Card remained hidden/displaced");
    });
    act(() => root.unmount()); root = null;
    check("Modal: open unmount restores document and subscriptions", () => {
      assert(!target.querySelector("dialog") && subscriptions.size === 0, "Portal/subscription leaked");
      assert(document.body.style.overflowY === previousOverflow && document.body.style.paddingRight === previousPadding, "Unmount leaked scroll lock");
    });
    // Mutating the old target after unmount must not resurrect the portal.
    target.append(document.createElement("span")); await settle();
    check("Modal: post-unmount mutations do not reopen", () => assert(!target.querySelector("dialog"), "Detached observer reopened modal"));
  } finally {
    if (root) act(() => root.unmount());
    target.remove();
    window.matchMedia = media;
    document.body.style.overflowY = previousOverflow;
    document.body.style.paddingRight = previousPadding;
  }
}
