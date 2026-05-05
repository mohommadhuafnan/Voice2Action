import Link from "next/link";
import { appConfig } from "@/config/app";
import { marketingNavLinks } from "@/features/marketing/components/content";

export function MarketingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="rounded-full bg-sky-500/20 px-2 py-1 text-xs text-sky-300">AI</span>
          <span>{appConfig.name}</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          {marketingNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="hidden rounded-lg border border-white/15 px-3 py-2 text-sm text-slate-200 transition hover:border-sky-400/60 hover:text-white sm:inline-flex"
          >
            Log in
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-400"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
