import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/notifications/app
export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${BASE_URL}/getallnotifications?type=email`);
    const data = await res.json();
    if (res.ok) {
      return NextResponse.json(data, { status: res.status });
    } else {
      return NextResponse.json({ error: data?.error || "Failed to fetch notifications" }, { status: res.status });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}
