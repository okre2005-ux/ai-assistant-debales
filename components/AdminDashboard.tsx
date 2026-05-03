"use client";

import Link from "next/link";
import { IntegrationToggles } from "./IntegrationToggles";
import { useDashboardConfig } from "../hooks/useDashboardConfig";

type DashboardWidget = {
  type: string;
  label: string;
  order: number;
};

type RecentConversation = {
  _id: string;
  title: string;
  createdAt: string;
};

type AdminDashboardProps = {
  slug: string;
  projectName: string;
};

export function AdminDashboard({ slug, projectName }: AdminDashboardProps) {
  const { data, isLoading, isError, error } = useDashboardConfig(slug);

  const widgets: DashboardWidget[] = [...(data?.config?.widgets ?? [])].sort(
    (a, b) => a.order - b.order
  );

  const metrics = data?.metrics ?? {
    totalConversations: 0,
    totalMessages: 0,
    activeIntegrations: 0,
  };

  const recentConversations: RecentConversation[] =
    data?.recentConversations ?? [];

  function getWidgetValue(widget: DashboardWidget) {
    const label = widget.label.toLowerCase();

    if (label.includes("conversation")) {
      return metrics.totalConversations;
    }

    if (label.includes("message")) {
      return metrics.totalMessages;
    }

    if (label.includes("integration") || label.includes("shopify") || label.includes("crm")) {
      return `${metrics.activeIntegrations}/2 active`;
    }

    return "Ready";
  }

  return (
    <main className="min-h-screen bg-[#080b12] text-white">
      <header className="border-b border-white/10 bg-white/[0.03] px-6 py-5">
        <Link
          href={`/projects/${slug}/chat`}
          className="text-sm font-medium text-cyan-300 hover:text-cyan-200"
        >
          Back to chat
        </Link>

        <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
              Project admin
            </p>
            <h1 className="mt-2 text-3xl font-semibold">
              {data?.config?.title ?? "Admin Dashboard"}
            </h1>
            <p className="mt-1 text-slate-400">Project: {projectName}</p>
          </div>

          <div className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-sm text-emerald-200">
            Admin access active
          </div>
        </div>
      </header>

      <section className="p-6">
        <IntegrationToggles slug={slug} />

        {isLoading && (
          <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] p-6 text-slate-400">
            Loading dashboard...
          </div>
        )}

        {isError && (
          <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 p-6 text-red-100">
            {error instanceof Error ? error.message : "Failed to load dashboard"}
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {widgets.length === 0 ? (
              <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] p-8 text-center text-slate-400">
                No widgets configured.
              </div>
            ) : (
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {widgets.map((widget) => (
                  <div
                    key={`${widget.type}-${widget.order}`}
                    className="rounded-xl border border-white/10 bg-white/[0.05] p-5 shadow-lg shadow-black/10"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                        {widget.type}
                      </p>
                      <span className="rounded-full bg-cyan-300/10 px-2 py-1 text-xs text-cyan-200">
                        Live
                      </span>
                    </div>

                    <h2 className="mt-4 text-lg font-semibold">
                      {widget.label}
                    </h2>

                    <p className="mt-4 text-4xl font-semibold text-cyan-200">
                      {getWidgetValue(widget)}
                    </p>

                    <p className="mt-3 text-sm text-emerald-300">
                      Updated from MongoDB config
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.05] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    Table widget
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">
                    Recent Conversations
                  </h2>
                </div>

                <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-300">
                  {recentConversations.length} latest
                </span>
              </div>

              <div className="mt-5 overflow-hidden rounded-lg border border-white/10">
                {recentConversations.length === 0 ? (
                  <p className="p-4 text-slate-400">
                    No recent conversations found.
                  </p>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/[0.04] text-slate-400">
                      <tr>
                        <th className="px-4 py-3 font-medium">Title</th>
                        <th className="px-4 py-3 font-medium">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentConversations.map((conversation) => (
                        <tr
                          key={conversation._id}
                          className="border-t border-white/10"
                        >
                          <td className="px-4 py-3 text-slate-200">
                            {conversation.title}
                          </td>
                          <td className="px-4 py-3 text-slate-400">
                            {new Date(conversation.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
