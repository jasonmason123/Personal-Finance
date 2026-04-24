import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import { fetchUserProfile } from "../api_caller/UserProfileApiCaller";
import { UserInfo } from "../types";
import { useI18n } from "../context/I18nContext";

const emptyProfile: UserInfo = { username: "", email: "", dateJoined: "" };

export default function UserProfile() {
  const { t } = useI18n();
  const [profile, setProfile] = useState<UserInfo>(emptyProfile);
  // const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    // setLoading(true);
    setLoadError(null);
    fetchUserProfile()
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError(t("profile.loadError", "Unable to load profile. Please try again later."));
          setProfile(emptyProfile);
        }
      })
      .finally(() => {
        // if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [t]);

  return (
    <>
      <PageMeta
        title={t("profile.title", "Profile")}
        description={t("profile.description", "Your profile")}
      />
      <PageBreadcrumb
        pageTitles={[{ title: t("profile.breadcrumb", "Your profile"), path: "/profile" }]}
      />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          {t("profile.heading", "Your profile")}
        </h3>
        {loadError && (
          <p className="mb-4 text-sm text-red-600 dark:text-red-500">{loadError}</p>
        )}
        <div className="space-y-6">
          <UserMetaCard profile={profile} />
          <UserInfoCard profile={profile} />
        </div>
      </div>
    </>
  );
}
