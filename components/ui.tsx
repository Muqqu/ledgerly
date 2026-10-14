"use client";
import clsx from "clsx";
import { X } from "lucide-react";
import type { InvoiceStatus } from "@/lib/types";

export function StatusBadge({ s }: { s: InvoiceStatus }) {
  const c = { paid: "bg-emerald-50 text-emerald-700 ring-emerald-200", pending: "bg-amber-50 text-amber-700 ring-amber-200", overdue: "bg-rose-50 text-rose-700 ring-rose-200", draft: "bg-slate-100 text-slate-600 ring-slate-200" }[s];
  return <span className={clsx("inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset", c)}>{s}</span>;
}
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="card w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-semibold">{title}</h3><button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button></div>
        {children}
      </div>
    </div>
  );
}
export function PageHeader({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  return <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-2xl font-bold">{title}</h1>{sub && <p className="text-sm text-slate-500">{sub}</p>}</div><div className="flex gap-2">{children}</div></div>;
}
export function ReadOnlyNote() { return <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-500">Read-only role</span>; }
