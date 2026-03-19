import { createContext, useContext, useState } from "react";

const translations = {
  EN: {
    navAbout: "About",
    navProjects: "Projects",
    navExp: "Exp.",
    navContact: "Contact",
    heroTitle: "Hi, I'm ",
    heroName: "Oscar",
    heroSubtitle: "I'm a ",
    heroRole: "Frontend Developer",
    heroDescription: "Passionate about building web experiences and continuously learning new technologies. With over 13 years in IT support, I'm now transitioning into frontend development.",
    contactBtn: "Contact Me",
    aboutTitle: "About",
    aboutP1: "y! I'm Oscar. With a background in IT support and a passion for technology, I've spent 13 years helping users solve complex problems at multinational companies.",
    aboutP2: "Currently, I'm expanding my skills toward frontend development, building modern web applications with React and Next.js.",
    aboutP3: "I love combining my problem-solving abilities with new coding skills to create intuitive user experiences.",
    aboutP4: "I'm always open to new opportunities where I can merge my IT experience with my passion for development.",
    aboutMyLinks: "My links",
    statsUseAtWork: "Use at work",
    statsUseForFun: "Use for fun",
    statsWindows: "Windows",
    statsNetwork: "Network",
    statsTroubleshooting: "Troubleshooting",
    statsDocumentation: "Documentation",
    statsServiceNow: "ServiceNow",
    statsIntune: "Intune",
    statsMicrosoft: "Microsoft",
    statsApple: "Apple",
    statsHardware: "Hardware",
    statsJS: "JavaScript",
    statsReact: "React",
    statsTailwind: "Tailwind",
    statsHTML: "HTML",
    statsCSS: "CSS",
    statsGit: "Git",
    statsGitHub: "GitHub",
    projectsTitle: "Projects",
    projectLinks: "Project Links",
    projectLearnMore: "Learn more",
    projectSourceCode: "Source Code",
    projectLiveProject: "Live Project",
    experienceTitle: "Experience",
    contactTitle: "Contact",
    contactText: "Shoot me an email if you want to connect! You can also find me on",
    contactLinkedin: "Linkedin",
    contactTwitter: "Twitter",
    contactOr: "or",
    contactEmail: "oscar@email.com",
    resumeBtn: "My Resume",
    typewriter1: "IT Support Sr. Analyst",
    typewriter2: "Frontend Developer",
  },
  ES: {
    navAbout: "Sobre mí",
    navProjects: "Proyectos",
    navExp: "Exp.",
    navContact: "Contacto",
    heroTitle: "Hola, soy ",
    heroName: "Oscar",
    heroSubtitle: "Soy ",
    heroRole: "Desarrollador Frontend",
    heroDescription: "Apasionado por construir experiencias web y aprendiendo constantemente nuevas tecnologías. Con más de 13 años en soporte de TI, ahora me estoy transfiriendo al desarrollo frontend.",
    contactBtn: "Contáctame",
    aboutTitle: "Sobre mí",
    aboutP1: "ola! Soy Oscar. Con experiencia en soporte de TI y pasión por la tecnología, he pasado 13 años ayudando a usuarios a resolver problemas complejos en empresas multinacionales.",
    aboutP2: "Actualmente, estoy expandiendo mis habilidades hacia el desarrollo frontend, construyendo aplicaciones web modernas con React y Next.js.",
    aboutP3: "Me encanta combinar mis habilidades de resolución de problemas con nuevas habilidades de codificación para crear experiencias de usuario intuitivas.",
    aboutP4: "Siempre estoy abierto a nuevas oportunidades donde pueda combinar mi experiencia en TI con mi pasión por el desarrollo.",
    aboutMyLinks: "Mis enlaces",
    statsUseAtWork: "Uso en el trabajo",
    statsUseForFun: "Uso por hobby",
    statsWindows: "Windows",
    statsNetwork: "Network",
    statsTroubleshooting: "Troubleshooting",
    statsDocumentation: "Documentation",
    statsServiceNow: "ServiceNow",
    statsIntune: "Intune",
    statsMicrosoft: "Microsoft",
    statsApple: "Apple",
    statsHardware: "Hardware",
    statsJS: "JavaScript",
    statsReact: "React",
    statsTailwind: "Tailwind",
    statsHTML: "HTML",
    statsCSS: "CSS",
    statsGit: "Git",
    statsGitHub: "GitHub",
    projectsTitle: "Proyectos",
    projectLinks: "Enlaces del Proyecto",
    projectLearnMore: "Ver más",
    projectSourceCode: "Código Fuente",
    projectLiveProject: "Proyecto en Vivo",
    experienceTitle: "Experiencia",
    contactTitle: "Contacto",
    contactText: "¡Escríbeme un email si quieres conectar! También puedes encontrarme en",
    contactLinkedin: "Linkedin",
    contactTwitter: "Twitter",
    contactOr: "o",
    contactEmail: "oscar@email.com",
    resumeBtn: "Mi CV",
    typewriter1: "Analista Sr. de Soporte IT",
    typewriter2: "Desarrollador Frontend",
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState("EN");

  const toggleLang = () => {
    setLang(lang === "EN" ? "ES" : "EN");
  };

  const t = (key) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
