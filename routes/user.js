import express from "express";
import { logUser, registerUser } from "../controllers/user.js";

export const userRoute = express.Router();

userRoute.post("/auth/register", registerUser);
userRoute.get("/auth/login", logUser);
