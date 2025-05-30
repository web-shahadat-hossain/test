// import { NextRequest, NextResponse } from "next/server";

// const EXTERNAL_API = "https://america-to-bd.vercel.app/user/";

// function getAccessToken(req: NextRequest) {
//   return req.cookies.get("accessToken")?.value;
// }

// // Get user details
// export async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const token = getAccessToken(req);
//   const headers: Record<string, string> = {};

//   // Add authorization header if token exists
//   if (token) {
//     headers["Authorization"] = `Bearer ${token}`;
//   }

//   try {
//     const response = await fetch(`${EXTERNAL_API}${params.id}`, { headers });

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => null);
//       return NextResponse.json(
//         { detail: errorData?.detail || "Failed to fetch user details" },
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
//     console.error("Error fetching user details:", error);
//     return NextResponse.json(
//       { detail: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// // Update user details
// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const token = getAccessToken(req);
//   if (!token) {
//     return NextResponse.json(
//       { detail: "Authentication credentials were not provided." },
//       { status: 401 }
//     );
//   }

//   try {
//     const body = await req.json();
//     const headers: Record<string, string> = {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     };

//     const response = await fetch(`${EXTERNAL_API}${params.id}/`, {
//       method: "PATCH",
//       headers,
//       body: JSON.stringify(body),
//     });

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => null);
//       return NextResponse.json(
//         { detail: errorData?.detail || "Failed to update user details" },
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
//     console.error("Error updating user details:", error);
//     return NextResponse.json(
//       { detail: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";

const EXTERNAL_API = "https://america-to-bd.vercel.app/user/";

function getAccessToken(req: NextRequest) {
  return req.cookies.get("accessToken")?.value;
}

// Get user details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Await the params Promise

  const token = getAccessToken(req);
  const headers: Record<string, string> = {};

  // Add authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${EXTERNAL_API}${id}`, { headers }); // Use awaited id

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return NextResponse.json(
        { detail: errorData?.detail || "Failed to fetch user details" },
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
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update user details
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Await the params Promise

  const token = getAccessToken(req);
  if (!token) {
    return NextResponse.json(
      { detail: "Authentication credentials were not provided." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${EXTERNAL_API}${id}/`, {
      // Use awaited id
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return NextResponse.json(
        { detail: errorData?.detail || "Failed to update user details" },
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
    console.error("Error updating user details:", error);
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 }
    );
  }
}
