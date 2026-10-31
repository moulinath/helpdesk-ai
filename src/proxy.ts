import { NextResponse } from "next/server";

import { auth } from "@/auth";

const LEAD_ONLY = ["/agent/dashboard"];

// Used if the styled 403 page can't be fetched (e.g. Vercel Deployment Protection on a preview).
const FALLBACK_403 = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>No access · HelpDesk AI</title></head><body><main><h1>You don't have access to this page</h1><p>The dashboard is for team leads.</p><p><a href="/agent/queue">Back to the queue</a></p></main></body></html>`;

/** The static /no-access page's HTML with a real 403 status (Next ignores a status on rewrites). */
async function forbiddenResponse(origin: URL): Promise<Response> {
  const headers = { "cache-control": "private, no-store" };
  try {
    const page = await fetch(new URL("/no-access", origin), { cache: "no-store" });
    if (page.ok) {
      return new Response(page.body, {
        status: 403,
        headers: { ...headers, "content-type": page.headers.get("content-type") ?? "text/html; charset=utf-8" },
      });
    }
  } catch {
    // Fall through to the plain page.
  }
  return new Response(FALLBACK_403, {
    status: 403,
    headers: { ...headers, "content-type": "text/html; charset=utf-8" },
  });
}

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
    return forbiddenResponse(request.nextUrl);
  }

  return NextResponse.next();
});

export const config = {
  // Everything under /agent except the sign-in page, and every agent API route.
  matcher: ["/agent", "/agent/((?!sign-in(?:/|$)).*)", "/api/agent/:path*"],
};
