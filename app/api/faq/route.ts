import { NextResponse } from "next/server";

// FAQ data structure
interface FAQ {
  question: string;
  answer: string;
}

// Sample FAQ data - replace with your actual QA data
const faqs: FAQ[] = [
  {
    question: "Which shipping carrier does AmericaToBD works with?",
    answer:
      "AmericaToBD works with multiple trusted international shipping carriers including DHL, FedEx, and UPS to ensure reliable and efficient delivery of your products from the US to Bangladesh.",
  },
  {
    question: "How will I know when my product will arrive?",
    answer:
      "You'll receive real-time tracking updates via email and SMS at every stage of your shipment. Our system will notify you when your package is received at our US warehouse, when it's shipped, and when it arrives in Bangladesh. You can also track your shipment status through your account dashboard.",
  },
  {
    question: "How can I track my shipment?",
    answer:
      "You can track your shipment in multiple ways:\n1. Log into your AmericaToBD account and check the tracking section\n2. Use the tracking number provided in your email/SMS notifications\n3. Contact our customer support team for real-time updates",
  },
  {
    question: "What kind of customer support does AmericaToBD provide?",
    answer:
      "AmericaToBD provides 24/7 customer support through multiple channels:\n- Live chat on our website\n- Email support at support@americatobd.com\n- Phone support at +880 XXXX-XXXXXX\n- WhatsApp support at +880 XXXX-XXXXXX\nOur support team is trained to handle all your queries regarding shipping, tracking, customs, and delivery.",
  },
  {
    question: "What is packet consolidation?",
    answer:
      "Packet consolidation is a service where we combine multiple small packages into one shipment to help you save on shipping costs. If you order multiple items from different US stores, we'll receive them at our US warehouse, combine them into a single package, and ship them together to Bangladesh. This helps reduce overall shipping costs and customs fees.",
  },
];

export async function GET() {
  try {
    return NextResponse.json(faqs);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQs" },
      { status: 500 }
    );
  }
}
