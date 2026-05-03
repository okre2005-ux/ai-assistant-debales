"use client";

import { useQuery } from "@tanstack/react-query";

export function useDashboardConfig(slug: string) {
  return useQuery({
    queryKey: ["dashboard-config", slug],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${slug}/admin/dashboard`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to load dashboard config");
      }

      return response.json();
    },
  });
}
