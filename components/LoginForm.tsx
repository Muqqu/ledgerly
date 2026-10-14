"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogIn } from "lucide-react";

const demos = [
  { label: "Admin", email: "admin@indus.demo", note: "Full access · Indus Traders" },
  { label: "Manager", email: "manager@indus.demo", note: "Create & edit, no delete" },
  { label: "Viewer", email: "viewer@indus.demo", note: "Read-only" },
  { label: "Other tenant", email: "admin@margalla.demo", note: "Margalla Retail (isolated data)" },
];

export default function LoginForm() {
  const r = useRouter();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [err, setErr] = useState(""); const [busy, setBusy] = useState<string | null>(null);
  async function login(e: string, p: string) {
    setBusy(e); setErr("");
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: e, password: p }) });
    if (res.ok) { r.push("/dashboard"); r.refresh(); } else { setErr((await res.json()).error); setBusy(null); }
  }
  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold">Welcome back</h2>
      <p className="mt-1 text-sm text-slate-500">Sign in, or explore instantly with a one-click demo account.</p>
      <div className="mt-6 grid grid-cols-2 gap-2">
        {demos.map(d => (
          <button key={d.email} onClick={() => login(d.email, "demo1234")} disabled={!!busy} className="card p-3 text-left transition hover:border-indigo-400 hover:shadow">
            <div className="flex items-center justify-between text-sm font-semibold">{d.label}{busy === d.email ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4 text-indigo-500" />}</div>
            <div className="mt-0.5 text-xs text-slate-500">{d.note}</div>
          </button>
        ))}
      </div>
      <div className="my-6 flex items-center gap-3 text-xs text-slate-400"><div className="h-px flex-1 bg-slate-200" />or sign in with email<div className="h-px flex-1 bg-slate-200" /></div>
      <form onSubmit={e => { e.preventDefault(); login(email, password); }} className="space-y-3">
        <div><label className="label">Email</label><input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@indus.demo" required /></div>
        <div><label className="label">Password</label><input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="demo1234" required /></div>
        {err && <p className="text-sm text-rose-600">{err}</p>}
        <button className="btn-primary w-full" disabled={!!busy}>Sign in</button>
      </form>
      <p className="mt-4 text-center text-xs text-slate-400">Demo password for all accounts: <code>demo1234</code></p>
    </div>
  );
}
