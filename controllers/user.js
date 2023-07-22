import User from "../models/user.js";
import Verify from "../models/verify.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import "dotenv/config";
import { body, validationResult, param, query } from "express-validator";
import { cryptoToken } from "../utils/helpers.js";
import sendEmail from "../utils/sendEmail.js";
import sendHtml from "../utils/sendHtml.js";

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
  const userExist = await User.findOne({ email });

  if (userExist) {
    return res.status(409).json({
      status: 409,
      error: "Duplicate User",
    });
  }

  try {
    const newUser = new User({
      email,
      password: await bcrypt.hash(password, salt),
    });
    const user = await newUser.save();

    const token = cryptoToken();
    const verification = new Verify({
      userId: user._id,
      token,
    });

    await verification.save();

    const url = new URL(process.env.VERIFY_URL + user._id);
    url.searchParams.set("token", token);
    console.log(url);
    await sendEmail(email, "Verify your account", sendHtml(url));

    return res.status(201).json({
      status: 201,
      message: "Successfully registered",
      data: { id: user._id, email },
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(409).json({
        status: 409,
        error: "Duplicate user credentials!",
      });
    } else {
      return res.status(500).json({
        status: 500,
        error: "Server Error!",
      });
    }
  }
};

export const loginUser = async (req, res) => {
  const errors = myValidationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
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
    const token = Jwt.sign(user, process.env.JWT_TOKEN, { expiresIn: 360000 });

    if (match) {
      return userExist.verified
        ? res.status(200).json({
            status: 200,
            message: "Successfully logged in",
            token: token,
          })
        : res
            .status(403)
            .json({ status: 403, message: "Verify account", token: null });
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
    return res.status(400).json({ errors: "Invalid Link" });
  }

  const { userId } = req.params;
  const { token } = req.query;
  console.log(userId, token);
  try {
    const verification = await Verify.findOne({ userId });

    if (!verification) {
      return res.status(400).json({
        error: "Link expired!",
      });
    }

    if (verification.token === token) {
      await User.findByIdAndUpdate(userId, { verified: true });
      await Verify.findOneAndDelete(userId);

      return res.status(200).json({
        message: "User Verified",
      });
    }

    return res.status(400).json({ errors: "Invalid Link" });
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
        body("email", "Please enter a valid email.").isEmail(),
        body(
          "password",
          "Please enter a password with 6 or more characters including at least 1 lowercase, 1 uppercase and 1 number."
        ).isStrongPassword({
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
        body("email").isEmail(),
        body("password").isStrongPassword({
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 0,
        }),
      ];
    }

    case "verifyUser": {
      return [param("userId").isUUID(), query("token").isString()];
    }
  }
};
