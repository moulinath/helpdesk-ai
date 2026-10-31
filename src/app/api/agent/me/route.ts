import { agentOrUnauthorized } from "@/lib/auth/guards";

/** The signed-in agent's name and role (US-12 AC1: 401 when signed out). */
export async function GET(): Promise<Response> {
  const agent = await agentOrUnauthorized();
  if (agent instanceof Response) {
    return agent;
  }
  return Response.json({ name: agent.name, role: agent.role });
}
