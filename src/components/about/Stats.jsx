/**
 * Stats component - displays skill chips in the About section.
 * 
 * Skills are divided into two categories:
 * 1. IT operations and automation
 * 2. Development and delivery
 * 
 * Each skill is rendered as a Chip component with a subtle border.
 */

import { Chip } from "../util/Chip";
import Reveal from "../util/Reveal";
// Icons for visual flair
import { AiFillCode, AiFillSmile } from "react-icons/ai";
import { useLanguage } from "../../context/LanguageContext";

export const Stats = () => {
  const { t } = useLanguage();
  return (
    <div className="relative">
      {/* Work skills section */}
      <Reveal>
        <div>
          <h3 className="flex items-center mb-6">
            <AiFillCode className="text-green-400 text-2xl" aria-hidden="true" />
            <span className="font-bold ml-2">{t("statsUseAtWork")}</span>
          </h3>
          <div className="flex flex-wrap gap-2 mb-12">
            <Chip>{t("statsWindows")}</Chip>
            <Chip>{t("statsNetwork")}</Chip>
            <Chip>{t("statsTroubleshooting")}</Chip>
            <Chip>{t("statsDocumentation")}</Chip>
            <Chip>{t("statsServiceNow")}</Chip>
            <Chip>{t("statsIntune")}</Chip>
            <Chip>{t("statsMicrosoft")}</Chip>
            <Chip>{t("statsApple")}</Chip>
            <Chip>{t("statsHardware")}</Chip>
            <Chip>Autopilot / BitLocker</Chip>
            <Chip>CrowdStrike</Chip>
            <Chip>Power Automate Desktop</Chip>
            <Chip>BAT / PowerShell</Chip>
          </div>
        </div>
      </Reveal>
      
      {/* Development and delivery skills */}
      <Reveal>
        <div>
          <h3 className="flex items-center mb-6">
            <AiFillSmile className="text-green-400 text-2xl" aria-hidden="true" />
            <span className="font-bold ml-2">{t("statsUseForFun")}</span>
          </h3>
          <div className="flex flex-wrap gap-2 mb-12">
            <Chip>{t("statsJS")}</Chip>
            <Chip>{t("statsReact")}</Chip>
            <Chip>{t("statsTailwind")}</Chip>
            <Chip>{t("statsHTML")}</Chip>
            <Chip>{t("statsCSS")}</Chip>
            <Chip>{t("statsGit")}</Chip>
            <Chip>{t("statsGitHub")}</Chip>
            <Chip>Vite</Chip>
            <Chip>Supabase / PostgreSQL</Chip>
            <Chip>Vercel</Chip>
          </div>
        </div>
      </Reveal>
    </div>
  );
};
