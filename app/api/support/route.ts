import { NextRequest, NextResponse } from "next/server";

// ✅ do not use cookies() directly in App Router, get token from request headers
export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";

  // Check content-type before using formData()
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Invalid content type. Use multipart/form-data." },
      { status: 400 }
    );
  }

  const token = req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const title = formData.get("subject") as string;
    const description = formData.get("description") as string;

    const forwardData = new FormData();
    forwardData.append("title", title);
    forwardData.append("description", description);

    const response = await fetch(
      "https://america-to-bd.vercel.app/contact/support",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ sending token
        },
        body: forwardData,
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("❌ Proxy error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
