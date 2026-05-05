"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Mic, Square, UploadCloud } from "lucide-react";
import { extractWaveformPeaks } from "@/lib/audio/waveform";
import { AudioWaveform } from "@/features/audio/components/audio-waveform";
import { useVoiceRecorder } from "@/features/audio/hooks/use-voice-recorder";

type UploadItem = {
  id: string;
  fileName: string;
  source: string;
  uploadedAt: string;
  durationSec: number | null;
  languageHint: string | null;
  publicUrl?: string | null;
  ticketId?: string | null;
  analysisStatus?: string;
};

type PipelineResult = {
  transcript: string;
  language: string;
  intent: string;
  sentiment: string;
  urgencyScore: number;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  entities: Record<string, string>;
  recommendedAction: string;
  ticketId: string;
  audioUploadId: string;
};

type LanguageOption = "auto" | "english" | "sinhala" | "tamil";

export function VoiceUploadStudio() {
  const recorder = useVoiceRecorder();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [peaks, setPeaks] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recentUploads, setRecentUploads] = useState<UploadItem[]>([]);
  const [latestResult, setLatestResult] = useState<PipelineResult | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>("auto");
  const transcriptBoxRef = useRef<HTMLDivElement | null>(null);

  const activeAudioBlob = useMemo(() => recorder.audioBlob, [recorder.audioBlob]);

  async function handleFileChange(file: File | null) {
    setSelectedFile(file);
    if (!file) {
      setPeaks([]);
      return;
    }

    try {
      const waveform = await extractWaveformPeaks(file);
      setPeaks(waveform);
    } catch {
      setPeaks([]);
      toast.error("Could not generate waveform for this file.");
    }
  }

  async function handleUseRecordingWaveform() {
    if (!recorder.audioBlob) {
      return;
    }

    try {
      const recordedFile = new File([recorder.audioBlob], `recording-${Date.now()}.webm`, {
        type: recorder.audioBlob.type || "audio/webm",
      });
      const waveform = await extractWaveformPeaks(recordedFile);
      setPeaks(waveform);
    } catch {
      setPeaks([]);
      toast.error("Could not generate waveform for this recording.");
    }
  }

  async function fetchRecentUploads() {
    const response = await fetch("/api/voice/uploads", { cache: "no-store" });
    if (!response.ok) {
      return;
    }
    const json = (await response.json()) as { uploads: UploadItem[] };
    setRecentUploads(json.uploads);
  }

  async function submitAudio(source: "BROWSER_RECORDING" | "FILE_UPLOAD") {
    const fileFromRecorder =
      source === "BROWSER_RECORDING" && activeAudioBlob
        ? new File([activeAudioBlob], `recording-${Date.now()}.webm`, {
            type: activeAudioBlob.type || "audio/webm",
          })
        : null;

    const uploadFile = source === "FILE_UPLOAD" ? selectedFile : fileFromRecorder;

    if (!uploadFile) {
      toast.error("Please record or select an audio file.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("audio", uploadFile);
      formData.append("source", source);
      formData.append("language", selectedLanguage);
      if (source === "BROWSER_RECORDING") {
        const transcriptHint = `${recorder.finalTranscript} ${recorder.liveTranscript}`.trim();
        if (transcriptHint) {
          formData.append("transcriptHint", transcriptHint);
        }
      }

      if (recorder.elapsedSec > 0) {
        formData.append("durationSec", String(recorder.elapsedSec));
      }

      if (peaks.length > 0) {
        formData.append("waveform", JSON.stringify(peaks));
      }

      const response = await fetch("/api/voice/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = (await response.json()) as { error?: string };
        throw new Error(err.error ?? "Upload failed.");
      }

      toast.success("Audio uploaded successfully.");
      setSelectedFile(null);
      setLatestResult(null);
      await fetchRecentUploads();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function processUpload(audioUploadId: string) {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/voice/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioUploadId, language: selectedLanguage }),
      });

      if (!response.ok) {
        const err = (await response.json()) as { error?: string };
        throw new Error(err.error ?? "AI processing failed.");
      }

      const data = (await response.json()) as { result: PipelineResult };
      setLatestResult(data.result);
      toast.success("AI workflow generated successfully.");
      await fetchRecentUploads();
    } catch (error) {
      const message = error instanceof Error ? error.message : "AI processing failed.";
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  }

  async function deleteUpload(audioUploadId: string) {
    try {
      const response = await fetch(`/api/voice/uploads/${audioUploadId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const err = (await response.json()) as { error?: string };
        throw new Error(err.error ?? "Delete failed.");
      }

      if (latestResult?.audioUploadId === audioUploadId) {
        setLatestResult(null);
      }

      toast.success("Audio upload deleted.");
      await fetchRecentUploads();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Delete failed.";
      toast.error(message);
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      void fetchRecentUploads();
    });
  }, []);

  useEffect(() => {
    const node = transcriptBoxRef.current;
    if (!node) {
      return;
    }
    node.scrollTop = node.scrollHeight;
  }, [recorder.finalTranscript, recorder.liveTranscript]);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white">Record in browser</h2>
          <p className="mt-2 text-sm text-slate-300">
            Capture customer complaint audio directly using microphone access.
          </p>

          <div className="mt-4">
            <label className="text-xs text-slate-400">Transcription language</label>
            <select
              value={selectedLanguage}
              onChange={(event) => {
                setSelectedLanguage(event.target.value as LanguageOption);
              }}
              className="mt-2 block w-full rounded-lg border border-white/20 bg-slate-900/70 px-3 py-2 text-sm text-slate-100"
            >
              <option value="auto">Auto detect</option>
              <option value="english">English</option>
              <option value="sinhala">Sinhala</option>
              <option value="tamil">Tamil</option>
            </select>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={recorder.startRecording}
              disabled={recorder.state === "recording"}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              <Mic className="h-4 w-4" />
              Start
            </button>
            <button
              type="button"
              onClick={recorder.stopRecording}
              disabled={recorder.state !== "recording"}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm text-slate-100 disabled:opacity-50"
            >
              <Square className="h-4 w-4" />
              Stop
            </button>
            <span className="text-sm text-slate-400">{recorder.elapsedSec}s</span>
          </div>

          {recorder.error ? <p className="mt-3 text-sm text-rose-300">{recorder.error}</p> : null}

          {recorder.audioUrl ? (
            <audio className="mt-4 w-full" controls src={recorder.audioUrl} />
          ) : null}

          {recorder.state === "recording" || recorder.finalTranscript || recorder.liveTranscript ? (
            <div className="mt-4 rounded-xl border border-white/10 bg-slate-900/60 p-3">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Live speech text</p>
              <p
                ref={transcriptBoxRef}
                className="mt-2 max-h-28 overflow-y-auto whitespace-pre-wrap text-sm text-slate-200"
              >
                {`${recorder.finalTranscript} ${recorder.liveTranscript}`.trim() || "Listening..."}
              </p>
            </div>
          ) : null}

          <button
            type="button"
            onClick={handleUseRecordingWaveform}
            disabled={!recorder.audioBlob}
            className="mt-4 rounded-xl border border-white/20 px-4 py-2 text-sm text-slate-100 disabled:opacity-50"
          >
            Generate waveform from recording
          </button>

          <button
            type="button"
            disabled={isSubmitting || !recorder.audioBlob}
            onClick={() => submitAudio("BROWSER_RECORDING")}
            className="mt-4 block rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Upload recording
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white">Upload audio file</h2>
          <p className="mt-2 text-sm text-slate-300">Upload MP3, WAV, OGG, M4A, or WEBM files.</p>

          <label className="mt-5 block rounded-xl border border-dashed border-white/20 bg-slate-900/70 p-4 text-sm text-slate-300">
            <span className="inline-flex items-center gap-2">
              <UploadCloud className="h-4 w-4" />
              Select audio file
            </span>
            <input
              type="file"
              accept="audio/*"
              className="mt-3 block w-full text-sm"
              onChange={(event) => {
                void handleFileChange(event.target.files?.[0] ?? null);
              }}
            />
          </label>

          <button
            type="button"
            disabled={isSubmitting || !selectedFile}
            onClick={() => submitAudio("FILE_UPLOAD")}
            className="mt-4 rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Upload file
          </button>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Waveform preview</h3>
        <AudioWaveform peaks={peaks} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Recent uploads</h3>
          <button
            type="button"
            onClick={() => {
              void fetchRecentUploads();
            }}
            className="rounded-lg border border-white/20 px-3 py-1.5 text-sm text-slate-100"
          >
            Refresh
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {recentUploads.length === 0 ? (
            <p className="text-sm text-slate-400">No uploads yet. Upload your first complaint audio.</p>
          ) : (
            recentUploads.map((item) => (
              <div key={item.id} className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
                <p className="text-sm font-medium text-white">{item.fileName}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {item.source} | {item.durationSec ?? "-"}s | {new Date(item.uploadedAt).toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-slate-500">Analysis: {item.analysisStatus ?? "PENDING"}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => {
                      void processUpload(item.id);
                    }}
                    className="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                  >
                    {isProcessing ? "Processing..." : "Run AI Pipeline"}
                  </button>
                  {item.publicUrl ? (
                    <a
                      href={item.publicUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-medium text-slate-100"
                    >
                      Listen
                    </a>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => {
                      void deleteUpload(item.id);
                    }}
                    className="rounded-lg border border-rose-400/30 px-3 py-1.5 text-xs font-medium text-rose-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {latestResult ? (
        <section className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-6">
          <h3 className="text-lg font-semibold text-white">Latest structured output</h3>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-950/80 p-4 text-xs text-emerald-100">
            {JSON.stringify(latestResult, null, 2)}
          </pre>
        </section>
      ) : null}
    </div>
  );
}
