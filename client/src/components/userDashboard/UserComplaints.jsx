import React, { useEffect, useState } from "react";
import api from "../../config/ApiConfig";
import { FiMessageSquare, FiPlus, FiCheckCircle, FiClock, FiAlertCircle } from "react-icons/fi";
import toast from "react-hot-toast";

const CATEGORIES = [
  { value: "order_delay", label: "Delivery Delay" },
  { value: "food_quality", label: "Food Quality / Packaging" },
  { value: "wrong_items", label: "Missing / Incorrect Items" },
  { value: "payment_issue", label: "Payment / Refund Issue" },
  { value: "rider_behavior", label: "Rider Issue" },
  { value: "other", label: "Other Inquiry" },
];

const UserComplaints = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "order_delay",
    description: "",
  });

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await api.get("/customer/complaints");
      if (res.data?.success) {
        setTickets(res.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to load support tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/customer/complaints", ticketForm);
      if (res.data?.success) {
        toast.success("Support ticket created!");
        setShowModal(false);
        setTicketForm({ subject: "", category: "order_delay", description: "" });
        fetchTickets();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create ticket");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-base-content">Helpdesk & Support</h1>
          <p className="text-sm text-base-content/60">
            Need help with an order or payment? Reach our customer resolution team.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-sm btn-primary text-white rounded-xl gap-2 font-bold"
        >
          <FiPlus /> New Ticket
        </button>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      ) : !tickets.length ? (
        <div className="rounded-2xl border border-base-200 bg-base-100 p-12 text-center text-sm text-base-content/60 shadow-sm">
          No active support tickets. Have an issue? Click "New Ticket".
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <div
              key={t._id}
              className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-xs font-bold text-primary">
                    {t.ticketNumber}
                  </span>
                  <h3 className="font-bold text-base text-base-content mt-0.5">
                    {t.subject}
                  </h3>
                </div>
                <span
                  className={`badge badge-sm font-bold capitalize ${
                    t.status === "resolved"
                      ? "badge-success text-white"
                      : t.status === "in_progress"
                      ? "badge-warning"
                      : "badge-ghost"
                  }`}
                >
                  {t.status.replace(/_/g, " ")}
                </span>
              </div>

              <p className="text-xs text-base-content/80 whitespace-pre-wrap">
                {t.description}
              </p>

              {t.adminNotes && (
                <div className="rounded-xl bg-success/10 border border-success/20 p-3 text-xs text-success-content mt-2">
                  <p className="font-bold text-success">Support Resolution:</p>
                  <p className="text-base-content/80 mt-0.5">{t.adminNotes}</p>
                </div>
              )}

              <p className="text-[10px] text-base-content/40 pt-1">
                Created on {new Date(t.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Ticket Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-base-100 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-base-200 pb-3">
              <h3 className="text-lg font-black text-base-content">Create Support Ticket</h3>
              <button onClick={() => setShowModal(false)} className="btn btn-circle btn-sm btn-ghost">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold block mb-1">Issue Category</label>
                <select
                  className="select select-sm select-bordered w-full rounded-xl text-xs"
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Order delayed by 30 mins"
                  className="input input-sm input-bordered w-full rounded-xl text-xs"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Explain the issue with order or payment details..."
                  className="textarea textarea-bordered w-full rounded-xl text-xs"
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-sm btn-primary w-full text-white font-bold rounded-xl mt-2"
              >
                Submit Ticket
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserComplaints;
