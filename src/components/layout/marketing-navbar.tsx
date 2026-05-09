"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useDictionary } from "@/components/i18n/language-provider";
import { appConfig } from "@/config/app";
import { marketingNavLinks } from "@/features/marketing/components/content";

export function MarketingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLElement>(null);
  const t = useDictionary();
  const marketingLabelByHref: Record<string, string> = {
    "/features": t.nav.features,
    "/about": t.nav.about,
    "/pricing": t.nav.pricing,
    "/contact": t.nav.contact,
  };

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = "";
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEscape);
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const closeIfOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (menuButtonRef.current?.contains(target)) {
        return;
      }
      if (menuPanelRef.current?.contains(target)) {
        return;
      }
      setMobileOpen(false);
    };

    document.addEventListener("pointerdown", closeIfOutside, true);
    return () => document.removeEventListener("pointerdown", closeIfOutside, true);
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl ${
        mobileOpen ? "z-[200]" : "z-50"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/20 text-slate-200 md:hidden"
            aria-expanded={mobileOpen}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="rounded-full bg-sky-500/20 px-2 py-1 text-xs text-sky-300">AI</span>
            <span>{appConfig.name}</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          {marketingNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-white"
            >
              {marketingLabelByHref[link.href] ?? link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <Link
            href="/sign-in"
            className="hidden h-9 items-center rounded-lg border border-white/15 px-3 text-xs text-slate-200 transition hover:border-sky-400/60 hover:text-white md:inline-flex"
          >
            {t.actions.login}
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-9 items-center rounded-lg bg-sky-500 px-3 text-xs font-medium text-white transition hover:bg-sky-400 sm:px-4 sm:text-sm"
          >
            {t.actions.getStarted}
          </Link>
        </div>
      </div>
      {mobileOpen ? (
        <div className="md:hidden">
          <div
            className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm"
            onPointerDown={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside
            ref={menuPanelRef}
            className="fixed left-0 top-0 z-[130] h-screen w-[78vw] max-w-sm border-r border-white/10 bg-slate-950 p-5 pt-20 shadow-2xl"
            onPointerDown={(event) => event.stopPropagation()}
          >
            <nav className="space-y-3 text-sm text-slate-100">
              {marketingNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-md px-2 py-2 hover:bg-white/5"
                  onClick={() => setMobileOpen(false)}
                >
                  {marketingLabelByHref[link.href] ?? link.label}
                </Link>
              ))}
              <Link
                href="/sign-in"
                className="block rounded-md border border-white/20 px-2 py-2"
                onClick={() => setMobileOpen(false)}
              >
                {t.actions.login}
              </Link>
              <Link
                href="/dashboard"
                className="block rounded-md bg-sky-500 px-2 py-2 text-white"
                onClick={() => setMobileOpen(false)}
              >
                {t.actions.getStarted}
              </Link>
            </nav>
          </aside>
        </div>
      ) : null}
    </header>
  );
}
