import React, { useEffect, useState } from "react";
import api from "../../config/ApiConfig";
import {
  Button,
  Badge,
  Modal,
  EmptyState,
  LoadingSpinner,
} from "../ui";
import { FiMessageSquare, FiRefreshCw } from "react-icons/fi";
import toast from "react-hot-toast";

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [resolveStatus, setResolveStatus] = useState("resolved");
  const [adminNotes, setAdminNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/complaints");
      if (res.data?.success) {
        setComplaints(res.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to load customer support tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleResolve = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await api.patch(
        `/admin/complaints/${selectedTicket._id}/resolve`,
        {
          status: resolveStatus,
          adminNotes,
        }
      );
      if (res.data?.success) {
        toast.success("Ticket updated successfully");
        setComplaints((prev) =>
          prev.map((c) => (c._id === selectedTicket._id ? res.data.data : c))
        );
        setSelectedTicket(null);
        setAdminNotes("");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBadgeVariant = (st) => {
    if (st === "resolved") return "success";
    if (st === "in_progress") return "warning";
    return "error";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-base-content">
            Helpdesk & Dispute Tickets
          </h1>
          <p className="text-xs text-base-content/60">
            Resolve complaints raised by customers, riders, and restaurants.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={<FiRefreshCw />}
          onClick={fetchComplaints}
        >
          Refresh Tickets
        </Button>
      </div>

      <div className="rounded-2xl border border-base-200 bg-base-100 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner fullHeight label="Loading tickets..." />
        ) : !complaints.length ? (
          <EmptyState
            icon={<FiMessageSquare />}
            title="No support tickets"
            message="No complaints or disputes filed. Platform health is 100%!"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-sm w-full">
              <thead>
                <tr className="border-b border-base-200 bg-base-200/50 text-xs font-bold text-base-content/70 uppercase">
                  <th>Ticket #</th>
                  <th>User</th>
                  <th>Category</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c._id} className="hover:bg-base-200/40 transition">
                    <td className="font-mono text-xs font-bold text-primary">
                      {c.ticketNumber}
                    </td>
                    <td>
                      <div className="font-bold text-xs text-base-content">
                        {c.userId?.fullName || "User"}
                      </div>
                      <div className="text-[10px] text-base-content/50 uppercase">
                        {c.userRole}
                      </div>
                    </td>
                    <td>
                      <Badge variant="ghost" size="xs">
                        {c.category?.replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td className="text-xs font-medium text-base-content max-w-xs truncate">
                      {c.subject}
                    </td>
                    <td>
                      <Badge variant={getBadgeVariant(c.status)} size="xs">
                        {c.status.replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td className="text-xs text-base-content/60">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="text-right">
                      <Button
                        variant="primary"
                        size="xs"
                        onClick={() => {
                          setSelectedTicket(c);
                          setResolveStatus(c.status);
                          setAdminNotes(c.adminNotes || "");
                        }}
                      >
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ticket Modal */}
      {selectedTicket && (
        <Modal
          isOpen={Boolean(selectedTicket)}
          onClose={() => setSelectedTicket(null)}
          title={selectedTicket.subject}
          subtitle={`Ticket ${selectedTicket.ticketNumber}`}
          badge={
            <Badge variant={getBadgeVariant(selectedTicket.status)} size="sm">
              {selectedTicket.status}
            </Badge>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="rounded-2xl bg-base-200/50 p-4">
              <p className="font-bold text-base-content/60 mb-1">Description:</p>
              <p className="text-base-content text-sm whitespace-pre-wrap leading-relaxed">
                {selectedTicket.description}
              </p>
            </div>

            <form onSubmit={handleResolve} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-base-content/70 block mb-1">
                  Update Resolution Status
                </label>
                <select
                  className="select select-sm select-bordered w-full rounded-xl text-xs font-semibold"
                  value={resolveStatus}
                  onChange={(e) => setResolveStatus(e.target.value)}
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-base-content/70 block mb-1">
                  Admin Resolution Note
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter resolution notes or refund details..."
                  className="textarea textarea-bordered w-full text-xs rounded-xl"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="sm"
                fullWidth
                loading={isSubmitting}
              >
                Save Resolution
              </Button>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminComplaints;
