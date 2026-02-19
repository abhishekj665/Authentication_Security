import express from "express";
import * as leaveRequestController from "../../controllers/admin/leaveRequest.controller.js";

const Router = express.Router();




Router.patch("/lms/leave/approve/:id", leaveRequestController.approveLeaveRequest);
Router.patch("/lms/leave/reject/:id", leaveRequestController.rejectLeaveRequest);



export const leaveRequestRouter = Router;
