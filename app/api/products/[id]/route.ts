import { db, log } from "@/lib/db";
import { guard, isRes, json } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };
export async function PATCH(req: Request, { params }: Ctx) {
  const s = await guard("write"); if (isRes(s)) return s; const { id } = await params;
  const p = db.products.find(x => x.id === id && x.tenantId === s.tenantId);
  if (!p) return json({ error: "Not found" }, 404);
  const b = await req.json();
  if (b.name !== undefined) p.name = String(b.name);
  if (b.category !== undefined) p.category = String(b.category);
  if (b.price !== undefined && Number(b.price) > 0) p.price = Number(b.price);
  if (b.stock !== undefined && Number(b.stock) >= 0) p.stock = Number(b.stock);
  log(s.tenantId, s.name, `updated product ${p.name}`);
  return json(p);
}
export async function DELETE(_: Request, { params }: Ctx) {
  const s = await guard("delete"); if (isRes(s)) return s; const { id } = await params;
  const idx = db.products.findIndex(x => x.id === id && x.tenantId === s.tenantId);
  if (idx < 0) return json({ error: "Not found" }, 404);
  const [p] = db.products.splice(idx, 1); log(s.tenantId, s.name, `deleted product ${p.name}`);
  return json({ ok: true });
}
