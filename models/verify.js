import { Schema, model } from "mongoose";
import { randomUUID } from "crypto";

const VerifySchema = new Schema({
  _id: {
    type: Schema.Types.UUID,
    default: () => randomUUID(),
  },
  userId: {
    type: Schema.Types.UUID,
    required: true,
    ref: "users",
  },
  token: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    default: Date.now(),
    expires: 18000,
  },
});

export default model("verification", VerifySchema);
