import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PlatformShell } from "@/components/layout/platform-shell";

export default async function PlatformLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <PlatformShell>{children}</PlatformShell>;
}
