import { guard, isRes, json } from "@/lib/api";
import { stats } from "@/lib/stats";
export async function GET() { const s = await guard(); if (isRes(s)) return s; return json(stats(s.tenantId)); }
