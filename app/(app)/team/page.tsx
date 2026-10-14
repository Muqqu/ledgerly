import { redirect } from "next/navigation";
import { getSession, can } from "@/lib/auth";
import { db } from "@/lib/db";
import { Check, Minus } from "lucide-react";

export const dynamic = "force-dynamic";
export default async function Team() {
  const s = (await getSession())!;
  if (!can.manageTeam(s.role)) redirect("/dashboard");
  const users = db.users.filter(u => u.tenantId === s.tenantId);
  const perms: [string, boolean, boolean, boolean][] = [["View dashboards & data", true, true, true], ["Create / edit invoices, products, customers", true, true, false], ["Delete records", true, false, false], ["Manage team & roles", true, false, false]];
  return (
    <>
      <div className="mb-6"><h1 className="text-2xl font-bold">Team &amp; Roles</h1><p className="text-sm text-slate-500">Only admins can see this page — enforced on the server.</p></div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="card overflow-hidden"><table className="w-full"><thead className="bg-slate-50"><tr><th className="th">Member</th><th className="th">Role</th></tr></thead><tbody className="divide-y divide-slate-100">{users.map(u => <tr key={u.id}><td className="td"><div className="font-medium">{u.name}</div><div className="text-xs text-slate-500">{u.email}</div></td><td className="td"><span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium capitalize text-indigo-700">{u.role}</span></td></tr>)}</tbody></table></div>
        <div className="card overflow-hidden"><table className="w-full"><thead className="bg-slate-50"><tr><th className="th">Permission</th><th className="th text-center">Admin</th><th className="th text-center">Manager</th><th className="th text-center">Viewer</th></tr></thead><tbody className="divide-y divide-slate-100">{perms.map(([p, ...r]) => <tr key={p}><td className="td">{p}</td>{r.map((v, k) => <td key={k} className="td text-center">{v ? <Check className="mx-auto h-4 w-4 text-emerald-600" /> : <Minus className="mx-auto h-4 w-4 text-slate-300" />}</td>)}</tr>)}</tbody></table></div>
      </div>
    </>
  );
}
