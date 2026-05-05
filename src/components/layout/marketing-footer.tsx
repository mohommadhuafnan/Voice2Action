import Link from "next/link";
import { appConfig } from "@/config/app";

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-12 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-semibold">{appConfig.name}</h3>
          <p className="mt-3 max-w-sm text-sm text-slate-400">{appConfig.description}</p>
        </div>

        <div className="text-sm text-slate-400">
          <p className="font-medium text-slate-200">Company</p>
          <div className="mt-3 space-y-2">
            <Link href="/about" className="block hover:text-white">About</Link>
            <Link href="/pricing" className="block hover:text-white">Pricing</Link>
            <Link href="/contact" className="block hover:text-white">Contact</Link>
          </div>
        </div>

        <div className="text-sm text-slate-400">
          <p className="font-medium text-slate-200">Support</p>
          <p className="mt-3">{appConfig.supportEmail}</p>
          <p className="mt-2 text-xs text-slate-500">Built for modern support operations.</p>
        </div>
      </div>
    </footer>
  );
}
