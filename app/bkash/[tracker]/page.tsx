"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function BkashPaymentPage() {
  const router = useRouter();
  const { tracker } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initiateBkashPayment = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `/api/payment/bkash/start-payment/${tracker}`
        );
        const { bkashURL } = response.data;
        if (bkashURL) {
          window.location.href = bkashURL;
        } else {
          throw new Error("No bKash URL received from server");
        }
      } catch (err: any) {
        setError("Failed to initiate payment. Please try again.");
        toast.error("Failed to initiate payment. Please try again.");
        console.error("Payment initiation error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (tracker) initiateBkashPayment();
  }, [tracker]);

  if (loading) return <div>Starting bKash payment...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="mb-4 text-xl font-bold">bKash Payment</h2>
      <div>Redirecting to bKash...</div>
    </div>
  );
}
