"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { Property } from "@/lib/types";
import PropertyCard from "@/components/property/PropertyCard";
import { Heart, Home, ArrowRight } from "lucide-react";

export default function SavedPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/auth/login"); return; }
    api.get("/users/saved-properties")
      .then((res) => setProperties(res.data.data.properties || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen" style={{ background: "#f4f6fb" }}>
        <div className="bg-white border-b" style={{ borderColor: "#edf2f7" }}>
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border border-gray-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#f4f6fb" }}>

      {/* Page header */}
      <div className="bg-white border-b" style={{ borderColor: "#edf2f7" }}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
            <Link href="/" className="hover:text-[#1B3F72] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-600 font-medium">Saved Properties</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#1B3F72] leading-tight">Saved Properties</h1>
                {properties.length > 0 && (
                  <p className="text-sm text-gray-400 mt-0.5">
                    <span className="font-semibold text-gray-600">{properties.length}</span> {properties.length === 1 ? "property" : "properties"} saved
                  </p>
                )}
              </div>
            </div>
            <Link
              href="/properties"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#1B3F72] hover:text-[#C8922A] transition-colors"
            >
              Browse more <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {properties.length === 0 ? (
          <div
            className="bg-white rounded-2xl border border-gray-100 py-24 text-center"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
          >
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Heart className="w-9 h-9 text-red-200" />
            </div>
            <h2 className="text-lg font-bold text-gray-700 mb-2">No saved properties yet</h2>
            <p className="text-gray-400 text-sm mb-7 max-w-xs mx-auto">
              Tap the heart icon on any property to save it here for easy access later.
            </p>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "#1B3F72" }}
            >
              <Home className="w-4 h-4" /> Browse Properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
