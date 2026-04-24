import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import ChangePasswordCard from "../components/UserProfile/ChangePasswordCard";
import LanguagePreferenceCard from "../components/UserProfile/LanguagePreferenceCard";
import { useI18n } from "../context/I18nContext";

export default function Settings() {
  const { t } = useI18n();

  return (
    <>
      <PageMeta
        title={t("settings.title", "Settings")}
        description={t("settings.description", "Application settings")}
      />
      <PageBreadcrumb
        pageTitles={[{ title: t("settings.breadcrumb", "Settings"), path: "/settings" }]}
      />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          {t("settings.heading", "Settings")}
        </h3>
        <div className="space-y-6">
          <LanguagePreferenceCard />
          <ChangePasswordCard />
        </div>
      </div>
    </>
  );
}
