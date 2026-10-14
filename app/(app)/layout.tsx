import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Shell from "@/components/Shell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const s = await getSession();
  if (!s) redirect("/");
  const tenant = db.tenants.find(t => t.id === s.tenantId)!;
  return <Shell session={s} tenant={tenant}>{children}</Shell>;
}
