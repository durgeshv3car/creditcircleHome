import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/getToken";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// GET /api/ourServices?type=serviceType
export async function GET(req: NextRequest) {
  try {
    const token = await getToken();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "";
    const res = await fetch(`${BASE_URL}/service/${type}`,
      { headers: { Authorization: token || "" } }
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch data" },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/ourServices
export async function POST(req: NextRequest) {
  try {
    const token = await getToken();
    const contentType = req.headers.get("content-type") || "";
    let res;
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      res = await fetch(`${BASE_URL}/service`, {
        method: "POST",
        headers: { Authorization: token || "" },
        body: formData,
      });
    } else {
      const body = await req.json();
      res = await fetch(`${BASE_URL}/service`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token || "" },
        body: JSON.stringify(body),
      });
    }
    const data = await res.json();
    if (!res.ok) {
      console.error("POST backend error:", data);
      return NextResponse.json(
        { error: data?.error || "Failed to add service", backend: data },
        { status: res.status }
      );
    }
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/ourServices
export async function PUT(req: NextRequest) {
  try {
    const token = await getToken();
    const contentType = req.headers.get("content-type") || "";
    let res;
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      res = await fetch(`${BASE_URL}/service`, {
        method: "PUT",
        headers: { Authorization: token || "" },
        body: formData,
      });
    } else {
      const body = await req.json();
      res = await fetch(`${BASE_URL}/service`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token || "" },
        body: JSON.stringify(body),
      });
    }
    const data = await res.json();
    if (!res.ok) {
      console.error("PUT backend error:", data);
      return NextResponse.json(
        { error: data?.error || "Failed to update service", backend: data },
        { status: res.status }
      );
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/ourServices?id=serviceId
export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const res = await fetch(`${BASE_URL}/service/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: token || "" },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to delete service" },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
