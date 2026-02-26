import express from "express";
import { adminAuth, managerAuth, userAuth} from "../../middlewares/auth.middleware.js";
import * as JobPostingController from "../../controllers/recruitment/jobPosting.controller.js";


const Router = express.Router();

Router.patch("/job-post/:id", adminAuth, JobPostingController.updateJobPosting);
Router.patch("/job-post/active/:id", adminAuth, JobPostingController.activeJobPosting);
Router.get("/job-post/:id", userAuth,JobPostingController.getJobPosting);
Router.get("/job-posts", userAuth, JobPostingController.getJobPostings)
Router.get("/jobs", JobPostingController.getJobs)
Router.get("/job/:slug", JobPostingController.getJob)




export const JobPostingRouter = Router;