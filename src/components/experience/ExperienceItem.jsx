import { Chip } from "../util/Chip";
import Reveal from "../util/Reveal";
import { useLanguage } from "../../context/LanguageContext";

const expKeys = {
  "RCI Latinoamericana (Travel + Leisure)": { title: "expRciTitle", pos: "expRciPos", desc: "expRciDesc" },
  "ITS - Infrastructure Technology Services": { title: "expItsTitle", pos: "expItsPos", desc: "expItsDesc" },
  "Infocorp": { title: "expInfoTitle", pos: "expInfoPos", desc: "expInfoDesc" },
};

export const ExperienceItem = ({ title, position, time, location, description, tech }) => {
  const { t } = useLanguage();
  const keys = expKeys[title] || {};
  
  const translatedTitle = keys.title ? t(keys.title) : title;
  const translatedPos = keys.pos ? t(keys.pos) : position;
  const translatedDesc = keys.desc ? t(keys.desc) : description;

  return (
    <div className="mb-6 border-b pb-6 border-zinc-700">
      <div className="flex items-center justify-between mb-2">
        <Reveal>
          <span className="font-bold text-xl">{translatedTitle}</span>
        </Reveal>
        <Reveal>
          <span>{time}</span>
        </Reveal>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Reveal>
          <span className="text-green-400 font-bold">{translatedPos}</span>
        </Reveal>
        <Reveal>
          <span>{location}</span>
        </Reveal>
      </div>
      <Reveal>
        <p className="mb-6 text-zinc-300 leading-relaxed">{translatedDesc}</p>
      </Reveal>
      <Reveal>
        <div className="flex flex-wrap gap-2">
          {tech.map((item) => (
            <Chip key={item}>{item}</Chip>
          ))}
        </div>
      </Reveal>
    </div>
  );
};
