"use client";

import { useState, useEffect } from "react";

interface CardRequest {
  id: string;
  cardType: string;
  cardName: string;
  billingAddress: string;
  shippingAddress: string;
  quantity: number;
  price: number;
}

export default function AddCardPage() {
  const [cardRequests, setCardRequests] = useState<CardRequest[]>([]);
  const [form, setForm] = useState({
    cardType: "",
    cardName: "",
    billingAddress: "",
    shippingAddress: "",
    quantity: 1,
    price: 0,
  });
  const [error, setError] = useState("");

  // Prefill from localStorage if available
  useEffect(() => {
    const prefill = window.localStorage.getItem("addCardPrefill");
    if (prefill) {
      const card = JSON.parse(prefill);
      setCardRequests((prev) => {
        // Prevent duplicate if already in cart
        if (
          prev.some(
            (c) => c.cardName === card.cardName && c.price === card.price
          )
        )
          return prev;
        return [
          ...prev,
          {
            ...card,
            id: Date.now().toString(),
            quantity: Number(card.quantity),
            price: Number(card.price),
          },
        ];
      });
      window.localStorage.removeItem("addCardPrefill");
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.cardType ||
      !form.cardName ||
      !form.billingAddress ||
      !form.shippingAddress ||
      form.quantity < 1
    ) {
      setError("Please fill all fields and quantity must be at least 1.");
      return;
    }
    setCardRequests([
      ...cardRequests,
      {
        ...form,
        id: Date.now().toString(),
        quantity: Number(form.quantity),
        price: Number(form.price),
      },
    ]);
    setForm({
      cardType: "",
      cardName: "",
      billingAddress: "",
      shippingAddress: "",
      quantity: 1,
      price: 0,
    });
    setError("");
  };

  const handleRemove = (id: string) => {
    setCardRequests(cardRequests.filter((c) => c.id !== id));
  };

  const subtotal = cardRequests.reduce(
    (sum, c) => sum + c.price * c.quantity,
    0
  );

  return (
    <div className="flex flex-col gap-8 px-4 py-8 mx-auto md:flex-row max-w-7xl">
      {/* Left: Card List */}
      <div className="flex-1">
        <h2 className="mb-4 text-2xl font-bold">Add Card</h2>
        <h3 className="mb-2 text-xl font-semibold">Your Card Requests</h3>
        <div className="bg-white divide-y shadow rounded-xl">
          {cardRequests.length === 0 ? (
            <div className="p-6 text-gray-500">No card requests added yet.</div>
          ) : (
            cardRequests.map((card) => (
              <div
                key={card.id}
                className="flex items-center justify-between p-4"
              >
                <div>
                  <div className="font-medium">
                    {card.cardType} - {card.cardName}
                  </div>
                  <div className="text-sm text-gray-500">
                    Billing: {card.billingAddress}
                  </div>
                  <div className="text-sm text-gray-500">
                    Shipping: {card.shippingAddress}
                  </div>
                  <div className="text-sm text-gray-500">
                    Qty: {card.quantity} × {card.price} ={" "}
                    <span className="font-semibold">
                      {card.quantity * card.price}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(card.id)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right: Summary */}
      <div className="w-full md:w-96">
        <div className="sticky p-6 bg-white shadow rounded-xl top-8">
          <h3 className="mb-4 text-xl font-bold">Summary</h3>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>BDT {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>BDT 0.00</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Taxes</span>
            <span>BDT 0.00</span>
          </div>
          <div className="flex justify-between mb-4 text-lg font-bold">
            <span>Total</span>
            <span>BDT {subtotal.toLocaleString()}</span>
          </div>
          <button
            className="w-full bg-[#ff5c00] text-white py-2 rounded-lg font-semibold hover:bg-[#ff2f0a] transition"
            disabled={cardRequests.length === 0}
            onClick={() => {
              if (cardRequests.length > 0) {
                window.location.href = "/dashboard/checkout?step=address";
              }
            }}
          >
            Go to Checkout
          </button>
          <div className="mt-4 text-xs text-red-600">
            Note: Additional shipping, cleaning, and packaging costs will be
            added to your product's current price based on its weight upon
            arrival in Bangladesh at a rate of{" "}
            <b>3 BDT per gram (3000 BDT per KG)</b>.
          </div>
        </div>
      </div>
    </div>
  );
}
