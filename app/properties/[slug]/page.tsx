"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Property } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import PropertyCard from "@/components/property/PropertyCard";
import ImageGallery from "@/components/property/ImageGallery";
import EnquiryModal from "@/components/EnquiryModal";
import {
  MapPin, BedDouble, Bath, Maximize2, Eye, Heart, Share2,
  Calendar, Building2, Zap, Phone, Mail, MessageCircle,
  CheckCircle2, Star, ArrowUpRight, Home, Layers,
  ShieldCheck, ShieldAlert, ExternalLink, FileText,
} from "lucide-react";

const LISTING_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  sale:  { label: "For Sale",  bg: "#dcfce7", color: "#16a34a" },
  rent:  { label: "For Rent",  bg: "#dbeafe", color: "#2563eb" },
  lease: { label: "For Lease", bg: "#ede9fe", color: "#7c3aed" },
  pg:    { label: "PG",        bg: "#fef9c3", color: "#ca8a04" },
};

/* ── Loading skeleton ─────────────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ background: "#f4f6fb" }}>
      <div className="h-[460px] bg-gray-200 rounded-2xl animate-pulse mb-8" />
      <div className="flex gap-8">
        <div className="flex-1 space-y-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
          <div className="h-28 bg-gray-200 rounded-2xl animate-pulse" />
          <div className="h-40 bg-gray-200 rounded-2xl animate-pulse" />
          <div className="h-24 bg-gray-200 rounded-2xl animate-pulse" />
        </div>
        <div className="w-[320px] shrink-0 hidden lg:block space-y-4">
          <div className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
          <div className="h-56 bg-gray-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/* ── Section card wrapper ─────────────────────────────────────────────────── */
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn("bg-white rounded-2xl border border-gray-100 p-5 sm:p-6", className)}
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
      <span className="w-1 h-4 rounded-full bg-[#C8922A] shrink-0" />
      {children}
    </h2>
  );
}

/* ── Detail item ─────────────────────────────────────────────────────────── */
function DetailItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f8fafc] border border-gray-100">
      <div className="w-8 h-8 rounded-lg bg-[#EEF3FB] flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-[#1B3F72]" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-800 capitalize truncate">{value}</p>
      </div>
    </div>
  );
}

/* ── Main page ────────────────────────────────────────────────────────────── */
export default function PropertyDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { user, isAuthenticated, updateUser } = useAuth();

  const [property,          setProperty]          = useState<Property | null>(null);
  const [loading,           setLoading]           = useState(true);
  const [saved,             setSaved]             = useState(false);
  const [showEnquiry,       setShowEnquiry]       = useState(false);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [descExpanded,      setDescExpanded]      = useState(false);
  const [landRecord,        setLandRecord]        = useState<{
    verificationStatus: string; state?: string; district?: string;
    khasraNumber?: string; khautaniNumber?: string; govPortalUrl?: string;
  } | null>(null);

  useEffect(() => {
    if (!params.slug) return;
    api.get(`/properties/${params.slug}`)
      .then((res) => {
        const p = res.data.data.property;
        setProperty(p);
        setSaved(user?.savedProperties?.includes(p._id) || false);
        api.get(`/properties/${p._id}/similar`)
          .then((r) => setSimilarProperties(r.data.data?.properties || []))
          .catch(() => {});
        api.get(`/properties/${p._id}/land-record`)
          .then((r) => setLandRecord(r.data.data || null))
          .catch(() => {});
      })
      .catch(() => router.push("/properties"))
      .finally(() => setLoading(false));
  }, [params.slug, user, router]);

  const handleSave = async () => {
    if (!isAuthenticated) { toast.error("Please login to save properties"); return; }
    try {
      await api.post(`/properties/${property!._id}/save`);
      setSaved(!saved);
      if (user) {
        const updated = { ...user };
        if (saved) {
          updated.savedProperties = updated.savedProperties.filter((id) => id !== property!._id);
        } else {
          updated.savedProperties = [...(updated.savedProperties || []), property!._id];
        }
        updateUser(updated);
      }
      toast.success(saved ? "Removed from saved" : "Property saved!");
    } catch {
      toast.error("Something went wrong");
    }
  };

  if (loading) return <Skeleton />;
  if (!property) return null;

  const owner   = typeof property.owner === "object" ? property.owner : null;
  const badge   = LISTING_BADGE[property.listingType] ?? LISTING_BADGE.sale;
  const descLong = property.description && property.description.length > 320;

  return (
    <>
      <div className="min-h-screen pb-24 lg:pb-10" style={{ background: "#f4f6fb" }}>

        {/* ── Breadcrumb + quick actions ─────────────────────────────────── */}
        <div className="bg-white border-b" style={{ borderColor: "#edf2f7" }}>
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 overflow-hidden">
              <Link href="/" className="hover:text-[#1B3F72] shrink-0 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/properties" className="hover:text-[#1B3F72] shrink-0 transition-colors">Properties</Link>
              <span>/</span>
              <span className="text-gray-600 font-medium truncate">{property.title}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleSave}
                className={cn(
                  "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all",
                  saved
                    ? "border-red-200 bg-red-50 text-red-500"
                    : "border-gray-200 text-gray-500 hover:border-[#ADC8EE] hover:text-[#1B3F72]"
                )}
              >
                <Heart className={cn("w-3.5 h-3.5", saved && "fill-red-500")} />
                {saved ? "Saved" : "Save"}
              </button>
              <button
                onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-gray-200 text-gray-500 hover:border-[#ADC8EE] hover:text-[#1B3F72] transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">

          {/* ── Image Gallery ─────────────────────────────────────────────── */}
          <ImageGallery images={property.images || []} title={property.title} />

          {/* ── Two-column layout ─────────────────────────────────────────── */}
          <div className="flex gap-6 items-start">

            {/* ── LEFT: main content ──────────────────────────────────────── */}
            <div className="flex-1 min-w-0 space-y-4">

              {/* Title card */}
              <Card>
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span
                    className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: badge.bg, color: badge.color }}
                  >
                    {badge.label}
                  </span>
                  <span
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize"
                    style={{ background: "#EEF3FB", color: "#1B3F72" }}
                  >
                    {property.type}
                  </span>
                  {property.isFeatured && (
                    <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: "#C8922A", color: "#fff" }}>
                      <Star className="w-2.5 h-2.5 fill-white" /> Featured
                    </span>
                  )}
                  {property.priceType === "negotiable" && (
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                      Negotiable
                    </span>
                  )}
                </div>

                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight mb-2">
                  {property.title}
                </h1>

                <div className="flex items-start gap-2 text-gray-500 text-sm">
                  <MapPin className="w-4 h-4 text-[#C8922A] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    {property.location.address}, {property.location.city}, {property.location.state}
                    {property.location.pincode && ` - ${property.location.pincode}`}
                  </span>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> {property.views?.toLocaleString() ?? 0} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(property.postedAt || property.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              </Card>

              {/* Price card */}
              <Card>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1">
                      {property.listingType === "sale" ? "Sale Price" : "Monthly Rent"}
                    </p>
                    <p className="text-3xl font-extrabold leading-none" style={{ color: "#C8922A" }}>
                      {formatPrice(property.price)}
                    </p>
                    {property.listingType !== "sale" && (
                      <span className="text-sm text-gray-400 font-medium">/month</span>
                    )}
                  </div>
                  {/* Quick stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {property.bedrooms > 0 && (
                      <span className="flex items-center gap-1.5">
                        <BedDouble className="w-4 h-4 text-[#ADC8EE]" />
                        <span className="font-semibold text-gray-800">{property.bedrooms}</span> Bed
                      </span>
                    )}
                    {property.bathrooms > 0 && (
                      <span className="flex items-center gap-1.5">
                        <Bath className="w-4 h-4 text-[#ADC8EE]" />
                        <span className="font-semibold text-gray-800">{property.bathrooms}</span> Bath
                      </span>
                    )}
                    {property.area?.value && (
                      <span className="flex items-center gap-1.5">
                        <Maximize2 className="w-4 h-4 text-[#ADC8EE]" />
                        <span className="font-semibold text-gray-800">{property.area.value}</span> {property.area.unit}
                      </span>
                    )}
                  </div>
                </div>
              </Card>

              {/* Property details */}
              <Card>
                <SectionTitle>Property Details</SectionTitle>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {property.bedrooms > 0 && (
                    <DetailItem icon={BedDouble} label="Bedrooms" value={`${property.bedrooms} BHK`} />
                  )}
                  {property.bathrooms > 0 && (
                    <DetailItem icon={Bath} label="Bathrooms" value={property.bathrooms} />
                  )}
                  {property.area?.value && (
                    <DetailItem icon={Maximize2} label="Area" value={`${property.area.value} ${property.area.unit}`} />
                  )}
                  {(property.floors > 0 || property.totalFloors > 0) && (
                    <DetailItem icon={Layers} label="Floor" value={`${property.floors} / ${property.totalFloors}`} />
                  )}
                  {property.furnishing && (
                    <DetailItem icon={Zap} label="Furnishing" value={property.furnishing} />
                  )}
                  {property.facing && (
                    <DetailItem icon={ArrowUpRight} label="Facing" value={property.facing} />
                  )}
                  {property.type && (
                    <DetailItem icon={Home} label="Type" value={property.type} />
                  )}
                  <DetailItem icon={Building2} label="Age" value={property.age > 0 ? `${property.age} yr old` : "New"} />
                </div>
              </Card>

              {/* Description */}
              <Card>
                <SectionTitle>Description</SectionTitle>
                <div className={cn("text-sm text-gray-600 leading-relaxed whitespace-pre-line", !descExpanded && descLong && "line-clamp-4")}>
                  {property.description}
                </div>
                {descLong && (
                  <button
                    onClick={() => setDescExpanded(!descExpanded)}
                    className="mt-2 text-sm font-semibold text-[#1B3F72] hover:text-[#C8922A] transition-colors"
                  >
                    {descExpanded ? "Show less ↑" : "Read more ↓"}
                  </button>
                )}
              </Card>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <Card>
                  <SectionTitle>Amenities</SectionTitle>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border capitalize"
                        style={{ background: "#EEF3FB", color: "#1B3F72", borderColor: "#D6E4F7" }}
                      >
                        <CheckCircle2 className="w-3 h-3 text-[#C8922A]" />
                        {amenity}
                      </span>
                    ))}
                  </div>
                </Card>
              )}

              {/* Land Record Verification */}
              {landRecord && (
                <Card>
                  <SectionTitle>
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#C8922A]" />
                      Land Record
                    </span>
                  </SectionTitle>

                  {landRecord.verificationStatus === "verified" ? (
                    <div>
                      {/* Verified banner */}
                      <div
                        className="flex items-start gap-3 p-3.5 rounded-xl mb-4"
                        style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
                      >
                        <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-green-800">Paper Saaf aur Pakka ✓</p>
                          <p className="text-xs text-green-700 mt-0.5">
                            Land records verified against government portal
                          </p>
                        </div>
                      </div>

                      {/* Record details */}
                      <div className="grid grid-cols-2 gap-2.5 text-sm">
                        {landRecord.khasraNumber && (
                          <div className="p-3 rounded-xl bg-[#f8fafc] border border-gray-100">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-0.5">Khasra No.</p>
                            <p className="font-semibold text-gray-800">{landRecord.khasraNumber}</p>
                          </div>
                        )}
                        {landRecord.khautaniNumber && (
                          <div className="p-3 rounded-xl bg-[#f8fafc] border border-gray-100">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-0.5">Khatauni No.</p>
                            <p className="font-semibold text-gray-800">{landRecord.khautaniNumber}</p>
                          </div>
                        )}
                        {landRecord.district && (
                          <div className="p-3 rounded-xl bg-[#f8fafc] border border-gray-100">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-0.5">District</p>
                            <p className="font-semibold text-gray-800 capitalize">{landRecord.district}</p>
                          </div>
                        )}
                        {landRecord.state && (
                          <div className="p-3 rounded-xl bg-[#f8fafc] border border-gray-100">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-0.5">State</p>
                            <p className="font-semibold text-gray-800">{landRecord.state}</p>
                          </div>
                        )}
                      </div>

                      {landRecord.govPortalUrl && (
                        <a
                          href={landRecord.govPortalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#1B3F72] hover:text-[#C8922A] transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View on Government Portal
                        </a>
                      )}
                    </div>
                  ) : landRecord.verificationStatus === "disputed" ? (
                    <div
                      className="flex items-start gap-3 p-3.5 rounded-xl"
                      style={{ background: "#fff7ed", border: "1px solid #fed7aa" }}
                    >
                      <ShieldAlert className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-orange-800">Record Disputed</p>
                        <p className="text-xs text-orange-700 mt-0.5">
                          Land records are under dispute. Please verify independently before proceeding.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="flex items-start gap-3 p-3.5 rounded-xl"
                      style={{ background: "#f8fafc", border: "1px solid #e5e7eb" }}
                    >
                      <ShieldAlert className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Verification Pending</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Our team is verifying land records for this property.
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              )}

              {/* Location */}
              <Card>
                <SectionTitle>Location</SectionTitle>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-0.5">Address</p>
                    <p className="text-gray-700">{property.location.address}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-0.5">City</p>
                    <p className="text-gray-700">{property.location.city}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-0.5">State</p>
                    <p className="text-gray-700">{property.location.state}</p>
                  </div>
                  {property.location.pincode && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-0.5">Pincode</p>
                      <p className="text-gray-700">{property.location.pincode}</p>
                    </div>
                  )}
                  {property.location.landmark && (
                    <div className="col-span-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-0.5">Landmark</p>
                      <p className="text-gray-700">{property.location.landmark}</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* ── RIGHT: Sidebar (desktop only) ────────────────────────────── */}
            <div className="hidden lg:flex flex-col gap-4 w-[300px] xl:w-[320px] shrink-0 sticky top-[72px]">

              {/* Enquiry CTA */}
              <div
                className="rounded-2xl p-5 border border-[#D6E4F7] text-center"
                style={{ background: "linear-gradient(135deg, #EEF3FB 0%, #fff 100%)", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
              >
                <div className="text-2xl font-extrabold mb-0.5" style={{ color: "#C8922A" }}>
                  {formatPrice(property.price)}
                </div>
                {property.listingType !== "sale" && (
                  <p className="text-xs text-gray-400 mb-3">/month</p>
                )}

                <button
                  onClick={() => setShowEnquiry(true)}
                  className="w-full h-11 rounded-xl font-bold text-sm text-white mb-2.5 transition-all hover:opacity-90 hover:-translate-y-px active:translate-y-0"
                  style={{ background: "linear-gradient(135deg, #C8922A, #dfa030)" }}
                >
                  <Mail className="w-4 h-4 inline mr-2" />
                  Send Enquiry
                </button>

                {owner?.phone && (
                  <>
                    <a
                      href={`https://wa.me/91${owner.phone.replace(/\D/g, "")}?text=Hi%2C%20I%20am%20interested%20in%20${encodeURIComponent(property.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-10 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 mb-2 transition-all hover:opacity-90"
                      style={{ background: "#25D366" }}
                    >
                      <MessageCircle className="w-4 h-4" /> WhatsApp
                    </a>
                    <a
                      href={`tel:${owner.phone}`}
                      className="w-full h-10 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border transition-all hover:bg-[#EEF3FB]"
                      style={{ borderColor: "#ADC8EE", color: "#1B3F72" }}
                    >
                      <Phone className="w-4 h-4" /> {owner.phone}
                    </a>
                  </>
                )}

                <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-[#D6E4F7]">
                  <span className="text-[11px] text-gray-400">🔒 Confidential</span>
                  <span className="text-[11px] text-gray-400">⚡ 24hr reply</span>
                  <span className="text-[11px] text-gray-400">✓ Free</span>
                </div>
              </div>

              {/* Owner card */}
              {owner && (
                <Card>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-3">Posted By</p>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-[#1B3F72] text-base shrink-0"
                      style={{ background: "#D6E4F7" }}
                    >
                      {owner.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">{owner.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{owner.role}</p>
                    </div>
                  </div>
                  <a
                    href={`mailto:${owner.email}`}
                    className="w-full h-9 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border transition-all hover:bg-[#EEF3FB]"
                    style={{ borderColor: "#e5e7eb", color: "#374151" }}
                  >
                    <Mail className="w-3.5 h-3.5" /> Email Owner
                  </a>
                </Card>
              )}

              {/* Trust badges */}
              <div
                className="rounded-2xl border border-gray-100 p-4 space-y-2"
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)", background: "#fff" }}
              >
                {[
                  { icon: "🏠", text: "Verified Listing" },
                  { icon: "📸", text: `${property.images?.length ?? 0} professional photos` },
                  { icon: "📍", text: `${property.location.city}, ${property.location.state}` },
                  ...(landRecord?.verificationStatus === "verified" ? [{ icon: "📋", text: "Paper Saaf aur Pakka" }] : []),
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 text-xs text-gray-500">
                    <span>{icon}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Similar Properties ───────────────────────────────────────── */}
          {similarProperties.length > 0 && (
            <div className="mt-10 mb-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-extrabold text-[#1B3F72]">Similar Properties</h2>
                <Link
                  href={`/properties?city=${property.location.city}&type=${property.type}`}
                  className="text-sm font-semibold text-[#C8922A] hover:underline flex items-center gap-1"
                >
                  View all <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {similarProperties.slice(0, 3).map((p) => (
                  <PropertyCard key={p._id} property={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile sticky contact bar ─────────────────────────────────────── */}
      {owner && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t px-4 py-3 flex gap-2"
          style={{ borderColor: "#edf2f7", boxShadow: "0 -4px 20px rgba(0,0,0,0.08)" }}>
          {owner.phone && (
            <a
              href={`tel:${owner.phone}`}
              className="h-11 px-4 rounded-xl border font-semibold text-sm flex items-center justify-center gap-1.5 shrink-0 transition-colors hover:bg-[#EEF3FB]"
              style={{ borderColor: "#ADC8EE", color: "#1B3F72" }}
            >
              <Phone className="w-4 h-4" /> Call
            </a>
          )}
          <button
            onClick={() => setShowEnquiry(true)}
            className="flex-1 h-11 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #C8922A, #dfa030)" }}
          >
            <Mail className="w-4 h-4" /> Enquire Now
          </button>
          {owner.phone && (
            <a
              href={`https://wa.me/91${owner.phone.replace(/\D/g, "")}?text=Hi%2C%20I%20am%20interested%20in%20${encodeURIComponent(property.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0 text-white transition-all hover:opacity-90"
              style={{ background: "#25D366" }}
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          )}
          <button
            onClick={handleSave}
            className="h-11 w-11 rounded-xl border flex items-center justify-center shrink-0 transition-all hover:bg-[#EEF3FB]"
            style={{ borderColor: saved ? "#fecaca" : "#e5e7eb", background: saved ? "#fef2f2" : undefined }}
          >
            <Heart className={cn("w-5 h-5", saved ? "fill-red-500 text-red-500" : "text-gray-500")} />
          </button>
        </div>
      )}

      <EnquiryModal
        isOpen={showEnquiry}
        onClose={() => setShowEnquiry(false)}
        property={property ? {
          _id: property._id,
          title: property.title,
          price: property.price,
          city: property.location?.city,
          image: property.images?.[0]?.url,
        } : undefined}
        initialName={user?.name || ""}
        initialEmail={user?.email || ""}
        ownerPhone={owner?.phone}
      />
    </>
  );
}
