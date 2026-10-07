import React, { useEffect, useState } from "react";
import api from "../../config/ApiConfig";
import { FiUsers, FiSearch, FiCheckCircle, FiSlash } from "react-icons/fi";
import toast from "react-hot-toast";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const url = `/admin/users?userType=${roleFilter}&search=${search}`;
      const res = await api.get(url);
      if (res.data?.success) {
        setUsers(res.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to load user directory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleToggleActive = async (userId, currentActive) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/status`, {
        isActive: !currentActive,
      });
      if (res.data?.success) {
        toast.success(`User ${!currentActive ? "activated" : "suspended"}`);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isActive: !currentActive } : u))
        );
      }
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-base-content">
          User Account Directory
        </h1>
        <p className="text-sm text-base-content/60">
          Manage customers, vendor accounts, and delivery partner profiles across the platform.
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-base-200 bg-base-100 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          {["all", "customer", "restaurant", "rider", "admin"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`btn btn-xs rounded-lg capitalize ${
                roleFilter === r
                  ? "btn-primary text-white"
                  : "btn-ghost text-base-content/70 hover:bg-base-200"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <FiSearch className="absolute left-3 top-3 text-base-content/40" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            className="input input-sm input-bordered w-full pl-9 rounded-xl text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-base-200 bg-base-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <span className="loading loading-spinner loading-md text-primary"></span>
          </div>
        ) : !users.length ? (
          <div className="py-16 text-center text-sm text-base-content/60">
            No users found matching query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-sm w-full">
              <thead>
                <tr className="border-b border-base-200 bg-base-200/50 text-xs font-bold text-base-content/70 uppercase">
                  <th>User</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Active</th>
                  <th>Joined</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-base-200/40">
                    <td>
                      <div className="font-bold text-xs text-base-content">
                        {u.fullName}
                      </div>
                      <div className="text-[10px] text-base-content/50">
                        {u.email}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-xs font-bold uppercase bg-base-200 text-[10px]">
                        {u.userType}
                      </span>
                    </td>
                    <td className="text-xs text-base-content/70">
                      {u.phone || "—"}
                    </td>
                    <td>
                      <span
                        className={`badge badge-xs font-semibold ${
                          u.status === "verified"
                            ? "badge-success text-white"
                            : u.status === "suspended"
                            ? "badge-error text-white"
                            : "badge-ghost"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td>
                      {u.isActive ? (
                        <span className="text-success font-bold text-xs">Yes</span>
                      ) : (
                        <span className="text-error font-bold text-xs">Suspended</span>
                      )}
                    </td>
                    <td className="text-xs text-base-content/60">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => handleToggleActive(u._id, u.isActive)}
                        className={`btn btn-xs rounded-lg ${
                          u.isActive
                            ? "btn-outline btn-error"
                            : "btn-outline btn-success"
                        }`}
                      >
                        {u.isActive ? "Suspend" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
