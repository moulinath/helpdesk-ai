"use client";

import { InfoIcon, Loader2Icon } from "lucide-react";
import { useActionState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { SIGN_IN_MESSAGES } from "@/lib/auth/sign-in-errors";

import { signInAction, type SignInState } from "./actions";

export type DemoHint = { agentEmail: string; agentPassword: string; leadEmail: string; leadPassword: string };

export function SignInForm({ demo }: { demo: DemoHint | null }) {
  const [state, formAction, pending] = useActionState<SignInState, FormData>(signInAction, {
    error: null,
    email: "",
    attempt: 0,
  });
  const message = state.error ? SIGN_IN_MESSAGES[state.error] : null;
  // Only "invalid" is about the fields; a rate limit or a server fault isn't.
  const fieldsInvalid = state.error === "invalid";

  return (
    <form
      action={formAction}
      noValidate
      className="flex flex-col gap-4"
      // The button stays focusable while pending (aria-disabled), so block repeat submits here.
      onSubmit={(event) => {
        if (pending) event.preventDefault();
      }}
    >
      <div aria-live="assertive">
        {/* Hidden while pending and keyed per attempt, so a repeated error is announced again. */}
        {message && !pending && (
          <Alert key={state.attempt} variant="destructive" role={undefined}>
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
          aria-invalid={fieldsInvalid ? true : undefined}
          aria-describedby={fieldsInvalid ? "signin-error" : undefined}
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
          aria-invalid={fieldsInvalid ? true : undefined}
          aria-describedby={fieldsInvalid ? "signin-error" : undefined}
          className="h-10"
        />
      </div>
      <Button type="submit" size="lg" className="h-10" aria-disabled={pending}>
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
