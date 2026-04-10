import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { MapPin, Building2, HandshakeIcon, TrendingUp, ShieldCheck, ExternalLink } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const CITIES = ["Haridwar", "Roorkee", "Dehradun", "Mussoorie", "Muzaffarnagar", "Saharanpur"];

const SERVICES = [
  { icon: Building2,      title: "Residential Property",      desc: "Apartments, houses, villas, plots — we help you find the perfect home across Uttarakhand & UP." },
  { icon: Building2,      title: "Commercial Property",        desc: "Offices, shops, and commercial spaces for your business needs in prime locations." },
  { icon: TrendingUp,     title: "Investment Consulting",      desc: "Strategic guidance to help you invest in real estate that delivers long-term returns." },
  { icon: HandshakeIcon,  title: "Property Buying & Selling",  desc: "End-to-end support through the entire buying or selling journey — transparent and hassle-free." },
];

const VALUES = [
  { icon: "🎯", title: "Honest Guidance",   desc: "Transparent dealings, no hidden charges. Your trust is our most valuable asset." },
  { icon: "📊", title: "Market Expertise",  desc: "Deep knowledge of Uttarakhand & UP real estate markets built over years of active work." },
  { icon: "🏆", title: "Long-Term Value",   desc: "We focus on investments that create lasting wealth, not just quick transactions." },
];

export default function AboutPage() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#1B3F72] via-[#16305a] to-[#0f2044] text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "36px 36px" }} />
        <div className="absolute -top-20 right-0 w-80 h-80 rounded-full bg-[#C8922A]/10 blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-medium mb-6 backdrop-blur-sm animate-fade-down">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C8922A]" />
            Trusted Real Estate Partner
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight animate-fade-up delay-100">
            About <span className="text-white">Gaejraaj</span> <span className="text-[#C8922A]">Properties</span>
          </h1>
          <p className="text-blue-200/80 text-base leading-relaxed max-w-2xl mx-auto animate-fade-up delay-200">
            Residential &amp; Commercial Real Estate across Uttarakhand &amp; Western Uttar Pradesh — built on honest guidance and deep market expertise.
          </p>
        </div>
      </div>

      {/* ── Founder Card ──────────────────────────────────────────────────── */}
      <section className="py-14 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="bg-gradient-to-r from-[#EEF3FB] to-white rounded-2xl border border-[#D6E4F7] p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center hover:shadow-md transition-shadow duration-300">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1B3F72] to-[#2d5fa0] flex items-center justify-center text-white text-4xl font-extrabold shrink-0 shadow-lg ring-4 ring-[#D6E4F7] hover:scale-105 transition-transform duration-300">
              G
            </div>
            <div>
              <p className="text-xs font-semibold text-[#C8922A] uppercase tracking-wider mb-1">About the Founder</p>
              <h2 className="text-xl font-extrabold mb-1">
                <span className="text-[#1B3F72]">Gaejraaj </span><span className="text-[#C8922A]">Properties</span>
              </h2>
              <p className="text-sm text-gray-500 mb-3">Founder — Residential &amp; Commercial Real Estate | Haridwar · Dehradun · Roorkee</p>
              <p className="text-gray-600 leading-relaxed text-sm max-w-2xl">
                Actively working across Haridwar, Roorkee, Dehradun, Mussoorie, Muzaffarnagar, and Saharanpur, I help clients buy, sell, and invest in real estate with confidence and clarity. My approach is simple — honest guidance, strong market understanding, and long-term value creation.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Residential Property", "Commercial Property", "Investment Consulting", "Buying & Selling"].map((s) => (
                  <span key={s} className="text-xs bg-[#EEF3FB] text-[#1B3F72] border border-[#D6E4F7] px-3 py-1 rounded-full font-medium hover:bg-[#D6E4F7] transition-colors duration-200">
                    {s}
                  </span>
                ))}
              </div>
              <a
                href="https://www.linkedin.com/in/gaejraaj-properties-19a72a3a9/"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: "sm" }), "mt-5 bg-[#0077B5] hover:bg-[#006097] text-white border-0 inline-flex gap-2")}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Connect on LinkedIn
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Values (full-width light bg, matches "Why Choose" on homepage) ── */}
      <section className="py-12 bg-[#EEF3FB]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <h2 className="text-2xl font-extrabold text-center mb-10">
              Our <span className="text-[#1B3F72]">Core</span> <span className="text-[#C8922A]">Values</span>
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map(({ icon, title, desc }, i) => (
              <ScrollReveal key={title} delay={i * 120} direction="up">
                <div className="bg-white rounded-xl p-6 border border-[#D6E4F7] hover:shadow-md hover:-translate-y-1 transition-all duration-300 group h-full text-center">
                  <div className="w-12 h-12 bg-[#EEF3FB] rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-[#D6E4F7] group-hover:scale-110 transition-all duration-300 text-2xl">
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

      {/* ── Services ──────────────────────────────────────────────────────── */}
      <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#1B3F72]">Our Services</h2>
            <p className="text-gray-500 mt-1">Residential &amp; commercial expertise across 6 cities</p>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SERVICES.map(({ icon: Icon, title, desc }, i) => (
            <ScrollReveal key={title} delay={i * 80} direction="up">
              <div className="bg-white rounded-xl border border-[#D6E4F7] p-5 flex gap-4 hover:shadow-md hover:border-[#ADC8EE] transition-all duration-200 group h-full">
                <div className="w-11 h-11 bg-[#EEF3FB] group-hover:bg-[#D6E4F7] rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200">
                  <Icon className="w-5 h-5 text-[#1B3F72]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#1B3F72] transition-colors">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Working Locations (full-width dark navy, matches "Cities We Serve") */}
      <section className="py-12 bg-[#1B3F72] overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-white">Working Locations</h2>
              <p className="text-blue-200 mt-1 text-sm">Actively operating across Uttarakhand &amp; Western UP</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CITIES.map((city, i) => (
              <ScrollReveal key={city} delay={i * 70} direction="up">
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

      {/* ── CTA (matches homepage CTA) ────────────────────────────────────── */}
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
              href="/properties"
              className={cn(buttonVariants({ size: "lg" }), "bg-[#C8922A] hover:bg-[#a6781e] text-white border-0 hover:shadow-lg hover:-translate-y-px transition-all duration-200 font-semibold")}
            >
              Browse Properties
            </Link>
            <Link
              href="/auth/register"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-[#1B3F72] text-[#1B3F72] hover:bg-[#EEF3FB] font-semibold transition-all duration-200")}
            >
              Post a Property
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
