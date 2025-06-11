import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let res;
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      res = await fetch(`${BASE_URL}/csv`, {
        method: "POST",
        body: formData,
      });
    } else {
      return NextResponse.json({ error: "Content-Type must be multipart/form-data for file uploads." }, { status: 400 });
    }
    const data = await res.json();
    if (res.ok) {
      return NextResponse.json(data, { status: res.status });
    } else {
      return NextResponse.json({ error: data?.error || "Failed to upload file" }, { status: res.status });
    }
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
