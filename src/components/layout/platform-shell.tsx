import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { PlatformMobileMenu } from "@/components/layout/platform-mobile-menu";
import { getCurrentUserRole } from "@/lib/auth/get-user-role";
import { getDictionary } from "@/lib/i18n/dictionary";
import { languageCookieName } from "@/lib/i18n/config";
import { normalizeLanguage } from "@/lib/i18n/resolve-language";

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
  const cookieStore = await cookies();
  const language = normalizeLanguage(cookieStore.get(languageCookieName)?.value);
  const t = getDictionary(language);

  const visibleLinks = links.filter((item) => !role || item.roles.includes(role));
  const platformLabelByHref: Record<string, string> = {
    "/dashboard": t.nav.dashboard,
    "/voice": t.nav.voiceUpload,
    "/analytics": t.nav.analytics,
    "/notifications": t.nav.notifications,
    "/agent/dashboard": t.nav.agentDashboard,
    "/admin/dashboard": t.nav.adminDashboard,
    "/settings": t.nav.settings,
  };
  const mobileMenuItems = visibleLinks.map((item) => ({
    href: item.href,
    label: platformLabelByHref[item.href] ?? item.label,
  }));

  return (
    <div className="min-h-screen">
      <header
        data-platform-shell-header
        className="border-b border-white/10 bg-slate-950/90 backdrop-blur"
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <PlatformMobileMenu items={mobileMenuItems} />
            <Link href="/" className="font-semibold text-white">
              Voice2Action
            </Link>
          </div>
          <nav className="hidden gap-5 text-sm text-slate-300 md:flex">
            {visibleLinks.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-white">
                {platformLabelByHref[item.href] ?? item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <UserButton />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}
