import mongoose from "mongoose";
import { config } from "dotenv";

config({ path: ".env.local" });

async function updateDashboardConfig() {
  const { connectDB } = await import("../lib/db");
  const { Project } = await import("../models/Project");
  const { DashboardConfig } = await import("../models/DashboardConfig");

  await connectDB();

  const project = await Project.findOne({
    slug: "debales-demo",
  });

  if (!project) {
    throw new Error("Project not found");
  }

  await DashboardConfig.findOneAndUpdate(
    {
      projectId: project._id,
    },
    {
      title: "Updated Admin Dashboard",
      widgets: [
        {
          type: "integration",
          label: "CRM Status",
          order: 1,
        },
        {
          type: "metric",
          label: "Conversations This Week",
          order: 2,
        },
        {
          type: "integration",
          label: "Shopify Status",
          order: 3,
        },
      ],
    }
  );

  console.log("Dashboard config updated successfully");

  await mongoose.disconnect();
}

updateDashboardConfig().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
