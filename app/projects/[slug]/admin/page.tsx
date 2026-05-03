import { redirect } from "next/navigation";
import { AdminDashboard } from "../../../../components/AdminDashboard";
import { getCurrentUser } from "../../../../lib/auth";
import { Project } from "../../../../models/Project";
import { canAccessAdminDashboard } from "../../../../access/projectAccess";
import { connectDB } from "../../../../lib/db";

type AdminPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function AdminPage({ params }: AdminPageProps) {
  const { slug } = await params;

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  await connectDB();

  const project = await Project.findOne({
    slug,
  });

  if (!project) {
    redirect("/login");
  }

  const isAdmin = await canAccessAdminDashboard(
    user._id.toString(),
    project._id.toString()
  );

  if (!isAdmin) {
    redirect("/access-denied");
  }

  return <AdminDashboard slug={slug} projectName={project.name} />;
}
