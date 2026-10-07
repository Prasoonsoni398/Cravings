import React, { useEffect, useState } from "react";
import api from "../../config/ApiConfig";
import { FiMessageSquare, FiCheckCircle, FiClock, FiAlertCircle } from "react-icons/fi";
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-base-content">
            Helpdesk & Dispute Tickets
          </h1>
          <p className="text-sm text-base-content/60">
            Resolve complaints raised by customers, riders, and restaurants.
          </p>
        </div>
        <button onClick={fetchComplaints} className="btn btn-sm btn-outline rounded-xl">
          Refresh Tickets
        </button>
      </div>

      <div className="rounded-2xl border border-base-200 bg-base-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <span className="loading loading-spinner loading-md text-primary"></span>
          </div>
        ) : !complaints.length ? (
          <div className="py-16 text-center text-sm text-base-content/60">
            No complaints or disputes filed. Platform health is 100%!
          </div>
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
                  <tr key={c._id} className="hover:bg-base-200/40">
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
                      <span className="badge badge-xs capitalize bg-base-200 text-[10px]">
                        {c.category?.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="text-xs font-medium text-base-content max-w-xs truncate">
                      {c.subject}
                    </td>
                    <td>
                      <span
                        className={`badge badge-sm text-[10px] font-bold capitalize ${
                          c.status === "resolved"
                            ? "badge-success text-white"
                            : c.status === "in_progress"
                            ? "badge-warning"
                            : "badge-error text-white"
                        }`}
                      >
                        {c.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="text-xs text-base-content/60">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => {
                          setSelectedTicket(c);
                          setResolveStatus(c.status);
                          setAdminNotes(c.adminNotes || "");
                        }}
                        className="btn btn-xs btn-outline btn-primary rounded-lg"
                      >
                        Manage
                      </button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-base-100 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-base-200 pb-3">
              <div>
                <span className="text-xs font-bold text-primary">
                  {selectedTicket.ticketNumber}
                </span>
                <h3 className="text-lg font-black text-base-content">
                  {selectedTicket.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="btn btn-circle btn-sm btn-ghost"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="rounded-xl bg-base-200/50 p-3 text-xs">
                <p className="font-bold text-base-content/60 mb-1">Description:</p>
                <p className="text-base-content text-sm whitespace-pre-wrap">
                  {selectedTicket.description}
                </p>
              </div>

              <form onSubmit={handleResolve} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-base-content/70 block mb-1">
                    Update Resolution Status
                  </label>
                  <select
                    className="select select-sm select-bordered w-full rounded-xl text-xs"
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
                    placeholder="Enter resolution notes, refund details, or communication log..."
                    className="textarea textarea-bordered w-full text-xs rounded-xl"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-sm btn-primary w-full text-white font-bold rounded-xl"
                >
                  {isSubmitting ? "Saving..." : "Save Resolution"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComplaints;
