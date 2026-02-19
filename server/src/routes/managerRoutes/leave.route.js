import express from "express";
import { managerAuth } from "../../middlewares/auth.middleware.js";
import * as managerLeaveRequestController from "../../controllers/manager/leave.controller.js";

const Router = express.Router();

Router.use(managerAuth);


Router.post("/lms/leave/apply", managerLeaveRequestController.registerLeaveRequest);

export const managerLeaveRouter = Router;
