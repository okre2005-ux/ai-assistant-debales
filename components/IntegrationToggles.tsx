"use client";

import {
  useIntegrations,
  useUpdateIntegrations,
} from "../hooks/useIntegrations";

type IntegrationTogglesProps = {
  slug: string;
};

export function IntegrationToggles({ slug }: IntegrationTogglesProps) {
  const { data, isLoading } = useIntegrations(slug);
  const updateIntegrations = useUpdateIntegrations(slug);

  const shopifyEnabled = data?.integrations?.shopify?.enabled ?? false;
  const crmEnabled = data?.integrations?.crm?.enabled ?? false;

  function updateToggle(nextValues: { shopify: boolean; crm: boolean }) {
    updateIntegrations.mutate(nextValues);
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 text-slate-400">
        Loading integrations...
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.05] p-5 shadow-lg shadow-black/10">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Connected systems
          </p>
          <h2 className="mt-2 text-xl font-semibold">Integration Control</h2>
        </div>

        {updateIntegrations.isPending && (
          <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-sm text-cyan-200">
            Saving...
          </span>
        )}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <IntegrationCard
          name="Shopify"
          description="Mock order and revenue context for sales answers."
          enabled={shopifyEnabled}
          onChange={(checked) =>
            updateToggle({
              shopify: checked,
              crm: crmEnabled,
            })
          }
          data={[
            "Order #1042 - Rs 12,400",
            "Order #1043 - Rs 8,250",
            "Abandoned cart - Rs 3,900",
          ]}
        />

        <IntegrationCard
          name="CRM"
          description="Mock lead and customer context for assistant replies."
          enabled={crmEnabled}
          onChange={(checked) =>
            updateToggle({
              shopify: shopifyEnabled,
              crm: checked,
            })
          }
          data={[
            "Lead: Ananya Sharma - Warm",
            "Lead: Rahul Mehta - Follow-up",
            "Customer: Priya Nair - Renewal",
          ]}
        />
      </div>

      {updateIntegrations.isError && (
        <p className="mt-4 rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">
          {updateIntegrations.error.message}
        </p>
      )}
    </div>
  );
}

type IntegrationCardProps = {
  name: string;
  description: string;
  enabled: boolean;
  onChange: (checked: boolean) => void;
  data: string[];
};

function IntegrationCard({
  name,
  description,
  enabled,
  onChange,
  data,
}: IntegrationCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/15 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={
                enabled
                  ? "h-2.5 w-2.5 rounded-full bg-emerald-300"
                  : "h-2.5 w-2.5 rounded-full bg-red-300"
              }
            />
            <h3 className="font-semibold">{name}</h3>
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            {description}
          </p>
        </div>

        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(event) => onChange(event.target.checked)}
            className="peer sr-only"
          />
          <span className="h-7 w-12 rounded-full bg-slate-700 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:bg-cyan-300 peer-checked:after:translate-x-5" />
        </label>
      </div>

      <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.03]">
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
            Sample data
          </p>
          <span
            className={
              enabled
                ? "text-xs font-medium text-emerald-300"
                : "text-xs font-medium text-red-300"
            }
          >
            {enabled ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="space-y-2 p-3">
          {enabled ? (
            data.map((item) => (
              <div
                key={item}
                className="rounded-md bg-white/[0.04] px-3 py-2 text-sm text-slate-300"
              >
                {item}
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">
              Enable {name} to include this mock data in assistant responses.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
