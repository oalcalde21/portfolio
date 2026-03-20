import { useAnimation, useInView, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AiOutlineExport } from "react-icons/ai";
import { ProjectModal } from "./ProjectModal";
import Reveal from "../util/Reveal";
import { useLanguage } from "../../context/LanguageContext";

const projectKeys = {
  "Plenitud Fit": { title: "plenitudTitle", desc: "plenitudDescription", m1: "plenitudModal1", m2: "plenitudModal2", m3: "plenitudModal3" },
  "CFR Estudio": { title: "cfrTitle", desc: "cfrDescription", m1: "cfrModal1", m2: "cfrModal2", m3: "cfrModal3" },
  "Revision Automotriz": { title: "revisionTitle", desc: "revisionDescription", m1: "revisionModal1", m2: "revisionModal2", m3: "revisionModal3" },
};

export const Project = ({ projectLink, description, imgSrc, title, code, tech }) => {
  const { t } = useLanguage();
  const [hovered, setHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const keys = projectKeys[title] || {};

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);

  const translatedTitle = keys.title ? t(keys.title) : title;
  const translatedDesc = keys.desc ? t(keys.desc) : description;

  const modalContent = keys.m1 ? (
    <>
      <p>{t(keys.m1)}</p>
      <p>{t(keys.m2)}</p>
      <p>{t(keys.m3)}</p>
    </>
  ) : null;

  return (
    <>
      <motion.div
        ref={ref}
        variants={{ hidden: { opacity: 0, y: 100 }, visible: { opacity: 1, y: 0 } }}
        initial="hidden"
        animate={controls}
        transition={{ duration: 0.75 }}
      >
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => setIsOpen(true)}
          className="w-full aspect-video bg-zinc-700 cursor-pointer relative rounded-lg overflow-hidden"
        >
          <img
            src={imgSrc}
            alt={`An image of the ${translatedTitle} project.`}
            style={{ width: hovered ? "90%" : "85%", rotate: hovered ? "2deg" : "0deg" }}
            className="w-[100%] absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 transition-all rounded"
          />
        </div>
        <div className="mt-6">
          <Reveal width="w-full">
            <div className="flex items-center gap-2 w-full">
              <h4 className="font-bold text-lg shrink-0 max-w-[calc(100%_-_150px)]">{translatedTitle}</h4>
              <div className="w-full h-[1px] bg-zinc-600" />
              {code && (
                <span className="text-zinc-500 text-sm">Code</span>
              )}
              <Link href={projectLink} target="_blank" rel="nofollow">
                <AiOutlineExport className="text-xl text-zinc-300 hover:text-green-400 transition-colors" />
              </Link>
            </div>
          </Reveal>
          <Reveal>
            <div className="flex flex-wrap gap-4 text-sm text-green-400 my-2">{tech.join(" - ")}</div>
          </Reveal>
          <Reveal>
            <p className="text-zinc-300 leading-relaxed">
              {translatedDesc}{" "}
              <span className="inline-block text-sm text-green-400 cursor-pointer" onClick={() => setIsOpen(true)}>
                {t("projectLearnMore")} {">"}
              </span>
            </p>
          </Reveal>
        </div>
      </motion.div>
      <ProjectModal
        modalContent={modalContent}
        projectLink={projectLink}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        imgSrc={imgSrc}
        title={translatedTitle}
        code={code}
        tech={tech}
      />
    </>
  );
};
