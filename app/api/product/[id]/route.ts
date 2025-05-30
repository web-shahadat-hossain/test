// // import { NextRequest, NextResponse } from "next/server";

// // const EXTERNAL_API = "https://america-to-bd.vercel.app/product/";

// // function getAccessToken(req: NextRequest) {
// //   return req.cookies.get("accessToken")?.value;
// // }

// // export async function PATCH(
// //   req: NextRequest,
// //   { params }: { params: { id: string } }
// // ) {
// //   const token = getAccessToken(req);
// //   if (!token) {
// //     return NextResponse.json(
// //       { detail: "Authentication credentials were not provided." },
// //       { status: 401 }
// //     );
// //   }

// //   const body = await req.json();
// //   const headers: Record<string, string> = {
// //     "Content-Type": "application/json",
// //     Authorization: `Bearer ${token}`,
// //   };

// //   const response = await fetch(EXTERNAL_API + `${params.id}/`, {
// //     method: "PATCH",
// //     headers,
// //     body: JSON.stringify(body),
// //   });
// //   const text = await response.text();
// //   let data;
// //   try {
// //     data = JSON.parse(text);
// //   } catch {
// //     data = { raw: text };
// //   }
// //   return NextResponse.json(data, { status: response.status });
// // }

// // export async function DELETE(
// //   req: NextRequest,
// //   { params }: { params: { id: string } }
// // ) {
// //   const token = getAccessToken(req);
// //   if (!token) {
// //     return NextResponse.json(
// //       { detail: "Authentication credentials were not provided." },
// //       { status: 401 }
// //     );
// //   }

// //   const headers: Record<string, string> = {
// //     Authorization: `Bearer ${token}`,
// //   };

// //   const response = await fetch(EXTERNAL_API + `${params.id}/`, {
// //     method: "DELETE",
// //     headers,
// //   });

// //   if (response.status === 204) {
// //     return new NextResponse(null, { status: 204 });
// //   }

// //   const text = await response.text();
// //   let data;
// //   try {
// //     data = JSON.parse(text);
// //   } catch {
// //     data = { raw: text };
// //   }
// //   return NextResponse.json(data, { status: response.status });
// // }

// import { NextRequest, NextResponse } from "next/server";

// const EXTERNAL_API = "https://america-to-bd.vercel.app/product/order";

// function getAccessToken(req: NextRequest) {
//   return req.cookies.get("accessToken")?.value;
// }

// // export async function DELETE(
// //   req: NextRequest,
// //   { params }: { params: { id: string } }
// // ) {
// //   console.log("=== DELETE ROUTE STARTED ===");
// //   console.log("Product ID:", params.id);

// //   try {
// //     const token = getAccessToken(req);
// //     console.log("Token exists:", !!token);

// //     if (!token) {
// //       console.log("No token found, returning 401");
// //       return NextResponse.json(
// //         { detail: "Authentication credentials were not provided." },
// //         { status: 401 }
// //       );
// //     }

// //     const headers: Record<string, string> = {
// //       Authorization: `Bearer ${token}`,
// //     };

// //     const url = `${EXTERNAL_API}${params.id}/`;
// //     console.log("Making DELETE request to:", url);
// //     console.log("Headers:", { ...headers, Authorization: "Bearer [HIDDEN]" });

// //     const response = await fetch(url, {
// //       method: "DELETE",
// //       headers,
// //     });

// //     console.log("External API response status:", response.status);
// //     console.log(
// //       "External API response headers:",
// //       Object.fromEntries(response.headers.entries())
// //     );

// //     // Handle 204 No Content (successful deletion)
// //     if (response.status === 204) {
// //       console.log("Successful deletion (204), returning empty response");
// //       return new NextResponse(null, { status: 204 });
// //     }

// //     // Handle other successful responses
// //     if (response.ok) {
// //       console.log("Successful deletion (200), returning success message");
// //       return NextResponse.json(
// //         { message: "Product deleted successfully" },
// //         { status: 200 }
// //       );
// //     }

// //     // Handle error responses
// //     const text = await response.text();
// //     console.log("External API error response text:", text);

// //     let data;
// //     try {
// //       data = JSON.parse(text);
// //       console.log("Parsed error data:", data);
// //     } catch (parseError) {
// //       console.log("Failed to parse error response as JSON:", parseError);
// //       data = { detail: text || "Failed to delete product" };
// //     }

// //     console.log("Returning error response with status:", response.status);
// //     return NextResponse.json(data, { status: response.status });
// //   } catch (error) {
// //     console.error("=== UNHANDLED ERROR IN DELETE ROUTE ===");
// //     console.error("Error type:", error?.constructor?.name);
// //     console.error(
// //       "Error message:",
// //       error instanceof Error ? error.message : String(error)
// //     );
// //     console.error(
// //       "Error stack:",
// //       error instanceof Error ? error.stack : "No stack trace"
// //     );

// //     return NextResponse.json(
// //       {
// //         detail: "Internal server error while deleting product",
// //         error: error instanceof Error ? error.message : String(error),
// //       },
// //       { status: 500 }
// //     );
// //   } finally {
// //     console.log("=== DELETE ROUTE ENDED ===");
// //   }
// // }

// export async function DELETE(req: NextRequest) {
//   try {
//     console.log("=== DEBUG DELETE ROUTE ===");

//     // Check if token exists in cookies
//     const token = req.cookies.get("accessToken")?.value;
//     console.log("Token exists:", !!token);
//     console.log(
//       "Token preview:",
//       token ? token.substring(0, 20) + "..." : "No token"
//     );

//     if (!token) {
//       return NextResponse.json(
//         {
//           error: "No authentication token found",
//           message: "Make sure you're logged in and have the accessToken cookie",
//           cookies: Object.fromEntries(
//             req.cookies
//               .getAll()
//               .map((c) => [c.name, c.value.substring(0, 20) + "..."])
//           ),
//         },
//         { status: 401 }
//       );
//     }

//     // Test DELETE request to external API
//     const headers = {
//       Authorization: `Bearer ${token}`,
//     };

//     console.log("Making DELETE request to external API...");
//     const response = await fetch(
//       "https://america-to-bd.vercel.app/product/4/",
//       {
//         method: "DELETE",
//         headers,
//       }
//     );

//     console.log("External API DELETE response status:", response.status);

//     const text = await response.text();
//     console.log("External API DELETE response text:", text);

//     return NextResponse.json({
//       message: "DEBUG DELETE test completed",
//       externalApiStatus: response.status,
//       externalApiResponse: text,
//       tokenExists: !!token,
//       tokenPreview: token.substring(0, 20) + "...",
//       timestamp: new Date().toISOString(),
//     });
//   } catch (error) {
//     console.error("DEBUG DELETE error:", error);
//     return NextResponse.json(
//       {
//         error: "DEBUG DELETE test failed",
//         message: error instanceof Error ? error.message : String(error),
//         stack: error instanceof Error ? error.stack : "No stack",
//       },
//       { status: 500 }
//     );
//   }
// }
// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   console.log("=== PATCH ROUTE STARTED ===");
//   console.log("Product ID:", params.id);

//   try {
//     const token = getAccessToken(req);
//     console.log("Token exists:", !!token);

//     if (!token) {
//       console.log("No token found, returning 401");
//       return NextResponse.json(
//         { detail: "Authentication credentials were not provided." },
//         { status: 401 }
//       );
//     }

//     const body = await req.json();
//     console.log("Request body:", body);

//     const headers: Record<string, string> = {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     };

//     const url = `${EXTERNAL_API}${params.id}/`;
//     console.log("Making PATCH request to:", url);

//     const response = await fetch(url, {
//       method: "PATCH",
//       headers,
//       body: JSON.stringify(body),
//     });

//     console.log("External API response status:", response.status);

//     const text = await response.text();
//     console.log("External API response text:", text);

//     let data;
//     try {
//       data = JSON.parse(text);
//       console.log("Parsed response data:", data);
//     } catch (parseError) {
//       console.log("Failed to parse response as JSON:", parseError);
//       data = { raw: text };
//     }

//     console.log("Returning response with status:", response.status);
//     return NextResponse.json(data, { status: response.status });
//   } catch (error) {
//     console.error("=== UNHANDLED ERROR IN PATCH ROUTE ===");
//     console.error("Error type:", error?.constructor?.name);
//     console.error(
//       "Error message:",
//       error instanceof Error ? error.message : String(error)
//     );
//     console.error(
//       "Error stack:",
//       error instanceof Error ? error.stack : "No stack trace"
//     );

//     return NextResponse.json(
//       {
//         detail: "Internal server error while updating product",
//         error: error instanceof Error ? error.message : String(error),
//       },
//       { status: 500 }
//     );
//   } finally {
//     console.log("=== PATCH ROUTE ENDED ===");
//   }
// }

// export async function GET(
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
//     method: "GET",
//     headers,
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

const EXTERNAL_API = "https://america-to-bd.vercel.app/product/order";

function getAccessToken(req: NextRequest) {
  return req.cookies.get("accessToken")?.value;
}

export async function DELETE(req: NextRequest) {
  try {
    console.log("=== DEBUG DELETE ROUTE ===");

    // Check if token exists in cookies
    const token = req.cookies.get("accessToken")?.value;
    console.log("Token exists:", !!token);
    console.log(
      "Token preview:",
      token ? token.substring(0, 20) + "..." : "No token"
    );

    if (!token) {
      return NextResponse.json(
        {
          error: "No authentication token found",
          message: "Make sure you're logged in and have the accessToken cookie",
          cookies: Object.fromEntries(
            req.cookies
              .getAll()
              .map((c) => [c.name, c.value.substring(0, 20) + "..."])
          ),
        },
        { status: 401 }
      );
    }

    // Test DELETE request to external API
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    console.log("Making DELETE request to external API...");
    const response = await fetch(
      "https://america-to-bd.vercel.app/product/4/",
      {
        method: "DELETE",
        headers,
      }
    );

    console.log("External API DELETE response status:", response.status);

    const text = await response.text();
    console.log("External API DELETE response text:", text);

    return NextResponse.json({
      message: "DEBUG DELETE test completed",
      externalApiStatus: response.status,
      externalApiResponse: text,
      tokenExists: !!token,
      tokenPreview: token.substring(0, 20) + "...",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("DEBUG DELETE error:", error);
    return NextResponse.json(
      {
        error: "DEBUG DELETE test failed",
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : "No stack",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Await the params Promise

  console.log("=== PATCH ROUTE STARTED ===");
  console.log("Product ID:", id); // Use awaited id

  try {
    const token = getAccessToken(req);
    console.log("Token exists:", !!token);

    if (!token) {
      console.log("No token found, returning 401");
      return NextResponse.json(
        { detail: "Authentication credentials were not provided." },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log("Request body:", body);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const url = `${EXTERNAL_API}${id}/`; // Use awaited id
    console.log("Making PATCH request to:", url);

    const response = await fetch(url, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    });

    console.log("External API response status:", response.status);

    const text = await response.text();
    console.log("External API response text:", text);

    let data;
    try {
      data = JSON.parse(text);
      console.log("Parsed response data:", data);
    } catch (parseError) {
      console.log("Failed to parse response as JSON:", parseError);
      data = { raw: text };
    }

    console.log("Returning response with status:", response.status);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("=== UNHANDLED ERROR IN PATCH ROUTE ===");
    console.error("Error type:", error?.constructor?.name);
    console.error(
      "Error message:",
      error instanceof Error ? error.message : String(error)
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    return NextResponse.json(
      {
        detail: "Internal server error while updating product",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  } finally {
    console.log("=== PATCH ROUTE ENDED ===");
  }
}

export async function GET(
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

  const response = await fetch(EXTERNAL_API + `${id}/`, {
    // Use awaited id
    method: "GET",
    headers,
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
