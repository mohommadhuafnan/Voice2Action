"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type RecorderState = "idle" | "recording" | "stopped";
type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: {
      transcript: string;
    };
  }>;
};

type StartRecordingOptions = {
  language?: string;
};

export function useVoiceRecorder() {
  const [state, setState] = useState<RecorderState>("idle");
  const [elapsedSec, setElapsedSec] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speechStatus, setSpeechStatus] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const speechRef = useRef<SpeechRecognitionLike | null>(null);
  const speechStartedRef = useRef(false);

  const audioUrl = useMemo(() => {
    if (!audioBlob) {
      return null;
    }
    return URL.createObjectURL(audioBlob);
  }, [audioBlob]);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      speechRef.current?.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [audioUrl]);

  const startRecording = useCallback(async (options?: StartRecordingOptions) => {
    try {
      setError(null);
      setAudioBlob(null);
      setElapsedSec(0);
      setLiveTranscript("");
      setFinalTranscript("");
      setSpeechStatus(null);
      speechStartedRef.current = false;
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4";
      const recorder = new MediaRecorder(stream, { mimeType });

      streamRef.current = stream;
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        setAudioBlob(blob);
        setState("stopped");
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        speechRef.current?.stop();
        streamRef.current?.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setState("recording");

      timerRef.current = setInterval(() => {
        setElapsedSec((prev) => prev + 1);
      }, 1000);

      const SpeechCtor = (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition
        ?? (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;

      if (SpeechCtor) {
        setSpeechSupported(true);
        const speech = new SpeechCtor();
        speech.continuous = true;
        speech.interimResults = true;
        const preferredLanguage =
          options?.language && options.language !== "auto"
            ? options.language
            : navigator.languages?.[0] ?? navigator.language ?? "en-US";
        speech.lang = preferredLanguage;
        speech.onresult = (event) => {
          speechStartedRef.current = true;
          let interim = "";
          let finalized = "";
          for (let i = event.resultIndex; i < event.results.length; i += 1) {
            const transcript = event.results[i][0]?.transcript ?? "";
            if (event.results[i].isFinal) {
              finalized += transcript;
            } else {
              interim += transcript;
            }
          }
          if (finalized) {
            setFinalTranscript((prev) => `${prev} ${finalized}`.trim());
          }
          setLiveTranscript(interim);
        };
        speech.onerror = (event) => {
          const reason = event.error ?? "unknown";
          if (reason === "no-speech" || reason === "aborted") {
            // Keep trying while user is recording; this is common on some browsers.
            return;
          }
          if (reason === "language-not-supported") {
            setSpeechStatus("Selected language is not supported by this browser. Falling back to English.");
            speech.lang = "en-US";
            try {
              speech.start();
            } catch {
              // Ignore restart errors.
            }
            return;
          }
          setSpeechStatus(`Live speech typing is unavailable (${reason}). Recording still works.`);
        };
        speech.onend = () => {
          if (recorderRef.current?.state === "recording") {
            try {
              speech.start();
            } catch {
              // Ignore restart errors.
            }
          }
        };
        speechRef.current = speech;
        try {
          speech.start();
        } catch {
          setSpeechStatus("Live speech typing could not start in this browser.");
          // Ignore startup errors; recorder still works.
        }
        setTimeout(() => {
          if (recorderRef.current?.state === "recording" && !speechStartedRef.current) {
            setSpeechStatus("Live typing did not detect speech yet. Speak louder or switch browser to Chrome/Edge.");
          }
        }, 4000);
      } else {
        setSpeechSupported(false);
        setSpeechStatus("Live speech typing is not supported in this browser. Recording still works.");
      }
    } catch {
      setError("Microphone access denied or unavailable.");
      setState("idle");
    }
  }, []);

  const stopRecording = useCallback(() => {
    speechRef.current?.stop();
    recorderRef.current?.stop();
  }, []);

  return {
    state,
    elapsedSec,
    audioBlob,
    audioUrl,
    error,
    liveTranscript,
    finalTranscript,
    speechSupported,
    speechStatus,
    startRecording,
    stopRecording,
  };
}
