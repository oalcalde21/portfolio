/**
 * SectionHeader - decorative header for each section.
 * 
 * Renders a section title with a horizontal line extending from it.
 * The direction can be:
 * - "r" (default): line extends to the right
 * - "l": line extends to the left
 * 
 * The title has a green accent dot at the end.
 */

import { Reveal } from "./Reveal";

export const SectionHeader = ({ title, dir = "r", id }) => {
  return (
    <div
      className="flex items-center gap-8 mb-12"
      style={{ flexDirection: dir === "r" ? "row" : "row-reverse" }}
    >
      {/* The horizontal line */}
      <div className="w-full h-[1px] bg-zinc-700" />
      
      {/* The title with green dot */}
      <h2 id={id} className="shrink-0">
        <Reveal>
          <span className="text-3xl md:text-5xl font-black whitespace-nowrap">
            {title}
            <span className="text-green-400">.</span>
          </span>
        </Reveal>
      </h2>
    </div>
  );
};
