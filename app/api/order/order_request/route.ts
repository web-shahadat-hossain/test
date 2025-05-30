import { NextRequest, NextResponse } from "next/server";

// external API
const EXTERNAL_API = "https://america-to-bd.vercel.app/order/order_request";

// get access token from cookies
function getAccessToken(req: NextRequest) {
  return req.cookies.get("accessToken")?.value;
}

// create order request (user only)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const token = getAccessToken(req);

  if (!token) {
    return NextResponse.json(
      { detail: "Authentication credentials were not provided." },
      { status: 401 }
    );
  }

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

// get all order requests (admin only)
export async function GET(req: NextRequest) {
  console.log("[API] GET /api/order/order_request hit");
  console.log("[API] Cookies:", req.cookies.getAll());

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
  console.log("token in API route:", token);
  console.log("headers in API route:", headers);
  console.log("Outgoing headers to backend:", headers);
  console.log("Token being sent:", token);

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
