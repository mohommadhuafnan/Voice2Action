import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { SystemRole } from "@prisma/client";
import { notFound } from "next/navigation";
import { TicketStatusBadge } from "@/features/dashboard/components/ticket-status-badge";
import { TicketActionsPanel } from "@/features/tickets/components/ticket-actions-panel";
import { db } from "@/server/db/client";
import { getUserByClerkId } from "@/server/services/ticket-automation";

export default async function TicketDetailPage({
  params,
}: Readonly<{
  params: Promise<{ ticketId: string }>;
}>) {
  const { ticketId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const currentUser = await getUserByClerkId(userId);

  if (!currentUser) {
    return null;
  }

  const ticket = await db.ticket.findUnique({
    where: { id: ticketId },
    include: {
      reporter: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
      assignee: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
      audioUploads: {
        orderBy: { uploadedAt: "desc" },
        take: 5,
        select: {
          id: true,
          fileName: true,
          publicUrl: true,
          uploadedAt: true,
          durationSec: true,
        },
      },
      aiAnalyses: {
        orderBy: { createdAt: "desc" },
        take: 3,
        select: {
          id: true,
          status: true,
          transcript: true,
          language: true,
          intent: true,
          sentiment: true,
          urgencyScore: true,
          priority: true,
          entities: true,
          recommendedAction: true,
          confidence: true,
          modelVersion: true,
          errorMessage: true,
          processedAt: true,
          createdAt: true,
        },
      },
      messages: {
        orderBy: { createdAt: "asc" },
        include: {
          sender: {
            select: { firstName: true, lastName: true },
          },
        },
      },
    },
  });

  if (!ticket) {
    notFound();
  }

  const canView =
    currentUser.role === SystemRole.ADMIN ||
    ticket.reporterId === currentUser.id ||
    ticket.assigneeId === currentUser.id;

  if (!canView) {
    notFound();
  }

  const showInternalMessages =
    currentUser.role === SystemRole.ADMIN ||
    (currentUser.role === SystemRole.SUPPORT_AGENT && ticket.assigneeId === currentUser.id);

  const messagesToShow = showInternalMessages
    ? ticket.messages
    : ticket.messages.filter((m) => !m.isInternal);

  const backHref =
    currentUser.role === SystemRole.ADMIN
      ? "/admin/dashboard"
      : currentUser.role === SystemRole.SUPPORT_AGENT
        ? "/agent/dashboard"
        : "/dashboard";

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href={backHref}
            className="text-sm text-sky-400 hover:text-sky-300"
          >
            ← Back to dashboard
          </Link>
          <p className="mt-3 text-sm uppercase tracking-[0.2em] text-sky-300">Complaint ticket</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">{ticket.ticketNo}</h1>
          <p className="mt-2 text-lg text-slate-200">{ticket.title}</p>
        </div>
        <TicketStatusBadge status={ticket.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white">Description</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
              {ticket.description}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white">AI analysis</h2>
            {ticket.aiAnalyses.length === 0 ? (
              <p className="mt-3 text-sm text-slate-400">No AI analysis linked yet.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {ticket.aiAnalyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    className="rounded-xl border border-white/10 bg-slate-900/60 p-4 text-sm"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span>Status: {analysis.status}</span>
                      {analysis.modelVersion ? (
                        <span className="text-slate-500">· {analysis.modelVersion}</span>
                      ) : null}
                    </div>
                    {analysis.status === "FAILED" && analysis.errorMessage ? (
                      <p className="mt-2 text-rose-300">{analysis.errorMessage}</p>
                    ) : null}
                    <p className="mt-3 text-slate-200">{analysis.transcript}</p>
                    <dl className="mt-3 grid gap-2 text-xs text-slate-400 sm:grid-cols-2">
                      <div>
                        Language: <span className="text-slate-300">{analysis.language}</span>
                      </div>
                      <div>
                        Intent: <span className="text-slate-300">{analysis.intent}</span>
                      </div>
                      <div>
                        Sentiment: <span className="text-slate-300">{analysis.sentiment}</span>
                      </div>
                      <div>
                        Priority: <span className="text-slate-300">{analysis.priority}</span>
                      </div>
                      <div className="sm:col-span-2">
                        Recommended:{" "}
                        <span className="text-slate-300">{analysis.recommendedAction}</span>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white">Timeline</h2>
            {messagesToShow.length === 0 ? (
              <p className="mt-3 text-sm text-slate-400">No messages yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {messagesToShow.map((msg) => (
                  <li
                    key={msg.id}
                    className="rounded-xl border border-white/10 bg-slate-900/50 p-3 text-sm"
                  >
                    <div className="flex flex-wrap justify-between gap-2 text-xs text-slate-500">
                      <span>
                        {msg.sender.firstName} {msg.sender.lastName}
                        {msg.isInternal ? (
                          <span className="ml-2 rounded bg-amber-500/20 px-1.5 py-0.5 text-amber-200">
                            Internal
                          </span>
                        ) : null}
                      </span>
                      <span>{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="mt-2 text-slate-300">{msg.content}</p>
                    <p className="mt-1 text-xs text-slate-500">{msg.type.replace(/_/g, " ")}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <TicketActionsPanel
            ticketId={ticket.id}
            currentStatus={ticket.status}
            canInternalNote={showInternalMessages}
          />

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white">Details</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-2 text-slate-400">
                <dt>Category</dt>
                <dd className="text-slate-200">{ticket.category}</dd>
              </div>
              <div className="flex justify-between gap-2 text-slate-400">
                <dt>Priority</dt>
                <dd className="text-slate-200">{ticket.priority}</dd>
              </div>
              <div className="flex justify-between gap-2 text-slate-400">
                <dt>Channel</dt>
                <dd className="text-slate-200">{ticket.channel}</dd>
              </div>
              <div className="flex justify-between gap-2 text-slate-400">
                <dt>Language</dt>
                <dd className="text-slate-200">{ticket.language}</dd>
              </div>
              {ticket.intent ? (
                <div className="flex justify-between gap-2 text-slate-400">
                  <dt>Intent</dt>
                  <dd className="text-slate-200">{ticket.intent}</dd>
                </div>
              ) : null}
              {ticket.sentiment ? (
                <div className="flex justify-between gap-2 text-slate-400">
                  <dt>Sentiment</dt>
                  <dd className="text-slate-200">{ticket.sentiment}</dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-2 text-slate-400">
                <dt>Urgency</dt>
                <dd className="text-slate-200">{ticket.urgencyScore.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between gap-2 text-slate-400">
                <dt>Reporter</dt>
                <dd className="text-right text-slate-200">
                  {ticket.reporter.firstName} {ticket.reporter.lastName}
                </dd>
              </div>
              <div className="flex justify-between gap-2 text-slate-400">
                <dt>Assignee</dt>
                <dd className="text-right text-slate-200">
                  {ticket.assignee
                    ? `${ticket.assignee.firstName} ${ticket.assignee.lastName}`
                    : "Unassigned"}
                </dd>
              </div>
              <div className="flex justify-between gap-2 text-slate-400">
                <dt>Created</dt>
                <dd className="text-slate-200">{ticket.createdAt.toLocaleString()}</dd>
              </div>
              {ticket.dueAt ? (
                <div className="flex justify-between gap-2 text-slate-400">
                  <dt>Due</dt>
                  <dd className="text-slate-200">{ticket.dueAt.toLocaleString()}</dd>
                </div>
              ) : null}
            </dl>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white">Audio</h2>
            {ticket.audioUploads.length === 0 ? (
              <p className="mt-3 text-sm text-slate-400">No audio files attached.</p>
            ) : (
              <ul className="mt-3 space-y-3 text-sm">
                {ticket.audioUploads.map((audio) => (
                  <li key={audio.id} className="text-slate-300">
                    <p className="font-medium text-white">{audio.fileName}</p>
                    <p className="text-xs text-slate-500">
                      {audio.durationSec != null ? `${audio.durationSec}s · ` : null}
                      {new Date(audio.uploadedAt).toLocaleString()}
                    </p>
                    {audio.publicUrl ? (
                      <audio className="mt-2 w-full" controls preload="none" src={audio.publicUrl} />
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
