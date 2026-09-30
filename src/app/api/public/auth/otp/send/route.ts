import { NextResponse } from "next/server";

const API_BASE = (process.env.API_BASE || "http://localhost:3000").replace(/\/$/, "");

export async function POST(req: Request) {
  const body = await req.text();
  const res = await fetch(`${API_BASE}/api/public/auth/otp/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    cache: "no-store",
  });
  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
