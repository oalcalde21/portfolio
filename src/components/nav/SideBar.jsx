/**
 * SideBar - the vertical navigation on the left side of the screen.
 * 
 * This component:
 * - Stays fixed on the left while the user scrolls
 * - Shows navigation links (About, Projects, Experience, Contact)
 * - Highlights the current section based on scroll position
 * 
 * It uses IntersectionObserver to detect which section is currently
 * visible on screen and updates the "selected" state accordingly.
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SideBarLink } from "./SideBarLink";
import { useLanguage } from "../../context/LanguageContext";

export const SideBar = () => {
  const { t } = useLanguage();
  // Tracks which section is currently visible (highlighted in the sidebar)
  const [selected, setSelected] = useState("");

  // Set up intersection observer to track scroll position
  useEffect(() => {
    // Get all sections with the "section-wrapper" class
    const sections = document.querySelectorAll(".section-wrapper");

    const options = {
      threshold: 0.3, // Section is considered "visible" when 30% is on screen
    };

    // Update selected state when a section comes into view
    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setSelected(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);

    // Start watching all sections
    sections.forEach((section) => observer.observe(section));
    
    // Cleanup when component unmounts
    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      initial={{ x: -70 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className="no-scrollbar bg-zinc-950 h-screen sticky top-0 left-0 z-20 flex flex-col items-center overflow-y-scroll"
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
