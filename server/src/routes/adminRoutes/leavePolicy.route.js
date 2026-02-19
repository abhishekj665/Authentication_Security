import express from "express";
import * as leavePolicyController from "../../controllers/admin/leavePolicy.controller.js";

const Router = express.Router();

Router.post("/lms/policy/register", leavePolicyController.registerLeavePolicy);
Router.put("/lms/policy/update/:id", leavePolicyController.updateLeavePolicy);
Router.patch("/lms/policy/assign/:id", leavePolicyController.assignPolicyToUser);
Router.patch("/lms/policy/assign-bulk/:id", leavePolicyController.assignPolicyBulk);
Router.delete(
  "/lms/policy/delete/:id",
  leavePolicyController.deleteLeavePolicy,
);
Router.get("/lms/policy/get", leavePolicyController.getLeavePolicies);

export const leavePolicyRouter = Router;
