import express from "express";
import {
  adminAuth,
  managerAuth,
  userAuth,
} from "../../middlewares/auth.middleware.js";
import * as JobRequistionController from "../../controllers/recruitment/jobRequisition.controller.js";
import { allowRoles } from "../../middlewares/roleAuth.middleware.js";

const Router = express.Router();

Router.post(
  "/job-requisition",
  managerAuth,
  JobRequistionController.registerJobRequisition,
);
Router.get(
  "/job-requisitions",
  userAuth,
  allowRoles("admin", "manager"),
  JobRequistionController.getJobRequisitions,
);
Router.get(
  "/job-requisition/:id",
  userAuth,
  allowRoles("admin", "manager"),
  JobRequistionController.getJobRequisition,
);
Router.put(
  "/job-requisition/:id",
  managerAuth,
  JobRequistionController.updateJobRequisition,
);
Router.patch(
  "/job-requisition/approve/:id",
  adminAuth,
  JobRequistionController.approveJobRequisition,
);
Router.patch(
  "/job-requisition/reject/:id",
  adminAuth,
  JobRequistionController.rejectJobRequisition,
);

export const JobRequistionRouter = Router;
