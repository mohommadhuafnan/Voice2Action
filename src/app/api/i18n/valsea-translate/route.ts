import { NextResponse } from "next/server";
import { z } from "zod";
import { translateEnglishToValseaTarget } from "@/lib/ai/valsea-client";

const bodySchema = z.object({
  text: z.string().min(1).max(8000),
  target: z.enum(["ta", "si"]),
});

/** Server-side ValSea EN → Tamil/Sinhala for dynamic copy (forms, CMS, future UI). */
export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const { text, target } = parsed.data;
  const targetLanguage = target === "ta" ? "tamil" : "sinhala";
  const translated = await translateEnglishToValseaTarget(text, targetLanguage);
  return NextResponse.json({ translated });
}
