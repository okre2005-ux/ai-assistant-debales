import Link from "next/link";

export default function AccessDeniedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080b12] px-6 text-white">
      <div className="w-full max-w-lg rounded-xl border border-red-400/20 bg-red-400/10 p-8 text-center shadow-2xl shadow-black/30">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-300 text-2xl font-bold text-slate-950">
          !
        </div>

        <h1 className="mt-6 text-3xl font-semibold">Access denied</h1>

        <p className="mt-3 leading-7 text-red-100">
          Admin dashboard access is restricted to project admins only. Your
          current demo user does not have permission to open this area.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="rounded-lg bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-200"
          >
            Switch user
          </Link>

          <Link
            href="/projects/debales-demo/chat"
            className="rounded-lg border border-white/15 px-5 py-3 font-semibold text-white hover:bg-white/10"
          >
            Back to chat
          </Link>
        </div>
      </div>
    </main>
  );
}
