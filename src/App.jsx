import { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import SuggestionChips from "./components/SuggestionChips";
import LoadingSkeleton from "./components/LoadingSkeleton";
import ResultArea from "./components/ResultArea";
import { getMockProducts } from "./mocks/products";

/* ── API Configuration ────────────────────────────────── */
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

/* ── Persistent session ID (survives page refreshes) ──── */
function getSessionId() {
  const KEY = "pilihpintar_session_id";
  let id = sessionStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(KEY, id);
  }
  return id;
}
const SESSION_ID = getSessionId();

/* ── View states: "idle" | "loading" | "results" | "error" */

export default function App() {
  const [query, setQuery] = useState("");
  const [view, setView] = useState("idle");
  const [products, setProducts] = useState([]);
  const [intent, setIntent] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  const [error, setError] = useState("");
  const [pendingChip, setPendingChip] = useState(false);

  /* ── Refs ───────────────────────────────────────────── */
  const abortRef = useRef(null);
  const resultsRef = useRef(null);
  const errorRef = useRef(null);

  /* ── Auto-submit when chip is selected ──────────────── */
  const pendingSubmitRef = useRef(false);
  useEffect(() => {
    if (pendingChip && query.trim()) {
      setPendingChip(false);
      pendingSubmitRef.current = true;
    }
  }, [pendingChip, query]);

  useEffect(() => {
    if (pendingSubmitRef.current) {
      pendingSubmitRef.current = false;
      handleSubmit();
    }
  });

  /* ── Submit search ─────────────────────────────────── */
  const handleSubmit = useCallback(async () => {
    if (!query.trim()) return;

    // Abort previous in-flight request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setView("loading");
    setError("");
    setIntent(null);
    setResponseTime(null);

    try {
      const res = await fetch(`${API_BASE}/recommendations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Session-Id": SESSION_ID,
        },
        body: JSON.stringify({ query: query.trim() }),
        signal: controller.signal,
      });

      // Validation error (e.g. query too short)
      if (res.status === 422) {
        const data = await res.json();
        const messages = data.errors
          ? Object.values(data.errors).flat().join(" ")
          : data.message || "Input tidak valid.";
        setError(messages);
        setView("error");
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      // Extract intent & recommendations
      if (data.data?.intent) {
        setIntent(data.data.intent);
      }
      if (data.meta?.response_time_ms) {
        setResponseTime(data.meta.response_time_ms);
      }
      const recs = data.data?.recommendations || [];
      if (recs.length === 0) {
        setError(
          "AI tidak menemukan rekomendasi yang cocok untuk pencarianmu. " +
          "Coba deskripsikan kebutuhanmu lebih detail, misal: budget, fitur, atau merek yang disukai."
        );
        setView("error");
        return;
      }
      setProducts(recs);
      setView("results");
    } catch (err) {
      // Ignore aborted requests
      if (err.name === "AbortError") return;

      console.warn("Backend offline, using mock data:", err.message);

      // Fallback ke mock data jika backend tidak tersedia
      const mockResult = getMockProducts(query);

      if (mockResult) {
        setProducts(mockResult);
        setView("results");
      } else {
        // Tidak ada mock data untuk kategori ini
        setError(
          "Backend belum terhubung dan kategori ini belum tersedia di mode offline. " +
          "Pastikan backend Laravel sudah berjalan dengan GEMINI_API_KEY yang valid, " +
          "atau coba pencarian: mouse, TWS, laptop, smartwatch, keyboard."
        );
        setView("error");
      }
    }
  }, [query]);

  /* ── Chip select → auto-submit ─────────────────────── */
  const handleChipSelect = (text) => {
    setQuery(text);
    setPendingChip(true);
  };

  /* ── Reset to idle ─────────────────────────────────── */
  const handleReset = () => {
    if (abortRef.current) abortRef.current.abort();
    setQuery("");
    setProducts([]);
    setIntent(null);
    setResponseTime(null);
    setView("idle");
  };

  /* ── Scroll & focus on view change ─────────────────── */
  useEffect(() => {
    if (view === "results" && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (view === "error" && errorRef.current) {
      errorRef.current.focus();
    }
  }, [view]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <Navbar />

      <main className="flex flex-1 flex-col items-center">
        {/* ── Hero Section ─────────────────────── */}
        <section
          className={`flex w-full max-w-2xl flex-col items-center px-4 transition-all duration-500 sm:px-6 ${
            view === "idle" ? "mt-[20vh]" : "mt-8"
          }`}
        >
          {/* Headline — hidden after results */}
          {view === "idle" && (
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
                Jangan salah beli.
              </h1>
              <p className="mt-3 text-lg text-gray-500 sm:text-xl">
                Ceritain barang yang kamu butuhkan...
              </p>
            </div>
          )}

          {/* Search Bar */}
          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={handleSubmit}
            isLoading={view === "loading"}
          />

          {/* Suggestion Chips — visible only on idle */}
          {view === "idle" && <SuggestionChips onSelect={handleChipSelect} />}
        </section>

        {/* ── Error State ──────────────────────── */}
        {view === "error" && (
          <div
            ref={errorRef}
            tabIndex={-1}
            role="alert"
            className="mx-auto mt-10 max-w-md rounded-2xl border border-red-100 bg-red-50 p-6 text-center outline-none"
          >
            <p className="text-sm font-medium text-red-700">{error}</p>
            <button
              onClick={() => setView("idle")}
              className="mt-3 text-sm font-semibold text-brand-600 hover:underline"
            >
              Kembali
            </button>
          </div>
        )}

        {/* ── Loading State ────────────────────── */}
        {view === "loading" && (
          <div className="mt-10 w-full animate-in fade-in">
            <LoadingSkeleton />
          </div>
        )}

        {/* ── Results ──────────────────────────── */}
        {view === "results" && (
          <div ref={resultsRef} className="mt-8 w-full pb-16">
            <ResultArea
              products={products}
              intent={intent}
              responseTime={responseTime}
              onReset={handleReset}
            />
          </div>
        )}
      </main>

      {/* ── Footer ─────────────────────────────── */}
      <footer className="py-6 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} PilihPintar.ai — Powered by Gemini
      </footer>
    </div>
  );
}
