import { Schema, model } from "mongoose";

const employeeSchema = new Schema(
  {
    shift: {
      type: String,
      required: true,
      trim: true,
    },
    docket: {
      type: String,
      required: true,
      trim: true,
    },
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
    position: {
      type: String,
      required: true,
      trim: true,
    },
    seniority: {
      type: String,
      required: false,
      trim: true,
    },
    remainingItems: {
      type: String,
      required: false,
      trim: true,
    },
    remainingLicenses: {
      type: String,
      required: false,
      trim: true,
    },
    remainingStudyDays: {
      type: String,
      required: false,
      trim: true,
    },
    jobApplications: {},
    overtime: {},
    sanctions: {},
    absences: {},
    lateArrivals: {},
    entryForm: {},
    exitForm: {},
    category: {
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

export default model("Employee", employeeSchema);
