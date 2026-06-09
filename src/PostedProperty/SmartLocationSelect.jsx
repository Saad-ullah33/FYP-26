import React, { useEffect, useMemo, useRef, useState } from "react";

const SmartLocationSelect = ({
  value,
  onChange,
  options,
  placeholder = "Search location...",
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || "");
  const [highlightIndex, setHighlightIndex] = useState(0);

  const containerRef = useRef(null);

  // filter options
  const filtered = useMemo(() => {
    return options.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, options]);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!open) return;

    if (e.key === "ArrowDown") {
      setHighlightIndex((prev) =>
        prev < filtered.length - 1 ? prev + 1 : prev
      );
    }

    if (e.key === "ArrowUp") {
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }

    if (e.key === "Enter") {
      const selected = filtered[highlightIndex];
      if (selected) {
        onChange(selected);
        setQuery(selected);
        setOpen(false);
      }
    }
  };

  return (
    <div className="relative" ref={containerRef}>

      {/* INPUT */}
      <input
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setHighlightIndex(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-50 mt-2 w-full max-h-60 overflow-auto bg-white border rounded-xl shadow-lg">

          {filtered.length === 0 && (
            <div className="p-3 text-sm text-gray-500">
              No locations found
            </div>
          )}

          {filtered.map((item, index) => {
            const isActive = index === highlightIndex;

            const matchIndex = item
              .toLowerCase()
              .indexOf(query.toLowerCase());

            const before = item.substring(0, matchIndex);
            const match = item.substring(
              matchIndex,
              matchIndex + query.length
            );
            const after = item.substring(matchIndex + query.length);

            return (
              <div
                key={item}
                onClick={() => {
                  onChange(item);
                  setQuery(item);
                  setOpen(false);
                }}
                onMouseEnter={() => setHighlightIndex(index)}
                className={`px-3 py-2 cursor-pointer text-sm flex items-center justify-between ${
                  isActive ? "bg-blue-50" : "hover:bg-gray-100"
                }`}
              >
                <span>
                  {before}
                  <span className="bg-yellow-200 font-semibold">
                    {match}
                  </span>
                  {after}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SmartLocationSelect;