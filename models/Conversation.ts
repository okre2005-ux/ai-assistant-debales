import { Schema, models, model } from "mongoose";

const ConversationSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    productInstanceId: {
      type: Schema.Types.ObjectId,
      ref: "ProductInstance",
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: "New conversation",
    },
  },
  {
    timestamps: true,
  }
);

export const Conversation =
  models.Conversation || model("Conversation", ConversationSchema);
