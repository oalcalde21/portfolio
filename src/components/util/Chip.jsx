/**
 * Chip - a small tag/label component for displaying technologies.
 * 
 * Used to show skills and technologies in the About and Experience sections.
 * Simple, understated styling with a dark background and small text.
 */

import React from "react";

export const Chip = ({ children }) => {
  return (
    <span className="text-xs px-2 py-1 rounded bg-zinc-700">{children}</span>
  );
};
