import { Schema, model } from "mongoose";

const reportSchema = new Schema(
  {
    hour: {
      type: String,
      required: false,
      trim: true,
    },
    firstResponder: {
      type: String,
      required: false,
      trim: true,
    },
    firstEventOption: {
      type: String,
      required: false,
      trim: true,
    },
    secondResponder: {
      type: String,
      required: false,
      trim: true,
    },
    secondEventOption: {
      type: String,
      required: false,
      trim: true,
    },
    status: {
      type: String,
      required: false,
      trim: true,
    },
    code: {
      type: String,
      required: false,
      trim: true,
    },
    location: {
      type: String,
      required: false,
      trim: true,
    },
    locality: {
      type: String,
      required: false,
      trim: true,
    },
    jurisdiction: {
      type: String,
      required: false,
      trim: true,
    },
    cameraOnSite: {},
    firstEvent: {
      type: String,
      required: false,
      trim: true,
    },
    secondEvent: {
      type: String,
      required: false,
      trim: true,
    },
    story: {
      type: String,
      required: false,
      trim: true,
    },
    storyEntrie: {
      type: String,
      required: false,
      trim: true,
    },
    mobileArrivalTime: {
      type: String,
      required: false,
      trim: true,
    },
    responseTime: {
      type: String,
      required: false,
      trim: true,
    },
    operator: {
      type: String,
      required: false,
      trim: true,
    },
    docket: {
      type: String,
      required: false,
      trim: true,
    },
    latitude: {
      type: String,
      required: false,
      trim: true,
    },
    longitude: {
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
    history: {},
  },
  {
    versionKey: false,
  }
);

export default model("Report", reportSchema);
