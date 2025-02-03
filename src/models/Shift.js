import { Schema, model } from "mongoose";

const shiftSchema = new Schema(
  {
    shift: {
      type: String,
      required: true,
      trim: true,
    },
    entry: {
      type: String,
      required: true,
      trim: true,
    },
    exit: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      default: () => {
        const date = new Date();
        date.setHours(date.getHours() - 3);
        return date;
      },
    },
  },
  {
    versionKey: false,
  }
);

export default model("Shift", shiftSchema);
