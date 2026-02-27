import express from "express";
import * as userLeaveController from "../../controllers/user/leave.controller.js";
import { allowRoles } from "../../middlewares/roleAuth.middleware.js";


const Router = express.Router();



Router.get("/lms/leave/requests",allowRoles("manager", "admin", "user"), userLeaveController.getLeaveRequests);
Router.get("/lms/leave/leave-balance",allowRoles("manager", "admin", "user"), userLeaveController.getLeaveBalance);

Router.post("/lms/leave/apply",allowRoles("manager", "admin", "user"), userLeaveController.registerLeaveRequest);

export const userLMSRouter = Router;
