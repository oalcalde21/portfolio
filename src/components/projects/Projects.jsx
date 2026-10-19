/**
 * Projects section - showcases Oscar's portfolio work.
 * 
 * Displays project cards in a responsive grid:
 * - 1 column on mobile
 * - 2 columns on medium+ screens
 * 
 * Each project is rendered by the Project component.
 * Projects are defined as a static array at the bottom of this file.
 */

import React from "react";
import { SectionHeader } from "../util/SectionHeader";
import { Project } from "./Project";
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton } from "../buttons/OutlineButton";

export const Projects = ({ showAll = false, onToggle }) => {
  const { t } = useLanguage();
  return (
    <section className="section-wrapper" id="projects" aria-labelledby="projects-heading">
      <SectionHeader title={t("projectsTitle")} dir="r" id="projects-heading" />
      <div className="grid gap-12 grid-cols-1 md:grid-cols-2">
        {projects.slice(0, 4).map((project) => {
          return <Project key={project.title} {...project} />;
        })}
      </div>
      <div className="mt-12 flex justify-center">
        <OutlineButton type="button" onClick={onToggle} aria-expanded={showAll} aria-controls="additional-projects">
          {t(showAll ? "projectsShowLess" : "projectsShowMore")}
        </OutlineButton>
      </div>
      <div id="additional-projects" hidden={!showAll}>
        {showAll && (
          <div className="mt-12 grid gap-12 grid-cols-1 md:grid-cols-2">
            {projects.slice(4).map((project) => <Project key={project.title} {...project} />)}
          </div>
        )}
      </div>
    </section>
  );
};

// Project data - each project has its title, image, link, and technologies used
const projects = [
  {
    title: "Seguros Guerrero e Hijos",
    imgSrc: "/project-imgs/seguros-guerrero-e-hijos.webp",
    projectLink: "https://segurosguerreroehijos.uy/",
    tech: ["React", "Tailwind"],
  },
  {
    title: "PrimerPaso",
    imgSrc: "/project-imgs/primerpaso.webp",
    projectLink: "https://www.primerpaso.uy/",
    tech: ["React", "Tailwind"],
  },
  {
    title: "Plenitud Fit",
    imgSrc: "project-imgs/plenitud.png",
    projectLink: "https://plenitudfit.com.uy",
    tech: ["React", "CSS"],
  },
  {
    title: "CFR Estudio",
    imgSrc: "project-imgs/cfrestudio.png",
    projectLink: "https://cfrestudio.com/",
    tech: ["React", "CSS"],
  },
  {
    title: "Revision Automotriz",
    imgSrc: "project-imgs/revisionautomotriz.png",
    projectLink: "https://revisionautomotriz.com/",
    tech: ["React", "Bootstrap"],
  },
  {
    title: "AltasWeb",
    imgSrc: "project-imgs/altasweb.png",
    projectLink: "https://altasweb.uy",
    tech: ["React", "Next.js", "Tailwind"],
  },
];
