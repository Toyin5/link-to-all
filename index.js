import express from "express";
import treblle from "@treblle/express";
import database from "./utils/db.js";
import "dotenv/config";
import cors from "cors";
import { userRoute } from "./routes/user.js";
import { linkRoute } from "./routes/link.js";

const app = express();
const PORT = 8080;

app.use(cors());
app.use(treblle());
app.use(express.json());
app.use("/api", userRoute);
app.use("/api", linkRoute);

//parent endpoints

await database();

app.use("/", (req, res) => {
  res.status(404).json({
    code: 404,
    message: "Endpoint Not Found",
  });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

export default app;
