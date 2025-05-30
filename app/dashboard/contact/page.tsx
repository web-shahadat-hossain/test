"use client";
import React, { useState, useRef } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [ticket, setTicket] = useState({
    subject: "",
    description: "",
    file: null as File | null,
  });
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement actual submission logic here
    setSubmitted(true);
  };

  const handleTicketChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as any;
    if (name === "file" && files && files[0]) {
      setTicket({ ...ticket, file: files[0] });
    } else {
      setTicket({ ...ticket, [name]: value });
    }
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement actual ticket submission logic here
    setTicketSubmitted(true);
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50 sm:px-6 lg:px-8">
      <div className="max-w-2xl p-8 mx-auto bg-white shadow-2xl rounded-2xl">
        <h1 className="text-3xl font-bold text-[#174832] mb-6">Contact Us</h1>
        <p className="mb-8 text-gray-600">
          Have a question or need help? Fill out the form below and our support
          team will get back to you as soon as possible.
        </p>
        {submitted ? (
          <div className="p-4 mb-6 text-green-800 border border-green-200 rounded-md bg-green-50">
            Thank you for contacting us! We have received your message and will
            respond soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Name
              </label>
              <div className="flex items-center bg-gray-100 rounded-lg border border-gray-200 focus-within:border-[#174832] transition-colors">
                <span className="pl-3 text-gray-400">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.418 0-8 2.239-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.761-3.582-5-8-5Z"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="flex-1 bg-transparent border-none outline-none px-3 py-3 rounded-lg focus:ring-2 focus:ring-[#174832] transition-all text-gray-900 placeholder-gray-400"
                  placeholder="Your Name"
                />
              </div>
            </div>
            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="flex items-center bg-gray-100 rounded-lg border border-gray-200 focus-within:border-[#174832] transition-colors">
                <span className="pl-3 text-gray-400">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Zm16 0-7 5-7-5"
                    />
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="flex-1 bg-transparent border-none outline-none px-3 py-3 rounded-lg focus:ring-2 focus:ring-[#174832] transition-all text-gray-900 placeholder-gray-400"
                  placeholder="you@email.com"
                />
              </div>
            </div>
            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Message
              </label>
              <div className="flex bg-gray-100 rounded-lg border border-gray-200 focus-within:border-[#174832] transition-colors">
                <span className="pt-3 pl-3 text-gray-400">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      d="M21 3 3 10.53m0 0 6.13 2.04M3 10.53l2.04 6.13m15.93-13.66-6.13 17.93a1 1 0 0 1-1.9.02l-2.04-6.13"
                    />
                  </svg>
                </span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="flex-1 bg-transparent border-none outline-none px-3 py-3 rounded-lg focus:ring-2 focus:ring-[#174832] transition-all text-gray-900 placeholder-gray-400 resize-none"
                  placeholder="How can we help you?"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-8 py-3 bg-[#174832] text-white rounded-lg font-semibold shadow hover:bg-[#11351f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#174832] transition-all"
              >
                Send Message
              </button>
            </div>
          </form>
        )}
        <div className="pt-8 mt-10 border-t">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            Other ways to reach us
          </h2>
          <p className="mb-1 text-gray-700">
            Email:{" "}
            <a
              href="mailto:support@example.com"
              className="text-[#174832] underline"
            >
              support@example.com
            </a>
          </p>
          <p className="text-gray-700">
            Phone:{" "}
            <a href="tel:+1234567890" className="text-[#174832] underline">
              +1 (234) 567-890
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
