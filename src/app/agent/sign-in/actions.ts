"use server";

import { redirect } from "next/navigation";
import { AuthError, CredentialsSignin } from "next-auth";

import { signIn } from "@/auth";
import { SignInSchema } from "@/lib/auth/credentials";
import { db } from "@/lib/db";

export type SignInState = {
  error: "invalid" | "rate_limited" | null;
  email: string;
};

export async function signInAction(_previous: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "");
  try {
    await signIn("credentials", {
      email,
      password: String(formData.get("password") ?? ""),
      redirect: false,
    });
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      return { error: error.code === "rate_limited" ? "rate_limited" : "invalid", email };
    }
    if (error instanceof AuthError) {
      return { error: "invalid", email };
    }
    throw error;
  }

  // Signed in. Agents land on the queue, leads on the dashboard (S4).
  const parsed = SignInSchema.shape.email.safeParse(email);
  const agent = parsed.success
    ? await db.agent.findUnique({ where: { email: parsed.data }, select: { role: true } })
    : null;
  redirect(agent?.role === "lead" ? "/agent/dashboard" : "/agent/queue");
}
