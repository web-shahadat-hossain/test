// import { NextRequest, NextResponse } from "next/server";

// const EXTERNAL_API = "https://america-to-bd.vercel.app/product";

// function getAccessToken(req: NextRequest) {
//   return req.cookies.get("accessToken")?.value;
// }

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

//   const body = await req.json();
//   const headers: Record<string, string> = {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//   };

//   const response = await fetch(EXTERNAL_API + `${params.id}/`, {
//     method: "PATCH",
//     headers,
//     body: JSON.stringify(body),
//   });
//   const text = await response.text();
//   let data;
//   try {
//     data = JSON.parse(text);
//   } catch {
//     data = { raw: text };
//   }
//   return NextResponse.json(data, { status: response.status });
// }

// export async function DELETE(
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

//   const headers: Record<string, string> = {
//     Authorization: `Bearer ${token}`,
//   };

//   const response = await fetch(EXTERNAL_API + `${params.id}/`, {
//     method: "DELETE",
//     headers,
//   });

//   if (response.status === 204) {
//     return new NextResponse(null, { status: 204 });
//   }

//   const text = await response.text();
//   let data;
//   try {
//     data = JSON.parse(text);
//   } catch {
//     data = { raw: text };
//   }
//   return NextResponse.json(data, { status: response.status });
// }

import { NextRequest, NextResponse } from "next/server";

const EXTERNAL_API = "https://america-to-bd.vercel.app/product";

function getAccessToken(req: NextRequest) {
  return req.cookies.get("accessToken")?.value;
}

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

  const body = await req.json();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(EXTERNAL_API + `/${id}/`, {
    // Use awaited id
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(
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

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(EXTERNAL_API + `/${id}/`, {
    // Use awaited id
    method: "DELETE",
    headers,
  });

  if (response.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  return NextResponse.json(data, { status: response.status });
}
