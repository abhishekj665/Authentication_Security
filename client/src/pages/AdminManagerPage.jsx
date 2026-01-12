import { useEffect, useState } from "react";
import { Button, Select, MenuItem } from "@mui/material";
import { toast } from "react-toastify";

import { getManagersWithUsers } from "../services/adminService";

export default function AdminManagersPage() {
  const [managers, setManagers] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState({});

  const fetchData = async () => {
    try {
      const m = await getManagersWithUsers();

      console.log(m.data, "hello");

      if (m.success) setManagers(m.data);
      // if (u.success) setUsers(u.data);
    } catch {
      toast.error("Failed to load data");
    }
  };

  const handleAssign = async (managerId) => {
    const workerIds = selectedUsers[managerId];
    if (!workerIds || workerIds.length === 0) {
      return toast.error("Select users first");
    }

    try {
      const res = await assignManager({ managerId, workerIds });
      if (res.success) {
        toast.success("Users assigned");
        fetchData();
      }
    } catch {
      toast.error("Assignment failed");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Manager Control</h1>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="grid grid-cols-5 bg-gray-50 px-4 py-3 text-sm font-semibold">
          <span>Manager</span>
          <span>Email</span>
          <span>Assigned Users</span>
          <span>Select Users</span>
          <span>Action</span>
        </div>

        {managers.map((m) => (
          <div
            key={m.id}
            className="grid grid-cols-5 px-4 py-3 border-t items-center"
          >
            <span>{m.first_name}</span>
            <span className="truncate">{m.email}</span>
            <span className="font-medium">{m.workers.length}</span>

            <Select
              multiple
              size="small"
              value={selectedUsers[m.id] || []}
              onChange={(e) =>
                setSelectedUsers((prev) => ({
                  ...prev,
                  [m.id]: e.target.value,
                }))
              }
              sx={{ minWidth: 220 }}
            >
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.email}
                </MenuItem>
              ))}
            </Select>

            <Button
              size="small"
              variant="contained"
              onClick={() => handleAssign(m.id)}
            >
              Assign
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
