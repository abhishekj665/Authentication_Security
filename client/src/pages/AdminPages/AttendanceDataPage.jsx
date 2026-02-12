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

const dummyData = [
  {
    id: 1,
    email: "user1@test.com",
    role: "user",
    punchIn: "09:05",
    punchOut: "18:10",
    lateTime: "5m",
    graceTime: "10m",
    overtime: "40m",
    status: "approved",
  },
  {
    id: 2,
    email: "manager@test.com",
    role: "manager",
    punchIn: "09:20",
    punchOut: "17:40",
    lateTime: "20m",
    graceTime: "10m",
    overtime: "0m",
    status: "pending",
  },
  {
    id: 3,
    email: "user2@test.com",
    role: "user",
    punchIn: "09:45",
    punchOut: "16:30",
    lateTime: "45m",
    graceTime: "10m",
    overtime: "0m",
    status: "rejected",
  },
];

export default function AttendanceTable() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredRows = useMemo(() => {
    return dummyData.filter((row) => {
      const statusMatch = statusFilter === "all" || row.status === statusFilter;
      const roleMatch = roleFilter === "all" || row.role === roleFilter;
      return statusMatch && roleMatch;
    });
  }, [statusFilter, roleFilter]);

 

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const data = await getAllAttendanceData();
        console.log(data);
      } catch (error) {
        console.log(error);
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
        <CardContent sx={{ p: 5 }}>
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
                {filteredRows.map((row) => (
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
                      {row.reviewedBy ? reviewedBy : "Not Reviewed"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Empty State */}
          {filteredRows.length === 0 && (
            <div className="text-center text-gray-500 mt-6">
              No attendance records found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
