import express from "express";
import * as  leaveBalanceController from "../../controllers/admin/leaveBalance.controller.js";
import { adminAuth } from "../../middlewares/auth.middleware.js";




const Router = express.Router();


Router.put(
  "/leave/leave-balance/assign/:id",adminAuth,
  leaveBalanceController.assignLeaveBalance,
);
Router.put(
  "/leave/leave-balance/assign-bulk/:id",adminAuth,
  leaveBalanceController.assignLeaveBalanceBulk,
)

export const leaveBalanceRouter = Router;
