import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/getToken";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "";
    const token = await getToken();
    const res = await fetch(`${BASE_URL}/banner/images/${type}`, {
      headers: {
        Authorization: token || "",
      },
    });
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

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    const token = await getToken();
    let res;
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      res = await fetch(`${BASE_URL}/banner/upload`, {
        method: "POST",
         headers: {
        Authorization: token  || "",
      },
        body: formData,
      });
    } else {
      const body = await req.json();
      res = await fetch(`${BASE_URL}/banner/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify(body),
      });
    }
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to upload" },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    const token = await getToken();
    let res;
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      res = await fetch(`${BASE_URL}/banner/image`, {
        method: "PUT",
        headers: {
        Authorization: token  || "",
      },
        body: formData,
      });
    } else {
      const body = await req.json();
      res = await fetch(`${BASE_URL}/banner/image`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify(body),
      });
    }
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to update" },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const token = await getToken();
    const res = await fetch(`${BASE_URL}/banner/image`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to delete" },
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
