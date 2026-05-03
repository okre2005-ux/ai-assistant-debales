"use client";

import Link from "next/link";
import {
  useConversations,
  useDeleteConversation,
} from "../hooks/useConversations";

type Conversation = {
  _id: string;
  title: string;
};

type ConversationSidebarProps = {
  slug: string;
};

export function ConversationSidebar({ slug }: ConversationSidebarProps) {
  const { data, isLoading, isError } = useConversations(slug);
  const deleteConversation = useDeleteConversation(slug);

  const conversations: Conversation[] = data?.conversations ?? [];

  return (
    <aside className="flex min-h-0 flex-col border-r border-white/10 bg-white/[0.02] p-4">
      <button
        onClick={() => window.dispatchEvent(new Event("new-chat"))}
        className="w-full rounded-lg bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
      >
        New Chat
      </button>

      <div className="mt-6 min-h-0 flex-1">
        <p className="px-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
          Conversations
        </p>

        <div className="mt-3 max-h-[calc(100vh-260px)] space-y-2 overflow-y-auto pr-1 text-sm">
          {isLoading && (
            <p className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-slate-400">
              Loading conversations...
            </p>
          )}

          {isError && (
            <p className="rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-red-200">
              Failed to load conversations
            </p>
          )}

          {!isLoading && !isError && conversations.length === 0 && (
            <p className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-slate-400">
              No conversations yet
            </p>
          )}

          {conversations.map((conversation) => (
            <div
              key={conversation._id}
              className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] p-2 text-slate-300 hover:border-cyan-300/40 hover:bg-cyan-300/10"
            >
              <span className="min-w-0 flex-1 truncate" title={conversation.title}>
                {conversation.title}
              </span>

              <button
                onClick={() => deleteConversation.mutate(conversation._id)}
                className="rounded-md px-2 py-1 text-xs text-slate-500 opacity-0 hover:bg-red-400/10 hover:text-red-200 group-hover:opacity-100"
                disabled={deleteConversation.isPending}
                title="Delete conversation"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      <Link
        href={`/projects/${slug}/admin`}
        className="mt-6 block rounded-lg border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-center text-sm font-semibold text-amber-100 hover:bg-amber-300/20"
      >
        Admin Dashboard
      </Link>
    </aside>
  );
}
