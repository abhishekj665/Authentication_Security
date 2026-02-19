import express from "express";
import { managerAuth } from "../../middlewares/auth.middleware.js";
import * as userLeaveRequestController from "../../controllers/manager/leaveRequest.controller.js";

const Router = express.Router();

Router.use(managerAuth);


Router.patch("/lms/leave/approve/:id", userLeaveRequestController.approveLeaveRequest);
Router.patch("/lms/leave/reject/:id", userLeaveRequestController.rejectLeaveRequest);



export const userLeaveRouter = Router;
