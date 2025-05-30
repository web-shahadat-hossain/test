import { NextRequest, NextResponse } from "next/server";

const EXTERNAL_API = "https://america-to-bd.vercel.app/address";

console.log("test address");

function getAccessToken(req: NextRequest) {
  // Try to get from cookies (Next.js 13+ API)
  return req.cookies.get("accessToken")?.value;
}

// Get all addresses
export async function GET(req: NextRequest) {
  const token = getAccessToken(req);
  console.log(token);
  if (!token) {
    return NextResponse.json(
      { detail: "Authentication credentials were not provided." },
      { status: 401 }
    );
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(EXTERNAL_API, { headers });
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  return NextResponse.json(data, { status: response.status });
}

// Create address
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
