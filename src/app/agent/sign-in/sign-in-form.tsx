"use client";

import { InfoIcon, Loader2Icon } from "lucide-react";
import { useActionState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { signInAction, type SignInState } from "./actions";

const MESSAGES = {
  // Generic whatever was wrong (US-12 AC3, S4).
  invalid: "Email or password is incorrect.",
  rate_limited: "Too many attempts. Try again in a few minutes.",
} as const;

export type DemoHint = { agentEmail: string; agentPassword: string; leadEmail: string; leadPassword: string };

export function SignInForm({ demo }: { demo: DemoHint | null }) {
  const [state, formAction, pending] = useActionState<SignInState, FormData>(signInAction, {
    error: null,
    email: "",
  });
  const message = state.error ? MESSAGES[state.error] : null;

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4">
      <div aria-live="assertive">
        {message && (
          <Alert variant="destructive" role={undefined}>
            <AlertTitle id="signin-error">{message}</AlertTitle>
          </Alert>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          defaultValue={state.email}
          aria-invalid={message ? true : undefined}
          aria-describedby={message ? "signin-error" : undefined}
          className="h-10"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          aria-invalid={message ? true : undefined}
          aria-describedby={message ? "signin-error" : undefined}
          className="h-10"
        />
      </div>
      <Button type="submit" size="lg" className="h-10" aria-disabled={pending} disabled={pending}>
        {pending ? (
          <>
            <Loader2Icon aria-hidden="true" className="animate-spin" />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </Button>
      {demo && (
        <Alert role="note">
          <InfoIcon aria-hidden="true" />
          <AlertTitle>Demo accounts (fictional data)</AlertTitle>
          <AlertDescription>
            <p>
              Agent: {demo.agentEmail} · {demo.agentPassword}
            </p>
            <p>
              Team lead: {demo.leadEmail} · {demo.leadPassword}
            </p>
          </AlertDescription>
        </Alert>
      )}
    </form>
  );
}
