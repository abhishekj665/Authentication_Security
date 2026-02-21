import express from "express";
import { userAuth } from "../../middlewares/auth.middleware.js";
import * as userLeaveController from "../../controllers/user/leave.controller.js";

const Router = express.Router();

Router.use(userAuth);

Router.get("/lms/leave/requests", userLeaveController.getLeaveRequests);
Router.get("/lms/leave/leave-balance", userLeaveController.getLeaveBalance);

Router.post("/lms/leave/apply", userLeaveController.registerLeaveRequest);

export const userLMSRouter = Router;
