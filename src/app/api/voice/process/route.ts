import { fail, ok } from "@/lib/http/api-response";
import { db } from "@/server/db/client";
import { requireCurrentUser } from "@/server/auth/require-current-user";
import { processAudioUpload } from "@/server/pipeline/process-audio-upload";
import { isRateLimited } from "@/server/security/rate-limit";
import { pipelineResultSchema } from "@/types/ai";

export async function POST(request: Request) {
  try {
    const { error, user } = await requireCurrentUser();

    if (error || !user) {
      return error ?? fail("Unauthorized.", 401);
    }

    if (isRateLimited(`voice:process:${user.id}`, 15, 60_000)) {
      return fail("Rate limit exceeded. Try again in a minute.", 429);
    }

    const body = (await request.json()) as {
      audioUploadId?: string;
      language?: "auto" | "english" | "sinhala" | "tamil";
    };

    if (!body.audioUploadId) {
      return fail("audioUploadId is required.", 400);
    }

    const upload = await db.audioUpload.findUnique({
      where: { id: body.audioUploadId },
      select: { id: true, userId: true },
    });

    if (!upload || upload.userId !== user.id) {
      return fail("Audio upload not found.", 404);
    }

    const pipelineResult = await processAudioUpload(upload.id, body.language);
    const parsed = pipelineResultSchema.parse(pipelineResult);

    return ok({ result: parsed }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI pipeline failed.";
    return fail(message, 500);
  }
}
