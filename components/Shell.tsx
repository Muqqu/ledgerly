"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, createContext, useContext } from "react";
import clsx from "clsx";
import { LayoutDashboard, FileText, Package, Users, UserCog, LogOut, Menu, X } from "lucide-react";
import Logo from "@/components/Logo";
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
  useEffect(() => { if (!open) return; const h = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); }; window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h); }, [open]);
  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); r.push("/"); r.refresh(); }
  const side = (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between"><div className="flex items-center gap-2 px-2 py-1 text-lg font-semibold"><Logo />Ledgerly</div><button aria-label="Close navigation" onClick={() => setOpen(false)} className="btn text-slate-500 hover:bg-slate-100 lg:hidden"><X className="h-5 w-5" /></button></div>
      <div className="mt-4 rounded-lg bg-slate-50 p-3"><div className="text-sm font-semibold">{tenant.name}</div><div className="text-xs text-slate-500">{tenant.city} · {tenant.plan} plan</div></div>
      <nav className="mt-4 flex-1 space-y-1">
        {nav.map(n => <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className={clsx("flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium", path.startsWith(n.href) ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-50", "min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500")}><n.icon className="h-4 w-4" />{n.label}</Link>)}
      </nav>
      <div className="border-t border-slate-100 pt-3">
        <div className="flex items-center gap-3 px-2"><div className="grid h-9 w-9 place-items-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">{session.name.split(" ").map(x => x[0]).join("")}</div><div className="min-w-0 flex-1"><div className="truncate text-sm font-medium">{session.name}</div><div className="text-xs capitalize text-slate-500">{session.role}</div></div><button onClick={logout} title="Log out" aria-label="Log out" className="btn text-slate-500 hover:bg-rose-50 hover:text-rose-700"><LogOut className="h-4 w-4" /></button></div>
      </div>
    </aside>
  );
  return (
    <Ctx.Provider value={session}>
      <div className="flex min-h-screen">
        <div className="sticky top-0 hidden h-screen lg:block">{side}</div>
        <div id="mobile-nav" className={clsx("fixed inset-0 z-40 lg:hidden", !open && "pointer-events-none")} aria-hidden={!open}>
          <div className={clsx("absolute inset-0 bg-slate-900/40 transition-opacity", open ? "opacity-100" : "opacity-0")} onClick={() => setOpen(false)} />
          <div className={clsx("relative h-full w-64 transition-transform duration-200", open ? "translate-x-0" : "-translate-x-full", !open && "invisible")}>{side}</div>
        </div>
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur lg:hidden"><button aria-label="Open navigation" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(true)} className="btn -m-2 p-2 text-slate-700 hover:bg-slate-100"><Menu className="h-5 w-5" /></button><Logo className="h-7 w-7" /><span className="font-semibold">{tenant.name}</span></header>
          <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </Ctx.Provider>
  );
}
