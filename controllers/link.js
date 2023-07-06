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

  const { id } = req.user;
  const { url, tag } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ status: 404, error: "Authorization required" });
    }

    const newLink = new Links({
      tag,
      url,
      userId: id,
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
    return res.status(400).json({ errors: "Invalid link" });
  }

  const { userId } = req.params;

  try {
    const allLinks = await Links.find({
      userId,
      public: true,
    });

    return res.status(200).json({
      data: allLinks.map((link) => {
        const { tag, url } = link;
        return {
          tag,
          url,
        };
      }),
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 500, error: "Server error" });
  }
};

export const toggleStatus = async (req, res) => {
  const errors = myValidationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { id } = req.user;

  try {
    const link = await Links.findOne({
      _id: req.params.id,
      userId: id,
    });
    if (!link) {
      return res
        .status(401)
        .json({ error: "Unauthorized user. Login as a different user" });
    }
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
  const { id } = req.user;

  try {
    const link = await Links.findOneAndDelete({
      _id: req.params.id,
      userId: id,
    });

    if (!link) {
      return res
        .status(401)
        .json({ error: "Unauthorized user. Login as a different user" });
    }

    res.status(200).json({
      status: 200,
      message: "Deleted"
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
        body("tag", "Tag is required").isString(),
        body("url", "Invalid URL").isURL(),
      ];
    }
    case "getLinks": {
      return [param("userId").isUUID()];
    }
    case "toggleStatus": {
      return [param("id", "Invalid id").isUUID()];
    }
    case "deleteLink": {
      return [param("id", "Invalid id").isUUID()];
    }
  }
};
