import User from "../models/user.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import "dotenv/config";
import { body, validationResult, param } from "express-validator";

const myValidationResult = validationResult.withDefaults({
  formatter: (error) => error.msg,
});

export const registerUser = async (req, res) => {
  const errors = myValidationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const userExist = await User.findOne({ email: email });
  if (userExist) {
    return res.status(409).json({
      status: 409,
      message: "Duplicate User",
    });
  }

  try {
    const newUser = new User({
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

export const loginUser = async (req, res) => {
  const errors = myValidationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: "You have entered an invalid email or password" });
  }

  const { email, password } = req.body;
  const userExist = await User.findOne({ email });
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
        ? res.status(200).json({
            status: 200,
            message: "Successfully logged in",
            token: token,
          })
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

export const verifyUser = async (req, res) => {
  const errors = myValidationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const userExist = await User.findById(id);
  if (!userExist) {
    return res
      .status(404)
      .json({ status: 404, message: "User not found", token: null });
  }
  try {
    if (userExist.confirmed === true) {
      return res.status(200).json({
        status: 200,
        message: "Account already verified!",
      });
    }

    await userExist.save();
    res.status(200).json({
      status: 200,
      message: "Account Verified!",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Server error",
    });
  }
};

export const userValidate = (method) => {
  switch (method) {
    case "registerUser": {
      return [
        body("email", "Please enter a valid email.").exists().isEmail(),
        body(
          "password",
          "Please enter a password with 6 or more characters including at least 1 lowercase, 1 uppercase and 1 number."
        )
          .exists()
          .isStrongPassword({
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 0,
          }),
      ];
    }

    case "loginUser": {
      return [
        body("email").exists().isEmail(),
        body("password").exists().isStrongPassword({
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 0,
        }),
      ];
    }

    case "verifyUser": {
      return [
        param("id", "Invalid id").exists().isUUID()
      ];
    }
  }
};
