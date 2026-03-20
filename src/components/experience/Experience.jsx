import { SectionHeader } from "../util/SectionHeader";
import { ExperienceItem } from "./ExperienceItem";
import { useLanguage } from "../../context/LanguageContext";

export const Experience = () => {
  const { t } = useLanguage();
  return (
    <section className="section-wrapper" id="experience">
      <SectionHeader title={t("experienceTitle")} dir="l" />
      {experience.map((item) => (
        <ExperienceItem key={item.title} {...item} />
      ))}
    </section>
  );
};

const experience = [
  {
    title: "RCI Latinoamericana (Travel + Leisure)",
    position: "Sr. Help Desk Support Analyst",
    time: "Jan 2022 - Present",
    location: "Uruguay",
    description: "Senior Help Desk Analyst at one of the world's largest timeshare exchange companies. Providing technical support for the Latin American region, managing complex incidents, and leading a team of support analysts.",
    tech: ["ServiceNow", "Microsoft", "Windows", "Hardware", "Intune"],
  },
  {
    title: "ITS - Infrastructure Technology Services",
    position: "Help Desk Analyst",
    time: "Jan 2019 - Dec 2021",
    location: "Uruguay",
    description: "Help Desk support for various clients including Telefonica Business Solutions. Provided first and second level technical support, managed incidents, and ensured customer satisfaction.",
    tech: ["Microsoft", "Windows", "Hardware", "ServiceNow"],
  },
  {
    title: "Infocorp",
    position: "Help Desk Analyst",
    time: "Jan 2013 - Dec 2018",
    location: "Uruguay",
    description: "Technical support for major clients including CPA Ferrere, Johnson & Johnson, Honda Uruguay, and INEFOP. Managed hardware and software issues, provided user training, and maintained documentation.",
    tech: ["Microsoft", "Windows", "Hardware", "Documentation"],
  },
];
