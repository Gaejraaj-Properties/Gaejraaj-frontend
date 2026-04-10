import Link from "next/link";
import { Building2, Mail, MapPin, ExternalLink } from "lucide-react";

const LOCATIONS   = ["Haridwar", "Roorkee", "Dehradun", "Mussoorie", "Muzaffarnagar", "Saharanpur"];
const QUICK_LINKS = [
  { href: "/properties",                    label: "All Properties" },
  { href: "/properties?listingType=sale",   label: "Buy Property"   },
  { href: "/properties?listingType=rent",   label: "Rent Property"  },
  { href: "/properties?type=commercial",    label: "Commercial"     },
  { href: "/auth/register",                 label: "Post Free Ad"   },
];
const SERVICES = [
  "Residential Property",
  "Commercial Property",
  "Investment Consulting",
  "Property Buying & Selling",
  "Plot & Land Deals",
];

export default function Footer() {
  return (
    <footer className="bg-[#0a1929] text-gray-400 mt-16">
      {/* Top gradient accent line */}
      <div className="h-[3px] bg-gradient-to-r from-[#1B3F72] via-[#C8922A] to-[#1B3F72]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* ── Brand column ─────────────────────────────────────────── */}
          <div className="md:col-span-5">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C8922A] to-[#e0a030] flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-extrabold text-lg leading-none tracking-tight">
                  <span className="text-white">Gaejraaj </span><span className="text-[#C8922A]">Properties</span>
                </p>
                <p className="text-gray-500 text-[9px] font-semibold tracking-[0.2em] uppercase mt-0.5">Real Estate</p>
              </div>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed max-w-sm mb-6">
              Trusted real estate partner across Uttarakhand &amp; Uttar Pradesh. Honest guidance, strong market understanding, and long-term value creation.
            </p>

            {/* Contact */}
            <div className="flex flex-col gap-2.5 text-sm mb-6">
              <a
                href="https://www.linkedin.com/in/gaejraaj-properties-19a72a3a9/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-[#C8922A] transition-colors group w-fit"
              >
                <span className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-[#C8922A]/15 flex items-center justify-center transition-colors">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </span>
                LinkedIn Profile
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
              </a>
              <a href="mailto:info@gaejraaj.com" className="flex items-center gap-2.5 hover:text-[#C8922A] transition-colors group w-fit">
                <span className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-[#C8922A]/15 flex items-center justify-center transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                </span>
                info@gaejraaj.com
              </a>
              <span className="flex items-center gap-2.5 text-gray-500">
                <span className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5" />
                </span>
                Uttarakhand &amp; Uttar Pradesh, India
              </span>
            </div>

            {/* City pills */}
            <div>
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2.5">Working Locations</p>
              <div className="flex flex-wrap gap-1.5">
                {LOCATIONS.map((city) => (
                  <Link
                    key={city}
                    href={`/properties?city=${city}`}
                    className="text-xs bg-white/5 hover:bg-[#C8922A] hover:text-white border border-white/8 px-2.5 py-1 rounded-full transition-all duration-150"
                  >
                    {city}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── Quick Links ───────────────────────────────────────────── */}
          <div className="md:col-span-3 md:col-start-7">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Quick Links</h3>
            <ul className="flex flex-col gap-2.5">
              {QUICK_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-400 hover:text-[#C8922A] transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-[#C8922A] transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Services ──────────────────────────────────────────────── */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Our Services</h3>
            <ul className="flex flex-col gap-2.5">
              {SERVICES.map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className="text-[#C8922A] mt-1 text-xs leading-none">›</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ───────────────────────────────────────────────── */}
        <div className="border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-gray-600">
            © {new Date().getFullYear()} Gaejraaj Properties. All rights reserved.
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-gray-600">Serving Uttarakhand &amp; Uttar Pradesh</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
