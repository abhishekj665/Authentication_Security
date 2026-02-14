import express from "express";

import * as attendanceController from "../../controllers/manager/attendance.controller.js";

const Router = express.Router();

Router.get("/attendance", attendanceController.getAllAttendanceData);
Router.get("/attendance/me", attendanceController.getAttendanceData);
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
