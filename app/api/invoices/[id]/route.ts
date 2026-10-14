import { db, log } from "@/lib/db";
import { guard, isRes, json } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };
export async function PATCH(req: Request, { params }: Ctx) {
  const s = await guard("write"); if (isRes(s)) return s; const { id } = await params;
  const inv = db.invoices.find(i => i.id === id && i.tenantId === s.tenantId);
  if (!inv) return json({ error: "Not found" }, 404);
  const { status } = await req.json();
  if (!["paid", "pending", "overdue", "draft"].includes(status)) return json({ error: "Invalid status" }, 422);
  inv.status = status; log(s.tenantId, s.name, `marked ${inv.number} as ${status}`);
  return json(inv);
}
export async function DELETE(_: Request, { params }: Ctx) {
  const s = await guard("delete"); if (isRes(s)) return s; const { id } = await params;
  const idx = db.invoices.findIndex(i => i.id === id && i.tenantId === s.tenantId);
  if (idx < 0) return json({ error: "Not found" }, 404);
  const [inv] = db.invoices.splice(idx, 1); log(s.tenantId, s.name, `deleted invoice ${inv.number}`);
  return json({ ok: true });
}
