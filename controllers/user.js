import user from "../models/user.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import "dotenv/config";

export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const salt = await bcrypt.genSalt(10);
  const userExist = await user.findOne({ email: email });
  if (userExist) {
    return res.status(409).json({
      status: 409,
      message: "Duplicate User",
    });
  }

  try {
    const newUser = new user({
      email,
      password: await bcrypt.hash(password, salt),
    });
    await newUser.save();
    return res.status(201).json({
      status: 201,
      message: "Successfully registered",
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(409).json({
        status: 409,
        message: "Duplicate",
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: "Server Error!",
      });
    }
  }
};

export const logUser = async (req, res) => {
  const { email, password } = req.body;
  const userExist = await user.findOne({ email });
  if (!userExist) {
    return res
      .status(404)
      .json({ status: 404, message: "User not found", token: null });
  }
  try {
    const match = await bcrypt.compare(password, userExist.password);
    const user = { id: userExist._id };
    const token = Jwt.sign(user, process.env.JWT_TOKEN);
    if (match) {
      return userExist.confirmed
        ? res.status(200).json({ status: 200, message: "Logged", token: token })
        : res
            .status(403)
            .json({ status: 403, message: "Account Pending", token: null });
    }
    return res
      .status(409)
      .json({ status: 409, message: "Incorrect Password", token: null });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      message: "Error decrypting",
      token: null,
    });
  }
};
