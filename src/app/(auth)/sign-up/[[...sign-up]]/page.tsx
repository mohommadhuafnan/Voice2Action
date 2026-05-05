import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign Up | Voice2Action",
};

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <SignUp
        fallbackRedirectUrl="/dashboard"
        forceRedirectUrl="/dashboard"
        signInForceRedirectUrl="/dashboard"
        appearance={{
          elements: {
            card: "bg-slate-900 border border-white/10 shadow-xl",
          },
        }}
      />
    </main>
  );
}