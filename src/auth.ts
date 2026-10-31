import NextAuth, { CredentialsSignin, type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import type { AgentRole } from "@/generated/prisma/client";
import { checkCredentials, clientIp } from "@/lib/auth/credentials";
import { nextToken, SESSION_MAX_AGE_MS, type AgentToken } from "@/lib/auth/session";

declare module "next-auth" {
  interface User {
    role: AgentRole;
  }
  interface Session {
    user: { id: string; role: AgentRole } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- module augmentation
  interface JWT extends AgentToken {}
}

/** Generic failure: the same code whatever was wrong (US-12 AC3). */
class InvalidCredentials extends CredentialsSignin {
  override code = "invalid";
}

class RateLimited extends CredentialsSignin {
  override code = "rate_limited";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Credentials sign-in requires JWT sessions (ADR 0005). The cookie's maxAge slides on use;
  // the absolute 8-hour limit is enforced in the jwt callback (nextToken).
  session: { strategy: "jwt", maxAge: SESSION_MAX_AGE_MS / 1000 },
  pages: { signIn: "/agent/sign-in" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials, request) {
        const result = await checkCredentials(credentials, clientIp(request.headers));
        if (!result.ok) {
          throw result.reason === "rate_limited" ? new RateLimited() : new InvalidCredentials();
        }
        const { id, name, email, role } = result.agent;
        return { id, name, email, role };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      return nextToken(token, user);
    },
    session({ session, token }) {
      if (token.agentId && token.role) {
        session.user.id = token.agentId;
        session.user.role = token.role;
      }
      return session;
    },
  },
});
