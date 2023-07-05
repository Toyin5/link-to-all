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
  url: {
    type: String,
  },
  public: {
    type: Boolean,
    default: true,
  },
  userId: {
    type: Schema.Types.UUID,
    required: true,
    ref: "users",
  },
});

export default model("links", LinkSchema);
