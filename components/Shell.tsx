"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, createContext, useContext } from "react";
import clsx from "clsx";
import { LayoutDashboard, FileText, Package, Users, UserCog, LogOut, Menu } from "lucide-react";
import type { Session, Tenant } from "@/lib/types";

const Ctx = createContext<Session | null>(null);
export const useSession = () => useContext(Ctx)!;

export default function Shell({ session, tenant, children }: { session: Session; tenant: Tenant; children: React.ReactNode }) {
  const path = usePathname(); const r = useRouter(); const [open, setOpen] = useState(false);
  const nav = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/invoices", label: "Invoices", icon: FileText },
    { href: "/products", label: "Inventory", icon: Package },
    { href: "/customers", label: "Customers", icon: Users },
    ...(session.role === "admin" ? [{ href: "/team", label: "Team & Roles", icon: UserCog }] : []),
  ];
  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); r.push("/"); r.refresh(); }
  const side = (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 px-2 py-1 text-lg font-semibold"><div className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-sm text-white">L</div>Ledgerly</div>
      <div className="mt-4 rounded-lg bg-slate-50 p-3"><div className="text-sm font-semibold">{tenant.name}</div><div className="text-xs text-slate-500">{tenant.city} · {tenant.plan} plan</div></div>
      <nav className="mt-4 flex-1 space-y-1">
        {nav.map(n => <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className={clsx("flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium", path.startsWith(n.href) ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50")}><n.icon className="h-4 w-4" />{n.label}</Link>)}
      </nav>
      <div className="border-t border-slate-100 pt-3">
        <div className="flex items-center gap-3 px-2"><div className="grid h-9 w-9 place-items-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">{session.name.split(" ").map(x => x[0]).join("")}</div><div className="min-w-0 flex-1"><div className="truncate text-sm font-medium">{session.name}</div><div className="text-xs capitalize text-slate-500">{session.role}</div></div><button onClick={logout} title="Log out" className="text-slate-400 hover:text-rose-600"><LogOut className="h-4 w-4" /></button></div>
      </div>
    </aside>
  );
  return (
    <Ctx.Provider value={session}>
      <div className="flex min-h-screen">
        <div className="sticky top-0 hidden h-screen lg:block">{side}</div>
        {open && <div className="fixed inset-0 z-40 flex lg:hidden"><div>{side}</div><div className="flex-1 bg-slate-900/40" onClick={() => setOpen(false)} /></div>}
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur lg:hidden"><button onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button><span className="font-semibold">{tenant.name}</span></header>
          <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </Ctx.Provider>
  );
}
