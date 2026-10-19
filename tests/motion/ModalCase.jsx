import { useRef, useState } from "react";
import { LanguageProvider } from "../../src/context/LanguageContext";
import { ProjectModal } from "../../src/components/projects/ProjectModal";

export function ModalCase({ initiallyOpen = false }) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const openerRef = useRef(null);
  return <LanguageProvider>
    <button ref={openerRef} onClick={() => setIsOpen(true)}>Open test project</button>
    <ProjectModal isOpen={isOpen} setIsOpen={setIsOpen} openerRef={openerRef}
      title="SSR project" tech={["React"]} projectLink="https://example.com"
      modalContent={<p>Regression fixture</p>} />
  </LanguageProvider>;
}
