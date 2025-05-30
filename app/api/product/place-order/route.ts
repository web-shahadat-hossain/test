// import { NextRequest, NextResponse } from "next/server";

// const EXTERNAL_API = "https://america-to-bd.vercel.app/product/place-order";

// function getAccessToken(req: NextRequest) {
//   const token = req.cookies.get("accessToken")?.value;
//   console.log("🍪 Access token:", token);
//   return token;
// }

// export async function POST(req: NextRequest) {
//   const token = getAccessToken(req);

//   if (!token) {
//     return NextResponse.json(
//       { detail: "Authentication credentials were not provided." },
//       { status: 401 }
//     );
//   }

//   const body = await req.json(); // Frontend থেকে JSON body ধরছে
//   console.log("📦 Placing Order with data:", body.data);

//   const response = await fetch(EXTERNAL_API, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
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

const POST_API = "https://america-to-bd.vercel.app/product/place-order";

function getAccessToken(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  return token;
}

export async function POST(req: NextRequest) {
  const token = getAccessToken(req);

  if (!token) {
    return NextResponse.json(
      { detail: "Authentication credentials were not provided." },
      { status: 401 }
    );
  }

  const body = await req.json();
  console.log("📦 Placing Order with data:", body);

  const response = await fetch(POST_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
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

export async function GET(req: NextRequest) {
  const token = getAccessToken(req);

  if (!token) {
    return NextResponse.json(
      { detail: "Authentication credentials were not provided." },
      { status: 401 }
    );
  }

  const response = await fetch(POST_API, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
