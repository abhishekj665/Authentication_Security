import express from "express";
import * as leavePolicyController from "../../controllers/admin/leavePolicy.controller.js";
import { adminAuth, userAuth } from "../../middlewares/auth.middleware.js";


const Router = express.Router();

Router.get("/policy/all", userAuth,leavePolicyController.getLeavePolicies);

Router.post("/policy/register",adminAuth, leavePolicyController.registerLeavePolicy);
Router.put("/policy/update/:id", adminAuth,leavePolicyController.updateLeavePolicy);
Router.patch("/policy/assign/:id",adminAuth, leavePolicyController.assignPolicyToUser);
Router.patch("/policy/assign-bulk/:id",adminAuth, leavePolicyController.assignPolicyBulk);
Router.delete("/policy/delete/:id",adminAuth, leavePolicyController.deleteLeavePolicy);

export const leavePolicyRouter = Router;
