import { Router } from "express";
import Profile from "../models/User";

const router = Router();

// @route    GET api/profile/:username
// @desc     Get Profile by username
// @access   Public
router.get("/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const profile = await Profile.findOne({ username }).select("-user");

    if (!profile || !profile.public) {
      return res.status(404).json({ msg: "Link not valid" });
    }
    if (!profile.public) {
      return res.status(401).json({ msg: "User is private" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
