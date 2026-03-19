import { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";

export const Typewriter = ({ className }) => {
  const { t } = useLanguage();
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const roles = [
    { prefix: "> ", text: t("typewriter1") },
    { prefix: "> ", text: t("typewriter2") },
  ];

  useEffect(() => {
    setDisplayText("");
    setRoleIndex(0);
    setIsDeleting(false);
  }, [t("typewriter1")]);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    const typeSpeed = isDeleting ? 50 : 100;
    const pauseBeforeDelete = isDeleting ? 1500 : 2000;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentRole.text.length) {
          setDisplayText(currentRole.text.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex, roles]);

  return (
    <span className={`text-green-400 ${className}`}>
      {roles[roleIndex].prefix}{displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};
