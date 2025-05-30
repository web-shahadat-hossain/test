import { NextRequest, NextResponse } from "next/server";

const EXTERNAL_API = "https://america-to-bd.vercel.app/order/resolved_order";

function getAccessToken(req: NextRequest) {
  return req.cookies.get("accessToken")?.value;
}

// Get all resolved orders
export async function GET(req: NextRequest) {
  const token = getAccessToken(req);
  if (!token) {
    return NextResponse.json(
      { detail: "Authentication credentials were not provided." },
      { status: 401 }
    );
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  const url = new URL(req.url);
  const search = url.search ? url.search : "";
  const response = await fetch(EXTERNAL_API + search, { headers });
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  return NextResponse.json(data, { status: response.status });
}

// Create resolved order
export async function POST(req: NextRequest) {
  const token = getAccessToken(req);
  if (!token) {
    return NextResponse.json(
      { detail: "Authentication credentials were not provided." },
      { status: 401 }
    );
  }

  const body = await req.json();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(EXTERNAL_API, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
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
