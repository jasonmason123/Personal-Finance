const SIGN_IN_WITH_EMAIL_URL = `api/authentication/web/login-email`;
const SIGN_IN_WITH_GOOGLE_URL = `api/authentication/web/sign-in/google`;
const SIGN_OUT_URL = `api/authentication/web/logout`;
const SIGN_UP_URL = `api/authentication/web/sign-up`;
const VERIFY_ACCOUNT_URL = `api/authentication/web/verify-account`;
const RESEND_CODE_URL = `api/authentication/web/verify-account/resend`;
const FORGOT_PASSWORD_REQUEST_URL = `api/authentication/web/request-reset-password`;

/**
 * Signs in a user.
 * @param identifier - The email of the user.
 * @param password - The password of the user.
 * @returns A promise that resolves when the user is signed in.
 */
export function signInWithEmail(
  { identifier, password }: { identifier: string; password: string },
  remember: boolean
): Promise<Response> {
  let url = SIGN_IN_WITH_EMAIL_URL;
  if (remember) {
    url += "?remember=true";
  }

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ identifier, password }),
    credentials: "include",
  });
}

/**
 * Signs in a user using Google authentication.
 */
export function signInWithGoogle(remember: boolean) {
  let url = SIGN_IN_WITH_GOOGLE_URL;
  if (remember) {
    url += "?remember=true";
  }

  window.location.href = url;
}

/**
 * Signs out the current user.
 * @returns A promise that resolves when the user is signed out.
 */
export function signOut(): Promise<Response> {
  return fetch(SIGN_OUT_URL, {
    method: "POST",
    credentials: "include",
  });
}

/**
 * Signs up a new user.
 * @param email - The email of the new user.
 * @param password - The password of the new user.
 * @returns A promise that resolves to the response of the sign-up request.
 */
export function signUp(
  { email, password }: { email: string; password: string }
): Promise<Response> {
  return fetch(SIGN_UP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
}

/**
 * Verifies the new user sign up, calls after sign up
 * @param confirmationToken the verification key
 * @param code the code received from email/sms
 * @returns A promise that resolves to the response of the verify account request.
 */
export function verifyAccount(confirmationToken: string, code: string): Promise<Response> {
  const formData = new FormData();
  formData.append("code", code);

  return fetch(`${VERIFY_ACCOUNT_URL}/${confirmationToken}`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });
}

/**
 * Requests the server to resend the code to the user
 * @param confirmationToken the old verification key received earlier
 * @returns A promise of the server response.
 */
export function resendCode(confirmationToken: string): Promise<Response> {
  return fetch(`${RESEND_CODE_URL}/${confirmationToken}`, {
    method: "POST",
    credentials: "include",
  });
}

export function forgotPasswordRequest(email: string): Promise<Response> {
  const formData = new FormData();
  formData.append("email", email);
  
  return fetch(FORGOT_PASSWORD_REQUEST_URL, {
    method: "POST",
    body: formData,
    credentials: "include",
  });
}

export interface AuthenticationApiCaller {
  signInWithEmail: (credentials: { identifier: string; password: string }, remember: boolean) => Promise<Response>;
  signInWithGoogle: (remember: boolean) => void;
  signOut: () => Promise<Response>;
  signUp: (credentials: { email: string; password: string }, isWeb?: boolean) => Promise<Response>;
  verifyAccount: (confirmationToken: string, code: string) => Promise<Response>;
  resendCode: (confirmationToken: string) => Promise<Response>;
  forgotPasswordRequest: (email: string) => Promise<Response>;
};

export const authenticationApiCaller: AuthenticationApiCaller = {
  signInWithEmail,
  signInWithGoogle,
  signOut,
  signUp,
  verifyAccount,
  resendCode,
  forgotPasswordRequest
};