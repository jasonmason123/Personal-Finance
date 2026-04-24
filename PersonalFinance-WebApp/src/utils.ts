import { UserInfo } from "./types"

export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export function checkStrongPassword(password: string) {
  const minLength = 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUpper &&
    hasLower &&
    hasNumber &&
    hasSpecial
  );
}

export function buildQueryString(params: Record<string, any>): string {
  const query = new URLSearchParams();

  const DEFAULTS: Record<string, any> = {
    pageNumber: 1,
    pageSize: 10,
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  Object.entries(params).forEach(([key, value]) => {
    // 1. Standard Guard Clauses
    if (
      value === null ||
      value === undefined ||
      value === '' ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return;
    }

    // 2. Skip Defaults
    if (DEFAULTS[key] !== undefined && DEFAULTS[key] === value) {
      return;
    }

    // 3. Handle DateFilterIso (Nested Object)
    // Since properties are already ISO strings, we just map them to Dot Notation
    if (typeof value === 'object' && !Array.isArray(value)) {
      Object.entries(value).forEach(([subKey, subValue]) => {
        if (subValue) {
          const compositeKey = `${capitalize(key)}.${capitalize(subKey)}`;
          query.append(compositeKey, String(subValue));
        }
      });
      return;
    }

    // 4. Handle Arrays & Primitives
    if (Array.isArray(value)) {
      value.forEach(v => query.append(capitalize(key), String(v)));
    } else {
      query.append(capitalize(key), String(value));
    }
  });

  return query.toString();
}

export function getUserInfo(): UserInfo | null {
  const userInfoBase64 = getCookie("user_info");
  if (!userInfoBase64) return null;

  try {
    const json = atob(userInfoBase64);
    const info = JSON.parse(json);
    return {
      username: info.username,
      dateJoined: info.dateJoined
    }
  } catch (err) {
    console.error("Failed to parse userInfo:", err);
    return null;
  }
}