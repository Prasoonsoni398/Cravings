import React, { useEffect, useState } from "react";
import api from "../../config/ApiConfig";
import { FiMessageSquare, FiPlus, FiCheckCircle, FiClock, FiAlertCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import { Button, Badge, Card, Modal, EmptyState, LoadingSpinner } from "../ui";

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
        <Button
          size="sm"
          variant="primary"
          icon={<FiPlus />}
          onClick={() => setShowModal(true)}
          className="font-bold self-start sm:self-auto"
        >
          New Ticket
        </Button>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <LoadingSpinner size="lg" label="Loading support tickets..." />
        </div>
      ) : !tickets.length ? (
        <EmptyState
          icon={FiMessageSquare}
          title="No active support tickets"
          description="Have an issue with an order, payment, or delivery? Create a ticket and our support team will resolve it quickly."
          action={
            <Button
              variant="primary"
              size="sm"
              icon={<FiPlus />}
              onClick={() => setShowModal(true)}
            >
              Create Ticket
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <Card
              key={t._id}
              className="p-5 space-y-2"
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
                <Badge
                  variant={
                    t.status === "resolved"
                      ? "success"
                      : t.status === "in_progress"
                      ? "warning"
                      : "ghost"
                  }
                  size="sm"
                  className="capitalize font-bold"
                >
                  {t.status.replace(/_/g, " ")}
                </Badge>
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
            </Card>
          ))}
        </div>
      )}

      {/* Ticket Modal */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Create Support Ticket"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleCreateTicket} className="space-y-3">
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

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="sm"
                className="font-bold"
              >
                Submit Ticket
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default UserComplaints;
