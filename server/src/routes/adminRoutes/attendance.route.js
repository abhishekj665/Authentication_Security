import express from "express";
import * as attendanceController from "../../controllers/admin/attendance.controller.js";

const Router = express.Router();

Router.get("/attendance/all", attendanceController.getAllAttendanceData);

Router.patch(
  "/attendance/approve/:id",
  attendanceController.approveAttendanceRequest,
);
Router.patch(
  "/attendance/reject/:id",
  attendanceController.rejectAttendanceRequest,
);

Router.patch(
  "/attendance/bulk-approve",
  attendanceController.bulkAttendanceRequestApprove,
);
Router.patch(
  "/attendance/bulk-reject",
  attendanceController.bulkAttendanceRequestReject,
);

export const attendanceRouter = Router;
