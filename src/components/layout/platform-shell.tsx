import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { getCurrentUserRole } from "@/lib/auth/get-user-role";

const links = [
  { href: "/dashboard", label: "User Dashboard", roles: ["USER", "SUPPORT_AGENT", "ADMIN"] },
  { href: "/voice", label: "Voice Upload", roles: ["USER", "SUPPORT_AGENT", "ADMIN"] },
  { href: "/analytics", label: "Analytics", roles: ["USER", "SUPPORT_AGENT", "ADMIN"] },
  { href: "/notifications", label: "Notifications", roles: ["USER", "SUPPORT_AGENT", "ADMIN"] },
  { href: "/agent/dashboard", label: "Agent Dashboard", roles: ["SUPPORT_AGENT", "ADMIN"] },
  { href: "/admin/dashboard", label: "Admin Dashboard", roles: ["ADMIN"] },
  { href: "/settings", label: "Settings", roles: ["USER", "SUPPORT_AGENT", "ADMIN"] },
];

export async function PlatformShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const { userId } = await auth();
  const role = userId ? await getCurrentUserRole() : null;
  const visibleLinks = links.filter((item) => !role || item.roles.includes(role));

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
          <Link href="/" className="font-semibold text-white">
            Voice2Action
          </Link>
          <nav className="hidden gap-5 text-sm text-slate-300 md:flex">
            {visibleLinks.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>
          <UserButton />
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}
