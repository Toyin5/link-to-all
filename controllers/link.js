import { body, validationResult, param } from "express-validator";
import Links from "../models/links.js";
import User from "../models/user.js";

const myValidationResult = validationResult.withDefaults({
  formatter: (error) => error.msg,
});

export const addLink = async (req, res) => {
  const errors = myValidationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { tag, url } = req.body;
  const userExist = await User.findById(req.user.id);
  if (!userExist) {
    return res.status(404).json({ status: 404, error: "User not found" });
  }

  try {
    const newLink = new Links({
      tag,
      url,
      userId: userExist._id,
    });
    await newLink.save();
    res.status(201).json({ status: 201, message: "Link created successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 500, error: "Server error" });
  }
};

export const getLinks = async (req, res) => {
  const errors = myValidationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { authorised, id } = req.user;
  const userExist = await User.findById(id);
  if (!userExist) {
    return res.status(404).json({ status: 404, error: "User not found" });
  }

  if (!authorised) {
    const allLinks = await Links.find({
      userId: userExist._id,
      public: true,
    });
    return res.status(200).json({
      status: 200,
      message: "Fetched!",
      data: allLinks.map((link) => {
        const { tag, url } = link;
        return {
          tag,
          url,
        };
      }),
    });
  }

  const allLinks = await Links.find({
    userId: userExist._id,
  });

  return res.status(200).json({
    status: 200,
    message: "Fetched!",
    data: allLinks.map((link) => {
      const { tag, url } = link;
      return {
        tag,
        url,
      };
    }),
  });
};

export const toggleStatus = async (req, res) => {
  const errors = myValidationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const userExist = await User.findById(req.user.id);
  if (!userExist) {
    return res.status(404).json({ status: 404, error: "User not found" });
  }
  try {
    const link = await Links.findOne({
      _id: req.params.id,
      userId: userExist._id,
    });
    link.public = !link.public;
    await link.save();
    res.status(200).json({
      status: 200,
      message: "Updated",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 500, error: "Server error" });
  }
};

export const deleteLink = async (req, res) => {
  const errors = myValidationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const userExist = await User.findById(req.user.id);
  if (!userExist) {
    return res.status(404).json({ status: 404, error: "User not found" });
  }
  try {
    const link = await Links.findOneAndDelete({
      _id: req.params.id,
      userId: userExist._id,
    });
    res.status(200).json({
      status: 200,
      message: "Deleted",
      link,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 500, error: "Server error" });
  }
};

export const linkValidate = (method) => {
  switch (method) {
    case "addLink": {
      return [
        body("tag", "Tag is required").exists().isString(),
        body("url", "Invalid URL").exists().isURL(),
      ];
    }
    case "getLinks": {
      return [param("id", "Invalid id").exists().isUUID()];
    }
    case "toggleStatus": {
      return [param("id", "Invalid id").exists().isUUID()];
    }
    case "deleteLink": {
      return [param("id", "Invalid id").exists().isUUID()];
    }
  }
};
