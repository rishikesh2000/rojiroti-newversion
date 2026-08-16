import { useEffect, useState } from "react";

export type Role = "employee" | "employer";

export interface Session {
  role: Role;
  mobile?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
}

const KEY = "rr.session";
const EVT = "rr.session.changed";

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function setSession(s: Session) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new Event(EVT));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.clear();
  sessionStorage.clear();
  window.dispatchEvent(new Event(EVT));
}

export function useSession(): Session | null {
  const [s, setS] = useState<Session | null>(null);
  useEffect(() => {
    setS(getSession());
    const handler = () => setS(getSession());
    window.addEventListener(EVT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return s;
}
