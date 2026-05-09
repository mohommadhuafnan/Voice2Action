"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Item = {
  href: string;
  label: string;
};

const HEADER_SELECTOR = "[data-platform-shell-header]";

const Z_MENU_SCRIM = 2_147_483_000;
const Z_MENU_DRAWER = 2_147_483_001;
const Z_MENU_TOPBAR = 2_147_483_002;

export function PlatformMobileMenu({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>(HEADER_SELECTOR);
    if (!header) {
      return;
    }

    if (open) {
      header.classList.add("relative");
      header.style.zIndex = String(Z_MENU_TOPBAR);
    } else {
      header.classList.remove("relative");
      header.style.zIndex = "";
    }

    return () => {
      header.classList.remove("relative");
      header.style.zIndex = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const closeIfOutside = (event: Event) => {
      const path = event.composedPath();
      if (panelRef.current && path.includes(panelRef.current)) {
        return;
      }
      if (buttonRef.current && path.includes(buttonRef.current)) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
    };

    document.addEventListener("pointerdown", closeIfOutside, true);
    document.addEventListener("touchstart", closeIfOutside, true);
    return () => {
      document.removeEventListener("pointerdown", closeIfOutside, true);
      document.removeEventListener("touchstart", closeIfOutside, true);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/20 text-slate-200"
        aria-expanded={open}
        aria-label="Toggle mobile menu"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {open && mounted
        ? createPortal(
            <>
              <div
                className="pointer-events-none fixed inset-0 bg-black/75 backdrop-blur-sm"
                style={{ zIndex: Z_MENU_SCRIM }}
                aria-hidden
              />
              <aside
                ref={panelRef}
                className="fixed left-0 top-0 flex h-screen w-[78vw] max-w-sm touch-manipulation flex-col border-r border-white/10 bg-slate-950 p-5 pt-20 shadow-2xl"
                style={{ zIndex: Z_MENU_DRAWER }}
              >
                <nav className="space-y-2 text-sm text-slate-100">
                  {items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-md px-2 py-2 hover:bg-white/5"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </aside>
            </>,
            document.body,
          )
        : null}
    </div>
  );
}
