"use client";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import { pkr, shortPkr } from "@/lib/format";

export function RevenueChart({ data }: { data: { month: string; revenue: number }[] }) {
  const total = data.reduce((a, d) => a + d.revenue, 0);
  return <div className="h-72" role="img" aria-label={`Monthly revenue area chart, ${data[0]?.month ?? ""} to ${data.at(-1)?.month ?? ""}; total ${pkr(total)}`}><ResponsiveContainer><AreaChart data={data} margin={{ left: 0, right: 8 }}>
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} /><stop offset="100%" stopColor="#6366f1" stopOpacity={0} /></linearGradient></defs>
    <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} /><XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#64748b" /><YAxis tickFormatter={shortPkr} tick={{ fontSize: 12 }} stroke="#64748b" width={70} />
    <Tooltip formatter={(v: number) => pkr(v)} /><Area isAnimationActive={false} type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#g)" />
  </AreaChart></ResponsiveContainer></div>;
}
const COLORS: Record<string, string> = { paid: "#10b981", pending: "#f59e0b", overdue: "#f43f5e", draft: "#94a3b8" };
export function StatusPie({ data }: { data: { name: string; value: number }[] }) {
  return <figure className="h-72" role="img" aria-label={`Invoice status: ${data.map(d => `${d.name} ${d.value}`).join(", ")}`}><ResponsiveContainer><PieChart><Pie isAnimationActive={false} data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>{data.map(d => <Cell key={d.name} fill={COLORS[d.name]} />)}</Pie><Tooltip /><Legend formatter={(v: string) => <span className="capitalize text-slate-700">{v}</span>} /></PieChart></ResponsiveContainer></figure>;
}
export function CategoryBars({ data }: { data: { name: string; value: number }[] }) {
  return <div className="h-64" role="img" aria-label={`Revenue by category: ${data.map(d => `${d.name} ${pkr(d.value)}`).join(", ")}`}><ResponsiveContainer><BarChart data={data} layout="vertical" margin={{ left: 10 }}><XAxis type="number" hide /><YAxis type="category" dataKey="name" width={85} tick={{ fontSize: 12 }} stroke="#64748b" /><Tooltip formatter={(v: number) => pkr(v)} /><Bar isAnimationActive={false} dataKey="value" fill="#8b5cf6" radius={[0, 6, 6, 0]} /></BarChart></ResponsiveContainer></div>;
}
