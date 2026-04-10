"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-2 max-w-2xl mx-auto flex flex-col sm:flex-row gap-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)] transition-shadow duration-300">
      <div className="flex-1 flex items-center gap-2 px-3">
        <Search className="w-5 h-5 text-gray-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search by city, area, property type..."
          className="flex-1 text-gray-700 text-sm py-2 outline-none bg-transparent placeholder:text-gray-400"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-gray-300 hover:text-gray-500 transition-colors text-lg leading-none"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
      <button
        onClick={handleSearch}
        className={cn(buttonVariants(), "bg-[#1B3F72] hover:bg-[#142f55] text-white rounded-xl px-6 border-0 hover:scale-[1.03] active:scale-95 transition-transform duration-150")}
      >
        Search
      </button>
    </div>
  );
}
