/** First address in X-Forwarded-For (set by Vercel; spoofable elsewhere, RAID R25), else "unknown". */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip") || "unknown";
}
