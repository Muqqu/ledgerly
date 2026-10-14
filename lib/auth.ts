import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { Role, Session } from "./types";

const SECRET = process.env.AUTH_SECRET ?? "ledgerly-demo-secret-change-me";
export const COOKIE = "ledgerly_session";

export function sign(s: Session) {
  const body = Buffer.from(JSON.stringify({ ...s, exp: Date.now() + 8 * 3600e3 })).toString("base64url");
  return `${body}.${createHmac("sha256", SECRET).update(body).digest("base64url")}`;
}
export function verify(token?: string): Session | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", SECRET).update(body).digest("base64url");
  if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  const data = JSON.parse(Buffer.from(body, "base64url").toString());
  return data.exp > Date.now() ? (data as Session) : null;
}
export async function getSession() { return verify((await cookies()).get(COOKIE)?.value); }

// RBAC permission matrix — single source of truth used by API + UI.
export const can = {
  write: (r: Role) => r === "admin" || r === "manager",
  delete: (r: Role) => r === "admin",
  manageTeam: (r: Role) => r === "admin",
};
