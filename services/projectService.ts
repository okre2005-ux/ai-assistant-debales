import { connectDB } from "../lib/db";
import { Project } from "../models/Project";
import { getCurrentUser } from "../lib/auth";
import {
  canAccessAdminDashboard,
  canAccessProject,
} from "../access/projectAccess";

export async function getProjectBySlug(slug: string) {
  await connectDB();

  return Project.findOne({ slug });
}

export async function requireProjectAccess(slug: string) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Not logged in");
  }

  const project = await getProjectBySlug(slug);

  if (!project) {
    throw new Error("Project not found");
  }

  const allowed = await canAccessProject(
    user._id.toString(),
    project._id.toString()
  );

  if (!allowed) {
    throw new Error("No project access");
  }

  return {
    user,
    project,
  };
}

export async function requireAdminAccess(slug: string) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Not logged in");
  }

  const project = await getProjectBySlug(slug);

  if (!project) {
    throw new Error("Project not found");
  }

  const allowed = await canAccessAdminDashboard(
    user._id.toString(),
    project._id.toString()
  );

  if (!allowed) {
    throw new Error("Admin access required");
  }

  return {
    user,
    project,
  };
}
