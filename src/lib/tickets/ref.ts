/** Human-readable reference, e.g. HD-24817. Not a secret: it never opens anything (§7.2). */
export function formatRef(refNumber: number): string {
  return `HD-${refNumber}`;
}
