import { z } from "zod";
import { fail, ok } from "@/lib/http/api-response";
import { requireCurrentUser } from "@/server/auth/require-current-user";
import { getUserSettings, updateUserSettings } from "@/server/services/settings";

const settingsSchema = z.object({
  timezone: z.string().min(2),
  preferredLang: z.string().min(2),
  emailNotifications: z.boolean(),
  inAppNotifications: z.boolean(),
  darkMode: z.boolean(),
});

export async function GET() {
  const { error, user } = await requireCurrentUser();

  if (error || !user) {
    return error ?? fail("Unauthorized.", 401);
  }

  const settings = await getUserSettings(user.id);

  return ok({ settings });
}

export async function PATCH(request: Request) {
  const { error, user } = await requireCurrentUser();

  if (error || !user) {
    return error ?? fail("Unauthorized.", 401);
  }

  const body = await request.json();
  const parsed = settingsSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Invalid settings payload.", 400, parsed.error.flatten());
  }

  const updated = await updateUserSettings(user.id, parsed.data);

  return ok({ settings: updated });
}
