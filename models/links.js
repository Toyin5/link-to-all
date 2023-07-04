import { Schema, model } from "mongoose";
import { randomUUID } from "crypto";

const LinkSchema = new Schema({
  _id: {
    type: Schema.Types.UUID,
    default: () => randomUUID(),
  },
  tag: {
    type: String,
  },
  urls: {
    type: [String],
  },
  public: {
    type: Boolean,
    default: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
});

export default model("links", LinkSchema);
