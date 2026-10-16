import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

export const Typewriter = ({ className = "", isPaused, reducedMotion }) => {
  const { t } = useLanguage();
  const roles = useMemo(() => [t("typewriter1"), t("typewriter2")], [t]);

  return (
    <span className={`text-green-400 ${className}`}>
      <span className="sr-only">{roles.join(" / ")}</span>
      <span aria-hidden="true">
        <AnimatedRoles
          key={roles.join("/")}
          roles={roles}
          isPaused={isPaused}
          reducedMotion={reducedMotion}
        />
        <span className="typewriter-static">{roles.join(" / ")}</span>
      </span>
    </span>
  );
};

// A translation change resets only this local animation, without stale timers.
function AnimatedRoles({ roles, isPaused, reducedMotion }) {
  const [frame, setFrame] = useState(() => ({
    role: 0,
    length: isPaused ? roles[0].length : 0,
    deleting: false,
  }));

  useEffect(() => {
    if (isPaused || reducedMotion !== false) return;

    const text = roles[frame.role];
    // Preserve the previous 100 ms scheduling step + 2000 ms hold.
    const delay = frame.deleting ? 50 : frame.length === text.length ? 2100 : 100;
    const timeout = setTimeout(() => {
      if (!frame.deleting) {
        setFrame(
          frame.length < text.length
            ? { ...frame, length: frame.length + 1 }
            : { ...frame, deleting: true }
        );
      } else if (frame.length > 0) {
        setFrame({ ...frame, length: frame.length - 1 });
      } else {
        setFrame({ role: (frame.role + 1) % roles.length, length: 0, deleting: false });
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [frame, roles, isPaused, reducedMotion]);

  return (
    <span className="typewriter-animated">
      {"> "}{roles[frame.role].slice(0, frame.length)}
      <span className="typewriter-cursor animate-pulse" data-paused={isPaused}>|</span>
    </span>
  );
}
