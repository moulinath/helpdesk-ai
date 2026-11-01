"use server";

import { redirect } from "next/navigation";

import { signIn } from "@/auth";
import { SignInSchema } from "@/lib/auth/credentials";
import { signInErrorFor, type SignInError } from "@/lib/auth/sign-in-errors";
import { db } from "@/lib/db";

export type SignInState = {
  error: SignInError | null;
  email: string;
  /** Changes on every failed attempt, so the same message is announced again. */
  attempt: number;
};

export async function signInAction(previous: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "");
  try {
    await signIn("credentials", {
      email,
      password: String(formData.get("password") ?? ""),
      redirect: false,
    });
  } catch (error) {
    const signInError = signInErrorFor(error);
    if (!signInError) {
      throw error;
    }
    if (signInError === "unavailable") {
      // The type only: never the email or the underlying message.
      console.error("Sign-in failed on the server:", (error as { type?: string }).type);
    }
    return { error: signInError, email, attempt: previous.attempt + 1 };
  }

  // Signed in. Agents land on the queue, leads on the dashboard (S4).
  const parsed = SignInSchema.shape.email.safeParse(email);
  const agent = parsed.success
    ? await db.agent.findUnique({ where: { email: parsed.data }, select: { role: true } })
    : null;
  redirect(agent?.role === "lead" ? "/agent/dashboard" : "/agent/queue");
}
