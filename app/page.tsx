import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";
import { BarChart3, ShieldCheck, Building2, Boxes } from "lucide-react";

export default async function Home() {
  if (await getSession()) redirect("/dashboard");
  const features = [
    [Building2, "Multi-tenant", "Every query is scoped to the signed-in organisation."],
    [ShieldCheck, "Role-based access", "Admin, Manager and Viewer permissions enforced in the API."],
    [BarChart3, "Live analytics", "Revenue trends, status mix and category breakdowns."],
    [Boxes, "Inventory-aware invoicing", "Invoices validate and decrement stock atomically."],
  ] as const;
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 p-12 text-white lg:flex">
        <div className="flex items-center gap-2 text-lg font-semibold"><div className="grid h-9 w-9 place-items-center rounded-lg bg-white/15">L</div>Ledgerly</div>
        <div>
          <h1 className="text-4xl font-bold leading-tight">Invoicing &amp; inventory<br />for growing Pakistani businesses.</h1>
          <p className="mt-4 max-w-md text-indigo-100">A production-style SaaS dashboard built with Next.js 15 App Router, TypeScript and Tailwind CSS.</p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {features.map(([Icon, t, d]) => <div key={t} className="rounded-xl bg-white/10 p-4 backdrop-blur"><Icon className="h-5 w-5" /><div className="mt-2 font-semibold">{t}</div><div className="text-sm text-indigo-100">{d}</div></div>)}
          </div>
        </div>
        <p className="text-sm text-indigo-200">Built by <a className="underline" href="https://www.muqaddamshaikh.site/">Muqaddam Shaikh</a> · <a className="underline" href="https://github.com/muqqu">github.com/muqqu</a></p>
      </section>
      <section className="flex items-center justify-center p-6"><LoginForm /></section>
    </main>
  );
}
