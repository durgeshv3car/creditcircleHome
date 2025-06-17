import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/getToken";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET() {
  try {
    const token = await getToken();
    const res = await fetch(`${BASE_URL}/wallet`, {
      headers: {
        Authorization: token || "",
      },
    });
    const data = await res.json();
    if (res.ok) {
      return NextResponse.json(data, { status: res.status });
    } else {
      return NextResponse.json({ error: data?.error || "Failed to fetch wallet" }, { status: res.status });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch wallet" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken();
    const body = await req.json();
   
    const res = await fetch(`${BASE_URL}/wallet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.ok) {
      return NextResponse.json(data, { status: res.status });
    } else {
      return NextResponse.json({ error: data?.error || "Failed to add wallet" }, { status: res.status });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to add wallet" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const body = await req.json();
    const res = await fetch(`${BASE_URL}/wallet/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.ok) {
      return NextResponse.json(data, { status: res.status });
    } else {
      return NextResponse.json({ error: data?.error || "Failed to update wallet" }, { status: res.status });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to update wallet" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const res = await fetch(`${BASE_URL}/wallet/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token || "",
      },
    });
    const data = await res.json();
    if (res.ok) {
      return NextResponse.json(data, { status: res.status });
    } else {
      return NextResponse.json({ error: data?.error || "Failed to delete wallet" }, { status: res.status });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete wallet" }, { status: 500 });
  }
}
