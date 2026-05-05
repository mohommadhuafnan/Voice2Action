import Link from "next/link";

export default function TicketNotFound() {
  return (
    <main className="mx-auto flex min-h-[40vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-semibold text-white">Ticket not found</h1>
      <p className="mt-3 text-slate-300">
        This ticket does not exist or you do not have access to view it.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-400"
      >
        Back to dashboard
      </Link>
    </main>
  );
}
