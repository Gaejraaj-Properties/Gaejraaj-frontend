"use client";

import Image from "next/image";
import Link from "next/link";
import { Property } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { Heart, MapPin, BedDouble, Bath, Maximize2, Eye, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";

interface Props {
  property: Property;
}

const LISTING_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  sale:  { label: "For Sale",  bg: "#dcfce7", color: "#16a34a" },
  rent:  { label: "For Rent",  bg: "#dbeafe", color: "#2563eb" },
  lease: { label: "For Lease", bg: "#ede9fe", color: "#7c3aed" },
  pg:    { label: "PG",        bg: "#fef9c3", color: "#ca8a04" },
};

export default function PropertyCard({ property }: Props) {
  const { user, isAuthenticated, updateUser } = useAuth();
  const isSaved = user?.savedProperties?.includes(property._id);
  const [saved, setSaved] = useState(isSaved);
  const [saving, setSaving] = useState(false);

  const primaryImage = property.images?.find((i) => i.isPrimary) || property.images?.[0];
  const badge = LISTING_BADGE[property.listingType] ?? LISTING_BADGE.sale;

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { toast.error("Please login to save properties"); return; }
    setSaving(true);
    try {
      await api.post(`/properties/${property._id}/save`);
      setSaved(!saved);
      if (user) {
        const updated = { ...user };
        if (saved) {
          updated.savedProperties = updated.savedProperties.filter((id) => id !== property._id);
        } else {
          updated.savedProperties = [...(updated.savedProperties || []), property._id];
        }
        updateUser(updated);
      }
      toast.success(saved ? "Removed from saved" : "Property saved!");
    } catch {
      toast.error("Failed to save property");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Link href={`/properties/${property.slug}`} className="group block">
      <div
        className="bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:-translate-y-1"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 36px rgba(27,63,114,0.13)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)")}
      >
        {/* Image */}
        <div className="relative h-52 w-full bg-[#EEF3FB] overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={property.title}
              fill
              className="object-cover group-hover:scale-[1.06] transition-transform duration-500 ease-out"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-[#D6E4F7] flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#ADC8EE]" />
              </div>
              <span className="text-[#ADC8EE] text-xs font-medium">No Image</span>
            </div>
          )}

          {/* Gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span
              className="text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: badge.bg, color: badge.color }}
            >
              {badge.label}
            </span>
            {property.isFeatured && (
              <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: "#C8922A", color: "#fff" }}>
                <Star className="w-2.5 h-2.5 fill-white" />
                Featured
              </span>
            )}
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
            style={{ background: "rgba(255,255,255,0.92)", boxShadow: "0 1px 4px rgba(0,0,0,0.12)" }}
            aria-label={saved ? "Unsave" : "Save"}
          >
            <Heart
              className="w-4 h-4 transition-all duration-200"
              style={saved ? { fill: "#ef4444", color: "#ef4444" } : { color: "#9ca3af" }}
            />
          </button>

          {/* Views + image count at bottom */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-1 bg-black/50 text-white text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">
              <Eye className="w-3 h-3" />
              {property.views?.toLocaleString() ?? 0}
            </div>
            {(property.images?.length ?? 0) > 1 && (
              <div className="flex items-center gap-1 bg-black/50 text-white text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">
                {property.images.length} photos
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-[13.5px] line-clamp-2 leading-snug group-hover:text-[#1B3F72] transition-colors duration-200 mb-1.5">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="line-clamp-1">{property.location.city}, {property.location.state}</span>
          </div>

          {/* Price */}
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-[18px] font-extrabold leading-none" style={{ color: "#C8922A" }}>
                {formatPrice(property.price)}
              </p>
              {property.listingType !== "sale" && (
                <span className="text-[11px] text-gray-400 font-medium">/month</span>
              )}
            </div>
            <span
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize"
              style={{ background: "#EEF3FB", color: "#1B3F72" }}
            >
              {property.type}
            </span>
          </div>

          {/* Stats */}
          {(property.bedrooms > 0 || property.bathrooms > 0 || property.area?.value) && (
            <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-3.5 text-gray-500 text-[11.5px]">
              {property.bedrooms > 0 && (
                <span className="flex items-center gap-1">
                  <BedDouble className="w-3.5 h-3.5 text-gray-400" />
                  {property.bedrooms} Bed
                </span>
              )}
              {property.bathrooms > 0 && (
                <span className="flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5 text-gray-400" />
                  {property.bathrooms} Bath
                </span>
              )}
              {property.area?.value && (
                <span className="flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5 text-gray-400" />
                  {property.area.value} {property.area.unit}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
