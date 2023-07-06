import Jwt from "jsonwebtoken";
import "dotenv/config";
import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 25, //  maximum of 25 request per minute
});

export const checkHeader = async (req, res, next) => {
  const authToken = req.headers.authorization;
  if (!authToken) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const token = authToken.split(" ")[1];

  try {
    Jwt.verify(token, process.env.JWT_TOKEN, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        return res.status(401).json({ error: "Authentication required" });
      } else {
        req.user = decodedToken;
        next();
      }
    });
  } catch (err) {
    return res.status(403).send("Invalid token");
  }
};
