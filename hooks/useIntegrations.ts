"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type UpdateIntegrationsInput = {
  shopify: boolean;
  crm: boolean;
};

export function useIntegrations(slug: string) {
  return useQuery({
    queryKey: ["integrations", slug],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${slug}/integrations`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to load integrations");
      }

      return response.json();
    },
  });
}

export function useUpdateIntegrations(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateIntegrationsInput) => {
      const response = await fetch(`/api/projects/${slug}/integrations`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to update integrations");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["integrations", slug],
      });
    },
  });
}
