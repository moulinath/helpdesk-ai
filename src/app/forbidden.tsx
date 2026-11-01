import { NoAccess } from "@/components/agent/no-access";

// Rendered by forbidden() when a page guard refuses access (requireLead).
export default function Forbidden() {
  return <NoAccess />;
}
