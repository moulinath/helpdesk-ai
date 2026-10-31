import NextAuth, { CredentialsSignin, type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import type { AgentRole } from "@/generated/prisma/client";
import { checkCredentials, clientIp } from "@/lib/auth/credentials";

declare module "next-auth" {
  interface User {
    role: AgentRole;
  }
  interface Session {
    user: { id: string; role: AgentRole } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    agentId?: string;
    role?: AgentRole;
  }
}

/** Generic failure: the same code whatever was wrong (US-12 AC3). */
class InvalidCredentials extends CredentialsSignin {
  override code = "invalid";
}

class RateLimited extends CredentialsSignin {
  override code = "rate_limited";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Credentials sign-in requires JWT sessions (ADR 0005). 8-hour lifetime.
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
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
      if (user?.id) {
        token.agentId = user.id;
        token.role = user.role;
      }
      return token;
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
