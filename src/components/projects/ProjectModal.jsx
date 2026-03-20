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
 * Uses ReactDOM.createPortal to render above everything else.
 */

import { useEffect } from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import Link from "next/link";
import { AiOutlineExport } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import { useLanguage } from "../../context/LanguageContext";

export const ProjectModal = ({ modalContent, projectLink, setIsOpen, imgSrc, isOpen, title, code, tech }) => {
  const { t } = useLanguage();

  // Lock/unlock body scroll when modal opens/closes
  useEffect(() => {
    const body = document.querySelector("body");
    if (isOpen) {
      body.style.overflowY = "hidden"; // Prevent background scrolling
    } else {
      body.style.overflowY = "scroll";
    }
  }, [isOpen]);

  // The modal content - rendered as a portal
  const content = (
    // Clicking the backdrop closes the modal
    <div className="fixed inset-0 z-50 px-4 py-12 bg-zinc-950/50 backdrop-blur overflow-y-scroll flex justify-center cursor-pointer" onClick={() => setIsOpen(false)}>
      {/* Close button */}
      <button className="absolute top-4 md:top-6 text-xl right-4"><MdClose /></button>
      
      {/* Modal card - clicking it doesn't close (stops propagation) */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl h-fit rounded-lg overflow-hidden bg-zinc-900 shadow-lg cursor-auto"
      >
        {imgSrc && <img className="w-full" src={imgSrc} alt={`An image of the ${title} project.`} />}
        <div className="p-8">
          <h4 className="text-3xl font-bold mb-2">{title}</h4>
          <div className="flex flex-wrap gap-2 text-sm text-green-400">{tech.join(" - ")}</div>
          <div className="space-y-4 my-6 leading-relaxed text-sm text-zinc-300">{modalContent}</div>
          <div>
            <p className="font-bold mb-2 text-xl">{t("projectLinks")}<span className="text-green-400">.</span></p>
            <div className="flex items-center gap-4 text-sm">
              {projectLink && (
                <Link target="_blank" rel="nofollow" className="text-zinc-300 hover:text-green-400 transition-colors flex items-center gap-1" href={projectLink}>
                  <AiOutlineExport /> {t("projectLiveProject")}
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // Only render if open
  if (!isOpen) return null;
  
  // Portal renders the modal at the root level (outside the main component tree)
  return ReactDOM.createPortal(content, document.getElementById("root"));
};
