import { Tag, Wallet, Sparkles, Clock, RotateCcw, SearchX } from "lucide-react";
import ProductCard from "./ProductCard";

export default function ResultArea({ products, intent, responseTime, onReset }) {
  if (!products || products.length === 0) {
    return (
      <section className="mx-auto w-full max-w-2xl px-4 py-16 text-center animate-fade-in-up">
        <SearchX className="mx-auto mb-4 h-12 w-12 text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-700">
          Tidak ada rekomendasi ditemukan
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          AI belum menemukan produk yang cocok. Coba deskripsikan kebutuhanmu
          lebih detail, misalnya budget, fitur, atau merek yang disukai.
        </p>
        <button
          onClick={onReset}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-brand-700"
        >
          <RotateCcw className="h-4 w-4" />
          Cari Lagi
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-4 sm:px-6">
      {/* ── Intent Summary ─────────────────────── */}
      {intent && (
        <div className="mx-auto mb-6 flex max-w-2xl animate-fade-in-up flex-wrap items-center justify-center gap-2">
          {intent.category && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
              <Tag className="h-3 w-3" />
              {intent.category}
            </span>
          )}
          {intent.budget && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 ring-1 ring-green-200">
              <Wallet className="h-3 w-3" />
              {intent.budget}
            </span>
          )}
          {intent.preferences?.map((pref, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-200"
            >
              <Sparkles className="h-3 w-3" />
              {pref}
            </span>
          ))}
          {responseTime && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-500">
              <Clock className="h-3 w-3" />
              {(responseTime / 1000).toFixed(1)}s
            </span>
          )}
        </div>
      )}

      <h2 className="mb-5 animate-fade-in-up text-center text-lg font-semibold text-gray-800">
        Rekomendasi Terbaik Untukmu
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, i) => (
          <div key={i} className="card-stagger animate-fade-in-up">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* ── Cari Lagi Button ───────────────────── */}
      {onReset && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
            Cari Lagi
          </button>
        </div>
      )}
    </section>
  );
}
