import express from "express";
import { JobRequistionRouter } from "./jobRequisition.route.js";
import { JobPostingRouter } from "./jobPosting.route.js";
import { ApplicationRouter } from "./application.route.js";
import { CandidateRouter } from "./candidate.route.js";

const Router = express.Router();

Router.use(JobRequistionRouter);
Router.use(JobPostingRouter);
Router.use(ApplicationRouter);
Router.use(CandidateRouter);

export const RecuirmentRouter = Router;
