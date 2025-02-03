import { Schema, model } from "mongoose";

const entrieSchema = new Schema(
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

export default model("Entrie", entrieSchema);
