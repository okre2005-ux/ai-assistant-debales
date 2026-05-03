import { redirect } from "next/navigation";
import { ChatPanel } from "../../../../components/ChatPanel";
import { ConversationSidebar } from "../../../../components/ConversationSidebar";
import { ProjectSwitcher } from "../../../../components/ProjectSwitcher";
import { requireProjectAccess } from "../../../../services/projectService";

type ChatPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ChatPage({ params }: ChatPageProps) {
  const { slug } = await params;

  let data;

  try {
    data = await requireProjectAccess(slug);
  } catch {
    redirect("/login");
  }

  const { user, project } = data;

  return (
    <main className="min-h-screen bg-[#080b12] text-white">
      <header className="border-b border-white/10 bg-white/[0.03] px-6 py-4 backdrop-blur">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-cyan-300">
              AI Sales Assistant
            </p>
            <h1 className="mt-1 text-2xl font-semibold">{project.name}</h1>
            <p className="mt-1 text-sm text-slate-400">
              Logged in as {user.email}
            </p>
          </div>

          <ProjectSwitcher projectName={project.name} />
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-121px)] grid-cols-[300px_1fr]">
        <ConversationSidebar slug={slug} />
        <ChatPanel slug={slug} />
      </div>
    </main>
  );
}
