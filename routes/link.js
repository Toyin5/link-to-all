import express from "express";
import {
  addLink,
  deleteLink,
  getLinks,
  linkValidate,
  toggleStatus,
} from "../controllers/link.js";
import { checkHeader, resourceHeader } from "../middlewares/auth.js";

export const linkRoute = express.Router();

linkRoute.post("/link", [linkValidate("addLink"), checkHeader], addLink);
linkRoute.patch(
  "/link/:id",
  [linkValidate("toggleStatus"), checkHeader],
  toggleStatus
);
linkRoute.delete(
  "/link/:id",
  [linkValidate("deleteLink"), checkHeader],
  deleteLink
);
linkRoute.get(
  "/links/:userId",
  [linkValidate("getLinks"), resourceHeader],
  getLinks
);
