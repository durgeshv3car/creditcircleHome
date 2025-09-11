import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/getToken";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(req: NextRequest) {
  try {
    const token = await getToken();
    const res = await fetch(`${BASE_URL}/api-management`, {
      headers: {
        Authorization: token || "",
      },
    });

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json(
        { error: error || "Failed to fetch data" },
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
    const token = await getToken();
    const contentType = req.headers.get("content-type") || "";
    let requestBody;

    if (contentType.includes("multipart/form-data")) {
      requestBody = await req.formData();
    } else {
      requestBody = await req.json();
    }

    // ✅ Check if request has name, startdate, and enddate
    if (
      requestBody &&
      typeof requestBody === "object" &&
      "name" in requestBody &&
      "startdate" in requestBody &&
      "enddate" in requestBody
    ) {
      // Send to filter API
      const res = await fetch(`${BASE_URL}/api-management/filter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify({
          name: requestBody.name,
          startdate: requestBody.startdate,
          enddate: requestBody.enddate,
        }),
      });

      if (!res.ok) {
        const error = await res.text();
        return NextResponse.json(
          { error: error || "Failed to fetch filtered data" },
          { status: res.status }
        );
      }

      const data = await res.json();
      return NextResponse.json(data);
    }

    // ✅ Default API create flow
    const res = await fetch(`${BASE_URL}/api-management`, {
      method: "POST",
      headers: {
        Authorization: token || "",
      },
      body:
        requestBody instanceof FormData
          ? requestBody
          : JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json(
        { error: error || "Failed to create" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
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
    const token = await getToken();
    const contentType = req.headers.get("content-type") || "";
    let requestBody;

    if (contentType.includes("multipart/form-data")) {
      requestBody = await req.formData();
    } else {
      requestBody = await req.json();
    }

    const res = await fetch(`${BASE_URL}/api-management`, {
      method: "PUT",
      headers: {
        Authorization: token || "",
      },
      body:
        requestBody instanceof FormData
          ? requestBody
          : JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json(
        { error: error || "Failed to update" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
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
    const token = await getToken();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const res = await fetch(`${BASE_URL}/api-management/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token || "",
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json(
        { error: error || "Failed to delete" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
