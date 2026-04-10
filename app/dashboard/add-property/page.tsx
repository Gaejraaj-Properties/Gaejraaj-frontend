"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Image from "next/image";
import { Upload, X, CheckCircle2, ChevronDown } from "lucide-react";

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

export default function AddPropertyPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
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
    if (!authLoading && user && user.role === "buyer") {
      toast.error("Only sellers and agents can post properties");
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const f = (key: string) => (value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  const fi = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (selectedImages.length + files.length > 10) { toast.error("Maximum 10 images allowed"); return; }
    setSelectedImages((prev) => [...prev, ...files]);
    setPreviewUrls((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (idx: number) => {
    URL.revokeObjectURL(previewUrls[idx]);
    setSelectedImages((prev) => prev.filter((_, i) => i !== idx));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== idx));
  };

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
      selectedAmenities.forEach((a) => fd.append("amenities[]", a));
      selectedImages.forEach((img) => fd.append("images", img));

      await api.post("/properties", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Property submitted for review!");
      router.push("/dashboard");
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to submit property");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) return <div className="min-h-screen" style={{ background: "#f4f6fb" }} />;

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
            <span className="text-gray-600 font-medium">Post Property</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1B3F72]">Post a Property</h1>
          <p className="text-gray-400 text-sm mt-0.5">Fill in the details below. Your listing will be reviewed before going live.</p>
        </div>
      </div>

      <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* 1. Basic Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <SectionTitle step={1}>Basic Information</SectionTitle>
            <div className="space-y-4">
              <div>
                <FieldLabel required>Title</FieldLabel>
                <Input placeholder="e.g. 3 BHK Apartment near Haridwar Bypass" value={form.title} onChange={fi("title")} required minLength={10} className="h-11 text-sm" />
              </div>
              <div>
                <FieldLabel required>Description</FieldLabel>
                <textarea
                  rows={5}
                  placeholder="Describe the property, neighbourhood, nearby landmarks..."
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
                    {["apartment", "house", "villa", "plot", "commercial", "farmhouse", "pg", "studio"].map((t) => (
                      <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
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
                <Input type="number" placeholder="e.g. 5000000" value={form.price} onChange={fi("price")} required min="0" className="h-11 text-sm" />
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
                <Input type="number" placeholder="e.g. 1200" value={form.area_value} onChange={fi("area_value")} required min="0" className="h-11 text-sm" />
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
                <Input placeholder="Street address, area..." value={form.address} onChange={fi("address")} required className="h-11 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel required>City</FieldLabel>
                  <Input placeholder="e.g. Haridwar" value={form.city} onChange={fi("city")} required className="h-11 text-sm" />
                </div>
                <div>
                  <FieldLabel required>State</FieldLabel>
                  <Input placeholder="e.g. Uttarakhand" value={form.state} onChange={fi("state")} required className="h-11 text-sm" />
                </div>
                <div>
                  <FieldLabel required>Pincode</FieldLabel>
                  <Input placeholder="6-digit pincode" value={form.pincode} onChange={fi("pincode")} required maxLength={6} pattern="\d{6}" className="h-11 text-sm" />
                </div>
                <div>
                  <FieldLabel>Landmark</FieldLabel>
                  <Input placeholder="Near..." value={form.landmark} onChange={fi("landmark")} className="h-11 text-sm" />
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
            <SectionTitle step={6}>Photos <span className="text-gray-400 font-normal normal-case text-sm">(up to 10)</span></SectionTitle>

            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#C8922A] hover:bg-[#EEF3FB]/50 transition-all">
              <Upload className="w-6 h-6 text-gray-300 mb-2" />
              <span className="text-sm text-gray-400 font-medium">Click to upload images</span>
              <span className="text-xs text-gray-300 mt-0.5">{selectedImages.length}/10 uploaded</span>
              <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
            </label>

            {previewUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                {previewUrls.map((url, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-100">
                    <Image src={url} alt="" fill className="object-cover" sizes="120px" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "#1B3F72", color: "#fff" }}>
                        Primary
                      </span>
                    )}
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
                  Submitting…
                </span>
              ) : "Submit for Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
