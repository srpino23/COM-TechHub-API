import { Schema, model } from "mongoose";

const reportSchema = new Schema(
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
    summary: {
      type: String,
      required: false,
      trim: true,
    },
    supplies: [],
    changes: {
      type: String,
      required: false,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
    },
    startTime: {
      type: String,
      required: true,
      trim: true,
    },
    endTime: {
      type: String,
      required: false,
      trim: true,
    },
    location: {
      type: String,
      required: false,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: false,
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

export default model("Report", reportSchema);
