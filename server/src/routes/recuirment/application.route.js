import express from "express";
import { uploadResume } from "../../middlewares/upload.js";
import * as ApplicationController from "../../controllers/recruitment/application.controller.js";

const Router = express.Router();

Router.post(
  "/application/apply/:slug",
  uploadResume.single("resume"),
  ApplicationController.registerApplication,
);

export const ApplicationRouter = Router;
