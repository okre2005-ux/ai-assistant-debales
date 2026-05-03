import { Schema, models, model } from "mongoose";

const ProductInstanceSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    productType: {
      type: String,
      required: true,
    },
    integrations: {
      shopify: {
        enabled: {
          type: Boolean,
          default: true,
        },
      },
      crm: {
        enabled: {
          type: Boolean,
          default: true,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

export const ProductInstance =
  models.ProductInstance ||
  model("ProductInstance", ProductInstanceSchema);
