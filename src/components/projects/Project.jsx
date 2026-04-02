/**
 * Project component - individual project card.
 * 
 * Each project card shows:
 * - A screenshot/image that tilts and enlarges on hover
 * - Title with a link to the live project
 * - Technology tags
 * - Short description with a "Learn more" button
 * 
 * Clicking "Learn more" opens a modal with more details.
 * The card animates in when it comes into view.
 */

import { useAnimation, useInView, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AiOutlineExport } from "react-icons/ai";
import { ProjectModal } from "./ProjectModal";
import Reveal from "../util/Reveal";
import { useLanguage } from "../../context/LanguageContext";

// Maps project titles to their translation keys
const projectKeys = {
  "Plenitud Fit": { title: "plenitudTitle", desc: "plenitudDescription", m1: "plenitudModal1", m2: "plenitudModal2", m3: "plenitudModal3" },
  "CFR Estudio": { title: "cfrTitle", desc: "cfrDescription", m1: "cfrModal1", m2: "cfrModal2", m3: "cfrModal3" },
  "Revision Automotriz": { title: "revisionTitle", desc: "revisionDescription", m1: "revisionModal1", m2: "revisionModal2", m3: "revisionModal3" },
  "AltasWeb": { title: "altaswebTitle", desc: "altaswebDescription", m1: "altaswebModal1", m2: "altaswebModal2", m3: "altaswebModal3" },
};

export const Project = ({ projectLink, description, imgSrc, title, tech }) => {
  const { t } = useLanguage();
  const [hovered, setHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  // Get translation keys for this project
  const keys = projectKeys[title] || {};

  // Animate in when the card comes into view
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);

  // Translate title and description
  const translatedTitle = keys.title ? t(keys.title) : title;
  const translatedDesc = keys.desc ? t(keys.desc) : description;

  // Build modal content from translation keys
  const modalContent = keys.m1 ? (
    <>
      <p>{t(keys.m1)}</p>
      <p>{t(keys.m2)}</p>
      <p>{t(keys.m3)}</p>
    </>
  ) : null;

  return (
    <>
      {/* Animated card container */}
      <motion.div
        ref={ref}
        variants={{ hidden: { opacity: 0, y: 100 }, visible: { opacity: 1, y: 0 } }}
        initial="hidden"
        animate={controls}
        transition={{ duration: 0.75 }}
      >
        {/* Project screenshot - interactive hover effect */}
        <button
          type="button"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => setIsOpen(true)}
          aria-label={`View details for ${translatedTitle}`}
          className="w-full aspect-video bg-zinc-700 cursor-pointer relative rounded-lg overflow-hidden"
        >
          <img
            src={imgSrc}
            alt={`Screenshot of ${translatedTitle} project`}
            width={800}
            height={450}
            loading="lazy"
            style={{ width: hovered ? "90%" : "85%", rotate: hovered ? "2deg" : "0deg" }}
            className="w-[100%] absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-3 transition-all rounded"
          />
        </button>
        
        {/* Project info below the image */}
        <div className="mt-6">
          {/* Title row with link */}
          <Reveal width="w-full">
            <div className="flex items-center gap-2 w-full">
              <h4 className="font-bold text-lg shrink-0 max-w-[calc(100%_-_150px)]">{translatedTitle}</h4>
              <div className="w-full h-[1px] bg-zinc-600" />
              <Link href={projectLink} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${translatedTitle} website`}>
                <AiOutlineExport className="text-xl text-zinc-300 hover:text-green-400 transition-colors" />
              </Link>
            </div>
          </Reveal>
          
          {/* Technology tags */}
          <Reveal>
            <div className="flex flex-wrap gap-4 text-sm text-green-400 my-2">{tech.join(" - ")}</div>
          </Reveal>
          
          {/* Description with "Learn more" button */}
          <Reveal>
            <p className="text-zinc-300 leading-relaxed">
              {translatedDesc}{" "}
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="inline-block text-sm text-green-400 cursor-pointer hover:underline"
              >
                {t("projectLearnMore")} {">"}
              </button>
            </p>
          </Reveal>
        </div>
      </motion.div>
      
      {/* Modal with more details */}
      <ProjectModal
        modalContent={modalContent}
        projectLink={projectLink}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        imgSrc={imgSrc}
        title={translatedTitle}
        tech={tech}
      />
    </>
  );
};
