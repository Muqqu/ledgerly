import { NextResponse } from "next/server";
import { getSession, can } from "./auth";
import type { Session } from "./types";

export const json = (data: unknown, status = 200) => NextResponse.json(data, { status });
export async function guard(perm?: keyof typeof can): Promise<Session | NextResponse> {
  const s = await getSession();
  if (!s) return json({ error: "Unauthenticated" }, 401);
  if (perm && !can[perm](s.role)) return json({ error: `Forbidden: role '${s.role}' cannot perform this action` }, 403);
  return s;
}
export const isRes = (x: unknown): x is NextResponse => x instanceof NextResponse;
