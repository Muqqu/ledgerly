import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";
import Logo from "@/components/Logo";
import { ShieldCheck, Building2 } from "lucide-react";

const PORTFOLIO_URL = "https://ledgerly-saas-orcin.vercel.app"; // TODO: switch to the new portfolio URL once live (muqaddamshaikh.site does not resolve yet)

function Credit({ className }: { className: string }) {
  return <p className={className}>Built by <a className="link-focus inline-block py-3 underline" href={PORTFOLIO_URL}>Muqaddam Shaikh</a> · <a className="link-focus inline-block py-3 underline" href="https://github.com/muqqu">GitHub</a></p>;
}

export default async function Home() {
  if (await getSession()) redirect("/dashboard");
  const features = [
    [Building2, "Multi-tenant", "Every query is scoped to the signed-in organisation."],
    [ShieldCheck, "Role-based access", "Admin, Manager and Viewer enforced in the API."],
  ] as const;
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 p-12 text-white lg:flex">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.18),transparent_45%)]" />
        <div className="relative flex items-center gap-2 text-lg font-semibold"><Logo tile="bg-white/15" className="h-9 w-9" />Ledgerly</div>
        <div className="relative">
          <h1 className="text-5xl font-bold leading-tight tracking-tight">Invoicing &amp; inventory<br />for growing Pakistani businesses.</h1>
          <p className="mt-4 max-w-md text-indigo-100">Create invoices, track stock and see cash flow across every branch, with isolated data per business.</p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tech stack">{["Next.js 15", "TypeScript", "Tailwind", "RBAC"].map(t => <li key={t} className="rounded-full bg-white/10 px-3 py-1 text-xs">{t}</li>)}</ul>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/02-dashboard.png" alt="Ledgerly dashboard showing revenue KPIs, monthly revenue chart and invoice status breakdown" width={1440} height={1174} className="mt-10 rounded-xl shadow-2xl ring-1 ring-white/20" />
          <div className="mt-6 grid grid-cols-2 gap-4">
            {features.map(([Icon, t, d]) => <div key={t} className="rounded-xl bg-white/10 p-4 backdrop-blur"><Icon className="h-5 w-5" aria-hidden="true" /><div className="mt-2 font-semibold">{t}</div><div className="text-sm text-indigo-100">{d}</div></div>)}
          </div>
        </div>
        <Credit className="relative text-sm text-indigo-100" />
      </section>
      <section className="flex flex-col items-center justify-center gap-8 p-6">
        <div className="w-full max-w-md lg:hidden">
          <div className="flex items-center gap-2 text-lg font-semibold"><Logo />Ledgerly</div>
          <h1 className="mt-4 text-2xl font-bold leading-tight">Invoicing &amp; inventory for growing Pakistani businesses.</h1>
          <p className="mt-2 text-sm text-slate-600">Multi-tenant · RBAC · Live analytics · Next.js 15</p>
        </div>
        <LoginForm />
        <Credit className="mt-8 text-center text-xs text-slate-600 lg:hidden" />
      </section>
    </main>
  );
}
