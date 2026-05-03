import { ProjectMember } from "../models/ProjectMember";

export async function getProjectRole(userId: string, projectId: string) {
  const membership = await ProjectMember.findOne({
    userId,
    projectId,
  });

  return membership?.role ?? null;
}

export async function canAccessProject(userId: string, projectId: string) {
  const role = await getProjectRole(userId, projectId);

  return role === "admin" || role === "member";
}

export async function canAccessAdminDashboard(
  userId: string,
  projectId: string
) {
  const role = await getProjectRole(userId, projectId);

  return role === "admin";
}
