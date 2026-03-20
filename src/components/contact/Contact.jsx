/**
 * Contact section - a simple call-to-action area at the bottom.
 * 
 * Shows:
 * - Section title
 * - Text inviting contact, with links to LinkedIn and GitHub
 * - Email address as a clickable link
 * 
 * All links open in new tabs.
 */

import { AiFillMail } from "react-icons/ai";
import Link from "next/link";
import Reveal from "../util/Reveal";
import { useLanguage } from "../../context/LanguageContext";

export const Contact = () => {
  const { t } = useLanguage();
  return (
    <section className="section-wrapper" id="contact">
      <div className="max-w-xl mx-auto bg-zinc-800 px-8 py-12 rounded-xl">
        {/* Section title */}
        <Reveal width="w-full">
          <h4 className="text-4xl md:text-5xl text-center font-black">
            {t("contactTitle")}<span className="text-green-400">.</span>
          </h4>
        </Reveal>
        
        {/* Contact text with social links */}
        <Reveal width="w-full">
          <p className="text-center my-8 text-zinc-300 leading-relaxed">
            {t("contactText")}{" "}
            <Link
              href="https://www.linkedin.com"
              target="_blank"
              className="text-green-400 hover:underline"
            >
              {t("contactLinkedin")}
            </Link>{" "}
            {t("contactOr")}{" "}
            <Link
              href="https://github.com/oalcalde21"
              target="_blank"
              className="text-green-400 hover:underline"
            >
              {t("contactTwitter")}
            </Link>
          </p>
        </Reveal>
        
        {/* Email link */}
        <Reveal width="w-full">
          <Link href="mailto:oalcalde211@gmail.com">
            <div className="flex items-center justify-center gap-2 w-fit text-lg md:text-2xl whitespace-normal mx-auto hover:text-green-400 transition-colors">
              <AiFillMail />
              <span>{t("contactEmail")}</span>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
};
