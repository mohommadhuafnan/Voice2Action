"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Item = {
  href: string;
  label: string;
};

const HEADER_SELECTOR = "[data-platform-shell-header]";

export function PlatformMobileMenu({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

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
      header.style.zIndex = "200";
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

    const closeIfOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target)) {
        return;
      }
      if (panelRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };

    document.addEventListener("pointerdown", closeIfOutside, true);
    return () => document.removeEventListener("pointerdown", closeIfOutside, true);
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

      {open ? (
        <>
          <div
            className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm"
            onPointerDown={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside
            ref={panelRef}
            className="fixed left-0 top-0 z-[130] h-screen w-[78vw] max-w-sm border-r border-white/10 bg-slate-950 p-5 pt-20 shadow-2xl"
            onPointerDown={(event) => event.stopPropagation()}
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
        </>
      ) : null}
    </div>
  );
}
