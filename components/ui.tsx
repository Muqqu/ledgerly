"use client";
import { useEffect } from "react";
import clsx from "clsx";
import { X } from "lucide-react";
import type { InvoiceStatus } from "@/lib/types";

export function StatusBadge({ s }: { s: InvoiceStatus }) {
  const c = { paid: "bg-emerald-50 text-emerald-700 ring-emerald-200", pending: "bg-amber-50 text-amber-800 ring-amber-200", overdue: "bg-rose-50 text-rose-700 ring-rose-200", draft: "bg-slate-100 text-slate-700 ring-slate-200" }[s];
  return <span className={clsx("inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset", c)}>{s}</span>;
}
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="card w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between"><h3 id="modal-title" className="text-lg font-semibold">{title}</h3><button aria-label="Close dialog" onClick={onClose} className="btn -mr-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"><X className="h-5 w-5" /></button></div>
        {children}
      </div>
    </div>
  );
}
export function ConfirmModal({ open, title, body, confirmLabel = "Delete", onCancel, onConfirm }: { open: boolean; title: string; body: string; confirmLabel?: string; onCancel: () => void; onConfirm: () => void }) {
  return <Modal open={open} onClose={onCancel} title={title}><p className="text-sm text-slate-600">{body}</p><div className="mt-6 flex justify-end gap-2"><button className="btn-ghost" onClick={onCancel}>Cancel</button><button className="btn bg-rose-600 text-white hover:bg-rose-700" onClick={onConfirm}>{confirmLabel}</button></div></Modal>;
}
export function EmptyState({ icon: Icon, title, sub, action }: { icon: React.ComponentType<{ className?: string }>; title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-center">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-500"><Icon className="h-5 w-5" /></div>
      <div className="text-sm font-medium text-slate-700">{title}</div>
      {sub && <div className="text-xs text-slate-500">{sub}</div>}
      {action}
    </div>
  );
}
export function SkeletonRows({ cols, n = 6 }: { cols: number; n?: number }) {
  return <>{Array.from({ length: n }, (_, k) => <tr key={k}><td colSpan={cols} className="px-4 py-3"><div className="h-4 animate-pulse rounded bg-slate-100" /></td></tr>)}</>;
}
export function PageHeader({ title, sub, children }: { title: string; sub?: React.ReactNode; children?: React.ReactNode }) {
  return <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-2xl font-bold">{title}</h1>{sub && <p className="text-sm text-slate-500">{sub}</p>}</div><div className="flex gap-2">{children}</div></div>;
}
export const SubSkeleton = () => <span className="inline-block h-4 w-20 animate-pulse rounded bg-slate-200 align-middle" />;
export function ReadOnlyNote() { return <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600">Read-only role</span>; }
