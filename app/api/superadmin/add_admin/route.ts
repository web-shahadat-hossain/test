import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const body = await request.json();
  // Get the access token from cookies
  // const accessToken = request.cookies.get("accessToken")?.value;

  try {
    const response = await fetch(
      "https://america-to-bd.vercel.app/superadmin/add_admin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
        body: JSON.stringify(body),
      }
    );
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch from API" },
      { status: 500 }
    );
  }
}
