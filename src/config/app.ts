export const appConfig = {
  name: "Voice2Action",
  description:
    "Multilingual AI-powered voice-to-workflow automation for support operations.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  supportEmail: "support@voice2action.ai",
} as const;

export type AppConfig = typeof appConfig;
