import type { Metadata } from "next";
import { cookies } from "next/headers";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingNavbar } from "@/components/layout/marketing-navbar";
import { getDictionary } from "@/lib/i18n/dictionary";
import { languageCookieName } from "@/lib/i18n/config";
import { normalizeLanguage } from "@/lib/i18n/resolve-language";

export const metadata: Metadata = {
  title: "Contact | Voice2Action",
  description: "Contact the Voice2Action team for demos and enterprise onboarding.",
};

export default async function ContactPage() {
  const cookieStore = await cookies();
  const language = normalizeLanguage(cookieStore.get(languageCookieName)?.value);
  const t = getDictionary(language);

  return (
    <div className="min-h-screen">
      <MarketingNavbar />
      <main className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2">
        <section>
          <h1 className="text-4xl font-semibold text-white">{t.pages.contact.title}</h1>
          <p className="mt-4 text-slate-300">{t.pages.contact.subtitle}</p>
          <div className="mt-8 space-y-3 text-sm text-slate-300">
            <p>Email: support@voice2action.ai</p>
            <p>Phone: +94 11 555 2019</p>
            <p>Office: Colombo, Sri Lanka</p>
          </div>
        </section>
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <form className="space-y-4">
            <Field label={t.pages.contact.fullName} type="text" name="name" placeholder={t.pages.contact.yourName} />
            <Field label={t.pages.contact.workEmail} type="email" name="email" placeholder="you@company.com" />
            <Field label={t.pages.contact.company} type="text" name="company" placeholder={t.pages.contact.companyName} />
            <label className="block text-sm text-slate-200">
              {t.pages.contact.message}
              <textarea
                name="message"
                rows={5}
                className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none transition focus:border-sky-400"
                placeholder={t.pages.contact.workflowGoalsPlaceholder}
              />
            </label>
            <button
              type="submit"
              className="rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-400"
            >
              {t.pages.contact.sendMessage}
            </button>
          </form>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}

type FieldProps = {
  label: string;
  type: string;
  name: string;
  placeholder: string;
};

function Field({ label, type, name, placeholder }: FieldProps) {
  return (
    <label className="block text-sm text-slate-200">
      {label}
      <input
        type={type}
        name={name}
        className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none transition focus:border-sky-400"
        placeholder={placeholder}
      />
    </label>
  );
}
