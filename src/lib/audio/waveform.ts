export async function extractWaveformPeaks(file: File, bars = 48): Promise<number[]> {
  const context = new AudioContext();

  try {
    const buffer = await file.arrayBuffer();
    const audioBuffer = await context.decodeAudioData(buffer.slice(0));
    const data = audioBuffer.getChannelData(0);
    const blockSize = Math.floor(data.length / bars);
    const peaks: number[] = [];

    for (let i = 0; i < bars; i += 1) {
      let sum = 0;
      const start = i * blockSize;
      const end = Math.min(start + blockSize, data.length);

      for (let j = start; j < end; j += 1) {
        sum += Math.abs(data[j]);
      }

      peaks.push(Number((sum / Math.max(1, end - start)).toFixed(4)));
    }

    return peaks;
  } finally {
    await context.close();
  }
}
