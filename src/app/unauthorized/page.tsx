import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-2xl border border-red-400/20 bg-red-500/10 p-8 text-center">
        <h1 className="text-3xl font-semibold text-white">Access denied</h1>
        <p className="mt-3 text-slate-200">
          You do not have permission to view this section. Contact your admin if this is unexpected.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-400"
        >
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}