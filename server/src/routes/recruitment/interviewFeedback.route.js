import express from "express";
import * as interviewFeedbackController from "../../controllers/recruitment/interviewFeedback.controller.js";
import { managerAuth, userAuth } from "../../middlewares/auth.middleware.js";

const Router = express.Router();

Router.post(
  "/interview-feedback/:interviewId",
  userAuth,
  managerAuth,
  interviewFeedbackController.createInterviewFeedback,
);

export const InterviewFeedbackRouter = Router;
