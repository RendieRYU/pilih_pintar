import { useState, useEffect } from "react";
import { LoaderCircle } from "lucide-react";

const MESSAGES = [
  "Menganalisis permintaan...",
  "Mencari spesifikasi yang cocok...",
  "Membandingkan opsi terbaik...",
  "Menyusun rekomendasi...",
];

export default function LoadingSkeleton() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto w-full max-w-5xl px-4 sm:px-6"
    >
      {/* Dynamic message */}
      <div className="mb-6 flex items-center justify-center gap-2 text-sm font-medium text-brand-600">
        <LoaderCircle className="h-4 w-4 animate-spin" />
        <span className="transition-all">{MESSAGES[msgIndex]}</span>
        <span className="sr-only">{MESSAGES[msgIndex]}</span>
      </div>

      {/* Skeleton cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-100 bg-white p-5"
          >
            {/* Badge placeholder */}
            <div className="mb-4 flex justify-end">
              <div className="skeleton h-6 w-24" />
            </div>
            {/* Title */}
            <div className="skeleton mb-2 h-5 w-3/4" />
            {/* Price */}
            <div className="skeleton mb-4 h-4 w-1/2" />
            {/* Pros line 1 */}
            <div className="skeleton mb-2 h-4 w-full" />
            {/* Pros line 2 */}
            <div className="skeleton mb-2 h-4 w-5/6" />
            {/* Cons line */}
            <div className="skeleton h-4 w-4/6" />
          </div>
        ))}
      </div>
    </div>
  );
}
