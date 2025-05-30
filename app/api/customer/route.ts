import { NextRequest, NextResponse } from "next/server";

const POST_API = "https://america-to-bd.vercel.app/user";

function getAccessToken(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  return token;
}

export async function GET(req: NextRequest) {
  const token = getAccessToken(req);

  if (!token) {
    return NextResponse.json(
      { detail: "Authentication credentials were not provided." },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(POST_API, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log(data);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { detail: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
