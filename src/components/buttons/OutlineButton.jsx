/**
 * OutlineButton - a reusable button with a cool fill animation on hover.
 * 
 * The button has a white border and text, but when you hover over it,
 * the background fills in from the corner with a nice scaling effect.
 * 
 * It's used for the Resume/CV button in the header.
 * Accepts any props that a regular button would (onClick, children, etc.)
 */

import React from "react";
import { twMerge } from "tailwind-merge";

export const OutlineButton = ({ children, className, ...rest }) => {
  return (
    <button
      className={twMerge(
        // Base button styles: white border, white text
        `relative z-0 flex items-center justify-center gap-2 overflow-hidden rounded-md border-[1px] 
        border-white px-4 py-2 font-medium text-sm min-w-[120px]
        text-white transition-all duration-300
        
        // The "before" pseudo-element creates the fill animation
        // It starts scaled up and hidden off-screen, then moves into view on hover
        before:absolute before:inset-0
        before:-z-10 before:translate-x-[150%]
        before:translate-y-[150%] before:scale-[2.5]
        before:rounded-[100%] before:bg-white
        before:transition-transform before:duration-1000
        before:content-[""]

        // Hover state: text turns dark, the fill animation plays
        hover:text-zinc-950
        hover:before:translate-x-[0%]
        hover:before:translate-y-[0%]
        
        // Active/click state: slight scale down
        active:scale-95`,
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
