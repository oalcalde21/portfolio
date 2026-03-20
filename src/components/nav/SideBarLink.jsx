/**
 * SideBarLink - individual navigation link for the sidebar.
 * 
 * This component renders as a vertical link that:
 * - Shows a highlighted state when its section is visible (selected prop)
 * - Animates in from the left when the page loads
 * - Smoothly scrolls to the target section on click
 */

// MotionLink wraps Next's Link with animation capabilities from framer-motion
import { motion } from "framer-motion";
import Link from "next/link";

const MotionLink = motion(Link);

export const SideBarLink = ({
  setSelected,
  selected,
  children,
  href,
  value,
}) => {
  return (
    <MotionLink
      initial={{ x: -70 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      href={href}
      onClick={() => {
        // Update selected state so this link stays highlighted
        setSelected(value);
      }}
      // Conditional styling: green border and full opacity when selected
      className={`writing-vertical h-24 shrink-0 flex items-center justify-center border-r-2 text-sm transition-all w-full ${
        selected === value
          ? "bg-zinc-800 border-green-400 opacity-100"
          : "border-transparent hover:border-r-zinc-50 opacity-50 hover:bg-zinc-900"
      }`}
    >
      {children}
    </MotionLink>
  );
};
