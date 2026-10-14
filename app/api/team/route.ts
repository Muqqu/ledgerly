import { db } from "@/lib/db";
import { guard, isRes, json } from "@/lib/api";
export async function GET() {
  const s = await guard("manageTeam"); if (isRes(s)) return s;
  return json({ rows: db.users.filter(u => u.tenantId === s.tenantId).map(({ password, ...u }) => u) });
}
