import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://america-to-bd.vercel.app/payment/mannual-payment";

function getAccessToken(req: NextRequest) {
  return req.cookies.get("accessToken")?.value;
}

export async function GET(req: NextRequest) {
  const accessToken = getAccessToken(req);
  console.log(accessToken);
  if (!accessToken) {
    return NextResponse.json(
      { detail: "Authentication credentials were not provided." },
      { status: 401 }
    );
  }
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
  };
  const res = await fetch(BACKEND_URL, {
    method: "GET",
    headers,
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const accessToken = getAccessToken(req);
  if (!accessToken) {
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
    Authorization: `Bearer ${accessToken}`,
    // 'Content-Type' will be set automatically by fetch when using FormData
  };
  const res = await fetch(BACKEND_URL, {
    method: "POST",
    headers,
    body: forwardForm,
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  return NextResponse.json(data, { status: res.status });
}
