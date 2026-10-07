import React, { useEffect, useState } from "react";
import api from "../../config/ApiConfig";
import {
  Button,
  Badge,
  SearchInput,
  FilterTabs,
  EmptyState,
  LoadingSpinner,
} from "../ui";
import { FiUsers, FiRefreshCw } from "react-icons/fi";
import toast from "react-hot-toast";

const ROLE_TABS = [
  { id: "all", label: "All Users" },
  { id: "customer", label: "Customers" },
  { id: "restaurant", label: "Vendors" },
  { id: "rider", label: "Riders" },
  { id: "admin", label: "Admins" },
];

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const url = `/admin/users?userType=${roleFilter}&search=${encodeURIComponent(search)}`;
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
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-base-content">
            User Account Directory
          </h1>
          <p className="text-xs text-base-content/60">
            Manage customers, vendor accounts, and delivery partner profiles across the platform.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={<FiRefreshCw />}
          onClick={fetchUsers}
        >
          Refresh Directory
        </Button>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-base-200 bg-base-100 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <FilterTabs
          tabs={ROLE_TABS}
          activeTab={roleFilter}
          onSelectTab={setRoleFilter}
        />

        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={fetchUsers}
          onClear={() => {
            setSearch("");
            fetchUsers();
          }}
          placeholder="Search name, email, phone..."
          className="md:max-w-xs"
        />
      </div>

      <div className="rounded-2xl border border-base-200 bg-base-100 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner fullHeight label="Loading accounts..." />
        ) : !users.length ? (
          <EmptyState
            icon={<FiUsers />}
            title="No users found"
            message="No user accounts match the current filter and search term."
            actionLabel="Reset Filter"
            onAction={() => {
              setRoleFilter("all");
              setSearch("");
              fetchUsers();
            }}
          />
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
                  <tr key={u._id} className="hover:bg-base-200/40 transition">
                    <td>
                      <div className="font-bold text-xs text-base-content">
                        {u.fullName}
                      </div>
                      <div className="text-[10px] text-base-content/50">
                        {u.email}
                      </div>
                    </td>
                    <td>
                      <Badge variant="ghost" size="xs">
                        {u.userType}
                      </Badge>
                    </td>
                    <td className="text-xs text-base-content/70">
                      {u.phone || "—"}
                    </td>
                    <td>
                      <Badge
                        variant={u.status === "verified" ? "success" : "ghost"}
                        size="xs"
                      >
                        {u.status}
                      </Badge>
                    </td>
                    <td>
                      {u.isActive ? (
                        <span className="text-success font-bold text-xs">Active</span>
                      ) : (
                        <span className="text-error font-bold text-xs">Suspended</span>
                      )}
                    </td>
                    <td className="text-xs text-base-content/60">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="text-right">
                      <Button
                        variant={u.isActive ? "error" : "success"}
                        size="xs"
                        onClick={() => handleToggleActive(u._id, u.isActive)}
                      >
                        {u.isActive ? "Suspend" : "Activate"}
                      </Button>
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
