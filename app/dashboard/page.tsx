"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Property } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Plus, Building2, Eye, Clock, CheckCircle, XCircle,
  TrendingUp, Heart, User, ChevronRight, Pencil, Trash2,
} from "lucide-react";

interface Stats {
  totalProperties: number;
  pendingProperties: number;
  approvedProperties: number;
  rejectedProperties: number;
  totalViews: number;
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  approved: { bg: "#dcfce7", color: "#16a34a", label: "Approved" },
  pending:  { bg: "#fef9c3", color: "#ca8a04", label: "Pending"  },
  rejected: { bg: "#fee2e2", color: "#dc2626", label: "Rejected" },
  sold:     { bg: "#e0e7ff", color: "#4338ca", label: "Sold"     },
  rented:   { bg: "#f3e8ff", color: "#7c3aed", label: "Rented"   },
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/auth/login"); return; }
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const loadData = async () => {
    setLoadingData(true);
    try {
      const canPost = user?.role === "seller" || user?.role === "agent" || user?.role === "admin";
      if (canPost) {
        const res = await api.get("/properties/my-listings");
        const props: Property[] = res.data.data.properties || [];
        setProperties(props);
        setStats({
          totalProperties: props.length,
          pendingProperties: props.filter((p) => p.status === "pending").length,
          approvedProperties: props.filter((p) => p.status === "approved").length,
          rejectedProperties: props.filter((p) => p.status === "rejected").length,
          totalViews: props.reduce((sum, p) => sum + (p.views || 0), 0),
        });
      }
    } catch {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoadingData(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    try {
      await api.delete(`/properties/${id}`);
      setProperties((prev) => prev.filter((p) => p._id !== id));
      toast.success("Property deleted");
    } catch {
      toast.error("Failed to delete property");
    }
  };

  const canPost = user?.role === "seller" || user?.role === "agent" || user?.role === "admin";

  if (authLoading || loadingData) {
    return (
      <div className="min-h-screen" style={{ background: "#f4f6fb" }}>
        <div className="bg-white border-b h-20 animate-pulse" style={{ borderColor: "#edf2f7" }} />
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-gray-100" />)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-white rounded-2xl animate-pulse border border-gray-100" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#f4f6fb" }}>

      {/* ── Welcome banner ─────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1B3F72 0%, #0f2044 100%)" }}
      >
        {/* dot grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        {/* glow */}
        <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-[#C8922A]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-[#1B3F72] text-lg shrink-0"
              style={{ background: "#D6E4F7" }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-blue-200/70 text-xs font-semibold uppercase tracking-wider">Dashboard</p>
              <h1 className="text-xl font-extrabold text-white">Welcome back, {user?.name?.split(" ")[0]}</h1>
              <p className="text-blue-200/60 text-xs capitalize">{user?.role} account</p>
            </div>
          </div>
          {canPost && (
            <Link
              href="/dashboard/add-property"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 hover:-translate-y-px shrink-0"
              style={{ background: "linear-gradient(135deg, #C8922A, #dfa030)" }}
            >
              <Plus className="w-4 h-4" /> Post Property
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">

        {/* ── Stats ──────────────────────────────────────────────────────── */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { icon: Building2, accentColor: "#1B3F72", iconBg: "#EEF3FB", value: stats.totalProperties, label: "Total Listings" },
              { icon: Clock,     accentColor: "#d97706", iconBg: "#fef3c7", value: stats.pendingProperties,  label: "Pending"        },
              { icon: CheckCircle, accentColor: "#059669", iconBg: "#d1fae5", value: stats.approvedProperties, label: "Approved"     },
              { icon: XCircle,   accentColor: "#dc2626", iconBg: "#fee2e2", value: stats.rejectedProperties, label: "Rejected"       },
              { icon: TrendingUp, accentColor: "#2563eb", iconBg: "#dbeafe", value: stats.totalViews,        label: "Total Views"    },
            ].map(({ icon: Icon, accentColor, iconBg, value, label }) => (
              <div
                key={label}
                className="bg-white rounded-2xl border border-gray-100 p-4 text-center"
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: iconBg }}>
                  <Icon className="w-5 h-5" style={{ color: accentColor }} />
                </div>
                <p className="text-2xl font-extrabold text-gray-900">{value.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Quick links ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: "/saved",      icon: Heart,    iconBg: "#fee2e2", iconColor: "#ef4444", title: "Saved Properties", desc: `${user?.savedProperties?.length || 0} saved` },
            { href: "/profile",    icon: User,     iconBg: "#EEF3FB", iconColor: "#1B3F72", title: "My Profile",       desc: user?.email || "" },
            { href: "/properties", icon: Building2, iconBg: "#d1fae5", iconColor: "#059669", title: "Browse Listings", desc: "Find your next property" },
          ].map(({ href, icon: Icon, iconBg, iconColor, title, desc }) => (
            <Link
              key={href}
              href={href}
              className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 group hover:border-[#ADC8EE] transition-all"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: iconBg }}>
                <Icon className="w-5 h-5" style={{ color: iconColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900">{title}</p>
                <p className="text-xs text-gray-400 truncate">{desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#1B3F72] transition-colors shrink-0" />
            </Link>
          ))}
        </div>

        {/* ── My Listings ────────────────────────────────────────────────── */}
        {canPost && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-[#C8922A] shrink-0" />
                My Listings
              </h2>
              {properties.length > 0 && (
                <span className="text-xs text-gray-400">{properties.length} total</span>
              )}
            </div>

            {properties.length === 0 ? (
              <div
                className="bg-white rounded-2xl border border-gray-100 py-20 text-center"
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
              >
                <div className="w-16 h-16 bg-[#EEF3FB] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-7 h-7 text-[#ADC8EE]" />
                </div>
                <h3 className="font-bold text-gray-700 mb-1.5">No listings yet</h3>
                <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">Post your first property and start reaching buyers across Uttarakhand.</p>
                <Link
                  href="/dashboard/add-property"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                  style={{ background: "#C8922A" }}
                >
                  <Plus className="w-4 h-4" /> Post Property
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {properties.map((property) => {
                  const primaryImage = property.images?.find((i) => i.isPrimary) || property.images?.[0];
                  const statusStyle = STATUS_STYLES[property.status] ?? STATUS_STYLES.pending;
                  return (
                    <div
                      key={property._id}
                      className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 items-center"
                      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
                    >
                      {/* Thumbnail */}
                      <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-[#EEF3FB] shrink-0">
                        {primaryImage ? (
                          <Image src={primaryImage.url} alt={property.title} fill className="object-cover" sizes="80px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-[#ADC8EE]" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-bold text-sm text-gray-900 truncate">{property.title}</h3>
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 capitalize"
                            style={{ background: statusStyle.bg, color: statusStyle.color }}
                          >
                            {statusStyle.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">{property.location.city}, {property.location.state}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-sm font-extrabold" style={{ color: "#C8922A" }}>{formatPrice(property.price)}</span>
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Eye className="w-3 h-3" /> {property.views || 0}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {property.status === "approved" && (
                          <Link
                            href={`/properties/${property.slug}`}
                            className="h-8 w-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#ADC8EE] hover:text-[#1B3F72] transition-all"
                            title="View"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        )}
                        <Link
                          href={`/dashboard/edit-property/${property.slug}`}
                          className="h-8 w-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#ADC8EE] hover:text-[#1B3F72] transition-all"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(property._id)}
                          className="h-8 w-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-red-200 hover:text-red-500 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
