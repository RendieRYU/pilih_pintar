import { Lightbulb } from "lucide-react";

const SUGGESTIONS = [
  "Mouse gaming wireless under 500rb",
  "TWS ngebass under 500rb buat olahraga",
  "Laptop buat tugas berat belasan juta",
  "Smartwatch murah bisa balas WA",
  "Keyboard mechanical buat coding budget 1jt",
];

export default function SuggestionChips({ onSelect }) {
  return (
    <div
      role="group"
      aria-label="Saran pencarian"
      className="mt-4 flex flex-wrap justify-center gap-2"
    >
      {SUGGESTIONS.map((text) => (
        <button
          key={text}
          onClick={() => onSelect(text)}
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-600 shadow-sm transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
        >
          <Lightbulb className="h-3.5 w-3.5 text-yellow-500" />
          {text}
        </button>
      ))}
    </div>
  );
}
