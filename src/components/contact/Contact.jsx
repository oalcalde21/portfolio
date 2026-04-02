/**
 * Contact section - a simple call-to-action area at the bottom.
 */

import { AiFillMail, AiOutlineWhatsApp } from "react-icons/ai";
import Link from "next/link";
import Reveal from "../util/Reveal";
import { useLanguage } from "../../context/LanguageContext";

export const Contact = () => {
  const { t } = useLanguage();
  return (
    <section className="section-wrapper" id="contact" aria-labelledby="contact-heading">
      <div className="max-w-xl mx-auto bg-zinc-800 px-8 py-12 rounded-xl">
        <Reveal width="w-full">
          <h2 id="contact-heading" className="text-4xl md:text-5xl text-center font-black">
            {t("contactTitle")}<span className="text-green-400">.</span>
          </h2>
        </Reveal>
        
        <Reveal width="w-full">
          <p className="text-center my-8 text-zinc-300 leading-relaxed">
            {t("contactText")}{" "}
            <Link
              href="https://www.linkedin.com/in/oscar-alcalde/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:underline"
            >
              {t("contactLinkedin")}
            </Link>{" "}
            {t("contactOr")}{" "}
            <Link
              href="https://github.com/oalcalde21"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:underline"
            >
              {t("contactTwitter")}
            </Link>
          </p>
        </Reveal>
        
        <Reveal width="w-full">
          <Link href="mailto:oalcalde211@gmail.com" aria-label={t("contactEmail")}>
            <div className="flex items-center justify-center gap-2 w-fit text-lg md:text-2xl whitespace-normal mx-auto hover:text-green-400 transition-colors">
              <AiFillMail aria-hidden="true" />
              <span>{t("contactEmail")}</span>
            </div>
          </Link>
        </Reveal>
        
        <Reveal width="w-full">
          <Link href="https://wa.me/59894299470?text=Hola!%20llegue%20desde%20tu%20portfolio%20hasta%20vos" target="_blank" rel="noopener noreferrer" aria-label={t("contactWriteMe")}>
            <div className="flex items-center justify-center gap-2 w-fit text-lg md:text-xl whitespace-normal mx-auto mt-4 text-green-400 hover:underline">
              <AiOutlineWhatsApp aria-hidden="true" />
              <span>{t("contactWriteMe")}</span>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
};
