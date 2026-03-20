import { Chip } from "../util/Chip";
import Reveal from "../util/Reveal";
import { useLanguage } from "../../context/LanguageContext";

const expKeys = {
  "RCI Latinoamericana (Travel + Leisure)": { title: "expRciTitle", pos: "expRciPos", time: "expRciTime", desc: "expRciDesc", desc2: "expRciDesc2", desc3: "expRciDesc3", desc4: "expRciDesc4", desc5: "expRciDesc5" },
  "ITS - Infrastructure Technology Services": { title: "expItsTitle", pos: "expItsPos", time: "expItsTime", desc: "expItsDesc", desc2: "expItsDesc2", desc3: "expItsDesc3", desc4: "expItsDesc4" },
  "Infocorp": { title: "expInfoTitle", pos: "expInfoPos", time: "expInfoTime", desc: "expInfoDesc", desc2: "expInfoDesc2", desc3: "expInfoDesc3" },
};

const techKeys = {
  "ITIL": "techITIL",
  "English Support": "techEnglish",
  "Fast Adaptation": "techAdaptation",
  "Windows": "techWindows",
  "Windows AIK": "techWindowsAIK",
  "Sysprep": "techSysprep",
  "Office 365": "techOffice365",
  "Vendor Management": "techVendor",
  "Networking": "techNetworking",
  "iOS": "techIOS",
  "Data Center": "techDataCenter",
  "Coordination": "techCoordination",
  "VIP Support": "techVIP",
  "Global Support": "techGlobal",
  "Hardware Repair": "techHardware",
  "Data Migration": "techDataMigration",
  "Backups": "techBackups",
  "DGI Software": "techDGI",
  "ServiceNow": "statsServiceNow",
  "Intune": "statsIntune",
  "Autopilot": "techAutopilot",
  "Crowdstrike": "techCrowdstrike",
  "SCCM": "techSCCM",
  "MS Teams": "techMSTeams",
  "Microsoft Server": "techMicrosoftServer",
  "Snowflake": "techSnowflake",
  "SQL": "techSQL",
  "PowerBi": "techPowerBi",
  "Zscaler": "techZscaler",
  "VPN": "techVPN",
  "Meraki": "techMeraki",
  "PaperCut": "techPaperCut",
  "OSD Images": "techOSDImages",
  "Bitlocker": "techBitlocker",
  "Global Teams": "techGlobalTeams",
  "Global Support": "techGlobalSupport",
  "Massive Migrations": "techMassiveMigrations",
};

export const ExperienceItem = ({ title, position, time, location, description, tech }) => {
  const { t } = useLanguage();
  const keys = expKeys[title] || {};
  
  const translatedTitle = keys.title ? t(keys.title) : title;
  const translatedPos = keys.pos ? t(keys.pos) : position;
  const translatedTime = keys.time ? t(keys.time) : time;
  const translatedDesc = keys.desc ? t(keys.desc) : description;
  const translatedDesc2 = keys.desc2 ? t(keys.desc2) : null;
  const translatedDesc3 = keys.desc3 ? t(keys.desc3) : null;
  const translatedDesc4 = keys.desc4 ? t(keys.desc4) : null;
  const translatedDesc5 = keys.desc5 ? t(keys.desc5) : null;

  const translateTech = (techItem) => {
    const key = techKeys[techItem];
    return key ? t(key) : techItem;
  };

  return (
    <div className="mb-6 border-b pb-6 border-zinc-700">
      <div className="flex items-center justify-between mb-2">
        <Reveal>
          <span className="font-bold text-xl">{translatedTitle}</span>
        </Reveal>
        <Reveal>
          <span>{translatedTime}</span>
        </Reveal>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Reveal>
          <span className="text-green-400 font-bold">{translatedPos}</span>
        </Reveal>
        <Reveal>
          <span>{location}</span>
        </Reveal>
      </div>
      <Reveal>
        <p className="mb-4 text-zinc-300 leading-relaxed">{translatedDesc}</p>
      </Reveal>
      {translatedDesc2 && (
        <Reveal>
          <p className="mb-4 text-zinc-300 leading-relaxed">{translatedDesc2}</p>
        </Reveal>
      )}
      {translatedDesc3 && (
        <Reveal>
          <p className="mb-4 text-zinc-300 leading-relaxed">{translatedDesc3}</p>
        </Reveal>
      )}
      {translatedDesc4 && (
        <Reveal>
          <p className="mb-4 text-zinc-300 leading-relaxed">{translatedDesc4}</p>
        </Reveal>
      )}
      {translatedDesc5 && (
        <Reveal>
          <p className="mb-6 text-zinc-300 leading-relaxed">{translatedDesc5}</p>
        </Reveal>
      )}
      <Reveal>
        <div className="flex flex-wrap gap-2">
          {tech.map((item) => (
            <Chip key={item}>{translateTech(item)}</Chip>
          ))}
        </div>
      </Reveal>
    </div>
  );
};
