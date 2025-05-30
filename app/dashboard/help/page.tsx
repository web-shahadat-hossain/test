"use client";
import React, { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    question: "How do I track my order?",
    answer:
      "You can track your order from the Orders page. Click on 'Track Order' next to your order details.",
  },
  {
    question: "How do I change my account information?",
    answer:
      "Go to Profile Settings to update your personal information, password, or addresses.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "You can contact us directly from the Contact Us page or email support@example.com.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept all major credit cards, PayPal, and other secure payment methods.",
  },
];

const knowledgeBase = [
  {
    category: "Orders",
    articles: [
      {
        title: "How to place an order",
        content:
          "To place an order, browse products, add them to your cart, and proceed to checkout.",
      },
      {
        title: "Order status explained",
        content:
          "Learn what each order status means: Pending, Processing, Shipped, Delivered, Cancelled.",
      },
    ],
  },
  {
    category: "Account",
    articles: [
      {
        title: "Resetting your password",
        content:
          "Go to Profile > Security to change your password. If you forgot it, use the Forgot Password link on login.",
      },
      {
        title: "Managing addresses",
        content:
          "You can add, edit, or remove addresses in Profile > Addresses.",
      },
    ],
  },
  {
    category: "Payments",
    articles: [
      {
        title: "Accepted payment methods",
        content:
          "We accept all major credit cards, PayPal, and more. See the Payments page for details.",
      },
      {
        title: "How to download invoices",
        content:
          "Go to Orders, select an order, and click 'Download Invoice' to get your invoice as a file.",
      },
    ],
  },
];

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState("faq");
  const [search, setSearch] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  // Filtered articles for knowledge base
  const filteredArticles = knowledgeBase
    .map((cat) => ({
      ...cat,
      articles: cat.articles.filter(
        (a) =>
          a.title.toLowerCase().includes(search.toLowerCase()) ||
          a.content.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((cat) => cat.articles.length > 0);

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50 sm:px-6 lg:px-8">
      <div className="max-w-3xl p-8 mx-auto bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-[#174832] mb-6">Help Center</h1>
        <p className="mb-8 text-gray-600">
          Find answers to common questions or{" "}
          <Link href="/dashboard/contact" className="text-[#174832] underline">
            contact us
          </Link>{" "}
          for further assistance.
        </p>
        {/* Tabs */}
        <div className="flex mb-8 space-x-6 border-b">
          <button
            className={`pb-2 text-lg font-medium transition-colors border-b-2 ${
              activeTab === "faq"
                ? "border-[#174832] text-[#174832]"
                : "border-transparent text-gray-500 hover:text-[#174832]"
            }`}
            onClick={() => setActiveTab("faq")}
          >
            FAQ
          </button>
          <button
            className={`pb-2 text-lg font-medium transition-colors border-b-2 ${
              activeTab === "kb"
                ? "border-[#174832] text-[#174832]"
                : "border-transparent text-gray-500 hover:text-[#174832]"
            }`}
            onClick={() => setActiveTab("kb")}
          >
            Knowledge Base
          </button>
        </div>
        {/* FAQ Tab */}
        {activeTab === "faq" && (
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="pb-4 border-b">
                <h2 className="mb-2 text-lg font-semibold text-gray-900">
                  {faq.question}
                </h2>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        )}
        {/* Knowledge Base Tab */}
        {activeTab === "kb" && (
          <div>
            <div className="mb-6">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent"
              />
            </div>
            <div className="space-y-8">
              {filteredArticles.length === 0 && (
                <div className="py-12 text-center text-gray-500">
                  No articles found.
                </div>
              )}
              {filteredArticles.map((cat) => (
                <div key={cat.category}>
                  <h3 className="text-xl font-semibold text-[#174832] mb-4">
                    {cat.category}
                  </h3>
                  <div className="space-y-4">
                    {cat.articles.map((article, idx) => (
                      <div
                        key={article.title}
                        className="p-4 border border-gray-100 rounded-lg bg-gray-50"
                      >
                        <h4 className="mb-2 text-lg font-bold text-gray-900">
                          {article.title}
                        </h4>
                        <p className="text-gray-700">{article.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Live Chat Floating Button */}
      <button
        className="fixed z-50 flex items-center gap-2 px-4 py-3 text-white bg-[#174832] rounded-full shadow-lg bottom-8 right-8 hover:bg-[#11351f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#174832]"
        onClick={() => setChatOpen(true)}
        aria-label="Open live chat"
      >
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            strokeWidth="2"
            d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 21l1.13-3.39C3.42 16.3 3 15.19 3 14c0-4.418 4.03-8 9-8s9 3.582 9 8Z"
          />
        </svg>
        Live Chat
      </button>
      {/* Live Chat Modal */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="relative w-full max-w-sm p-8 bg-white shadow-2xl rounded-xl">
            <button
              className="absolute text-gray-400 top-3 right-3 hover:text-gray-600"
              onClick={() => setChatOpen(false)}
              aria-label="Close chat"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-xl font-bold text-[#174832] mb-2">Live Chat</h2>
            <p className="mb-4 text-gray-700">
              Live chat support is coming soon! For now, please use the Contact
              Us form or submit a support ticket.
            </p>
            <button
              className="px-4 py-2 bg-[#174832] text-white rounded-md hover:bg-[#11351f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#174832]"
              onClick={() => setChatOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
