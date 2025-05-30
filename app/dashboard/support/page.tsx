"use client";
import { postSupportTicket } from "@/lib/utils/service/support";
import React, { useState, useRef, ChangeEvent, FormEvent } from "react";

// টাইপ ডেফিনিশন
interface SupportTicket {
  subject: string;
  description: string;
  file: File | null;
}

export default function SupportPage() {
  const [ticket, setTicket] = useState<SupportTicket>({
    subject: "",
    description: "",
    file: null,
  });

  const [ticketSubmitted, setTicketSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTicketChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "file" && (e.target as HTMLInputElement).files?.length) {
      const files = (e.target as HTMLInputElement).files!;
      setTicket({ ...ticket, file: files[0] || null });
    } else {
      setTicket({ ...ticket, [name]: value });
    }
  };

  const handleTicketSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("subject", ticket.subject);
    formData.append("description", ticket.description);
    if (ticket.file) {
      formData.append("file", ticket.file);
    }

    try {
      await postSupportTicket(formData);
      setTicketSubmitted(true);
      setTicket({ subject: "", description: "", file: null });
      if (fileInputRef.current) fileInputRef.current.value = "";
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // error already handled inside postSupportTicket
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50 sm:px-6 lg:px-8">
      <div className="max-w-2xl p-8 mx-auto bg-white shadow-2xl rounded-2xl">
        <h1 className="text-3xl font-bold text-[#174832] mb-6">Support</h1>
        <p className="mb-8 text-gray-600">
          Submit a support ticket and our team will get back to you as soon as
          possible.
        </p>

        <h2 className="mb-4 text-lg font-semibold text-[#174832]">
          Submit a Support Ticket
        </h2>

        {ticketSubmitted ? (
          <div className="p-4 mb-6 text-green-800 border border-green-200 rounded-md bg-green-50">
            Your support ticket has been submitted! Our team will get back to
            you soon.
          </div>
        ) : (
          <form onSubmit={handleTicketSubmit} className="space-y-6">
            {/* Subject Input */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={ticket.subject}
                onChange={handleTicketChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent"
                placeholder="Briefly describe your issue"
              />
            </div>

            {/* Description Textarea */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={ticket.description}
                onChange={handleTicketChange}
                required
                rows={5}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174832] focus:border-transparent"
                placeholder="Please provide as much detail as possible"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Attachment (optional)
              </label>
              <input
                type="file"
                name="file"
                ref={fileInputRef}
                onChange={handleTicketChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#174832]/10 file:text-[#174832] hover:file:bg-[#174832]/20"
                accept="image/*,application/pdf,.doc,.docx,.txt"
              />
              {ticket.file && (
                <div className="mt-2 text-xs text-gray-600">
                  Selected: {ticket.file.name}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-[#174832] text-white rounded-lg font-semibold shadow hover:bg-[#11351f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#174832] transition-all disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Ticket"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
