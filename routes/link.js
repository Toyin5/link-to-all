import express from "express";
import { addLink, getLinks, linkValidate } from "../controllers/link.js";
import { checkHeader, getHeader } from "../middlewares/auth.js";

export const linkRoute = express.Router();

linkRoute.post("/link", [checkHeader, linkValidate("addLink")], addLink);
linkRoute.get("/links/:id", [getHeader, linkValidate("getLinks")], getLinks);
