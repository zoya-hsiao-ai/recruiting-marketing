"use client";

import { useState, useRef, useEffect } from "react";

interface PersonResult {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  team: string;
  title?: string;
  office?: string;
  profileImageUrl?: string;
}

interface Props {
  onSelect: (person: PersonResult) => void;
  onClose: () => void;
}

export default function PeopleSearch({ onSelect, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PersonResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function search(q: string) {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError("");

    fetch(`/api/people/search?q=${encodeURIComponent(q)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setResults([]);
        } else {
          setResults(data.results || []);
        }
      })
      .catch(() => setError("Failed to search"))
      .finally(() => setLoading(false));
  }

  function handleInput(value: string) {
    setQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 300);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24"
      style={{ background: "rgba(0,0,0,0.3)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-lg"
        style={{ background: "var(--color-white)", border: "1px solid var(--color-light-gray)", borderRadius: "var(--radius-lg)", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}
      >
        {/* Search input */}
        <div className="p-4" style={{ borderBottom: "1px solid var(--color-light-gray)" }}>
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4 flex-shrink-0" style={{ color: "var(--color-gray)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
              placeholder="Search people by name..."
              className="flex-1 text-sm bg-transparent focus:outline-none"
              style={{ color: "var(--color-off-black)" }}
            />
            {loading && (
              <span className="text-xs" style={{ color: "var(--color-gray)" }}>Searching...</span>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {error && (
            <div className="px-4 py-3 text-xs" style={{ color: "#C62828" }}>
              {error}
            </div>
          )}

          {results.length === 0 && query.length >= 2 && !loading && !error && (
            <div className="px-4 py-6 text-center text-xs" style={{ color: "var(--color-gray)" }}>
              No results found for &quot;{query}&quot;
            </div>
          )}

          {results.map((person, idx) => (
            <button
              key={idx}
              onClick={() => { onSelect(person); onClose(); }}
              className="w-full text-left px-4 py-3 flex items-center gap-3 transition-colors"
              style={{ borderBottom: "1px solid var(--color-light-gray)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--color-off-white)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              {/* Avatar */}
              {person.profileImageUrl ? (
                <img
                  src={person.profileImageUrl}
                  alt={person.name}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                  style={{ background: "var(--color-off-white)", color: "var(--color-gray)" }}
                >
                  {(person.firstName?.[0] || person.name?.[0] || "?").toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: "var(--color-off-black)" }}>
                  {person.name}
                </div>
                <div className="text-xs truncate" style={{ color: "var(--color-gray)" }}>
                  {[person.title, person.team].filter(Boolean).join(" · ")}
                </div>
                <div className="text-xs truncate" style={{ color: "var(--color-light-gray)" }}>
                  {person.email}
                </div>
              </div>
              <span className="text-xs flex-shrink-0" style={{ color: "var(--color-applied-blue)" }}>Add</span>
            </button>
          ))}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2.5 text-xs" style={{ color: "var(--color-light-gray)", borderTop: results.length > 0 ? "1px solid var(--color-light-gray)" : "none" }}>
          Powered by Anaheim · Press Esc to close
        </div>
      </div>
    </div>
  );
}
