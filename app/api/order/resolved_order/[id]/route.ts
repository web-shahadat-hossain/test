// import { NextRequest, NextResponse } from "next/server";

// const EXTERNAL_API = "https://america-to-bd.vercel.app/order/resolved_order";

// function getAccessToken(req: NextRequest) {
//   return req.cookies.get("accessToken")?.value;
// }

// // Update resolved order
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

// // Delete resolved order
// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const token = getAccessToken(req);
//   console.log("Token:", token);
//   if (!token) {
//     return NextResponse.json(
//       { detail: "Authentication credentials were not provided." },
//       { status: 401 }
//     );
//   }

//   const headers: Record<string, string> = {
//     Authorization: `Bearer ${token}`,
//   };

//   console.log("Deleting order:", params.id);

//   const response = await fetch(`${EXTERNAL_API}${params.id}`, {
//     method: "DELETE",
//     headers,
//   });

//   console.log("External API status:", response.status);
//   const url = `${EXTERNAL_API}${params.id}`;
//   console.log("Calling external API URL:", url);
//   if (!response.ok) {
//     const text = await response.text();
//     let data;
//     try {
//       data = JSON.parse(text);
//     } catch {
//       data = { raw: text };
//     }
//     console.log("Error from external API:", data);
//     return NextResponse.json(
//       { detail: "Failed to delete order", ...data },
//       { status: response.status }
//     );
//   }

//   if (response.status === 204) {
//     console.log("Delete successful, 204 No Content");
//     return NextResponse.json({ success: true }, { status: 200 });
//   }

//   let data = {};
//   try {
//     data = await response.json();
//   } catch {
//     // ignore, maybe no body
//   }
//   console.log("Delete successful, data:", data);
//   return NextResponse.json({ success: true, ...data }, { status: 200 });
// }

import { NextRequest, NextResponse } from "next/server";

const EXTERNAL_API = "https://america-to-bd.vercel.app/order/resolved_order";

function getAccessToken(req: NextRequest) {
  return req.cookies.get("accessToken")?.value;
}

// Update resolved order
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

  const url = `${EXTERNAL_API}${id}/`; // Use the awaited id
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

// Delete resolved order
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Await the params Promise

  const token = getAccessToken(req);
  console.log("Token:", token);
  if (!token) {
    return NextResponse.json(
      { detail: "Authentication credentials were not provided." },
      { status: 401 }
    );
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  console.log("Deleting order:", id); // Use the awaited id

  const response = await fetch(`${EXTERNAL_API}${id}`, {
    method: "DELETE",
    headers,
  });

  console.log("External API status:", response.status);
  const url = `${EXTERNAL_API}${id}`; // Use the awaited id
  console.log("Calling external API URL:", url);
  if (!response.ok) {
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
    console.log("Error from external API:", data);
    return NextResponse.json(
      { detail: "Failed to delete order", ...data },
      { status: response.status }
    );
  }

  if (response.status === 204) {
    console.log("Delete successful, 204 No Content");
    return NextResponse.json({ success: true }, { status: 200 });
  }

  let data = {};
  try {
    data = await response.json();
  } catch {
    // ignore, maybe no body
  }
  console.log("Delete successful, data:", data);
  return NextResponse.json({ success: true, ...data }, { status: 200 });
}
