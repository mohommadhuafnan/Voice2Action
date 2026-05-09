import { db } from "@/server/db/client";
import { buildTicketCreatedEmail, buildTicketUpdatedEmail } from "@/server/services/email-localization";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

async function sendViaResend(payload: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM;

  if (!apiKey || !emailFrom) {
    return;
  }

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: emailFrom,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    }),
  });
}

async function isEmailEnabled(userId: string): Promise<boolean> {
  const setting = await db.setting.findUnique({
    where: { userId_key: { userId, key: "notifications.email.enabled" } },
    select: { value: true },
  });

  if (!setting) {
    return true;
  }

  return setting.value !== false;
}

export async function sendTicketCreatedEmail(params: {
  userId: string;
  ticketNo: string;
  recipientName?: string;
}) {
  const user = await db.user.findUnique({
    where: { id: params.userId },
    select: { email: true, preferredLang: true },
  });

  if (!user) {
    return;
  }

  if (!(await isEmailEnabled(params.userId))) {
    return;
  }

  const content = buildTicketCreatedEmail(user.preferredLang, {
    ticketNo: params.ticketNo,
    recipientName: params.recipientName,
  });

  await sendViaResend({
    to: user.email,
    ...content,
  });
}

export async function sendTicketUpdatedEmail(params: {
  userId: string;
  ticketNo: string;
  status: string;
  recipientName?: string;
}) {
  const user = await db.user.findUnique({
    where: { id: params.userId },
    select: { email: true, preferredLang: true },
  });

  if (!user) {
    return;
  }

  if (!(await isEmailEnabled(params.userId))) {
    return;
  }

  const content = buildTicketUpdatedEmail(user.preferredLang, {
    ticketNo: params.ticketNo,
    status: params.status,
    recipientName: params.recipientName,
  });

  await sendViaResend({
    to: user.email,
    ...content,
  });
}
