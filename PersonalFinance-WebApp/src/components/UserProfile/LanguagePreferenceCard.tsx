import { useI18n } from "../../context/I18nContext";
import { Option } from "../../types";
import Select from "../form/Select";

const localeOptions: Option[] = [
  { value: "vi-VN", label: "Tiếng Việt" },
  { value: "en-US", label: "English (US)" },
];

export default function LanguagePreferenceCard() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
        {t("language.title", "Language")}
      </h4>

      <div className="max-w-xs">
        <label
          htmlFor="preferred-locale"
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
        >
          {t("language.label", "Display language")}
        </label>
        <Select
          defaultValue={locale}
          options={localeOptions}
          onChange={(value) => setLocale(value)}
          placeholder={t("language.selectLanguage", "Select language")}
        />
      </div>
    </div>
  );
}
