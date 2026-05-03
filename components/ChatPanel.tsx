"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSendMessage } from "../hooks/useSendMessage";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  steps?: string[];
};

type ChatPanelProps = {
  slug: string;
};

const welcomeMessage: ChatMessage = {
  role: "assistant",
  content: "Hello! I am your AI Sales Assistant. Ask me about sales, leads, customers, or orders.",
};

export function ChatPanel({ slug }: ChatPanelProps) {
  const queryClient = useQueryClient();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [content, setContent] = useState("");
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [typedAssistantText, setTypedAssistantText] = useState("");

  const sendMessage = useSendMessage(slug);

  useEffect(() => {
    function handleNewChat() {
      setConversationId(undefined);
      setMessages([welcomeMessage]);
      setTypedAssistantText("");
      setContent("");
    }

    window.addEventListener("new-chat", handleNewChat);

    return () => {
      window.removeEventListener("new-chat", handleNewChat);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, typedAssistantText, sendMessage.isPending]);

  async function typeAssistantMessage(message: ChatMessage) {
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        role: "assistant",
        content: "",
        steps: message.steps,
      },
    ]);

    setTypedAssistantText("");

    for (let index = 0; index <= message.content.length; index++) {
      setTypedAssistantText(message.content.slice(0, index));
      await new Promise((resolve) => setTimeout(resolve, 12));
    }

    setMessages((currentMessages) => {
      const updatedMessages = [...currentMessages];
      updatedMessages[updatedMessages.length - 1] = message;
      return updatedMessages;
    });

    setTypedAssistantText("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!content.trim() || sendMessage.isPending) {
      return;
    }

    const userText = content.trim();
    setContent("");

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        role: "user",
        content: userText,
      },
    ]);

    try {
      const result = await sendMessage.mutateAsync({
        conversationId,
        content: userText,
      });

      setConversationId(result.conversation._id);

      const assistantMessage = result.messages.find(
        (message: ChatMessage) => message.role === "assistant"
      );

      if (assistantMessage) {
        await typeAssistantMessage(assistantMessage);
      }

      queryClient.invalidateQueries({
        queryKey: ["conversations", slug],
      });
    } catch {
      // Error UI is handled below through TanStack Query state.
    }
  }

  return (
    <section className="flex min-h-0 flex-col bg-[#080b12]">
      <div className="flex-1 space-y-5 overflow-y-auto p-6">
        {messages.map((message, index) => {
          const isTypingLastAssistant =
            index === messages.length - 1 &&
            message.role === "assistant" &&
            message.content === "" &&
            typedAssistantText;

          return (
            <div
              key={index}
              className={
                message.role === "assistant"
                  ? "max-w-3xl rounded-xl border border-white/10 bg-white/[0.05] p-5 shadow-lg shadow-black/10"
                  : "ml-auto max-w-2xl rounded-xl bg-cyan-300 p-5 text-slate-950 shadow-lg shadow-cyan-950/20"
              }
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold opacity-75">
                  {message.role === "assistant" ? "Assistant" : "You"}
                </p>

                {message.role === "assistant" && (
                  <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-2 py-1 text-xs text-emerald-200">
                    AI
                  </span>
                )}
              </div>

              {message.steps && message.steps.length > 0 && (
                <div className="mt-4 grid gap-2">
                  {message.steps.map((step) => (
                    <div
                      key={step}
                      className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/15 px-3 py-2 text-xs text-slate-300"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-300 text-[10px] font-bold text-slate-950">
                        OK
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-4 whitespace-pre-wrap leading-7">
                {isTypingLastAssistant ? typedAssistantText : message.content}
                {isTypingLastAssistant && (
                  <span className="ml-1 inline-block h-5 w-2 animate-pulse rounded-sm bg-cyan-300 align-middle" />
                )}
              </p>
            </div>
          );
        })}

        {sendMessage.isPending && (
          <div className="max-w-3xl rounded-xl border border-white/10 bg-white/[0.05] p-5 text-slate-300">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
              Assistant is preparing a response...
            </div>
          </div>
        )}

        {sendMessage.isError && (
          <div className="max-w-3xl rounded-xl border border-red-400/20 bg-red-400/10 p-5 text-red-100">
            <p className="font-semibold">Failed to send message</p>
            <p className="mt-1 text-sm text-red-200">
              {sendMessage.error.message}. Please try again.
            </p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-white/10 bg-white/[0.03] p-4"
      >
        <div className="flex gap-3">
          <input
            className="min-h-12 flex-1 rounded-xl border border-white/10 bg-white/[0.06] px-4 text-white placeholder:text-slate-500"
            placeholder="Ask about orders, leads, customers..."
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />

          <button
            className="rounded-xl bg-cyan-300 px-6 font-semibold text-slate-950 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={sendMessage.isPending || !content.trim()}
          >
            Send
          </button>
        </div>
      </form>
    </section>
  );
}
