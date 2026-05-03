import { Schema, models, model } from "mongoose";

const DashboardWidgetSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const DashboardConfigSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    widgets: {
      type: [DashboardWidgetSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const DashboardConfig =
  models.DashboardConfig ||
  model("DashboardConfig", DashboardConfigSchema);
