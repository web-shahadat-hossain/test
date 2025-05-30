// import { NextRequest, NextResponse } from "next/server";

// const POST_API = "https://america-to-bd.vercel.app/product/place-order";

// function getAccessToken(req: NextRequest) {
//   const token = req.cookies.get("accessToken")?.value;
//   return token;
// }

// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const token = getAccessToken(req);
//   const { id } = params;
//   const body = await req.json();

//   const response = await fetch(`${POST_API}/${id}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(body),
//   });

//   const data = await response
//     .json()
//     .catch(() => ({ raw: response.statusText }));

//   return NextResponse.json(data, { status: response.status });
// }

// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const token = getAccessToken(req);
//   const { id } = params;

//   const response = await fetch(`${POST_API}/${id}`, {
//     method: "DELETE",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   const data = await response
//     .json()
//     .catch(() => ({ raw: response.statusText }));

//   return NextResponse.json(data, { status: response.status });
// }

import { NextRequest, NextResponse } from "next/server";

const POST_API = "https://america-to-bd.vercel.app/product/place-order";

function getAccessToken(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  return token;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = getAccessToken(req);
  const { id } = await params; // Await the params
  const body = await req.json();

  const response = await fetch(`${POST_API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = { message: response.statusText };
  }

  if (response.ok) {
    return NextResponse.json(data, { status: 200 }); // ✅ Always 200 if successful
  } else {
    console.error("❌ PATCH error:", data);
    return NextResponse.json(data, { status: response.status || 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = getAccessToken(req);
  const { id } = await params; // Await the params

  const response = await fetch(`${POST_API}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = { message: response.statusText || "No content" };
  }

  if (response.ok) {
    return NextResponse.json(data, { status: 200 }); // ✅ Always 200 if successful
  } else {
    console.error("❌ DELETE error:", data);
    return NextResponse.json(data, { status: response.status || 500 });
  }
}
