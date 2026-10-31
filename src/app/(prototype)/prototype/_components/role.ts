"use client";

import { useSyncExternalStore } from "react";

// Prototype-only stand-in for Auth.js (US-12): remembers who "signed in" for this browser tab.
export type Role = "agent" | "lead";

const KEY = "prototype-role";
const listeners = new Set<() => void>();

function read(): Role {
  try {
    return sessionStorage.getItem(KEY) === "lead" ? "lead" : "agent";
  } catch {
    return "agent";
  }
}

export function setRole(role: Role) {
  try {
    sessionStorage.setItem(KEY, role);
  } catch {
    // Storage blocked: the prototype falls back to the agent role.
  }
  listeners.forEach((l) => l());
}

export function useRole(): Role {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => "agent",
  );
}
