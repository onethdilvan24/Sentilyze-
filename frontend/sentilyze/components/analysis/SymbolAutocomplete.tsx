"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { searchSymbols, type MarketSymbol, type MarketType } from "@/lib/marketSymbols";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
}

const TYPE_STYLES: Record<MarketType, string> = {
  Stock: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
  Crypto: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  Forex: "text-purple-400 bg-purple-500/10 border-purple-500/30",
};

export default function SymbolAutocomplete({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = "Search symbol or name (e.g., apple, bitcoin, EUR/USD)",
}: Props) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const prevValueRef = useRef(value);

  const suggestions = useMemo(() => searchSymbols(value), [value]);

  // Derive whether dropdown should be open based on focus and suggestions
  const shouldShowDropdown = open && isFocused && suggestions.length > 0;

  // Reset active index when value changes (user typed something new)
  if (prevValueRef.current !== value) {
    prevValueRef.current = value;
    if (activeIndex !== -1) {
      setActiveIndex(-1);
    }
  }

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeItem = listRef.current.children[activeIndex] as HTMLElement | undefined;
      activeItem?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  const pickSuggestion = useCallback(
    (item: MarketSymbol) => {
      onChange(item.symbol);
      setOpen(false);
      setActiveIndex(-1);
      inputRef.current?.focus();
    },
    [onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) {
      if (e.key === "Enter") {
        e.preventDefault();
        onSubmit();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          pickSuggestion(suggestions[activeIndex]);
        } else {
          // No suggestion highlighted - close dropdown and submit
          setOpen(false);
          onSubmit();
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        setActiveIndex(-1);
        break;
      case "Tab":
        setOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (suggestions.length > 0) {
      setOpen(true);
    }
  };

  const handleBlur = () => {
    // Delay closing to allow click events on dropdown items to fire
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        setOpen(false);
        setIsFocused(false);
        setActiveIndex(-1);
      }
    }, 150);
  };

  return (
    <div ref={containerRef} className="relative flex-1">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          if (e.target.value.trim().length > 0) {
            setOpen(true);
          }
        }}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all disabled:opacity-50"
      />

      {shouldShowDropdown && (
        <ul
          ref={listRef}
          className="absolute left-0 right-0 top-full mt-1 z-20 bg-zinc-950 border border-white/10 rounded-lg shadow-lg max-h-72 overflow-y-auto"
          role="listbox"
        >
          {suggestions.map((item, idx) => (
            <li
              key={item.symbol}
              role="option"
              aria-selected={idx === activeIndex}
              className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors ${
                idx === activeIndex ? "bg-white/10" : "hover:bg-white/5"
              }`}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent input blur
                pickSuggestion(item);
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-white font-semibold shrink-0">{item.symbol}</span>
                <span className="text-gray-400 text-sm truncate">{item.name}</span>
              </div>
              <span
                className={`shrink-0 ml-2 px-2 py-0.5 text-xs font-medium rounded border ${TYPE_STYLES[item.type]}`}
              >
                {item.type}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
