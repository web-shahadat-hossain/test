import { NextRequest, NextResponse } from "next/server";

const EXTERNAL_API = "https://america-to-bd.vercel.app/product/order";

function getAccessToken(req: NextRequest) {
  return req.cookies.get("accessToken")?.value;
}

// Get all products
export async function GET(req: NextRequest) {
  const response = await fetch(EXTERNAL_API);
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  return NextResponse.json(data, { status: response.status });
}

// Add product
export async function POST(req: NextRequest) {
  const token = getAccessToken(req);
  if (!token) {
    return NextResponse.json(
      { detail: "Authentication credentials were not provided." },
      { status: 401 }
    );
  }

  // Parse multipart form data
  const formData = await req.formData();
  const forwardForm = new FormData();
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      forwardForm.append(key, value, value.name);
    } else {
      forwardForm.append(key, value as string);
    }
  }
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    // 'Content-Type' will be set automatically by fetch when using FormData
  };

  const response = await fetch(EXTERNAL_API, {
    method: "POST",
    headers,
    body: forwardForm,
  });
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  return NextResponse.json(data, { status: response.status });
}
