import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Get the access token from cookies
  const accessToken = request.cookies.get("accessToken")?.value;

  try {
    const response = await fetch(
      "https://america-to-bd.vercel.app/superadmin/get_admin",
      {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
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
