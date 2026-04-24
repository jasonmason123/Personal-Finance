import { useState } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import { changePassword } from "../../api_caller/UserProfileApiCaller";
import { checkStrongPassword } from "../../utils";
import { useI18n } from "../../context/I18nContext";

export default function ChangePasswordCard() {
  const { t } = useI18n();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!currentPassword.trim()) {
      setErrorMessage(t("changePassword.errorRequiredCurrent", "Please enter your current password."));
      return;
    }
    if (!checkStrongPassword(newPassword)) {
      setErrorMessage(
        t(
          "changePassword.errorWeakPassword",
          "New password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
        ),
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage(t("changePassword.errorConfirmMismatch", "Password confirmation does not match."));
      return;
    }
    if (newPassword === currentPassword) {
      setErrorMessage(t("changePassword.errorSamePassword", "New password must be different from current password."));
      return;
    }

    try {
      setIsLoading(true);
      await changePassword(currentPassword, newPassword);
      setSuccessMessage(t("changePassword.success", "Password changed successfully."));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : t("changePassword.errorUnexpected", "Something went wrong."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <h4 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
        {t("changePassword.title", "Change password")}
      </h4>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
        {errorMessage && (
          <p className="text-sm text-red-600 dark:text-red-500">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-sm text-green-600 dark:text-green-500">{successMessage}</p>
        )}

        <div>
          <Label htmlFor="current-password">{t("changePassword.currentPasswordLabel", "Current password")}</Label>
          <div className="relative">
            <Input
              id="current-password"
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="current-password"
              placeholder={t("changePassword.currentPasswordPlaceholder", "Enter current password")}
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2 text-gray-500 dark:text-gray-400"
              aria-label={
                showCurrent
                  ? t("changePassword.toggleHide", "Hide password")
                  : t("changePassword.toggleShow", "Show password")
              }
            >
              {showCurrent ? (
                <EyeIcon className="fill-current size-5" />
              ) : (
                <EyeCloseIcon className="fill-current size-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <Label htmlFor="new-password">{t("changePassword.newPasswordLabel", "New password")}</Label>
          <div className="relative">
            <Input
              id="new-password"
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="new-password"
              placeholder={t("changePassword.newPasswordPlaceholder", "Enter new password")}
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2 text-gray-500 dark:text-gray-400"
              aria-label={
                showNew
                  ? t("changePassword.toggleHide", "Hide password")
                  : t("changePassword.toggleShow", "Show password")
              }
            >
              {showNew ? (
                <EyeIcon className="fill-current size-5" />
              ) : (
                <EyeCloseIcon className="fill-current size-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <Label htmlFor="confirm-password">
            {t("changePassword.confirmPasswordLabel", "Confirm new password")}
          </Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="new-password"
              placeholder={t("changePassword.confirmPasswordPlaceholder", "Re-enter new password")}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2 text-gray-500 dark:text-gray-400"
              aria-label={
                showConfirm
                  ? t("changePassword.toggleHide", "Hide password")
                  : t("changePassword.toggleShow", "Show password")
              }
            >
              {showConfirm ? (
                <EyeIcon className="fill-current size-5" />
              ) : (
                <EyeCloseIcon className="fill-current size-5" />
              )}
            </button>
          </div>
        </div>

        <Button type="submit" size="sm" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading
            ? t("changePassword.submitting", "Processing...")
            : t("changePassword.submit", "Change password")}
        </Button>
      </form>
    </div>
  );
}
