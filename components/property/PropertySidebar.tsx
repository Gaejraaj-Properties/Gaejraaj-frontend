"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Search, X, MapPin, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";

const LISTING_TYPES = [
  { value: "",      label: "All"   },
  { value: "sale",  label: "Sale"  },
  { value: "rent",  label: "Rent"  },
  { value: "lease", label: "Lease" },
  { value: "pg",    label: "PG"    },
];

const PROPERTY_TYPES = [
  "apartment", "house", "villa", "plot", "commercial", "farmhouse", "studio", "pg",
];

const BEDROOMS = [
  { value: "",  label: "Any" },
  { value: "1", label: "1"   },
  { value: "2", label: "2"   },
  { value: "3", label: "3"   },
  { value: "4", label: "4"   },
  { value: "5", label: "5+"  },
];

const PRICE_PRESETS = [
  { label: "Under 50L",  min: "",         max: "5000000"  },
  { label: "50L – 1Cr",  min: "5000000",  max: "10000000" },
  { label: "1Cr – 2Cr",  min: "10000000", max: "20000000" },
  { label: "Above 2Cr",  min: "20000000", max: ""         },
];

const SORT_OPTIONS = [
  { value: "",           label: "Newest First"       },
  { value: "price_asc",  label: "Price: Low → High"  },
  { value: "price_desc", label: "Price: High → Low"  },
  { value: "most_viewed",label: "Most Viewed"        },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-2.5">
      {children}
    </p>
  );
}

export default function PropertySidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [showCustomPrice, setShowCustomPrice] = useState(
    !!(searchParams.get("minPrice") || searchParams.get("maxPrice"))
  );
  const [customMin, setCustomMin] = useState(searchParams.get("minPrice") || "");
  const [customMax, setCustomMax] = useState(searchParams.get("maxPrice") || "");

  // Keep inputs in sync when URL changes (e.g. preset clicked or Clear all)
  useEffect(() => {
    setCustomMin(searchParams.get("minPrice") || "");
    setCustomMax(searchParams.get("maxPrice") || "");
  }, [searchParams]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pushParams = useCallback(
    (updates: Record<string, string>) => {
      const p = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) p.set(k, v); else p.delete(k);
      });
      p.set("page", "1");
      router.push(`/properties?${p.toString()}`);
    },
    [router, searchParams]
  );

  const updateParam = useCallback(
    (key: string, value: string) => pushParams({ [key]: value }),
    [pushParams]
  );

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParam("search", val), 420);
  };

  const clearAll = () => { setSearch(""); router.push("/properties"); };

  const cur = {
    listingType: searchParams.get("listingType") || "",
    type:        searchParams.get("type")        || "",
    bedrooms:    searchParams.get("bedrooms")    || "",
    sort:        searchParams.get("sort")        || "",
    city:        searchParams.get("city")        || "",
    minPrice:    searchParams.get("minPrice")    || "",
    maxPrice:    searchParams.get("maxPrice")    || "",
  };

  const hasFilters = !!(
    search || cur.listingType || cur.type || cur.bedrooms ||
    cur.sort || cur.city || cur.minPrice || cur.maxPrice
  );

  const activePricePreset = PRICE_PRESETS.find(
    (p) => p.min === cur.minPrice && p.max === cur.maxPrice
  );

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 sticky top-[72px]"
      style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}
    >
      {/* Header */}
      <div className="px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#1B3F72]" />
          <span className="font-bold text-gray-900 text-sm">Filters</span>
        </div>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-[11px] font-semibold text-red-500 hover:text-red-600 flex items-center gap-0.5 transition-colors"
          >
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div className="px-4 py-4">
        <SectionLabel>Search</SectionLabel>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="City, title, area…"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADC8EE] focus:border-transparent transition placeholder:text-gray-400"
          />
          {search && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Listing Type */}
      <div className="px-4 py-4">
        <SectionLabel>Listing Type</SectionLabel>
        <div className="flex flex-wrap gap-1.5">
          {LISTING_TYPES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updateParam("listingType", value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-all"
              style={
                cur.listingType === value
                  ? { background: "#1B3F72", color: "#fff", borderColor: "#1B3F72" }
                  : { background: "#fff", color: "#6b7280", borderColor: "#e5e7eb" }
              }
              onMouseEnter={(e) => {
                if (cur.listingType !== value) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#ADC8EE";
                  (e.currentTarget as HTMLButtonElement).style.color = "#1B3F72";
                }
              }}
              onMouseLeave={(e) => {
                if (cur.listingType !== value) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb";
                  (e.currentTarget as HTMLButtonElement).style.color = "#6b7280";
                }
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div className="px-4 py-4">
        <SectionLabel>Property Type</SectionLabel>
        <div className="flex flex-wrap gap-1.5">
          {PROPERTY_TYPES.map((type) => {
            const isActive = cur.type === type;
            return (
              <button
                key={type}
                onClick={() => updateParam("type", isActive ? "" : type)}
                className="text-xs font-medium px-3 py-1.5 rounded-full border capitalize transition-all"
                style={
                  isActive
                    ? { background: "#EEF3FB", color: "#1B3F72", borderColor: "#ADC8EE", fontWeight: 600 }
                    : { background: "#fff", color: "#6b7280", borderColor: "#e5e7eb" }
                }
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#ADC8EE";
                    (e.currentTarget as HTMLButtonElement).style.color = "#1B3F72";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb";
                    (e.currentTarget as HTMLButtonElement).style.color = "#6b7280";
                  }
                }}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bedrooms */}
      <div className="px-4 py-4">
        <SectionLabel>Bedrooms</SectionLabel>
        <div className="flex gap-1.5">
          {BEDROOMS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updateParam("bedrooms", value)}
              className="flex-1 text-xs font-bold py-2 rounded-xl border transition-all"
              style={
                cur.bedrooms === value
                  ? { background: "#1B3F72", color: "#fff", borderColor: "#1B3F72" }
                  : { background: "#f8fafc", color: "#6b7280", borderColor: "#e5e7eb" }
              }
              onMouseEnter={(e) => {
                if (cur.bedrooms !== value) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#ADC8EE";
                  (e.currentTarget as HTMLButtonElement).style.color = "#1B3F72";
                }
              }}
              onMouseLeave={(e) => {
                if (cur.bedrooms !== value) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb";
                  (e.currentTarget as HTMLButtonElement).style.color = "#6b7280";
                }
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className="px-4 py-4">
        <SectionLabel>Budget</SectionLabel>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {PRICE_PRESETS.map(({ label, min, max }) => {
            const isActive = activePricePreset?.label === label;
            return (
              <button
                key={label}
                onClick={() => pushParams({ minPrice: min, maxPrice: max })}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-full border transition-all"
                style={
                  isActive
                    ? { background: "#C8922A", color: "#fff", borderColor: "#C8922A" }
                    : { background: "#fff", color: "#6b7280", borderColor: "#e5e7eb" }
                }
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#C8922A";
                    (e.currentTarget as HTMLButtonElement).style.color = "#C8922A";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb";
                    (e.currentTarget as HTMLButtonElement).style.color = "#6b7280";
                  }
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setShowCustomPrice(!showCustomPrice)}
          className="text-[11.5px] font-semibold text-[#1B3F72] flex items-center gap-1 hover:opacity-70 transition-opacity"
        >
          {showCustomPrice ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          Custom range
        </button>

        {showCustomPrice && (
          <div className="flex gap-2 mt-2.5">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Min ₹"
              value={customMin}
              onChange={(e) => setCustomMin(e.target.value.replace(/\D/g, ""))}
              className="min-w-0 flex-1 px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADC8EE] focus:border-transparent transition"
              onBlur={() => updateParam("minPrice", customMin)}
              onKeyDown={(e) => { if (e.key === "Enter") updateParam("minPrice", customMin); }}
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Max ₹"
              value={customMax}
              onChange={(e) => setCustomMax(e.target.value.replace(/\D/g, ""))}
              className="min-w-0 flex-1 px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADC8EE] focus:border-transparent transition"
              onBlur={() => updateParam("maxPrice", customMax)}
              onKeyDown={(e) => { if (e.key === "Enter") updateParam("maxPrice", customMax); }}
            />
          </div>
        )}
      </div>

      {/* City */}
      <div className="px-4 py-4">
        <SectionLabel>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> City
          </span>
        </SectionLabel>
        <input
          type="text"
          placeholder="e.g. Haridwar, Dehradun"
          defaultValue={cur.city}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADC8EE] focus:border-transparent transition placeholder:text-gray-400"
          onKeyDown={(e) => { if (e.key === "Enter") updateParam("city", (e.target as HTMLInputElement).value); }}
          onBlur={(e) => updateParam("city", e.target.value)}
        />
      </div>

      {/* Sort */}
      <div className="px-4 py-4">
        <SectionLabel>Sort By</SectionLabel>
        <div className="space-y-1">
          {SORT_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updateParam("sort", value)}
              className="w-full text-left text-xs py-2 px-3 rounded-xl transition-all font-medium"
              style={
                cur.sort === value
                  ? { background: "#EEF3FB", color: "#1B3F72", fontWeight: 600 }
                  : { color: "#6b7280" }
              }
              onMouseEnter={(e) => {
                if (cur.sort !== value)
                  (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc";
              }}
              onMouseLeave={(e) => {
                if (cur.sort !== value)
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
