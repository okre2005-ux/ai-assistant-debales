import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { User } from "../models/User";
import { Project } from "../models/Project";
import { ProjectMember } from "../models/ProjectMember";

export async function requireProjectAccess(slug: string, demoUserEmail?: string) {
  // If demo user email is provided, use that instead
  if (demoUserEmail) {
    // Find or create demo user
    let user = await User.findOne({ email: demoUserEmail });
    
    if (!user) {
      user = await User.create({
        email: demoUserEmail,
        name: demoUserEmail === "admin@debales.ai" ? "Demo Admin" : "Demo Member",
        role: demoUserEmail === "admin@debales.ai" ? "admin" : "member",
      });
    }
    
    // Get project
    const project = await Project.findOne({ slug });
    
    if (!project) {
      throw new Error("Project not found");
    }
    
    return { user, project };
  }
  
  // Original logic for non-demo users (from your existing code)
  // Get user from session/cookie
  const cookieStore = cookies();
  const userEmail = cookieStore.get("user-email")?.value;
  
  if (!userEmail) {
    redirect("/login");
  }
  
  const user = await User.findOne({ email: userEmail });
  
  if (!user) {
    redirect("/login");
  }
  
  const project = await Project.findOne({ slug });
  
  if (!project) {
    throw new Error("Project not found");
  }
  
  // Check if user has access to this project
  const member = await ProjectMember.findOne({
    projectId: project._id,
    userId: user._id,
  });
  
  if (!member && user.role !== "admin") {
    redirect("/access-denied");
  }
  
  return { user, project };
}