import express from "express";
import {
  addLink,
  deleteLink,
  getLinks,
  linkValidate,
  toggleStatus,
} from "../controllers/link.js";
import { checkHeader, getHeader } from "../middlewares/auth.js";

export const linkRoute = express.Router();

linkRoute.post("/link", [checkHeader, linkValidate("addLink")], addLink);
linkRoute.patch(
  "/link/:id",
  [checkHeader, linkValidate("toggleStatus")],
  toggleStatus
);
linkRoute.delete(
  "/link/:id",
  [checkHeader, linkValidate("deleteLink")],
  deleteLink
);
linkRoute.get("/links/:id", [getHeader, linkValidate("getLinks")], getLinks);
