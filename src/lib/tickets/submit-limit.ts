import type { RateLimitRule } from "@/lib/rate-limit";

// 5 tickets per 10 minutes per IP (US-01 AC4, NFR-12; assumed).
export const SUBMIT_LIMIT: RateLimitRule = { bucket: "submit", limit: 5, windowMs: 10 * 60 * 1000 };
