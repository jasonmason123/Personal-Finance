import { UserInfo } from "../types";

const FETCH_USER_PROFILE_API_ROUTE = "/api/profile/get-profile";
const CHANGE_PASSWORD_API_ROUTE = "/api/profile/change-password";

function normalizeUserProfile(data: unknown): UserInfo {
  if (data == null || typeof data !== "object") {
    return { username: "", email: "", dateJoined: "" };
  }
  const o = data as Record<string, unknown>;
  const dateJoined = o.dateJoined;
  return {
    username: typeof o.username === "string" ? o.username : "",
    email: typeof o.email === "string" ? o.email : "",
    dateJoined:
      typeof dateJoined === "string"
        ? dateJoined
        : dateJoined instanceof Date
          ? dateJoined.toISOString()
          : "",
  };
}

export async function fetchUserProfile(): Promise<UserInfo> {
  const response = await fetch(FETCH_USER_PROFILE_API_ROUTE, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Không tải được hồ sơ.");
  }
  const data = await response.json();
  return normalizeUserProfile(data);
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const response = await fetch(CHANGE_PASSWORD_API_ROUTE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("Mật khẩu hiện tại không đúng hoặc mật khẩu mới không hợp lệ.");
    }
    throw new Error("Đổi mật khẩu thất bại. Vui lòng thử lại.");
  }
}

export interface UserProfileApiCaller {
  fetchUserProfile: () => Promise<UserInfo>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export const userProfileApiCaller: UserProfileApiCaller = {
  fetchUserProfile,
  changePassword,
};
