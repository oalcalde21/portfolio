/**
 * ProjectModal - detailed view for a project, shown as an overlay.
 * 
 * Opens when the user clicks "Learn more" on a project card.
 * Shows:
 * - Large project screenshot
 * - Full title and technology tags
 * - Detailed description
 * - Link to the live project
 * 
 * Clicking outside the modal or the X button closes it.
 * Uses a native modal dialog in a portal to isolate the background.
 */

import { useCallback, useEffect, useId, useRef, useSyncExternalStore } from "react";
import ReactDOM from "react-dom";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import { AiOutlineExport } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import { useLanguage } from "../../context/LanguageContext";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

function getPortalContainer() {
  return document.getElementById("root");
}

function getServerPortalContainer() {
  return null;
}

export const ProjectModal = ({ modalContent, projectLink, setIsOpen, imgSrc, isOpen, title, tech, openerRef }) => {
  const { t } = useLanguage();
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const titleId = useId();
  const reducedMotion = usePrefersReducedMotion();
  const controls = useAnimation();
  const subscribeToPortal = useCallback((onChange) => {
    if (!isOpen) return () => {};
    const observer = new MutationObserver(onChange);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["id"],
    });
    return () => observer.disconnect();
  }, [isOpen]);
  // The server and first hydration render agree; resolve the portal afterwards.
  // Observe an absent/replaced target so opening can recover without polling.
  const portalContainer = useSyncExternalStore(subscribeToPortal, getPortalContainer, getServerPortalContainer);

  useEffect(() => {
    if (!isOpen || !portalContainer) return;
    if (reducedMotion) {
      controls.stop();
      controls.set({ y: 0, opacity: 1 });
    } else {
      controls.start({ y: 0, opacity: 1 });
    }
    return () => controls.stop();
  }, [controls, isOpen, reducedMotion, portalContainer]);

  // showModal makes the background inert; restore global state on every exit.
  useEffect(() => {
    if (!isOpen || !portalContainer) return;

    const dialog = dialogRef.current;
    const opener = openerRef.current || document.activeElement;
    const previousOverflow = document.body.style.overflowY;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const paddingRight = parseFloat(getComputedStyle(document.body).paddingRight);
    const { scrollX, scrollY } = window;

    document.body.style.overflowY = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${paddingRight + scrollbarWidth}px`;
    }
    // Stop an in-flight anchor/focus scroll before locking the modal position.
    window.scrollTo({ left: scrollX, top: scrollY, behavior: "instant" });
    dialog.showModal();
    closeButtonRef.current.focus({ preventScroll: true });

    return () => {
      dialog.close();
      document.body.style.overflowY = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
      window.scrollTo({ left: scrollX, top: scrollY, behavior: "instant" });
    };
  }, [isOpen, openerRef, portalContainer]);

  const containTab = (event) => {
    if (event.key !== "Tab") return;
    const controls = dialogRef.current.querySelectorAll('button:not([disabled]), a[href]');
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus({ preventScroll: true });
      last.scrollIntoView({ block: "nearest", behavior: "instant" });
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus({ preventScroll: true });
      first.scrollIntoView({ block: "nearest", behavior: "instant" });
    }
  };

  if (!isOpen || !portalContainer) return null;

  // The modal content - rendered as a portal
  const content = (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-modal="true"
      onCancel={(event) => {
        event.preventDefault();
        setIsOpen(false);
      }}
      onKeyDown={containTab}
      className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 text-inherit backdrop:bg-transparent"
    >
      {/* Clicking the backdrop closes the modal */}
      <div className="fixed inset-0 z-50 px-4 py-12 bg-zinc-950/50 backdrop-blur overflow-y-scroll flex justify-center cursor-pointer" onClick={() => setIsOpen(false)}>
        {/* Close button */}
        <button ref={closeButtonRef} type="button" onClick={() => setIsOpen(false)} aria-label={t("projectCloseModal")} className="absolute top-4 md:top-6 text-xl right-4"><MdClose aria-hidden="true" /></button>
      
        {/* Modal card - clicking it doesn't close (stops propagation) */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={controls}
          onClick={(e) => e.stopPropagation()}
          className="motion-entrance w-full max-w-2xl h-fit rounded-lg overflow-hidden bg-zinc-900 shadow-lg cursor-auto"
        >
          {imgSrc && <img className="w-full" src={imgSrc} alt={`${t("projectImageAlt")} ${title}`} width={800} height={450} loading="lazy" />}
          <div className="p-8">
            <h2 id={titleId} className="text-3xl font-bold mb-2">{title}</h2>
            <div className="flex flex-wrap gap-2 text-sm text-green-400">{tech.join(" - ")}</div>
            <div className="space-y-4 my-6 leading-relaxed text-sm text-zinc-300">{modalContent}</div>
            <div>
              <p className="font-bold mb-2 text-xl">{t("projectLinks")}<span className="text-green-400">.</span></p>
              <div className="flex items-center gap-4 text-sm">
                {projectLink && (
                  <Link target="_blank" rel="noopener noreferrer" aria-label={t("projectLiveProject")} className="text-zinc-300 hover:text-green-400 transition-colors flex items-center gap-1" href={projectLink}>
                    <AiOutlineExport aria-hidden="true" /> {t("projectLiveProject")}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </dialog>
  );

  // Portal renders the modal at the root level (outside the main component tree)
  return ReactDOM.createPortal(content, portalContainer);
};
