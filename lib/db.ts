import type { Tenant, User, Customer, Product, Invoice, Activity, InvoiceStatus } from "./types";

// Deterministic PRNG so the seed is identical on every cold start.
function rng(seed: number) { return () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }; }

type DB = { tenants: Tenant[]; users: User[]; customers: Customer[]; products: Product[]; invoices: Invoice[]; activity: Activity[]; seq: number };

function seed(): DB {
  const r = rng(42);
  const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)];
  const tenants: Tenant[] = [
    { id: "t_indus", name: "Indus Traders", city: "Karachi", plan: "Growth" },
    { id: "t_margalla", name: "Margalla Retail", city: "Islamabad", plan: "Starter" },
  ];
  const users: User[] = [
    { id: "u1", tenantId: "t_indus", name: "Ayesha Khan", email: "admin@indus.demo", password: "demo1234", role: "admin" },
    { id: "u2", tenantId: "t_indus", name: "Bilal Ahmed", email: "manager@indus.demo", password: "demo1234", role: "manager" },
    { id: "u3", tenantId: "t_indus", name: "Sara Malik", email: "viewer@indus.demo", password: "demo1234", role: "viewer" },
    { id: "u4", tenantId: "t_margalla", name: "Hamza Qureshi", email: "admin@margalla.demo", password: "demo1234", role: "admin" },
    { id: "u5", tenantId: "t_margalla", name: "Zainab Raza", email: "manager@margalla.demo", password: "demo1234", role: "manager" },
  ];
  const cities = ["Karachi", "Lahore", "Islamabad", "Faisalabad", "Multan", "Peshawar", "Quetta", "Hyderabad"];
  const names = ["Al-Noor Stores", "Crescent Textiles", "Habib Electronics", "Saba Pharma", "Gulshan Mart", "Ravi Foods", "Clifton Cafe", "Zamzam Traders", "Shan Distributors", "Pak Steel Works", "Lucky Mobiles", "Mehran Motors", "Tariq Garments", "Bahria Supplies", "Iqbal & Sons", "Noor Interiors"];
  const catalog: [string, string, number][] = [
    ["Wireless Mouse", "Electronics", 2499], ["Mechanical Keyboard", "Electronics", 12999], ["27\" Monitor", "Electronics", 64999], ["USB-C Hub", "Electronics", 5499],
    ["Office Chair", "Furniture", 38999], ["Standing Desk", "Furniture", 89999], ["Basmati Rice 25kg", "Grocery", 8999], ["Cooking Oil 5L", "Grocery", 3299],
    ["Lawn Suit", "Apparel", 6499], ["Cotton Kurta", "Apparel", 3999], ["LED Bulb Pack", "Home", 1899], ["Water Dispenser", "Home", 27999],
  ];
  const customers: Customer[] = []; const products: Product[] = []; const invoices: Invoice[] = []; const activity: Activity[] = [];
  const now = new Date("2026-10-14T10:00:00Z");
  for (const t of tenants) {
    const nC = t.id === "t_indus" ? 16 : 10;
    for (let i = 0; i < nC; i++) customers.push({ id: `${t.id}_c${i}`, tenantId: t.id, name: names[(i + (t.id === "t_indus" ? 0 : 5)) % names.length], email: `accounts${i}@${t.id.slice(2)}-client.pk`, city: pick(cities), createdAt: new Date(now.getTime() - r() * 300 * 864e5).toISOString() });
    catalog.forEach(([name, category, price], i) => products.push({ id: `${t.id}_p${i}`, tenantId: t.id, sku: `${t.id === "t_indus" ? "IND" : "MRG"}-${String(1001 + i)}`, name, category, price, stock: Math.floor(r() * 120), reorderLevel: 15 }));
    const tc = customers.filter(c => c.tenantId === t.id); const tp = products.filter(p => p.tenantId === t.id);
    const nI = t.id === "t_indus" ? 140 : 70;
    for (let i = 0; i < nI; i++) {
      const issued = new Date(now.getTime() - Math.pow(r(), 0.8) * 360 * 864e5);
      const due = new Date(issued.getTime() + 30 * 864e5);
      const items = Array.from({ length: 1 + Math.floor(r() * 3) }, () => { const p = pick(tp); return { productId: p.id, name: p.name, qty: 1 + Math.floor(r() * 6), price: p.price }; });
      const total = items.reduce((s, it) => s + it.qty * it.price, 0);
      let status: InvoiceStatus = r() < 0.72 ? "paid" : "pending";
      if (status === "pending" && due < now) status = "overdue";
      if (r() < 0.04) status = "draft";
      const c = pick(tc);
      invoices.push({ id: `${t.id}_i${i}`, tenantId: t.id, number: "", customerId: c.id, customerName: c.name, items, total, status, issuedAt: issued.toISOString(), dueAt: due.toISOString() });
    }
  }
  for (const t of tenants) invoices.filter(i => i.tenantId === t.id).sort((a, b) => a.issuedAt.localeCompare(b.issuedAt)).forEach((inv, k) => (inv.number = `INV-${2026}-${String(k + 1).padStart(4, "0")}`));
  const acts = ["created invoice", "marked invoice as paid", "restocked", "added customer", "updated product price"];
  for (const t of tenants) { const tu = users.filter(u => u.tenantId === t.id); for (let i = 0; i < 8; i++) activity.push({ id: `${t.id}_a${i}`, tenantId: t.id, actor: pick(tu).name, action: `${pick(acts)} ${pick(products.filter(p => p.tenantId === t.id)).name}`, at: new Date(now.getTime() - i * 3.7 * 3600e3).toISOString() }); }
  return { tenants, users, customers, products, invoices, activity, seq: 1000 };
}

const g = globalThis as unknown as { __db?: DB };
export const db: DB = g.__db ?? (g.__db = seed());
export const newId = (p: string) => `${p}_${Date.now().toString(36)}${(db.seq++).toString(36)}`;
export function log(tenantId: string, actor: string, action: string) { db.activity.unshift({ id: newId("a"), tenantId, actor, action, at: new Date().toISOString() }); }
