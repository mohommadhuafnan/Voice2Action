import { VoiceUploadStudio } from "@/features/audio/components/voice-upload-studio";
import { cookies } from "next/headers";
import { getDictionary } from "@/lib/i18n/dictionary";
import { languageCookieName } from "@/lib/i18n/config";
import { normalizeLanguage } from "@/lib/i18n/resolve-language";

export default async function VoicePage() {
  const cookieStore = await cookies();
  const language = normalizeLanguage(cookieStore.get(languageCookieName)?.value);
  const t = getDictionary(language);

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-sky-300">Voice Intake</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">{t.voice.heading}</h1>
        <p className="mt-2 text-slate-300">{t.voice.subtitle}</p>
      </div>
      <VoiceUploadStudio />
    </section>
  );
}
