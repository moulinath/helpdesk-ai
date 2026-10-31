import { NextResponse } from "next/server";

import { auth } from "@/auth";

const LEAD_ONLY = ["/agent/dashboard"];

/**
 * First check only: sends signed-out users away from agent pages and API routes, and sets the
 * 403 status for agents on lead-only pages. Every page, Server Action and Route Handler still runs
 * its own guard against the database (architecture §5).
 */
export const proxy = auth(async (request) => {
  const { pathname } = request.nextUrl;
  const user = request.auth?.user;

  if (!user) {
    if (pathname.startsWith("/api/")) {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/agent/sign-in", request.nextUrl));
  }

  // /agent itself routes by role (S4).
  if (pathname === "/agent") {
    const landing = user.role === "lead" ? "/agent/dashboard" : "/agent/queue";
    return NextResponse.redirect(new URL(landing, request.nextUrl));
  }

  if (user.role !== "lead" && LEAD_ONLY.some((path) => pathname.startsWith(path))) {
    // Next ignores a status on rewrites, so serve the static 403 page's HTML with a real 403.
    const page = await fetch(new URL("/no-access", request.nextUrl));
    return new Response(page.body, {
      status: 403,
      headers: { "content-type": page.headers.get("content-type") ?? "text/html; charset=utf-8" },
    });
  }

  return NextResponse.next();
});

export const config = {
  // Everything under /agent except the sign-in page, and every agent API route.
  matcher: ["/agent", "/agent/((?!sign-in).*)", "/api/agent/:path*"],
};
