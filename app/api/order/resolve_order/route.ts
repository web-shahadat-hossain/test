import { NextRequest, NextResponse } from "next/server";

const EXTERNAL_API = "https://america-to-bd.vercel.app/order/resolve_order/";

function getAccessToken(req: NextRequest) {
  return req.cookies.get("accessToken")?.value;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const token = getAccessToken(req);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const response = await fetch(EXTERNAL_API, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function GET(req: NextRequest) {
  const token = getAccessToken(req);
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const url = new URL(req.url);
  const search = url.search ? url.search : "";
  const response = await fetch(EXTERNAL_API + search, { headers });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
