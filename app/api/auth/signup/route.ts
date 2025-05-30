// For App Router (app/api/auth/register/route.ts)
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const response = await fetch(
      "https://america-to-bd.vercel.app/auth/signup", // <-- your backend signup endpoint
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      // Log error for debugging
      console.error("Backend signup error:", data);
      return NextResponse.json(data, { status: response.status });
    }
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch from API",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
