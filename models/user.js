import { Schema, model } from "mongoose";
import { randomUUID } from "crypto";

const UserSchema = new Schema(
  {
    _id: {
      type: Schema.Types.UUID,
      default: () => randomUUID(),
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    links: {
      type: [Schema.Types.UUID],
      ref: "links",
    },
  },
  { timestamps: true }
);

export default User = model("user", UserSchema);
