import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    console.log("Test route called");

    // Test external API connection
    const response = await fetch("https://america-to-bd.vercel.app/product/");
    const text = await response.text();

    return NextResponse.json({
      message: "API route is working",
      externalApiStatus: response.status,
      externalApiResponse: text.substring(0, 200) + "...", // First 200 chars
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Test route error:", error);
    return NextResponse.json(
      {
        error: "Test route failed",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({
    message: "DELETE method is working",
    timestamp: new Date().toISOString(),
  });
}
