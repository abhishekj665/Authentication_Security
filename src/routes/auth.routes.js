import express from "express";
import { logIn, signUp, verifyOtp } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import authSchema from "../validators/auth.validator.js";

export const authRouter = express.Router();

authRouter.post("/signup", validate(authSchema), signUp);
authRouter.post("/login", validate(authSchema), logIn);
authRouter.get("/verify", verifyOtp);
