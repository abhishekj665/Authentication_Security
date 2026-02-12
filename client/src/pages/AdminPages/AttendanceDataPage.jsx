import {
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useMemo } from "react";
import { getAllAttendanceData } from "../../services/adminService";

const statusColor = {
  approved: "success",
  pending: "warning",
  rejected: "error",
};

export default function AttendanceTable() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [rows, setRows] = useState([]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const statusMatch = statusFilter === "all" || row.status === statusFilter;
      const roleMatch = roleFilter === "all" || row.role === roleFilter;
      return statusMatch && roleMatch;
    });
  }, [rows, statusFilter, roleFilter]);

  const fmtTime = (iso) =>
    iso
      ? new Date(iso).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const res = await getAllAttendanceData();
        console.log(res);

        if (!res?.success || !Array.isArray(res.data)) {
          setRows([]);
          return;
        }

        const mapped = res.data.map((item) => {
          const a = item.Attendance || {};
          const u = item.requester || a.User || {};

          return {
            id: item.id,

            email: u.email || a.email || "-",
            role: (u.role || "user").toLowerCase(),

            punchIn: fmtTime(a.punchInAt),
            punchOut: fmtTime(a.punchOutAt),

            lateTime: a.workedMinutes != null ? `${a.workedMinutes}m` : "0m",
            graceTime: a.breakMinutes != null ? `${a.breakMinutes}m` : "0m",
            overtime:
              a.overtimeMinutes != null ? `${a.overtimeMinutes}m` : "0m",

            status: (item.status || "pending").toLowerCase(),
            reviewedBy: item.reviewedBy,
          };
        });

        setRows(mapped);
      } catch (error) {
        console.log(error);
        setRows([]);
      }
    };

    fetchAttendanceData();
  }, []);

  return (
    <div className=" bg-gray-100 h-full">
      <Card
        className="rounded-2xl shadow-none border border-gray-200"
        style={{ padding: "4px" }}
      >
        <CardContent>
          {/* Header */}
          <Typography variant="h5" className="font-semibold mb-6 ml-5">
            Attendance Dashboard
          </Typography>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6 mt-5 justify-end">
            <FormControl size="small" className="min-w-45 w-25">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" className="min-w-45 w-25">
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                label="Role"
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Table */}
          <TableContainer component={Paper} className="rounded-xl shadow-sm">
            <Table>
              <TableHead className="bg-gray-50">
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Punch In</TableCell>
                  <TableCell>Punch Out</TableCell>
                  <TableCell>WorkTime</TableCell>
                  <TableCell>BreakTime</TableCell>
                  <TableCell>Overtime</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>ReviewedBy</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      align="center"
                      className="text-gray-500"
                    >
                      No data found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows.map((row) => (
                    <TableRow
                      key={row.id}
                      hover
                      className="transition hover:bg-gray-50"
                    >
                      <TableCell>{row.email}</TableCell>

                      <TableCell>
                        <Chip label={row.role.toUpperCase()} size="small" />
                      </TableCell>

                      <TableCell>{row.punchIn}</TableCell>
                      <TableCell>{row.punchOut}</TableCell>
                      <TableCell>{row.lateTime}</TableCell>
                      <TableCell>{row.graceTime}</TableCell>
                      <TableCell>{row.overtime}</TableCell>

                      <TableCell>
                        <Chip
                          label={row.status.toUpperCase()}
                          color={statusColor[row.status]}
                          size="small"
                        />
                      </TableCell>

                      <TableCell>
                        {row.reviewedBy ? row.reviewedBy : "Not Reviewed"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );
}
