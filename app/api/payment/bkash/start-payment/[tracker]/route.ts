import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tracker: string }> }
) {
  const { tracker } = await params; // Await the params
  const backendUrl = `https://america-to-bd.vercel.app/payment/bkash/start-payment/${tracker}`;

  try {
    const response = await axios.get(backendUrl);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
        ...(error.response?.data && { data: error.response.data }),
      },
      { status: error.response?.status || 500 }
    );
  }
}
