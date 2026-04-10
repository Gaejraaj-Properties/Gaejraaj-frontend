import { Suspense } from "react";
import PropertyCard from "@/components/property/PropertyCard";
import PropertyFilters from "@/components/property/PropertyFilters";
import PropertySidebar from "@/components/property/PropertySidebar";
import { Property } from "@/lib/types";
import { ChevronLeft, ChevronRight, Building2, MapPin } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getProperties(params: Record<string, string | string[] | undefined>) {
  const query = new URLSearchParams();
  const mapping: Record<string, string> = { search: "keyword", sort: "sortBy" };
  const allowed = ["search", "city", "type", "listingType", "minPrice", "maxPrice", "bedrooms", "sort", "page", "limit"];
  allowed.forEach((k) => {
    const v = params[k];
    if (v && typeof v === "string") query.set(mapping[k] ?? k, v);
  });
  query.set("status", "approved");
  if (!query.has("limit")) query.set("limit", "12");

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"}/properties?${query.toString()}`,
      { next: { revalidate: 30 } }
    );
    if (!res.ok) return { properties: [], totalPages: 0, currentPage: 1, results: 0 };
    const data = await res.json();
    return {
      properties: (data.data?.properties || []) as Property[],
      totalPages: data.pagination?.totalPages || 0,
      currentPage: data.pagination?.page || 1,
      results: data.pagination?.total || 0,
    };
  } catch {
    return { properties: [], totalPages: 0, currentPage: 1, results: 0 };
  }
}

export default async function PropertiesPage({ searchParams }: Props) {
  const params = await searchParams;
  const { properties, totalPages, currentPage, results } = await getProperties(params);
  const page = Number(params.page) || 1;

  const buildPageUrl = (p: number) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v && typeof v === "string") sp.set(k, v);
    });
    sp.set("page", String(p));
    return `/properties?${sp.toString()}`;
  };

  // Friendly header title
  const listingLabel = params.listingType === "sale" ? "For Sale"
    : params.listingType === "rent" ? "For Rent"
    : params.listingType === "lease" ? "For Lease"
    : params.listingType === "pg" ? "PG"
    : null;

  const pageTitle = [
    params.type && String(params.type).charAt(0).toUpperCase() + String(params.type).slice(1),
    listingLabel,
    params.city && `in ${params.city}`,
    params.search && `"${params.search}"`,
  ].filter(Boolean).join(" ") || "All Properties";

  return (
    <div className="min-h-screen" style={{ background: "#f4f6fb" }}>

      {/* ── Page Header ── */}
      <div className="bg-white border-b" style={{ borderColor: "#edf2f7" }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
                <Link href="/" className="hover:text-[#1B3F72] transition-colors">Home</Link>
                <span>/</span>
                <span className="text-gray-600 font-medium">Properties</span>
                {params.city && (
                  <>
                    <span>/</span>
                    <span className="text-gray-600 font-medium capitalize">{String(params.city)}</span>
                  </>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#1B3F72] leading-tight">
                {pageTitle}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#C8922A]" />
                <p className="text-sm text-gray-500">
                  {results > 0 ? (
                    <>
                      <span className="font-semibold text-gray-700">{results.toLocaleString()}</span>
                      {" "}{results === 1 ? "property" : "properties"} found
                    </>
                  ) : "No properties match your filters"}
                  {" · "}
                  <span className="text-gray-400">Uttarakhand &amp; Western UP</span>
                </p>
              </div>
            </div>

            {/* Mobile: clear filters */}
            {(params.city || params.type || params.listingType || params.search || params.minPrice || params.maxPrice) && (
              <Link
                href="/properties"
                className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-xl"
              >
                Clear filters ×
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6 items-start">

          {/* ── Sidebar (desktop only) ── */}
          <aside className="hidden lg:block w-[260px] shrink-0">
            <Suspense fallback={
              <div className="bg-white rounded-2xl border border-gray-100 h-[600px] animate-pulse" />
            }>
              <PropertySidebar />
            </Suspense>
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">

            {/* Mobile filter bar */}
            <div className="lg:hidden mb-4">
              <Suspense fallback={<div className="h-14 bg-white rounded-xl border border-gray-100 animate-pulse" />}>
                <PropertyFilters />
              </Suspense>
            </div>

            {/* Results bar */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                {results > 0
                  ? <><span className="font-semibold text-gray-700">{results.toLocaleString()}</span> {results === 1 ? "property" : "properties"}</>
                  : "0 properties"
                }
              </p>
              {results > 0 && (
                <p className="text-xs text-gray-400">
                  Page {currentPage} of {totalPages}
                </p>
              )}
            </div>

            {/* Grid */}
            {properties.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {properties.map((property) => (
                    <PropertyCard key={property._id} property={property} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    <Link
                      href={buildPageUrl(page - 1)}
                      className={cn(
                        "flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                        page <= 1
                          ? "pointer-events-none opacity-40 border-gray-200 text-gray-400"
                          : "border-[#ADC8EE] text-[#1B3F72] hover:bg-[#EEF3FB]"
                      )}
                      aria-disabled={page <= 1}
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </Link>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                        .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                          if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                          acc.push(p);
                          return acc;
                        }, [])
                        .map((p, i) =>
                          p === "..." ? (
                            <span key={`dot-${i}`} className="px-2 text-gray-400 text-sm">…</span>
                          ) : (
                            <Link
                              key={p}
                              href={buildPageUrl(p as number)}
                              className={cn(
                                "w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-all",
                                p === currentPage
                                  ? "bg-[#1B3F72] text-white shadow-sm"
                                  : "text-gray-600 hover:bg-[#EEF3FB] hover:text-[#1B3F72]"
                              )}
                            >
                              {p}
                            </Link>
                          )
                        )}
                    </div>

                    <Link
                      href={buildPageUrl(page + 1)}
                      className={cn(
                        "flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                        page >= totalPages
                          ? "pointer-events-none opacity-40 border-gray-200 text-gray-400"
                          : "border-[#ADC8EE] text-[#1B3F72] hover:bg-[#EEF3FB]"
                      )}
                      aria-disabled={page >= totalPages}
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </>
            ) : (
              /* Empty state */
              <div className="bg-white rounded-2xl border border-gray-100 py-24 text-center"
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                <div className="w-20 h-20 bg-[#EEF3FB] rounded-full flex items-center justify-center mx-auto mb-5">
                  <Building2 className="w-9 h-9 text-[#ADC8EE]" />
                </div>
                <h2 className="text-lg font-bold text-gray-700 mb-2">No properties found</h2>
                <p className="text-gray-400 text-sm mb-7 max-w-xs mx-auto">
                  Try different filters, a different city, or clear all filters to see everything available.
                </p>
                <Link
                  href="/properties"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "#1B3F72" }}
                >
                  Show All Properties
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
