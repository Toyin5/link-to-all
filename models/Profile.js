import { Schema, model } from "mongoose";
import { randomUUID } from "crypto";

const ProfileSchema = new Schema({
  _id: {
    type: Schema.Types.UUID,
    default: () => randomUUID(),
  },
  user: {
    type: mongoose.Schema.Types.UUID,
    ref: "user",
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  links: {
    type: Schema.Types.UUID,
    ref: "links",
  },
  public: {
    type: Boolean,
    default: true,
  },
});

export default Profile = model("profile", ProfileSchema);
