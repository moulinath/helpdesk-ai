import "server-only";

/**
 * Runs AI triage for a saved ticket, after the customer's response has been sent (ADR 0004).
 * Takes only the ticket id: it loads subject and description itself, so name and email can't
 * reach the AI (NFR-06).
 *
 * Not built yet: US-09 adds the switch, cap and "Needs triage" fallback, US-03 the Claude call.
 * Until then the ticket stays `pending`.
 */
export async function startTriage(ticketId: string): Promise<void> {
  void ticketId;
}
