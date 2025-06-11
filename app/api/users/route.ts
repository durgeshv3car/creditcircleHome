import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET() {
  try {
    const res = await fetch(`${BASE_URL}/otp/get-all-profile`);
    const data = await res.json();
    if (res.ok) {
      return NextResponse.json(data, { status: res.status });
    } else {
      return NextResponse.json({ error: data?.error || "Failed to fetch users" }, { status: res.status });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const body = await req.json();
    const res = await fetch(`${BASE_URL}/otp/update-profile/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.ok) {
      return NextResponse.json(data, { status: res.status });
    } else {
      return NextResponse.json({ error: data?.error || "Failed to update user" }, { status: res.status });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const res = await fetch(`${BASE_URL}/otp/delete-profile/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (res.ok) {
      return NextResponse.json(data, { status: res.status });
    } else {
      return NextResponse.json({ error: data?.error || "Failed to delete user" }, { status: res.status });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
