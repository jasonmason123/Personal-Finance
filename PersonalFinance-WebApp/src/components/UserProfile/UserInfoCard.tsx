import { UserInfo } from "../../types";
import { useI18n } from "../../context/I18nContext";

export default function UserInfoCard({ profile }: { profile: UserInfo }) {
  const { t } = useI18n();
  const { username, email } = profile;

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            {t("profile.accountInfo", "Account information")}
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                {t("profile.usernameLabel", "Username")}
              </p>

              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {username || "—"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                {t("profile.emailLabel", "Account email")}
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {email || "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

