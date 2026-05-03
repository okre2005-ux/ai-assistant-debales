import { Schema, models, model } from "mongoose";

const ProjectMemberSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ProjectMember =
  models.ProjectMember || model("ProjectMember", ProjectMemberSchema);
