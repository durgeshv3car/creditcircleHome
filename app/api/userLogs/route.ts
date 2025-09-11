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

export async function POST(req: Request) {
  try {
    const token = await getToken();
    const { action } = await req.json(); 

    const response = await fetch(`${BASE_URL}/logs`, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `${token}` : "",
      },
      body: JSON.stringify({ action }),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(data, { status: response.status });
    } else {
      return NextResponse.json(
        { error: data?.error || "Failed to create log" },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("POST /logs error:", error);
    return NextResponse.json(
      { error: "Failed to create log" },
      { status: 500 }
    );
  }
}
