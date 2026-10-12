/**
 * Experience section - shows Oscar's work history.
 * 
 * Iterates through the experience array and renders an ExperienceItem
 * for each job. Each item shows:
 * - Company name and time period
 * - Position and location
 * - Detailed description(s)
 * - Technology/skills used
 */

import { SectionHeader } from "../util/SectionHeader";
import { ExperienceItem } from "./ExperienceItem";
import { useLanguage } from "../../context/LanguageContext";

export const Experience = () => {
  const { t } = useLanguage();
  return (
    <section className="section-wrapper" id="experience" aria-labelledby="experience-heading">
      <SectionHeader title={t("experienceTitle")} dir="l" id="experience-heading" />
      {experience.map((item) => (
        <ExperienceItem key={item.title} {...item} />
      ))}
    </section>
  );
};

// Work experience data - ordered from most recent to oldest
const experience = [
  {
    title: "AltasWeb",
    location: "Uruguay",
    tech: ["React", "Vite", "Tailwind CSS", "Supabase / PostgreSQL", "Git / GitHub", "Vercel", "PowerShell"],
  },
  {
    title: "RCI Latinoamericana (Travel + Leisure)",
    position: "Sr. Help Desk Support Analyst",
    time: "Apr 2017 - Sep 2026",
    location: "Uruguay",
    tech: ["ServiceNow", "Intune", "Autopilot", "Microsoft 365", "Jamf", "macOS", "CrowdStrike", "Zscaler", "ZPA", "Meraki", "BitLocker", "Power Automate Desktop", "BAT", "PowerShell", "Global Support"],
  },
  {
    title: "ITS - Infrastructure Technology Services",
    position: "Help Desk Analyst",
    time: "May 2016 - Apr 2017",
    location: "Uruguay",
    tech: ["English Support", "Windows", "Networking"],
  },
  {
    title: "Infocorp",
    position: "Help Desk Analyst",
    time: "Dec 2012 - May 2016",
    location: "Uruguay",
    tech: ["Vendor Management", "Data Center", "Coordination", "Global Support", "Data Migration"],
  },
  {
    title: "Urudata",
    location: "Uruguay",
    tech: ["Windows", "Hardware Repair", "Networking"],
  },
  {
    title: "HYC Hardware",
    location: "Uruguay",
    tech: ["Hardware Repair", "POS"],
  },
];
