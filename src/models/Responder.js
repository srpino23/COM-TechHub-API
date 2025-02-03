import { Schema, model } from "mongoose";

const responderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    versionKey: false,
  }
);

export default model("Responder", responderSchema);
