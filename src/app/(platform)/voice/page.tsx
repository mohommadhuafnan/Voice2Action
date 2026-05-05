import { VoiceUploadStudio } from "@/features/audio/components/voice-upload-studio";

export default function VoicePage() {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-sky-300">Voice Intake</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Record or upload complaint audio</h1>
        <p className="mt-2 text-slate-300">
          Submit multilingual complaint audio and preview waveform before sending it to the AI pipeline.
        </p>
      </div>
      <VoiceUploadStudio />
    </section>
  );
}
