import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET() {
  try {
    const res = await fetch(`${BASE_URL}/logs`);
    const data = await res.json();
    if (res.ok) {
      return NextResponse.json(data, { status: res.status });
    } else {
      return NextResponse.json({ error: data?.error || "Failed to fetch user logs" }, { status: res.status });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user logs" }, { status: 500 });
  }
}
