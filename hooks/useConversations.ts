"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useConversations(slug: string) {
  return useQuery({
    queryKey: ["conversations", slug],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${slug}/conversations`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to load conversations");
      }

      return response.json();
    },
  });
}

export function useDeleteConversation(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      const response = await fetch(`/api/projects/${slug}/conversations`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to delete conversation");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", slug],
      });
    },
  });
}
