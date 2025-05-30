import { NextResponse } from "next/server";

interface ProductDetails {
  title: string;
  price: string;
  images: string[];
  description: string;
  specifications: Record<string, string>;
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { url } = await req.json();

    // Validate URL
    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        { error: "Invalid URL provided" },
        { status: 400 }
      );
    }

    // Add your product fetching logic here
    const productDetails: ProductDetails = {
      title: "Sample Product",
      price: "$99.99",
      images: ["https://example.com/sample-image.jpg"],
      description: "Sample product description",
      specifications: {
        brand: "Sample Brand",
        model: "Sample Model",
      },
    };

    return NextResponse.json(productDetails);
  } catch (error: unknown) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product details" },
      { status: 500 }
    );
  }
}

function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
}
