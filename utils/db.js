import "dotenv/config";
import mongoose from "mongoose";

const database = async () => {
  mongoose.set("strictQuery", false);
  return await mongoose
    .connect(process.env.MONGO)
    .then((res) => console.log("connection success : ", res.options.autoIndex))
    .catch((err) => console.log("connection failed : ", err));
};

export default database;
