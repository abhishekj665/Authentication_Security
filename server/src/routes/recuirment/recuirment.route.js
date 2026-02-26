import express from "express";
import { JobRequistionRouter } from "./jobRequisition.route.js";
import { JobPostingRouter } from "./jobPosting.route.js";


const Router = express.Router();

Router.use(JobRequistionRouter);
Router.use(JobPostingRouter);


export const RecuirmentRouter = Router;
