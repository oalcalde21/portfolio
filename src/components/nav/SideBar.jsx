/**
 * SideBar - the vertical navigation on the left side of the screen.
 * 
 * This component:
 * - Stays fixed on the left while the user scrolls
 * - Shows navigation links (About, Projects, Experience, Contact)
 * - Highlights the current section based on scroll position
 * 
 * Tracks the reading position, including sections replaced by language changes.
 */

import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { SideBarLink } from "./SideBarLink";
import { useLanguage } from "../../context/LanguageContext";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

export const SideBar = () => {
  const { t } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const controls = useAnimation();

  useEffect(() => {
    if (reducedMotion) {
      controls.stop();
      controls.set({ x: 0 });
    } else {
      controls.start({ x: 0, transition: { duration: 0.5 } });
    }
  }, [controls, reducedMotion]);
  // Tracks which section is currently visible (highlighted in the sidebar)
  const [selected, setSelected] = useState("");

  // Section heights can exceed the viewport; track the reading line instead
  // of requiring a percentage of an entire section to be visible.
  useEffect(() => {
    const content = document.getElementById("main-content");
    if (!content) return;
    let sections = Array.from(content.querySelectorAll(".section-wrapper"));
    let frame = null;

    const updateSelected = () => {
      frame = null;
      const readingLine = content.querySelector("header")?.getBoundingClientRect().height || 0;
      let active = "";
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= readingLine + 1) active = section.id;
      });
      // The last section may not be tall enough to reach the reading line.
      if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1) {
        active = sections.at(-1)?.id || "";
      }
      setSelected(active);
    };
    const scheduleUpdate = () => {
      if (frame === null) frame = window.requestAnimationFrame(updateSelected);
    };
    // AnimatePresence replaces the page after its exit finishes, so depending
    // on the language key alone would still subscribe to the outgoing nodes.
    const observer = new MutationObserver(() => {
      const next = Array.from(content.querySelectorAll(".section-wrapper"));
      if (next.length !== sections.length || next.some((section, index) => section !== sections[index])) {
        sections = next;
        scheduleUpdate();
      }
    });
    observer.observe(content, { childList: true, subtree: true });
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    scheduleUpdate();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <motion.nav
      initial={{ x: -70 }}
      animate={controls}
      transition={{ duration: 0.5 }}
      aria-label={t("navLabel")}
      className="motion-sidebar no-scrollbar bg-zinc-950 h-screen sticky top-0 left-0 z-20 flex flex-col items-center overflow-y-scroll"
    >
      {/* Logo mark at the top */}
      <span className="shrink-0 text-xl font-black leading-[1] size-10 flex items-center justify-center my-4">
        O<span className="text-green-400">.</span>
      </span>
      
      {/* Navigation links - each links to a section by ID */}
      <SideBarLink selected={selected} setSelected={setSelected} value="about" href="#about">
        {t("navAbout")}
      </SideBarLink>
      <SideBarLink selected={selected} setSelected={setSelected} value="projects" href="#projects">
        {t("navProjects")}
      </SideBarLink>
      <SideBarLink selected={selected} setSelected={setSelected} value="experience" href="#experience">
        {t("navExp")}
      </SideBarLink>
      <SideBarLink selected={selected} setSelected={setSelected} value="contact" href="#contact">
        {t("navContact")}
      </SideBarLink>
    </motion.nav>
  );
};
