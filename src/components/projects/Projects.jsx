import React from "react";
import { SectionHeader } from "../util/SectionHeader";
import { Project } from "./Project";
import { useLanguage } from "../../context/LanguageContext";

export const Projects = () => {
  const { t } = useLanguage();
  return (
    <section className="section-wrapper" id="projects">
      <SectionHeader title={t("projectsTitle")} dir="r" />
      <div className="grid gap-12 grid-cols-1 md:grid-cols-2">
        {projects.map((project) => {
          return <Project key={project.title} {...project} />;
        })}
      </div>
    </section>
  );
};

const projects = [
  {
    title: "PlenitudFit",
    imgSrc: "project-imgs/plenitud.png",
    projectLink: "https://plenitudfit.com.uy",
    tech: ["NextJS", "Tailwind", "React"],
    description: "Landing page para gimnasio de entrenamiento funcional en Montevideo, Uruguay. Diseño moderno y responsive.",
    modalContent: (
      <>
        <p>PlenitudFit es un gimnasio de entrenamiento funcional ubicado en Montevideo, Uruguay. Operando desde 2016, se especializan en entrenamiento deportivo y promoción de vida saludable.</p>
        <p>Desarrollo una landing page moderna y responsive que presenta sus servicios, actividades, horarios y planes de membresía de forma clara y atractiva.</p>
        <p>El sitio web ayuda a nuevos miembros a conocer el gimnasio, ver horarios de clases y obtener información de contacto de manera rápida y sencilla.</p>
      </>
    ),
  },
  {
    title: "CFR Estudio",
    imgSrc: "project-imgs/cfrestudio.png",
    projectLink: "https://cfrestudio.com/",
    tech: ["NextJS", "Tailwind", "React"],
    description: "Sitio web para estudio de arquitectura en Montevideo, Uruguay. Presenta proyectos y servicios de arquitectura.",
    modalContent: (
      <>
        <p>CFR Estudio es un estudio de arquitectura ubicado en Montevideo, Uruguay, especializado en proyectos residenciales y comerciales.</p>
        <p>Desarrollo un sitio web profesional que muestra su portafolio de proyectos, servicios ofrecidos e información de contacto.</p>
        <p>El diseño refleja la estética arquitectónica del estudio, con un enfoque en la presentación visual de sus obras y proyectos.</p>
      </>
    ),
  },
  {
    title: "Revision Automotriz",
    imgSrc: "project-imgs/revisionautomotriz.png",
    projectLink: "https://revisionautomotriz.com/",
    tech: ["React", "Bootstrap"],
    description: "Sitio web para servicio de revisión de vehículos usados en Uruguay. Presenta servicios de inspección automotriz.",
    modalContent: (
      <>
        <p>Revision Automotriz es un servicio de inspección vehicular que ayuda a compradores de vehículos usados a tomar decisiones informadas.</p>
        <p>Desarrollo el sitio web con React y Bootstrap, presentando sus servicios de revisión de más de 200 puntos del vehículo.</p>
        <p>El sitio incluye información sobre el proceso de inspección, beneficios del servicio y formas de contacto para solicitar una revisión.</p>
      </>
    ),
  },
];
