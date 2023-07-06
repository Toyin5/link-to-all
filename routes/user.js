import express from "express";
import {
  loginUser,
  registerUser,
  verifyUser,
  userValidate,
} from "../controllers/user.js";

export const userRoute = express.Router();

userRoute.post("/auth/register", userValidate("registerUser"), registerUser);
userRoute.get("/auth/login", userValidate("loginUser"), loginUser);
userRoute.patch("/auth/verify/:userId/:token", userValidate("verifyUser"), verifyUser);
