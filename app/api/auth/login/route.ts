import { db } from "@/lib/db";
import { sign, COOKIE } from "@/lib/auth";
import { json } from "@/lib/api";

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  const u = db.users.find(x => x.email.toLowerCase() === String(email ?? "").toLowerCase() && x.password === password);
  if (!u) return json({ error: "Invalid email or password" }, 401);
  const res = json({ ok: true, role: u.role });
  res.cookies.set(COOKIE, sign({ userId: u.id, tenantId: u.tenantId, role: u.role, name: u.name, email: u.email }), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 8 * 3600 });
  return res;
}
