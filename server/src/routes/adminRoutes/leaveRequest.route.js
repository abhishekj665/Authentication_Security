import express from "express";
import * as leaveRequestController from "../../controllers/admin/leaveRequest.controller.js";

const Router = express.Router();

Router.patch("/leave/approve/:id", leaveRequestController.approveLeaveRequest);
Router.patch("/leave/reject/:id", leaveRequestController.rejectLeaveRequest);
Router.get("/leave/requests", leaveRequestController.getLeaveRequests);

export const leaveRequestRouter = Router;
