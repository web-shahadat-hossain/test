import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://america-to-bd.vercel.app/profile";

function getAccessToken(req: NextRequest) {
  return req.cookies.get("accessToken")?.value;
}

// Get user profile
export async function GET(req: NextRequest) {
  const token = getAccessToken(req);
  if (!token) {
    return NextResponse.json(
      { detail: "Authentication credentials were not provided." },
      { status: 401 }
    );
  }

  console.log(token);

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(API_URL, { headers });
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  return NextResponse.json(data, { status: response.status });
}

// Update user profile
export async function PATCH(req: NextRequest) {
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

  const response = await fetch(API_URL, {
    method: "PATCH",
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
