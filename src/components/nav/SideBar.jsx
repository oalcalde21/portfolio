import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SideBarLink } from "./SideBarLink";
import { useLanguage } from "../../context/LanguageContext";

export const SideBar = () => {
  const { t } = useLanguage();
  const [selected, setSelected] = useState("");

  useEffect(() => {
    const sections = document.querySelectorAll(".section-wrapper");

    const options = {
      threshold: 0.3,
    };

    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setSelected(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);

    sections.forEach((section) => observer.observe(section));
  }, []);

  return (
    <motion.nav
      initial={{ x: -70 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className="no-scrollbar bg-zinc-950 h-screen sticky top-0 left-0 z-20 flex flex-col items-center overflow-y-scroll"
    >
      <span className="shrink-0 text-xl font-black leading-[1] size-10 flex items-center justify-center my-4">
        O<span className="text-green-400">.</span>
      </span>
      <SideBarLink
        selected={selected}
        setSelected={setSelected}
        value="about"
        href="#about"
      >
        {t("navAbout")}
      </SideBarLink>
      <SideBarLink
        selected={selected}
        setSelected={setSelected}
        value="projects"
        href="#projects"
      >
        {t("navProjects")}
      </SideBarLink>
      <SideBarLink
        selected={selected}
        setSelected={setSelected}
        value="experience"
        href="#experience"
      >
        {t("navExp")}
      </SideBarLink>
      <SideBarLink
        selected={selected}
        setSelected={setSelected}
        value="contact"
        href="#contact"
      >
        {t("navContact")}
      </SideBarLink>
    </motion.nav>
  );
};
