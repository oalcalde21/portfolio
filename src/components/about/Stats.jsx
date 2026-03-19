import { Chip } from "../util/Chip";
import Reveal from "../util/Reveal";
import { AiFillCode, AiFillSmile } from "react-icons/ai";
import { useLanguage } from "../../context/LanguageContext";

export const Stats = () => {
  const { t } = useLanguage();
  return (
    <div className="relative">
      <Reveal>
        <div>
          <h4 className="flex items-center mb-6">
            <AiFillCode className="text-green-400 text-2xl" />
            <span className="font-bold ml-2">{t("statsUseAtWork")}</span>
          </h4>
          <div className="flex flex-wrap gap-2 mb-12">
            <Chip>{t("statsJS")}</Chip>
            <Chip>{t("statsTS")}</Chip>
            <Chip>{t("statsHTML")}</Chip>
            <Chip>{t("statsCSS")}</Chip>
            <Chip>{t("statsReact")}</Chip>
            <Chip>{t("statsRedux")}</Chip>
            <Chip>{t("statsNode")}</Chip>
            <Chip>{t("statsExpress")}</Chip>
            <Chip>{t("statsPostgres")}</Chip>
            <Chip>{t("statsMongo")}</Chip>
            <Chip>{t("statsGitHub")}</Chip>
            <Chip>{t("statsJira")}</Chip>
            <Chip>{t("statsHeroku")}</Chip>
            <Chip>{t("statsAWS")}</Chip>
          </div>
        </div>
      </Reveal>
      <Reveal>
        <div>
          <h4 className="flex items-center mb-6">
            <AiFillSmile className="text-green-400 text-2xl" />
            <span className="font-bold ml-2">{t("statsUseForFun")}</span>
          </h4>
          <div className="flex flex-wrap gap-2 mb-12">
            <Chip>{t("statsRust")}</Chip>
            <Chip>{t("statsTailwind")}</Chip>
            <Chip>{t("statsJava")}</Chip>
            <Chip>{t("statsSpring")}</Chip>
            <Chip>{t("statsFigma")}</Chip>
            <Chip>{t("statsWhimsical")}</Chip>
            <Chip>{t("statsPlanetscale")}</Chip>
            <Chip>{t("statsGraphQL")}</Chip>
            <Chip>{t("statsPython")}</Chip>
            <Chip>{t("statsFastAPI")}</Chip>
          </div>
        </div>
      </Reveal>
    </div>
  );
};
