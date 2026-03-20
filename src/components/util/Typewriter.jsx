/**
 * Typewriter component - creates a typing animation effect.
 * 
 * Cycles through different roles/career paths, typing them out
 * letter by letter, then deleting, then typing the next one.
 * 
 * Current roles:
 * - "> IT Support Sr. Analyst" (English)
 * - "> Frontend Developer" (English)
 * 
 * The green color and blinking cursor give it that terminal vibe.
 */

import { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";

export const Typewriter = ({ className }) => {
  const { t } = useLanguage();
  // Current role being typed
  const [roleIndex, setRoleIndex] = useState(0);
  // What text is currently displayed
  const [displayText, setDisplayText] = useState("");
  // Whether we're deleting or typing
  const [isDeleting, setIsDeleting] = useState(false);

  // The roles to cycle through - wrapped in useState to get translated text
  const roles = [
    { prefix: "> ", text: t("typewriter1") },
    { prefix: "> ", text: t("typewriter2") },
  ];

  // Reset when language changes (to re-render with new translations)
  useEffect(() => {
    setDisplayText("");
    setRoleIndex(0);
    setIsDeleting(false);
  }, [t("typewriter1")]);

  // The typing/deleting logic
  useEffect(() => {
    const currentRole = roles[roleIndex];
    // Type faster than we delete
    const typeSpeed = isDeleting ? 50 : 100;
    // Pause a bit after typing before deleting
    const pauseBeforeDelete = isDeleting ? 1500 : 2000;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Still typing...
        if (displayText.length < currentRole.text.length) {
          setDisplayText(currentRole.text.slice(0, displayText.length + 1));
        } else {
          // Done typing, wait then start deleting
          setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
        }
      } else {
        // Deleting...
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          // Done deleting, move to next role
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, typeSpeed);

    // Cleanup the timeout if the effect re-runs
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex, roles]);

  return (
    <span className={`text-green-400 ${className}`}>
      {roles[roleIndex].prefix}{displayText}
      {/* Blinking cursor */}
      <span className="animate-pulse">|</span>
    </span>
  );
};
