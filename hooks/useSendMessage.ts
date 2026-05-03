"use client";

import { useMutation } from "@tanstack/react-query";

type SendMessageInput = {
  conversationId?: string;
  content: string;
};

export function useSendMessage(slug: string) {
  return useMutation({
    mutationFn: async (input: SendMessageInput) => {
      const response = await fetch(`/api/projects/${slug}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to send message");
      }

      return response.json();
    },
  });
}
