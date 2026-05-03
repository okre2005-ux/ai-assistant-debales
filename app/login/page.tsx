import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#080b12] px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-5xl items-center">
        <section className="grid w-full gap-8 lg:grid-cols-[1.1fr_420px]">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
              Multi-tenant AI assistant
            </div>

            <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-white">
              Debales AI Assistant
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              Demo workspace with project-based access, AI chat, integration
              toggles, and a MongoDB-driven admin dashboard.
            </p>

            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <p className="text-2xl font-semibold text-amber-300">2</p>
                <p className="mt-1 text-sm text-slate-400">Demo roles</p>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <p className="text-2xl font-semibold text-emerald-300">2</p>
                <p className="mt-1 text-sm text-slate-400">Integrations</p>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <p className="text-2xl font-semibold text-cyan-300">DB</p>
                <p className="mt-1 text-sm text-slate-400">Driven admin UI</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/30">
            <h2 className="text-2xl font-semibold">Choose demo access</h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Admin can manage dashboard and integrations. Member can use chat.
            </p>

            <div className="mt-6 space-y-3">
              <Link
                href="/api/auth/demo?role=admin"
                className="block w-full rounded-lg bg-cyan-300 px-4 py-3 text-center font-semibold text-slate-950 hover:bg-cyan-200"
              >
                Login as Admin
              </Link>

              <Link
                href="/api/auth/demo?role=member"
                className="block w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 py-3 text-center font-semibold text-white hover:border-amber-300/60 hover:bg-amber-300/10"
              >
                Login as Member
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
