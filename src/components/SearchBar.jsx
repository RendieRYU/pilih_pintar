import { useRef, useEffect } from "react";
import { Search, ArrowUp } from "lucide-react";

export default function SearchBar({ value, onChange, onSubmit, isLoading }) {
  const textareaRef = useRef(null);

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="relative w-full"
    >
      <div className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-lg shadow-gray-200/50 transition-shadow focus-within:border-brand-400 focus-within:shadow-brand-200/40">
        {/* Search icon */}
        <Search className="mt-1 h-5 w-5 shrink-0 text-gray-400" />

        {/* Auto-growing textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Contoh: "Cari TWS ngebass under 500rb buat olahraga"'
          aria-label="Ketik kebutuhanmu"
          className="search-input max-h-[200px] min-h-[28px] w-full resize-none bg-transparent text-base leading-7 text-gray-800 placeholder:text-gray-400"
          disabled={isLoading}
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={!value.trim() || isLoading}
          aria-label="Kirim pencarian"
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition-all hover:bg-brand-700 disabled:opacity-40 disabled:hover:bg-brand-600"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
