import { NextResponse } from "next/server";

const DOLLAR_RATE = 122;
const US_SALES_TAX_RATE = 0.0887;
const PLATFORM_FEE_RATE = 0.015; // 1.5% platform fee

interface ShippingRequest {
  category: string;
  productPrice: number;
  deliveryLocation: string;
}

export async function POST(request: Request) {
  try {
    const body: ShippingRequest = await request.json();
    const { productPrice, deliveryLocation } = body;

    // Calculate converted price
    const convertedPrice = productPrice * DOLLAR_RATE;

    // Calculate US Sales Tax
    const usSalesTax = productPrice * US_SALES_TAX_RATE * DOLLAR_RATE;

    // Calculate BD Customs Fee (varies by product value)
    let bdCustomsFee = 0;
    if (convertedPrice <= 10000) {
      bdCustomsFee = convertedPrice * 0.15; // 15% for items under 10,000 BDT
    } else if (convertedPrice <= 25000) {
      bdCustomsFee = convertedPrice * 0.2; // 20% for items between 10,000-25,000 BDT
    } else {
      bdCustomsFee = convertedPrice * 0.25; // 25% for items over 25,000 BDT
    }

    // Calculate Platform Fee
    const platformFee = convertedPrice * PLATFORM_FEE_RATE;

    // Get delivery charge from the selected option
    const deliveryCharge = parseInt(
      deliveryLocation.split(" - ")[1].replace(" BDT", "")
    );

    // Calculate total cost
    const totalCost =
      convertedPrice + bdCustomsFee + usSalesTax + platformFee + deliveryCharge;

    return NextResponse.json({
      itemPrice: productPrice,
      convertedPrice: Math.round(convertedPrice),
      bdCustomsFee: Math.round(bdCustomsFee),
      usSalesTax: Math.round(usSalesTax),
      platformFee: Math.round(platformFee),
      deliveryCharge,
      totalCost: Math.round(totalCost),
    });
  } catch (error) {
    console.error("Error calculating shipping:", error);
    return NextResponse.json(
      { error: "Failed to calculate shipping costs" },
      { status: 500 }
    );
  }
}
