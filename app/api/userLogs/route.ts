import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/getToken";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET() {
  try {
    const token = await getToken();
    const res = await fetch(`${BASE_URL}/logs`, {
       headers: {
        Authorization: token || "",
      },
    });
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
