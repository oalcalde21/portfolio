import Link from "next/link";
import React from "react";
import { FaCodepen, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { OutlineButton } from "../buttons/OutlineButton";
import { LanguageToggle } from "../buttons/LanguageToggle";
import { useLanguage } from "../../context/LanguageContext";

export const Header = () => {
  const { t } = useLanguage();
  return (
    <header className="h-[72px] px-4 flex items-center justify-between sticky top-0 z-20 bg-zinc-900/50 backdrop-blur-md">
      <MyLinks />
      <div className="flex items-center gap-3">
        <LanguageToggle />
        <OutlineButton onClick={() => window.open("/fake_resume.pdf")}>
          {t("resumeBtn")}
        </OutlineButton>
      </div>
    </header>
  );
};

export const MyLinks = () => (
  <div className="flex items-center text-lg gap-4">
    <Link
      className="text-zinc-300 hover:text-green-400 transition-colors"
      href="https://www.linkedin.com"
      target="_blank"
      rel="nofollow"
    >
      <FaLinkedin />
    </Link>
    <Link
      className="text-zinc-300 hover:text-green-400 transition-colors"
      href="https://www.github.com"
      target="_blank"
      rel="nofollow"
    >
      <FaGithub />
    </Link>
    <Link
      className="text-zinc-300 hover:text-green-400 transition-colors"
      href="https://www.x.com"
      target="_blank"
      rel="nofollow"
    >
      <FaTwitter />
    </Link>
    <Link
      className="text-zinc-300 hover:text-green-400 transition-colors"
      href="https://www.codepen.io"
      target="_blank"
      rel="nofollow"
    >
      <FaCodepen />
    </Link>
  </div>
);
