"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { Property } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, X, CheckCircle2, ChevronDown, AlertCircle, RotateCcw } from "lucide-react";

const AMENITIES_LIST = [
  "Parking", "Swimming Pool", "Gym", "Lift", "Power Backup", "Security",
  "Garden", "Club House", "Intercom", "CCTV", "Rain Water Harvesting", "Fire Safety",
  "Play Area", "Visitor Parking", "Maintenance Staff",
];

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1.5">
      {children}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

function SectionTitle({ step, children }: { step: number; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: "#1B3F72" }}>
        {step}
      </div>
      <h2 className="text-base font-bold text-gray-900">{children}</h2>
    </div>
  );
}

function StyledSelect({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 pl-3 pr-8 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADC8EE] focus:border-transparent appearance-none bg-white text-gray-800"
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}

const STATUS_BANNER: Record<string, { bg: string; border: string; color: string; text: string }> = {
  rejected: { bg: "#fef2f2", border: "#fecaca", color: "#dc2626", text: "This property was rejected. Fix the issues below and resubmit for review." },
  pending:  { bg: "#fefce8", border: "#fde68a", color: "#d97706", text: "This property is pending review. You can still make changes." },
};

export default function EditPropertyPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [property, setProperty] = useState<Property | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [keepImageIds, setKeepImageIds] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: "", description: "", type: "apartment", listingType: "sale",
    price: "", priceType: "negotiable", area_value: "", area_unit: "sqft",
    bedrooms: "0", bathrooms: "0", floors: "0", totalFloors: "0",
    furnishing: "unfurnished", facing: "north", age: "0",
    address: "", city: "", state: "", pincode: "", landmark: "",
  });

  useEffect(() => {
    if (!authLoading && !user) { router.push("/auth/login"); return; }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!params.id) return;
    api.get(`/properties/${params.id}`)
      .then((res) => {
        const p: Property = res.data.data.property;
        const ownerId = typeof p.owner === "object" ? p.owner._id : p.owner;
        if (user && ownerId !== user._id && user.role !== "admin") {
          toast.error("You don't have permission to edit this property");
          router.push("/dashboard");
          return;
        }
        setProperty(p);
        setKeepImageIds(p.images.map((i) => i.publicId));
        setSelectedAmenities(p.amenities || []);
        setForm({
          title: p.title, description: p.description, type: p.type, listingType: p.listingType,
          price: String(p.price), priceType: p.priceType,
          area_value: String(p.area.value), area_unit: p.area.unit,
          bedrooms: String(p.bedrooms), bathrooms: String(p.bathrooms),
          floors: String(p.floors), totalFloors: String(p.totalFloors),
          furnishing: p.furnishing, facing: p.facing, age: String(p.age),
          address: p.location.address, city: p.location.city, state: p.location.state,
          pincode: p.location.pincode, landmark: p.location.landmark || "",
        });
      })
      .catch(() => { toast.error("Property not found"); router.push("/dashboard"); })
      .finally(() => setPageLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, user]);

  const f = (key: string) => (value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  const fi = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (keepImageIds.length + newImages.length + files.length > 10) { toast.error("Maximum 10 images allowed"); return; }
    setNewImages((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeNewImage = (idx: number) => {
    URL.revokeObjectURL(newPreviews[idx]);
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
    setNewPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeExistingImage = (publicId: string) => setKeepImageIds((prev) => prev.filter((id) => id !== publicId));
  const restoreExistingImage = (publicId: string) => setKeepImageIds((prev) => [...prev, publicId]);
  const toggleAmenity = (amenity: string) =>
    setSelectedAmenities((prev) => prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.price || !form.area_value || !form.address || !form.city || !form.state || !form.pincode) {
      toast.error("Please fill all required fields"); return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries({
        title: form.title, description: form.description, type: form.type,
        listingType: form.listingType, price: form.price, priceType: form.priceType,
        bedrooms: form.bedrooms, bathrooms: form.bathrooms, floors: form.floors,
        totalFloors: form.totalFloors, furnishing: form.furnishing, facing: form.facing, age: form.age,
      }).forEach(([k, v]) => fd.append(k, v));
      fd.append("area[value]", form.area_value);
      fd.append("area[unit]", form.area_unit);
      fd.append("location[address]", form.address);
      fd.append("location[city]", form.city);
      fd.append("location[state]", form.state);
      fd.append("location[pincode]", form.pincode);
      fd.append("location[landmark]", form.landmark);
      fd.append("keepImages", JSON.stringify(keepImageIds));
      selectedAmenities.forEach((a) => fd.append("amenities[]", a));
      newImages.forEach((img) => fd.append("images", img));

      await api.put(`/properties/${property!._id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Property updated!");
      router.push("/dashboard");
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to update property");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || pageLoading) {
    return (
      <div className="min-h-screen" style={{ background: "#f4f6fb" }}>
        <div className="bg-white border-b h-20 animate-pulse" style={{ borderColor: "#edf2f7" }} />
        <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-6 space-y-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-40 bg-white rounded-2xl animate-pulse border border-gray-100" />)}
        </div>
      </div>
    );
  }

  if (!property) return null;

  const statusBanner = STATUS_BANNER[property.status];

  return (
    <div className="min-h-screen" style={{ background: "#f4f6fb" }}>

      {/* Page header */}
      <div className="bg-white border-b" style={{ borderColor: "#edf2f7" }}>
        <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
            <Link href="/" className="hover:text-[#1B3F72] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/dashboard" className="hover:text-[#1B3F72] transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-gray-600 font-medium">Edit Property</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1B3F72]">Edit Property</h1>
          <p className="text-gray-400 text-sm mt-0.5">Changes to price, type, or location will re-submit for review.</p>
        </div>
      </div>

      <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-6">

        {/* Status banner */}
        {statusBanner && (
          <div
            className="flex items-start gap-3 rounded-2xl border px-4 py-3.5 mb-4 text-sm"
            style={{ background: statusBanner.bg, borderColor: statusBanner.border, color: statusBanner.color }}
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{statusBanner.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* 1. Basic Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <SectionTitle step={1}>Basic Information</SectionTitle>
            <div className="space-y-4">
              <div>
                <FieldLabel required>Title</FieldLabel>
                <Input value={form.title} onChange={fi("title")} required minLength={10} className="h-11 text-sm" />
              </div>
              <div>
                <FieldLabel required>Description</FieldLabel>
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={fi("description")}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ADC8EE] focus:border-transparent resize-none transition"
                  required
                  minLength={20}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel required>Property Type</FieldLabel>
                  <StyledSelect value={form.type} onChange={f("type")}>
                    {["apartment","house","villa","plot","commercial","farmhouse","pg","studio"].map((t) => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </StyledSelect>
                </div>
                <div>
                  <FieldLabel required>Listing Type</FieldLabel>
                  <StyledSelect value={form.listingType} onChange={f("listingType")}>
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                    <option value="lease">For Lease</option>
                    <option value="pg">PG</option>
                  </StyledSelect>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Price & Area */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <SectionTitle step={2}>Price &amp; Area</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel required>Price (₹)</FieldLabel>
                <Input type="number" value={form.price} onChange={fi("price")} required min="0" className="h-11 text-sm" />
              </div>
              <div>
                <FieldLabel>Price Type</FieldLabel>
                <StyledSelect value={form.priceType} onChange={f("priceType")}>
                  <option value="fixed">Fixed</option>
                  <option value="negotiable">Negotiable</option>
                </StyledSelect>
              </div>
              <div>
                <FieldLabel required>Area</FieldLabel>
                <Input type="number" value={form.area_value} onChange={fi("area_value")} required min="0" className="h-11 text-sm" />
              </div>
              <div>
                <FieldLabel>Area Unit</FieldLabel>
                <StyledSelect value={form.area_unit} onChange={f("area_unit")}>
                  <option value="sqft">sq ft</option>
                  <option value="sqm">sq m</option>
                  <option value="sqyard">sq yard</option>
                </StyledSelect>
              </div>
            </div>
          </div>

          {/* 3. Property Details */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <SectionTitle step={3}>Property Details</SectionTitle>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
              {[
                { label: "Bedrooms",     key: "bedrooms"    },
                { label: "Bathrooms",    key: "bathrooms"   },
                { label: "Floor No.",    key: "floors"      },
                { label: "Total Floors", key: "totalFloors" },
                { label: "Age (years)",  key: "age"         },
              ].map(({ label, key }) => (
                <div key={key}>
                  <FieldLabel>{label}</FieldLabel>
                  <Input type="number" min="0" value={form[key as keyof typeof form]} onChange={fi(key)} className="h-11 text-sm" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Furnishing</FieldLabel>
                <StyledSelect value={form.furnishing} onChange={f("furnishing")}>
                  <option value="unfurnished">Unfurnished</option>
                  <option value="semi-furnished">Semi-Furnished</option>
                  <option value="fully-furnished">Fully Furnished</option>
                </StyledSelect>
              </div>
              <div>
                <FieldLabel>Facing</FieldLabel>
                <StyledSelect value={form.facing} onChange={f("facing")}>
                  {["north","south","east","west","north-east","north-west","south-east","south-west"].map((d) => (
                    <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                  ))}
                </StyledSelect>
              </div>
            </div>
          </div>

          {/* 4. Location */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <SectionTitle step={4}>Location</SectionTitle>
            <div className="space-y-3">
              <div>
                <FieldLabel required>Full Address</FieldLabel>
                <Input value={form.address} onChange={fi("address")} required className="h-11 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel required>City</FieldLabel>
                  <Input value={form.city} onChange={fi("city")} required className="h-11 text-sm" />
                </div>
                <div>
                  <FieldLabel required>State</FieldLabel>
                  <Input value={form.state} onChange={fi("state")} required className="h-11 text-sm" />
                </div>
                <div>
                  <FieldLabel required>Pincode</FieldLabel>
                  <Input value={form.pincode} onChange={fi("pincode")} required maxLength={6} pattern="\d{6}" className="h-11 text-sm" />
                </div>
                <div>
                  <FieldLabel>Landmark</FieldLabel>
                  <Input value={form.landmark} onChange={fi("landmark")} className="h-11 text-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* 5. Amenities */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <SectionTitle step={5}>Amenities</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {AMENITIES_LIST.map((amenity) => {
                const active = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                    style={active
                      ? { background: "#EEF3FB", color: "#1B3F72", borderColor: "#ADC8EE" }
                      : { background: "#fff", color: "#6b7280", borderColor: "#e5e7eb" }
                    }
                  >
                    {active && <CheckCircle2 className="w-3 h-3 text-[#C8922A]" />}
                    {amenity}
                  </button>
                );
              })}
            </div>
            {selectedAmenities.length > 0 && (
              <p className="text-xs text-gray-400 mt-3">{selectedAmenities.length} selected</p>
            )}
          </div>

          {/* 6. Photos */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <SectionTitle step={6}>Photos</SectionTitle>

            {/* Existing images */}
            {property.images.length > 0 && (
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-2">Current photos</p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                  {property.images.map((img) => {
                    const kept = keepImageIds.includes(img.publicId);
                    return (
                      <div
                        key={img.publicId}
                        className={`relative group aspect-square rounded-xl overflow-hidden border-2 transition-all ${kept ? "border-transparent" : "border-red-300 opacity-40"}`}
                      >
                        <Image src={img.url} alt="" fill className="object-cover" sizes="120px" />
                        {img.isPrimary && kept && (
                          <span className="absolute bottom-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "#1B3F72", color: "#fff" }}>
                            Primary
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => kept ? removeExistingImage(img.publicId) : restoreExistingImage(img.publicId)}
                          className={`absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-white transition-all ${
                            kept
                              ? "bg-black/60 opacity-0 group-hover:opacity-100 hover:bg-red-500"
                              : "bg-emerald-500 opacity-100"
                          }`}
                          title={kept ? "Remove" : "Restore"}
                        >
                          {kept ? <X className="w-3 h-3" /> : <RotateCcw className="w-3 h-3" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Upload new */}
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#C8922A] hover:bg-[#EEF3FB]/50 transition-all">
              <Upload className="w-5 h-5 text-gray-300 mb-1.5" />
              <span className="text-sm text-gray-400 font-medium">Add more photos</span>
              <span className="text-xs text-gray-300 mt-0.5">{keepImageIds.length + newImages.length}/10 total</span>
              <input type="file" accept="image/*" multiple onChange={handleNewImageChange} className="hidden" />
            </label>

            {newPreviews.length > 0 && (
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                {newPreviews.map((url, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-100">
                    <Image src={url} alt="" fill className="object-cover" sizes="120px" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <span className="absolute bottom-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500 text-white">New</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3 pb-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 h-11 rounded-xl font-bold text-sm border transition-all hover:bg-gray-50"
              style={{ borderColor: "#e5e7eb", color: "#374151" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 h-11 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #1B3F72, #2d5fa0)" }}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving…
                </span>
              ) : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
