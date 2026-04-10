"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X, SlidersHorizontal, ChevronDown } from "lucide-react";

const PRICE_PRESETS = [
  { label: "Under 50L",  min: "",         max: "5000000"  },
  { label: "50L – 1Cr", min: "5000000",  max: "10000000" },
  { label: "1Cr – 2Cr", min: "10000000", max: "20000000" },
  { label: "Above 2Cr", min: "20000000", max: ""         },
];

function formatPriceLabel(val: string) {
  const n = Number(val);
  if (!n) return val;
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(n % 10000000 === 0 ? 0 : 1)}Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function PropertyFilters() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [search,        setSearch]        = useState(searchParams.get("search") || "");
  const [showAdvanced,  setShowAdvanced]  = useState(
    !!(searchParams.get("minPrice") || searchParams.get("maxPrice") || searchParams.get("city"))
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const spListingType: string = searchParams.get("listingType") ?? "all";
  const spType: string        = searchParams.get("type")        ?? "all";
  const spBedrooms: string    = searchParams.get("bedrooms")    ?? "all";
  const spSort: string        = searchParams.get("sort")        ?? "newest";

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  const pushParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) params.set(k, v); else params.delete(k);
      });
      params.set("page", "1");
      router.push(`/properties?${params.toString()}`);
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
    debounceRef.current = setTimeout(() => updateParam("search", val), 450);
  };

  const clearFilters = () => { setSearch(""); router.push("/properties"); };

  const activeFilters: { label: string; key: string; extra?: Record<string, string> }[] = [];
  if (searchParams.get("search"))      activeFilters.push({ label: `"${searchParams.get("search")}"`,   key: "search" });
  if (searchParams.get("city"))        activeFilters.push({ label: searchParams.get("city")!,            key: "city" });
  if (searchParams.get("listingType")) activeFilters.push({ label: { sale: "For Sale", rent: "For Rent", lease: "For Lease" }[searchParams.get("listingType")!] ?? searchParams.get("listingType")!, key: "listingType" });
  if (searchParams.get("type"))        activeFilters.push({ label: searchParams.get("type")!,            key: "type" });
  if (searchParams.get("bedrooms"))    activeFilters.push({ label: `${searchParams.get("bedrooms")}+ BHK`, key: "bedrooms" });
  if (searchParams.get("minPrice") || searchParams.get("maxPrice")) {
    const min = searchParams.get("minPrice"); const max = searchParams.get("maxPrice");
    const label = min && max ? `${formatPriceLabel(min)} – ${formatPriceLabel(max)}`
                : min ? `Above ${formatPriceLabel(min)}` : `Under ${formatPriceLabel(max!)}`;
    activeFilters.push({ label, key: "minPrice", extra: { maxPrice: "" } });
  }

  const hasFilters = activeFilters.length > 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

      {/* ── Search row (always visible) ────────────────────────────────── */}
      <div className="p-3 sm:p-4 flex gap-2 items-center border-b border-gray-100">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Search city, title, area..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 h-10 text-sm"
          />
          {search && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mobile: toggle all filters */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden flex items-center gap-1.5 text-sm border-gray-200 shrink-0"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasFilters && (
            <span className="w-4 h-4 rounded-full bg-[#1B3F72] text-white text-[10px] flex items-center justify-center">
              {activeFilters.length}
            </span>
          )}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${mobileOpen ? "rotate-180" : ""}`} />
        </Button>
      </div>

      {/* ── Desktop filter row ─────────────────────────────────────────── */}
      <div className="hidden sm:flex p-3 sm:p-4 flex-wrap gap-2 sm:gap-3 items-center">
        <Select value={spListingType} onValueChange={(v) => updateParam("listingType", v === "all" ? "" : (v ?? ""))}>
          <SelectTrigger className="w-36 h-9 text-sm"><SelectValue placeholder="All Types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="sale">For Sale</SelectItem>
            <SelectItem value="rent">For Rent</SelectItem>
            <SelectItem value="lease">For Lease</SelectItem>
          </SelectContent>
        </Select>

        <Select value={spType} onValueChange={(v) => updateParam("type", v === "all" ? "" : (v ?? ""))}>
          <SelectTrigger className="w-40 h-9 text-sm"><SelectValue placeholder="Property Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Properties</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
            <SelectItem value="plot">Plot</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="farmhouse">Farmhouse</SelectItem>
            <SelectItem value="pg">PG</SelectItem>
            <SelectItem value="studio">Studio</SelectItem>
          </SelectContent>
        </Select>

        <Select value={spBedrooms} onValueChange={(v) => updateParam("bedrooms", v === "all" ? "" : (v ?? ""))}>
          <SelectTrigger className="w-28 h-9 text-sm"><SelectValue placeholder="BHK" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any BHK</SelectItem>
            <SelectItem value="1">1 BHK</SelectItem>
            <SelectItem value="2">2 BHK</SelectItem>
            <SelectItem value="3">3 BHK</SelectItem>
            <SelectItem value="4">4 BHK</SelectItem>
            <SelectItem value="5">5+ BHK</SelectItem>
          </SelectContent>
        </Select>

        <Select value={spSort} onValueChange={(v) => updateParam("sort", v === "newest" ? "" : (v ?? ""))}>
          <SelectTrigger className="w-44 h-9 text-sm"><SelectValue placeholder="Sort by" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="most_viewed">Most Viewed</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2 ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`text-sm ${showAdvanced ? "text-[#1B3F72] bg-[#EEF3FB]" : "text-gray-500"}`}
          >
            <SlidersHorizontal className="w-4 h-4 mr-1.5" />
            Price & City
          </Button>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-400 hover:text-red-500">
              <X className="w-4 h-4 mr-1" /> Clear all
            </Button>
          )}
        </div>
      </div>

      {/* ── Mobile expanded filters ────────────────────────────────────── */}
      {mobileOpen && (
        <div className="sm:hidden px-3 pb-3 border-t border-gray-100 pt-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Select value={spListingType} onValueChange={(v) => updateParam("listingType", v === "all" ? "" : (v ?? ""))}>
              <SelectTrigger className="h-10 text-sm w-full"><SelectValue placeholder="All Types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sale">For Sale</SelectItem>
                <SelectItem value="rent">For Rent</SelectItem>
                <SelectItem value="lease">For Lease</SelectItem>
              </SelectContent>
            </Select>

            <Select value={spType} onValueChange={(v) => updateParam("type", v === "all" ? "" : (v ?? ""))}>
              <SelectTrigger className="h-10 text-sm w-full"><SelectValue placeholder="Property Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="plot">Plot</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="farmhouse">Farmhouse</SelectItem>
                <SelectItem value="pg">PG</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
              </SelectContent>
            </Select>

            <Select value={spBedrooms} onValueChange={(v) => updateParam("bedrooms", v === "all" ? "" : (v ?? ""))}>
              <SelectTrigger className="h-10 text-sm w-full"><SelectValue placeholder="BHK" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any BHK</SelectItem>
                <SelectItem value="1">1 BHK</SelectItem>
                <SelectItem value="2">2 BHK</SelectItem>
                <SelectItem value="3">3 BHK</SelectItem>
                <SelectItem value="4">4 BHK</SelectItem>
                <SelectItem value="5">5+ BHK</SelectItem>
              </SelectContent>
            </Select>

            <Select value={spSort} onValueChange={(v) => updateParam("sort", v === "newest" ? "" : (v ?? ""))}>
              <SelectTrigger className="h-10 text-sm w-full"><SelectValue placeholder="Sort by" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price_asc">Price: Low → High</SelectItem>
                <SelectItem value="price_desc">Price: High → Low</SelectItem>
                <SelectItem value="most_viewed">Most Viewed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* City */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 shrink-0 w-8">City</span>
            <Input
              placeholder="e.g. Haridwar"
              defaultValue={searchParams.get("city") || ""}
              className="flex-1 h-10 text-sm"
              onKeyDown={(e) => { if (e.key === "Enter") updateParam("city", (e.target as HTMLInputElement).value); }}
              onBlur={(e) => updateParam("city", e.target.value)}
            />
          </div>

          {/* Price presets */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1.5">Price Range</p>
            <div className="flex flex-wrap gap-1.5">
              {PRICE_PRESETS.map(({ label, min, max }) => {
                const isActive = searchParams.get("minPrice") === min && searchParams.get("maxPrice") === max;
                return (
                  <button
                    key={label}
                    onClick={() => pushParams({ minPrice: min, maxPrice: max })}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      isActive ? "bg-[#1B3F72] text-white border-[#1B3F72]" : "border-[#ADC8EE] text-[#1B3F72] hover:bg-[#EEF3FB]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-red-500 font-medium hover:text-red-700 transition-colors">
              × Clear all filters
            </button>
          )}
        </div>
      )}

      {/* ── Desktop advanced (Price & City) ──────────────────────────── */}
      {showAdvanced && (
        <div className="hidden sm:flex px-4 pb-4 flex-wrap gap-3 items-center border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 shrink-0">City</span>
            <Input
              placeholder="e.g. Haridwar"
              defaultValue={searchParams.get("city") || ""}
              className="w-32 h-8 text-sm"
              onKeyDown={(e) => { if (e.key === "Enter") updateParam("city", (e.target as HTMLInputElement).value); }}
              onBlur={(e) => updateParam("city", e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 shrink-0">Min ₹</span>
            <Input
              type="number" placeholder="500000"
              defaultValue={searchParams.get("minPrice") || ""}
              className="w-28 h-8 text-sm"
              onBlur={(e) => updateParam("minPrice", e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") updateParam("minPrice", (e.target as HTMLInputElement).value); }}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 shrink-0">Max ₹</span>
            <Input
              type="number" placeholder="10000000"
              defaultValue={searchParams.get("maxPrice") || ""}
              className="w-28 h-8 text-sm"
              onBlur={(e) => updateParam("maxPrice", e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") updateParam("maxPrice", (e.target as HTMLInputElement).value); }}
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRICE_PRESETS.map(({ label, min, max }) => {
              const isActive = searchParams.get("minPrice") === min && searchParams.get("maxPrice") === max;
              return (
                <button
                  key={label}
                  onClick={() => pushParams({ minPrice: min, maxPrice: max })}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    isActive ? "bg-[#1B3F72] text-white border-[#1B3F72]" : "border-[#ADC8EE] text-[#1B3F72] hover:bg-[#EEF3FB]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Active filter chips ───────────────────────────────────────── */}
      {hasFilters && (
        <div className="px-3 sm:px-4 pb-3 flex flex-wrap gap-2 border-t border-gray-50 pt-2.5">
          <span className="text-xs text-gray-400 self-center mr-1">Active:</span>
          {activeFilters.map(({ label, key, extra }) => (
            <button
              key={key}
              onClick={() => pushParams({ [key]: "", ...(extra ?? {}) })}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[#EEF3FB] text-[#1B3F72] border border-[#D6E4F7] hover:bg-[#D6E4F7] transition-colors capitalize"
            >
              {label}
              <X className="w-3 h-3 text-[#ADC8EE]" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
