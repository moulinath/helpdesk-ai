"use client";

import { InfoIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProtoState } from "../../_components/prototype-bar";
import { setRole } from "../../_components/role";
import { AGENT, LEAD } from "../../_data/sample";

// Prototype only: no real authentication. Auth.js arrives with US-12.
export function SignInForm() {
  const state = useProtoState();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(state === "loading");
  const [error, setError] = useState<string | null>(
    state === "error"
      ? "Email or password is incorrect."
      : state === "rate-limited"
        ? "Too many attempts. Try again in a few minutes."
        : null,
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    window.setTimeout(() => {
      if (state === "rate-limited") {
        setLoading(false);
        setError("Too many attempts. Try again in a few minutes.");
        return;
      }
      // Generic message whatever was wrong (US-12 AC3).
      if (state === "error" || !email.trim() || !password) {
        setLoading(false);
        setError("Email or password is incorrect.");
        return;
      }
      const isLead = email.trim().toLowerCase() === LEAD.email;
      setRole(isLead ? "lead" : "agent");
      router.push(isLead ? "/prototype/agent/dashboard" : "/prototype/agent/queue");
    }, 600);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <div aria-live="assertive">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-10"
        />
      </div>
      <Button type="submit" size="lg" className="h-10" disabled={loading}>
        {loading ? (
          <>
            <Loader2Icon aria-hidden="true" className="animate-spin" />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </Button>
      <Alert>
        <InfoIcon aria-hidden="true" />
        <AlertTitle>Demo accounts (demo environment only)</AlertTitle>
        <AlertDescription>
          Agent: {AGENT.email} · Team lead: {LEAD.email} · any password
        </AlertDescription>
      </Alert>
    </form>
  );
}
