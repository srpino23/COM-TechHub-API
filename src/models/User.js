import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    surname: {
      type: String,
      required: true,
      trim: true,
    },
    team: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
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

export default model("User", userSchema);
