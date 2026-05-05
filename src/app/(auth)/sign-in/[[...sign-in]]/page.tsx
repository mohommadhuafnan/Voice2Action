import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign In | Voice2Action",
};

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <SignIn
        fallbackRedirectUrl="/dashboard"
        forceRedirectUrl="/dashboard"
        signUpForceRedirectUrl="/dashboard"
        appearance={{
          elements: {
            card: "bg-slate-900 border border-white/10 shadow-xl",
          },
        }}
      />
    </main>
  );
}