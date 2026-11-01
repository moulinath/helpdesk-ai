import { AuthError, CredentialsSignin } from "@auth/core/errors";

export type SignInError = "invalid" | "rate_limited" | "unavailable";

export const SIGN_IN_MESSAGES: Record<SignInError, string> = {
  // Generic whatever was wrong with the details (US-12 AC3, S4).
  invalid: "Email or password is incorrect.",
  rate_limited: "Too many attempts. Try again in a few minutes.",
  // A fault on our side (database, configuration) must not look like a wrong password.
  unavailable: "Sign-in isn't working right now. Try again shortly.",
};

/**
 * Maps what Auth.js threw to what S4 shows. Only a credentials failure means "wrong details";
 * returns null for errors that aren't Auth.js's, such as Next's redirect, which must propagate.
 */
export function signInErrorFor(error: unknown): SignInError | null {
  if (error instanceof CredentialsSignin) {
    return error.code === "rate_limited" ? "rate_limited" : "invalid";
  }
  if (error instanceof AuthError) {
    return "unavailable";
  }
  return null;
}
