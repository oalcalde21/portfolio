/**
 * Reveal - a wrapper that animates its children into view.
 * 
 * When the element scrolls into the viewport, it:
 * 1. Fades in (opacity 0 -> 1)
 * 2. Slides up (y: 75 -> 0)
 * 
 * The animation only plays once (once: true) so it doesn't
 * re-trigger every time the user scrolls up and down.
 * 
 * There's also a "wipe" effect - a green bar that sweeps across
 * from left to right as the content reveals.
 */

import { useEffect, useRef } from "react";
import { useAnimation, useInView, motion } from "framer-motion";

export const Reveal = ({ children, width = "w-fit" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const mainControls = useAnimation();
  const slideControls = useAnimation();

  // Trigger animation when element comes into view
  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
      slideControls.start("visible");
    }
  }, [isInView]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${width}`}>
      {/* Main content - fades and slides up */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {children}
      </motion.div>
      
      {/* The green "wipe" bar that sweeps across */}
      <motion.div
        variants={{
          hidden: { left: 0 },
          visible: { left: "100%" },
        }}
        initial="hidden"
        animate={slideControls}
        transition={{ duration: 0.5, ease: "easeIn" }}
        className="absolute bottom-1 left-0 right-0 top-1 z-20 bg-green-400"
      />
    </div>
  );
};

export default Reveal;
