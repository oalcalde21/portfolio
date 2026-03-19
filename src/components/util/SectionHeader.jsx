import { Reveal } from "./Reveal";

export const SectionHeader = ({ title, dir = "r" }) => {
  return (
    <div
      className="flex items-center gap-8 mb-12"
      style={{ flexDirection: dir === "r" ? "row" : "row-reverse" }}
    >
      <div className="w-full h-[1px] bg-zinc-700" />
      <h2 className="shrink-0">
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
