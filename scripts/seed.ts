import mongoose from "mongoose";
import { config } from "dotenv";

config({ path: ".env.local" });

async function seed() {
  const { connectDB } = await import("../lib/db");
  const { User } = await import("../models/User");
  const { Project } = await import("../models/Project");
  const { ProjectMember } = await import("../models/ProjectMember");
  const { ProductInstance } = await import("../models/ProductInstance");
  const { DashboardConfig } = await import("../models/DashboardConfig");

  await connectDB();

  await User.deleteMany({});
  await Project.deleteMany({});
  await ProjectMember.deleteMany({});
  await ProductInstance.deleteMany({});
  await DashboardConfig.deleteMany({});

  const adminUser = await User.create({
    name: "Demo Admin",
    email: "admin@debales.ai",
  });

  const memberUser = await User.create({
    name: "Demo Member",
    email: "member@debales.ai",
  });

  const project = await Project.create({
    name: "Debales Demo",
    slug: "debales-demo",
  });

  await ProjectMember.create([
    {
      projectId: project._id,
      userId: adminUser._id,
      role: "admin",
    },
    {
      projectId: project._id,
      userId: memberUser._id,
      role: "member",
    },
  ]);

  await ProductInstance.create({
    projectId: project._id,
    name: "AI Sales Assistant",
    productType: "sales-assistant",
    integrations: {
      shopify: { enabled: true },
      crm: { enabled: true },
    },
  });

  await DashboardConfig.create({
    projectId: project._id,
    title: "Project Admin Dashboard",
    widgets: [
      {
        type: "metric",
        label: "Total Conversations",
        order: 1,
      },
      {
        type: "integration",
        label: "Shopify Integration",
        order: 2,
      },
      {
        type: "integration",
        label: "CRM Integration",
        order: 3,
      },
    ],
  });

  console.log("Seed data created successfully");

  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
