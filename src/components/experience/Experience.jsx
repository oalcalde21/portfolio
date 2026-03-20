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
    time: "Apr 2017 - Present",
    location: "Uruguay",
    description: "Currently working at RCI Latin America within the IT support team, in a large corporate environment with modern management tools.",
    tech: ["ServiceNow", "Intune", "Autopilot", "Crowdstrike", "SCCM", "MS Teams", "Microsoft Server", "Snowflake", "SQL", "PowerBi", "Zscaler", "VPN", "Meraki", "PaperCut", "OSD Images", "Bitlocker", "Global Teams", "Global Support", "Massive Migrations"],
  },
  {
    title: "ITS - Infrastructure Technology Services",
    position: "Help Desk Analyst",
    time: "May 2016 - Apr 2017",
    location: "Uruguay",
    description: "At ITS, I worked providing IT support for Telefonica Business Solutions in a corporate environment with high service standards.",
    tech: ["ITIL", "English Support", "Fast Adaptation"],
  },
  {
    title: "Infocorp",
    position: "Help Desk Analyst",
    time: "Dec 2012 - May 2016",
    location: "Uruguay",
    description: "At Infocorp, I provided IT support for various companies, but the one that taught me the most was CPA Ferrere, a large corporate environment with over 500 users and high demands.",
    tech: ["Windows", "Windows AIK", "Sysprep", "Office 365", "Vendor Management", "Networking", "iOS", "Data Center", "Coordination", "VIP Support", "Global Support", "Hardware Repair", "Data Migration", "Backups", "DGI Software"],
  },
];
