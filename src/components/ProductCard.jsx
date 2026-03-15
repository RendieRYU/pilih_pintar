import { Flame, CheckCircle, AlertTriangle, ExternalLink } from "lucide-react";

/* E-commerce brand colors */
const STORE_STYLES = {
  Tokopedia: "bg-green-50 text-green-700 hover:bg-green-100 ring-green-200",
  Shopee:    "bg-orange-50 text-orange-700 hover:bg-orange-100 ring-orange-200",
  Blibli:    "bg-blue-50 text-blue-700 hover:bg-blue-100 ring-blue-200",
};

export default function ProductCard({ product }) {
  const { name, price, matchScore, pros, cons, links } = product;

  // Color based on match score
  const scoreColor =
    matchScore >= 90
      ? "bg-green-100 text-green-700"
      : matchScore >= 75
        ? "bg-yellow-100 text-yellow-700"
        : "bg-gray-100 text-gray-600";

  return (
    <div className="group relative rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-brand-200 hover:shadow-md">
      {/* Match score badge */}
      <div className="mb-3 flex justify-end">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${scoreColor}`}
        >
          <Flame className="h-3.5 w-3.5" />
          {matchScore}% Cocok
        </span>
      </div>

      {/* Product name */}
      <h3 className="mb-1 text-lg font-bold text-gray-900">{name}</h3>

      {/* Price */}
      <p className="mb-4 text-sm font-medium text-brand-600">{price}</p>

      {/* Pros */}
      <ul className="mb-3 space-y-1.5">
        {pros.map((pro, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
            <span>{pro}</span>
          </li>
        ))}
      </ul>

      {/* Cons */}
      <ul className="space-y-1.5">
        {cons.map((con, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <span>{con}</span>
          </li>
        ))}
      </ul>

      {/* E-commerce links */}
      {links && links.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
          {links.map((link) => (
            <a
              key={link.store}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition-colors ${
                STORE_STYLES[link.store] || "bg-gray-50 text-gray-700 hover:bg-gray-100 ring-gray-200"
              }`}
            >
              <ExternalLink className="h-3 w-3" />
              {link.store}
              <span className="sr-only">(buka di tab baru)</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
