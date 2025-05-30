// import { NextRequest, NextResponse } from "next/server";

// const BACKEND_BASE = "https://america-to-bd.vercel.app/payment/mannual-payment";
// const BACKEND_BASE_2 =
//   "https://america-to-bd.vercel.app/payment/approve-payment";

// function getAccessToken(req: NextRequest) {
//   // Try header first, then cookie
//   const authHeader = req.headers.get("authorization");
//   if (authHeader && authHeader.startsWith("Bearer ")) {
//     return authHeader.replace("Bearer ", "");
//   }
//   return req.cookies.get("accessToken")?.value;
// }

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { tracker: string } }
// ) {
//   const { tracker } = params;
//   const accessToken = getAccessToken(req);
//   console.log(accessToken);
//   if (!accessToken) {
//     return NextResponse.json(
//       { detail: "Authentication credentials were not provided." },
//       { status: 401 }
//     );
//   }
//   const headers: Record<string, string> = {
//     Authorization: `Bearer ${accessToken}`,
//     // "Content-Type": "application/json",
//   };
//   const res = await fetch(`${BACKEND_BASE}/${tracker}`, {
//     method: "GET",
//     headers,
//   });
//   const text = await res.text();
//   let data;
//   try {
//     data = JSON.parse(text);
//   } catch {
//     data = { raw: text };
//   }
//   return NextResponse.json(data, { status: res.status });
// }

// export async function POST(
//   req: NextRequest,
//   { params }: { params: { tracker: string } }
// ) {
//   const { tracker } = params;
//   const accessToken = getAccessToken(req);
//   if (!accessToken) {
//     return NextResponse.json(
//       { detail: "Authentication credentials were not provided." },
//       { status: 401 }
//     );
//   }

//   try {
//     const body = await req.json();
//     const headers: Record<string, string> = {
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": "application/json",
//     };

//     const res = await fetch(`${BACKEND_BASE_2}`, {
//       method: "POST",
//       headers,
//       body: JSON.stringify({
//         tracker_id: tracker,
//       }),
//     });

//     const text = await res.text();
//     let data;
//     try {
//       data = JSON.parse(text);
//     } catch {
//       data = { raw: text };
//     }

//     if (!res.ok) {
//       return NextResponse.json(
//         { detail: data.detail || "Failed to approve payment" },
//         { status: res.status }
//       );
//     }

//     return NextResponse.json(data, { status: res.status });
//   } catch (error) {
//     console.error("Error in approval:", error);
//     return NextResponse.json(
//       { detail: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { tracker: string } }
// ) {
//   const { tracker } = params;
//   const accessToken = getAccessToken(req);
//   console.log(accessToken);
//   if (!accessToken) {
//     return NextResponse.json(
//       { detail: "Authentication credentials were not provided." },
//       { status: 401 }
//     );
//   }
//   const headers: Record<string, string> = {
//     Authorization: `Bearer ${accessToken}`,
//   };
//   const res = await fetch(`${BACKEND_BASE}/${tracker}`, {
//     method: "DELETE",
//     headers,
//   });
//   return new NextResponse(null, { status: res.status });
// }

import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE = "https://america-to-bd.vercel.app/payment/mannual-payment";
const BACKEND_BASE_2 =
  "https://america-to-bd.vercel.app/payment/approve-payment";

function getAccessToken(req: NextRequest) {
  // Try header first, then cookie
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.replace("Bearer ", "");
  }
  return req.cookies.get("accessToken")?.value;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tracker: string }> }
) {
  const { tracker } = await params; // Add await here
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
    // "Content-Type": "application/json",
  };
  const res = await fetch(`${BACKEND_BASE}/${tracker}`, {
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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tracker: string }> }
) {
  const { tracker } = await params; // Add await here
  const accessToken = getAccessToken(req);
  if (!accessToken) {
    return NextResponse.json(
      { detail: "Authentication credentials were not provided." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const headers: Record<string, string> = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    const res = await fetch(`${BACKEND_BASE_2}`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        tracker_id: tracker,
      }),
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!res.ok) {
      return NextResponse.json(
        { detail: data.detail || "Failed to approve payment" },
        { status: res.status }
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error in approval:", error);
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ tracker: string }> }
) {
  const { tracker } = await params; // Add await here
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
  const res = await fetch(`${BACKEND_BASE}/${tracker}`, {
    method: "DELETE",
    headers,
  });
  return new NextResponse(null, { status: res.status });
}
