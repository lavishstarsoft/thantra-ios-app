import { NextResponse } from "next/server";

const API_BASE = (process.env.API_BASE || "http://localhost:3000").replace(/\/$/, "");

export async function GET(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const res = await fetch(`${API_BASE}/api/public/progress/me`, {
    headers: auth ? { Authorization: auth } : {},
    cache: "no-store",
  });
  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
