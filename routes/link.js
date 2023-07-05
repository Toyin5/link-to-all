import express from "express";
import { addLink, getLinks } from "../controllers/link.js";
import { checkHeader, getHeader } from "../middlewares/auth.js";

export const linkRoute = express.Router();

linkRoute.post("/link", checkHeader, addLink);
linkRoute.get("/links/:id", getHeader, getLinks);
