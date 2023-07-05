import links from "../models/links.js";
import user from "../models/user.js";

export const addLink = async (req, res) => {
  const { tag, url } = req.body;
  const userExist = await user.findById(req.user.id);
  if (!userExist) {
    return res.status(404).json({ status: 404, error: "User not found" });
  }
  try {
    const newLink = new links({
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
  const { authorised, id } = req.user;
  if (!authorised) {
    const allLinks = await links.find({
      userId: id,
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
  const allLinks = await links.find({
    userId: id,
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
