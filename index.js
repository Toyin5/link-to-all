import express from "express";
import treblle from "@treblle/express";
import database from "./utils/db.js";
import "dotenv/config";

import cors from "cors";

const app = express();
const PORT = 8080;

app.use(cors());
app.use(treblle());

app.use(express.json());

database();

app.use("/", (req, res) => {
  res.status(404).json({
    code: 404,
    message: "Page Not Found",
  });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

export default app;
