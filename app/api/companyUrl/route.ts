import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET() {
  try {
    const res = await fetch(`${BASE_URL}/credit-score-url`);
    const data = await res.json();
    if (res.ok) {
      return NextResponse.json(data, { status: res.status });
    } else {
      return NextResponse.json({ error: data?.error || "Failed to fetch company URLs" }, { status: res.status });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch company URLs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.companyUrl) {
      return NextResponse.json({ error: "companyUrl is required" }, { status: 400 });
    }
    const res = await fetch(`${BASE_URL}/credit-score-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.ok) {
      return NextResponse.json(data, { status: res.status });
    } else {
      return NextResponse.json({ error: data?.error || "Failed to add companyUrl" }, { status: res.status });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to add companyUrl" }, { status: 500 });
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
    if (!body.companyUrl) {
      return NextResponse.json({ error: "companyUrl is required" }, { status: 400 });
    }
    const res = await fetch(`${BASE_URL}/credit-score-url/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.ok) {
      return NextResponse.json(data, { status: res.status });
    } else {
      return NextResponse.json({ error: data?.error || "Failed to update companyUrl" }, { status: res.status });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to update companyUrl" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const res = await fetch(`${BASE_URL}/credit-score-url/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (res.ok) {
      return NextResponse.json(data, { status: res.status });
    } else {
      return NextResponse.json({ error: data?.error || "Failed to delete companyUrl" }, { status: res.status });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete companyUrl" }, { status: 500 });
  }
}
