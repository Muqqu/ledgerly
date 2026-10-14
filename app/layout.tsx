import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const url = "https://ledgerly-saas-orcin.vercel.app";
export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: "Ledgerly — Multi-tenant Invoicing & Inventory SaaS",
  description: "Portfolio project by Muqaddam Shaikh: Next.js 15, TypeScript, Tailwind, RBAC, multi-tenancy.",
  openGraph: { title: "Ledgerly — Invoicing & inventory SaaS", description: "Create invoices, track stock and see cash flow across every branch, with isolated data per business.", url, siteName: "Ledgerly", type: "website" },
  twitter: { card: "summary_large_image" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={inter.variable}><body>{children}</body></html>;
}
