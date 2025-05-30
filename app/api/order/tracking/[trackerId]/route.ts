// import { NextRequest, NextResponse } from "next/server";

// const EXTERNAL_API = "https://america-to-bd.vercel.app/order/tracking";

// function getAccessToken(req: NextRequest) {
//   return req.cookies.get("accessToken")?.value;
// }

// // Get tracking information
// export async function GET(
//   req: NextRequest,
//   { params }: { params: { trackerId: string } }
// ) {
//   const token = getAccessToken(req);
//   const headers: Record<string, string> = {};

//   // Add authorization header if token exists
//   if (token) {
//     headers["Authorization"] = `Bearer ${token}`;
//   }

//   try {
//     const response = await fetch(`${EXTERNAL_API}${params.trackerId}`, {
//       headers,
//     });

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => null);
//       return NextResponse.json(
//         { detail: errorData?.detail || "Failed to fetch tracking information" },
//         { status: response.status }
//       );
//     }

//     const text = await response.text();
//     let data;
//     try {
//       data = JSON.parse(text);
//     } catch {
//       data = { raw: text };
//     }
//     return NextResponse.json(data, { status: response.status });
//   } catch (error) {
//     console.error("Error fetching tracking information:", error);
//     return NextResponse.json(
//       { detail: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// import { NextRequest, NextResponse } from "next/server";

// const EXTERNAL_API = "https://america-to-bd.vercel.app/order/tracking/";

// function getAccessToken(req: NextRequest) {
//   return req.cookies.get("accessToken")?.value;
// }

// // Get tracking information
// export async function GET(
//   req: NextRequest,
//   { params }: { params: { trackerId: string } }
// ) {
//   const { trackerId } = params;

//   const token = getAccessToken(req);
//   const headers: Record<string, string> = {};

//   // Add authorization header if token exists
//   if (token) {
//     headers["Authorization"] = `Bearer ${token}`;
//   }

//   try {
//     const response = await fetch(`${EXTERNAL_API}${trackerId}`, {
//       headers,
//     });

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => null);
//       return NextResponse.json(
//         { detail: errorData?.detail || "Failed to fetch tracking information" },
//         { status: response.status }
//       );
//     }

//     const text = await response.text();
//     let data;
//     try {
//       data = JSON.parse(text);
//     } catch {
//       data = { raw: text };
//     }
//     return NextResponse.json(data, { status: response.status });
//   } catch (error) {
//     console.error("Error fetching tracking information:", error);
//     return NextResponse.json(
//       { detail: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";

const EXTERNAL_API = "https://america-to-bd.vercel.app/order/tracking/";

function getAccessToken(req: NextRequest) {
  return req.cookies.get("accessToken")?.value;
}

// Get tracking information
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ trackerId: string }> }
) {
  const { trackerId } = await params; // Add await here
  const token = getAccessToken(req);
  const headers: Record<string, string> = {};

  // Add authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${EXTERNAL_API}${trackerId}`, {
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return NextResponse.json(
        { detail: errorData?.detail || "Failed to fetch tracking information" },
        { status: response.status }
      );
    }

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error fetching tracking information:", error);
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 }
    );
  }
}
