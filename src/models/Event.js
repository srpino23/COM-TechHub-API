import { Schema, model } from "mongoose";

const eventSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      required: true,
      trim: true,
    },
    options: {},
  },
  {
    versionKey: false,
  }
);

export default model("Event", eventSchema);
