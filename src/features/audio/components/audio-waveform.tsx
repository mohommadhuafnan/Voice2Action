"use client";

type Props = {
  peaks: number[];
};

export function AudioWaveform({ peaks }: Props) {
  if (peaks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/15 bg-slate-900/60 p-4 text-sm text-slate-400">
        Waveform preview will appear after recording or selecting an audio file.
      </div>
    );
  }

  return (
    <div className="flex h-24 items-end gap-1 rounded-xl border border-white/10 bg-slate-900/60 p-3">
      {peaks.map((value, idx) => (
        <span
          key={`${idx}-${value}`}
          className="w-full rounded-sm bg-sky-400/90"
          style={{ height: `${Math.max(6, Math.min(100, Math.round(value * 120)))}%` }}
        />
      ))}
    </div>
  );
}
