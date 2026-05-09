type SupportedLang = "en" | "si" | "ta";

type TemplateInput = {
  ticketNo: string;
  status?: string;
  recipientName?: string;
};

type LocalizedEmail = {
  subject: string;
  html: string;
  text: string;
};

function resolveLang(value: string | null | undefined): SupportedLang {
  if (value === "si" || value === "ta") {
    return value;
  }
  return "en";
}

export function buildTicketCreatedEmail(preferredLang: string | null | undefined, input: TemplateInput): LocalizedEmail {
  const lang = resolveLang(preferredLang);
  const name = input.recipientName?.trim() || "there";

  if (lang === "si") {
    return {
      subject: `ඔබගේ පැමිණිල්ල ලැබුණි - ${input.ticketNo}`,
      html: `<p>ආයුබෝවන් ${name},</p><p>ඔබගේ පැමිණිල්ල ${input.ticketNo} ටිකට් අංකයෙන් සාර්ථකව සටහන් විය.</p><p>අපි ඉක්මනින් යාවත්කාලීනයක් ලබාදෙන්නෙමු.</p>`,
      text: `ආයුබෝවන් ${name}, ඔබගේ පැමිණිල්ල ${input.ticketNo} ටිකට් අංකයෙන් සාර්ථකව සටහන් විය.`,
    };
  }

  if (lang === "ta") {
    return {
      subject: `உங்கள் புகார் பெறப்பட்டது - ${input.ticketNo}`,
      html: `<p>வணக்கம் ${name},</p><p>உங்கள் புகார் ${input.ticketNo} டிக்கெட்டாக வெற்றிகரமாக பதிவு செய்யப்பட்டது.</p><p>விரைவில் புதுப்பிப்பு வழங்கப்படும்.</p>`,
      text: `வணக்கம் ${name}, உங்கள் புகார் ${input.ticketNo} டிக்கெட்டாக பதிவு செய்யப்பட்டது.`,
    };
  }

  return {
    subject: `Your complaint was received - ${input.ticketNo}`,
    html: `<p>Hello ${name},</p><p>Your complaint has been recorded as ticket <strong>${input.ticketNo}</strong>.</p><p>We will send you an update soon.</p>`,
    text: `Hello ${name}, your complaint has been recorded as ticket ${input.ticketNo}.`,
  };
}

export function buildTicketUpdatedEmail(preferredLang: string | null | undefined, input: TemplateInput): LocalizedEmail {
  const lang = resolveLang(preferredLang);
  const status = input.status ?? "UPDATED";
  const name = input.recipientName?.trim() || "there";

  if (lang === "si") {
    return {
      subject: `ටිකට් යාවත්කාලීන විය - ${input.ticketNo}`,
      html: `<p>ආයුබෝවන් ${name},</p><p>${input.ticketNo} ටිකට් හි තත්ත්වය <strong>${status}</strong> බවට වෙනස් වී ඇත.</p>`,
      text: `ආයුබෝවන් ${name}, ${input.ticketNo} ටිකට් තත්ත්වය ${status} ලෙස යාවත්කාලීන විය.`,
    };
  }

  if (lang === "ta") {
    return {
      subject: `டிக்கெட் புதுப்பிப்பு - ${input.ticketNo}`,
      html: `<p>வணக்கம் ${name},</p><p>${input.ticketNo} டிக்கெட் நிலை <strong>${status}</strong> ஆக மாற்றப்பட்டுள்ளது.</p>`,
      text: `வணக்கம் ${name}, ${input.ticketNo} டிக்கெட் நிலை ${status} ஆக மாற்றப்பட்டது.`,
    };
  }

  return {
    subject: `Ticket updated - ${input.ticketNo}`,
    html: `<p>Hello ${name},</p><p>Your ticket <strong>${input.ticketNo}</strong> status has changed to <strong>${status}</strong>.</p>`,
    text: `Hello ${name}, your ticket ${input.ticketNo} status has changed to ${status}.`,
  };
}
