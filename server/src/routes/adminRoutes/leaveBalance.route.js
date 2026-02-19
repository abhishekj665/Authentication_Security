import express from "express";
import * as adminLeaveBalanceController from "../../controllers/admin/leaveBalance.controller.js";

const Router = express.Router();

Router.put(
  "/lms/leave/leave-balance/assign/:id",
  adminLeaveBalanceController.assignLeaveBalance,
);
Router.put(
  "/lms/leave/leave-balance/assign-bulk/:id",
  adminLeaveBalanceController.assignLeaveBalanceBulk,
)

export const leaveBalanceRouter = Router;
