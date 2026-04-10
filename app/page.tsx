import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TrendingUp, Building2, HandshakeIcon, MapPin } from "lucide-react";
import PropertyCard from "@/components/property/PropertyCard";
import HeroSearch from "@/components/HeroSearch";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import { Property } from "@/lib/types";

async function getFeaturedProperties(): Promise<Property[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"}/properties/featured`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data?.properties || [];
  } catch {
    return [];
  }
}

const PROPERTY_TYPES = [
  { label: "Apartment", value: "apartment", icon: "🏢" },
  { label: "House",     value: "house",     icon: "🏠" },
  { label: "Villa",     value: "villa",     icon: "🏡" },
  { label: "Plot",      value: "plot",      icon: "🌳" },
  { label: "Commercial",value: "commercial",icon: "🏬" },
  { label: "PG",        value: "pg",        icon: "🛋️" },
];

const CITIES = ["Haridwar", "Roorkee", "Dehradun", "Mussoorie", "Muzaffarnagar", "Saharanpur"];

const STATS = [
  { label: "Cities Covered",    value: "6+",   icon: "📍" },
  { label: "Properties Listed", value: "500+", icon: "🏠" },
  { label: "Happy Clients",     value: "200+", icon: "🤝" },
  { label: "Years Experience",  value: "5+",   icon: "⭐" },
];

const WHY_ITEMS = [
  {
    icon: <Building2 className="w-7 h-7 text-[#1B3F72]" />,
    title: "Local Market Expertise",
    desc: "Deep knowledge of Haridwar, Dehradun, Roorkee, and Mussoorie real estate markets.",
  },
  {
    icon: <HandshakeIcon className="w-7 h-7 text-[#1B3F72]" />,
    title: "Honest Guidance",
    desc: "Transparent dealings, no hidden charges. Your trust is our most valuable asset.",
  },
  {
    icon: <TrendingUp className="w-7 h-7 text-[#1B3F72]" />,
    title: "Long-Term Value",
    desc: "We focus on investments that create lasting wealth — not just quick transactions.",
  },
];

export default async function HomePage() {
  const featuredProperties = await getFeaturedProperties();

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#1B3F72] via-[#16305a] to-[#0f2044] text-white py-14 sm:py-20 px-4 overflow-hidden">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#C8922A]/10 blur-3xl pointer-events-none animate-float" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" style={{ animationDelay: "1.5s" }} />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6 backdrop-blur-sm animate-fade-down">
            <span className="w-2 h-2 rounded-full bg-[#C8922A] animate-pulse" />
            Uttarakhand &amp; UP&apos;s Trusted Real Estate Partner
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight tracking-tight animate-fade-up delay-100">
            Find Your Perfect <br />
            <span className="text-[#C8922A]">Property in the Hills</span>
          </h1>

          <p className="text-blue-100 text-lg mb-4 max-w-2xl mx-auto leading-relaxed animate-fade-up delay-200">
            Residential &amp; commercial properties across Haridwar, Dehradun, Roorkee, Mussoorie, Muzaffarnagar &amp; Saharanpur.
          </p>
          <p className="text-blue-200/70 text-sm mb-10 max-w-xl mx-auto italic animate-fade-up delay-300">
            &ldquo;Honest guidance, strong market understanding, and long-term value creation.&rdquo;
          </p>

          <div className="animate-fade-up delay-400">
            <HeroSearch />
          </div>

          {/* City Pills */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm animate-fade-up delay-500">
            {CITIES.map((city) => (
              <Link
                key={city}
                href={`/properties?city=${city}`}
                className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-1.5 rounded-full transition-all duration-200 backdrop-blur-sm text-xs font-medium hover:scale-105"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className="py-10 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map(({ label, value, icon }, i) => (
              <ScrollReveal key={label} delay={i * 100} direction="up">
                <div className="group">
                  <div className="text-3xl mb-1 group-hover:scale-110 transition-transform duration-300">
                    {icon}
                  </div>
                  <p className="text-2xl font-bold text-[#1B3F72]">
                    <AnimatedCounter value={value} />
                  </p>
                  <p className="text-sm text-gray-500">{label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── About the Owner ───────────────────────────────────────────────── */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="bg-gradient-to-r from-[#EEF3FB] to-white rounded-2xl border border-[#D6E4F7] p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center hover:shadow-md transition-shadow duration-300">
            <div className="w-24 h-24 rounded-full bg-[#1B3F72] flex items-center justify-center text-white text-4xl font-bold shrink-0 shadow-lg hover:scale-105 transition-transform duration-300">
              G
            </div>
            <div>
              <p className="text-xs font-semibold text-[#C8922A] uppercase tracking-wider mb-1">About the Founder</p>
              <h2 className="text-xl font-extrabold mb-1">
                <span className="text-[#1B3F72]">Gaejraaj </span><span className="text-[#C8922A]">Properties</span>
              </h2>
              <p className="text-sm text-gray-500 mb-3">Founder — Residential &amp; Commercial Real Estate | Haridwar · Dehradun · Roorkee</p>
              <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
                Actively working across Haridwar, Roorkee, Dehradun, Mussoorie, Muzaffarnagar, and Saharanpur, I help clients buy, sell, and invest in real estate with confidence and clarity. My approach is simple — honest guidance, strong market understanding, and long-term value creation.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Residential Property", "Commercial Property", "Investment Consulting", "Buying & Selling"].map((s) => (
                  <span key={s} className="text-xs bg-[#EEF3FB] text-[#1B3F72] border border-[#D6E4F7] px-3 py-1 rounded-full font-medium hover:bg-[#D6E4F7] transition-colors duration-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Property Types ────────────────────────────────────────────────── */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#1B3F72]">Browse by Type</h2>
            <p className="text-gray-500 mt-1">Residential &amp; commercial properties across 6 cities</p>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
          {PROPERTY_TYPES.map(({ label, value, icon }, i) => (
            <ScrollReveal key={value} delay={i * 75} direction="up">
              <Link
                href={`/properties?type=${value}`}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#ADC8EE] hover:shadow-md hover:bg-[#EEF3FB] transition-all duration-200 group hover:-translate-y-1"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200">{icon}</span>
                <span className="text-xs font-semibold text-gray-600 group-hover:text-[#1B3F72] text-center transition-colors duration-200">{label}</span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Cities We Serve ───────────────────────────────────────────────── */}
      <section className="py-12 bg-[#1B3F72] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-white">Cities We Serve</h2>
              <p className="text-blue-200 mt-1 text-sm">Actively operating across Uttarakhand &amp; Western UP</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CITIES.map((city, i) => (
              <ScrollReveal key={city} delay={i * 80} direction="up">
                <Link
                  href={`/properties?city=${city}`}
                  className="bg-white/10 hover:bg-[#C8922A] border border-white/20 rounded-xl p-4 text-center transition-all duration-200 group hover:-translate-y-1 hover:shadow-lg block"
                >
                  <MapPin className="w-5 h-5 text-[#C8922A] group-hover:text-white mx-auto mb-2 transition-colors duration-200 group-hover:scale-110" />
                  <p className="text-white font-semibold text-sm">{city}</p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Properties ───────────────────────────────────────────── */}
      {featuredProperties.length > 0 && (
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[#1B3F72] flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-[#C8922A]" />
                  Featured Properties
                </h2>
                <p className="text-gray-500 mt-1">Handpicked premium listings</p>
              </div>
              <Link
                href="/properties"
                className={cn(buttonVariants({ variant: "outline" }), "text-[#1B3F72] border-[#ADC8EE] hover:bg-[#EEF3FB]")}
              >
                View All
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.slice(0, 6).map((property, i) => (
              <ScrollReveal key={property._id} delay={i * 80} direction="up">
                <PropertyCard property={property} />
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* ── Why Choose ────────────────────────────────────────────────────── */}
      <section className="py-12 bg-[#EEF3FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <h2 className="text-2xl font-extrabold text-center mb-10">
              Why Choose <span className="text-[#1B3F72]">Gaejraaj</span> <span className="text-[#C8922A]">Properties</span>?
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WHY_ITEMS.map(({ icon, title, desc }, i) => (
              <ScrollReveal key={title} delay={i * 120} direction="up">
                <div className="bg-white rounded-xl p-6 border border-[#D6E4F7] hover:shadow-md hover:-translate-y-1 transition-all duration-300 group h-full text-center">
                  <div className="w-12 h-12 bg-[#EEF3FB] rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-[#D6E4F7] group-hover:scale-110 transition-all duration-300">
                    {icon}
                  </div>
                  <h3 className="font-bold text-[#1B3F72] mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 border-t border-gray-100">
        <ScrollReveal direction="up" className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-[#EEF3FB] text-[#1B3F72] text-xs font-semibold px-4 py-1.5 rounded-full mb-5 border border-[#D6E4F7]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8922A]" />
            Uttarakhand &amp; UP&apos;s Trusted Partner
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B3F72] mb-4 leading-tight">
            Let&apos;s Explore Real Estate<br className="hidden sm:block" /> Opportunities
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed max-w-xl mx-auto">
            Looking to buy, sell, or invest in property across Uttarakhand &amp; UP? Connect with us today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/register"
              className={cn(buttonVariants({ size: "lg" }), "bg-[#C8922A] hover:bg-[#a6781e] text-white border-0 hover:shadow-lg hover:-translate-y-px transition-all duration-200 font-semibold")}
            >
              Get Started Free
            </Link>
            <Link
              href="/properties"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-[#1B3F72] text-[#1B3F72] hover:bg-[#EEF3FB] font-semibold transition-all duration-200")}
            >
              Browse Properties
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
