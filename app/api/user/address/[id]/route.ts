// import { NextRequest, NextResponse } from "next/server";

// console.log("Loaded [id]/route.ts");
// console.log("DELETE endpoint hit");

// const EXTERNAL_API = "https://america-to-bd.vercel.app/address/";

// function getAccessToken(req: NextRequest) {
//   return req.cookies.get("accessToken")?.value;
// }

// // Delete address
// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   console.log("DELETE endpoint hit");
//   console.log(params.id);
//   const token = getAccessToken(req);
//   console.log("Token used for DELETE:", token);
//   if (!token) {
//     return NextResponse.json(
//       { detail: "Authentication credentials were not provided." },
//       { status: 401 }
//     );
//   }

//   const headers: Record<string, string> = {
//     Authorization: `Bearer ${token}`,
//   };

//   console.log(headers);

//   const url = `${EXTERNAL_API}${params.id}/`;
//   console.log("DELETE URL:", url);

//   const response = await fetch(url, {
//     method: "DELETE",
//     headers,
//   });
//   const text = await response.text();
//   console.log("DELETE response status:", response.status);
//   console.log("DELETE response text:", text);
//   let data;
//   try {
//     data = JSON.parse(text);
//   } catch {
//     data = { raw: text };
//   }
//   return NextResponse.json(data, { status: response.status });
// }

// //Update Adress

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

//   const url = `${EXTERNAL_API}${params.id}/`;
//   const response = await fetch(url, {
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

import { NextRequest, NextResponse } from "next/server";

console.log("Loaded [id]/route.ts");
console.log("DELETE endpoint hit");

const EXTERNAL_API = "https://america-to-bd.vercel.app/address/";

function getAccessToken(req: NextRequest) {
  return req.cookies.get("accessToken")?.value;
}

// Delete address
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Await the params Promise

  console.log("DELETE endpoint hit");
  console.log(id); // Use awaited id
  const token = getAccessToken(req);
  console.log("Token used for DELETE:", token);
  if (!token) {
    return NextResponse.json(
      { detail: "Authentication credentials were not provided." },
      { status: 401 }
    );
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  console.log(headers);

  const url = `${EXTERNAL_API}${id}/`; // Use awaited id
  console.log("DELETE URL:", url);

  const response = await fetch(url, {
    method: "DELETE",
    headers,
  });
  const text = await response.text();
  console.log("DELETE response status:", response.status);
  console.log("DELETE response text:", text);
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  return NextResponse.json(data, { status: response.status });
}

//Update Adress

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

  const url = `${EXTERNAL_API}${id}/`; // Use awaited id
  const response = await fetch(url, {
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
