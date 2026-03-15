import { Brain } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        {/* ── Logo ──────────────────────────── */}
        <a href="/" className="flex items-center gap-2 select-none">
          <Brain className="h-6 w-6 text-brand-600" />
          <span className="text-lg font-bold tracking-tight text-gray-900">
            PilihPintar<span className="text-brand-600">.ai</span>
          </span>
        </a>
      </div>
    </nav>
  );
}
