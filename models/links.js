import { Schema, model } from "mongoose";
import { randomUUID } from "crypto";

const LinksSchema = new Schema({
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
  },
});

export default Links = model("links", LinksSchema);
