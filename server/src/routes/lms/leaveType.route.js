import express from "express";
import * as leaveController from "../../controllers/admin/leave.controller.js";
import * as lmsController from "../../controllers/LMS/lms.controller.js";
import { adminAuth, userAuth } from "../../middlewares/auth.middleware.js";

const Router = express.Router();

Router.get("/leave/leave-type", userAuth,lmsController.getLeaveTypes);

Router.post(
  "/lms/leave/leave-type/register",adminAuth,
  leaveController.registerLeaveType,
);

export const leaveTypeRouter = Router;
