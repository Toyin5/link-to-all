import Jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/user.js";

export const checkHeader = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Invalid authorization header" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const user = Jwt.verify(token, process.env.JWT_TOKEN);
    if (user) {
      req.user = user;
      next();
    }
  } catch (err) {
    return res.status(403).send("Invalid token");
  }
};

export const getHeader = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const userExist = await User.findById(req.params.id);
  if (!userExist) {
    return res.status(404).json({ status: 404, error: "User not found" });
  }

  if (!authHeader) {
    req.user = {
      authorised: false,
      id: userExist._id,
    };
    next();
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = Jwt.verify(token, process.env.JWT_TOKEN);
    if (user) {
      req.user = {
        authorised: true,
        id: userExist._id,
      };
      next();
    }
  } catch (err) {
    console.log(err);
    req.user = {
      authorised: false,
      id: userExist._id,
    };
    next();
  }
};
