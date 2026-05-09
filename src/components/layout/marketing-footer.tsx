import Link from "next/link";
import { cookies } from "next/headers";
import { appConfig } from "@/config/app";
import { getDictionary } from "@/lib/i18n/dictionary";
import { languageCookieName } from "@/lib/i18n/config";
import { normalizeLanguage } from "@/lib/i18n/resolve-language";

export async function MarketingFooter() {
  const cookieStore = await cookies();
  const language = normalizeLanguage(cookieStore.get(languageCookieName)?.value);
  const t = getDictionary(language);

  return (
    <footer className="border-t border-white/10 bg-slate-950/80">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-12 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-semibold">{appConfig.name}</h3>
          <p className="mt-3 max-w-sm text-sm text-slate-400">{appConfig.description}</p>
        </div>

        <div className="text-sm text-slate-400">
          <p className="font-medium text-slate-200">{t.footer.company}</p>
          <div className="mt-3 space-y-2">
            <Link href="/about" className="block hover:text-white">{t.nav.about}</Link>
            <Link href="/pricing" className="block hover:text-white">{t.nav.pricing}</Link>
            <Link href="/contact" className="block hover:text-white">{t.nav.contact}</Link>
          </div>
        </div>

        <div className="text-sm text-slate-400">
          <p className="font-medium text-slate-200">{t.footer.support}</p>
          <p className="mt-3">{appConfig.supportEmail}</p>
          <p className="mt-2 text-xs text-slate-500">{t.footer.builtForSupport}</p>
        </div>
      </div>
    </footer>
  );
}
