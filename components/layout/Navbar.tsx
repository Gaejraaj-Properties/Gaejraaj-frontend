"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  Building2,
  Menu,
  Plus,
  User,
  LogOut,
  LayoutDashboard,
  Heart,
  Home,
  ChevronDown,
} from "lucide-react";
import EnquiryModal from "@/components/EnquiryModal";

const NAV_LINKS = [
  { href: "/properties",               label: "Properties" },
  { href: "/properties?listingType=sale", label: "Buy"        },
  { href: "/properties?listingType=rent", label: "Rent"       },
  { href: "/about",                    label: "About"      },
];

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [enquireOpen,   setEnquireOpen]   = useState(false);

  const handleLogout = () => { logout(); router.push("/"); };

  const canPost = user?.role === "seller" || user?.role === "agent" || user?.role === "admin";


  const solid = true;

  return (
    <>
    <nav
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        solid
          ? "bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-[0_1px_12px_rgba(0,0,0,0.06)]"
          : "bg-transparent border-b border-white/10"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ─────────────────────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1B3F72] to-[#2d5fa0] flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
              <Building2 className="w-[18px] h-[18px] text-white" />
            </div>
            <div className="flex flex-col leading-none gap-[3px]">
              <span className="font-extrabold text-[18px] tracking-tight leading-none text-[#1B3F72]">
                Gaejraaj <span className="text-[#C8922A]">Properties</span>
              </span>
              <span className="text-[9px] font-semibold text-gray-400 tracking-[0.2em] uppercase leading-none">
                Real Estate
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav Links ─────────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map(({ href, label }) => {
              const [base, query] = href.split("?");
              const isActive = base === "/"
                ? pathname === "/"
                : query
                  ? pathname === base && searchParams.toString() === query
                  : pathname.startsWith(base) && !searchParams.get("listingType");
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative px-4 py-2 text-[13px] font-medium rounded-lg transition-all duration-200 group",
                    isActive
                      ? "text-[#1B3F72] bg-[#EEF3FB] font-semibold"
                      : "text-gray-600 hover:text-[#1B3F72] hover:bg-[#EEF3FB]"
                  )}
                >
                  {label}
                  {/* underline — always visible when active, animates in on hover */}
                  <span
                    className={cn(
                      "absolute bottom-[5px] left-4 right-4 h-[2px] rounded-full origin-left transition-transform duration-200 bg-[#C8922A]",
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                </Link>
              );
            })}
          </div>

          {/* ── Desktop Auth ──────────────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={() => setEnquireOpen(true)}
              className="group relative inline-flex items-center gap-2 px-4 py-[7px] text-[13px] font-semibold rounded-lg bg-[#1B3F72] text-white hover:bg-[#142f55] shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-px active:scale-95 overflow-hidden"
            >
              {/* subtle shimmer sweep */}
              <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
              {/* live indicator dot */}
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8922A] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C8922A]" />
              </span>
              Enquire Now
            </button>
            {isAuthenticated ? (
              <>
                {canPost && (
                  <Link
                    href="/dashboard/add-property"
                    className="inline-flex items-center gap-1.5 px-4 py-[7px] text-[13px] font-semibold text-white rounded-lg bg-gradient-to-r from-[#C8922A] to-[#dfa030] hover:from-[#b07822] hover:to-[#c8922a] shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-px active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Post Property
                  </Link>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none">
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-colors duration-150 group cursor-pointer">
                      <Avatar className="h-8 w-8 ring-2 ring-[#D6E4F7] group-hover:ring-[#ADC8EE] transition-all duration-200">
                        <AvatarImage src={user?.fullProfileUrl || user?.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-[#1B3F72] to-[#2d5fa0] text-white text-xs font-bold">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden lg:flex flex-col leading-none">
                        <span className="text-[13px] font-semibold text-gray-800 leading-tight max-w-[90px] truncate">{user?.name?.split(" ")[0]}</span>
                        <span className="text-[10px] text-[#C8922A] font-medium capitalize">{user?.role}</span>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#1B3F72] transition-colors duration-200" />
                    </div>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-52 mt-2 p-1.5 rounded-xl border border-gray-200 shadow-lg shadow-black/8 bg-white">
                    {/* Compact user info */}
                    <div className="px-3 py-2 mb-1">
                      <p className="text-[13px] font-semibold text-gray-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                    </div>

                    <DropdownMenuSeparator className="my-1 bg-gray-100" />

                    <DropdownMenuItem onClick={() => router.push("/dashboard")} className="cursor-pointer rounded-lg px-3 py-2 text-[13px] text-gray-700 hover:text-[#1B3F72] hover:bg-[#EEF3FB] focus:bg-[#EEF3FB] gap-2.5">
                      <LayoutDashboard className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      Dashboard
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => router.push("/saved")} className="cursor-pointer rounded-lg px-3 py-2 text-[13px] text-gray-700 hover:text-[#1B3F72] hover:bg-[#EEF3FB] focus:bg-[#EEF3FB] gap-2.5">
                      <Heart className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      Saved
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer rounded-lg px-3 py-2 text-[13px] text-gray-700 hover:text-[#1B3F72] hover:bg-[#EEF3FB] focus:bg-[#EEF3FB] gap-2.5">
                      <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      Profile
                    </DropdownMenuItem>

                    {canPost && (
                      <DropdownMenuItem onClick={() => router.push("/dashboard/add-property")} className="cursor-pointer rounded-lg px-3 py-2 text-[13px] text-gray-700 hover:text-[#1B3F72] hover:bg-[#EEF3FB] focus:bg-[#EEF3FB] gap-2.5">
                        <Plus className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        Post Property
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator className="my-1 bg-gray-100" />

                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer rounded-lg px-3 py-2 text-[13px] text-red-500 hover:text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600 gap-2.5">
                      <LogOut className="w-3.5 h-3.5 shrink-0" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className={cn(
                    "px-4 py-[7px] text-[13px] font-medium rounded-lg transition-all duration-200",
                    solid
                      ? "text-[#1B3F72] hover:bg-[#EEF3FB]"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  )}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className={cn(
                    "px-4 py-[7px] text-[13px] font-semibold text-white rounded-lg transition-all duration-200 hover:-translate-y-px active:scale-95",
                    solid
                      ? "bg-[#1B3F72] hover:bg-[#142f55] shadow-sm hover:shadow-md"
                      : "bg-white/15 hover:bg-white/25 border border-white/30"
                  )}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile Trigger ────────────────────────────────────────────── */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className={cn(
                "md:hidden inline-flex items-center justify-center rounded-lg w-9 h-9 transition-colors",
                solid ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/10 text-white"
              )}
            >
              <Menu className="w-5 h-5" />
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px] p-0 border-l border-gray-100 flex flex-col">
              {/* Sheet brand header */}
              <div className="bg-gradient-to-br from-[#1B3F72] to-[#0f2044] px-5 py-5 shrink-0">
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-extrabold text-base leading-none">
                      <span className="text-white">Gaejraaj </span><span className="text-[#C8922A]">Properties</span>
                    </p>
                    <p className="text-blue-300/70 text-[9px] font-semibold tracking-[0.2em] uppercase mt-0.5">Real Estate</p>
                  </div>
                </div>

                {isAuthenticated && (
                  <div className="mt-4 flex items-center gap-3 bg-white/10 rounded-xl p-3">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={user?.fullProfileUrl || user?.avatar} />
                      <AvatarFallback className="bg-[#D6E4F7] text-[#1B3F72] font-bold text-sm">
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
                      <p className="text-blue-300 text-xs capitalize">{user?.role}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sheet body */}
              <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-1">
                  Navigation
                </p>
                {[
                  { href: "/",                          label: "Home",        icon: <Home className="w-4 h-4" />      },
                  { href: "/properties",                label: "Properties",  icon: <Building2 className="w-4 h-4" /> },
                  { href: "/properties?listingType=sale", label: "Buy",       icon: null },
                  { href: "/properties?listingType=rent", label: "Rent",      icon: null },
                  { href: "/about",                     label: "About",       icon: <User className="w-4 h-4" />      },
                ].map(({ href, label, icon }) => {
                  const [base, query] = href.split("?");
                  const isActive = base === "/"
                    ? pathname === "/"
                    : query
                      ? pathname === base && searchParams.toString() === query
                      : pathname.startsWith(base) && !searchParams.get("listingType");
                  return (
                    <Link
                      key={href + label}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150",
                        isActive
                          ? "text-[#1B3F72] bg-[#EEF3FB] font-semibold"
                          : "text-gray-700 hover:text-[#1B3F72] hover:bg-[#EEF3FB]"
                      )}
                    >
                      {icon
                        ? <span className={isActive ? "text-[#C8922A] shrink-0" : "text-[#1B3F72] shrink-0"}>{icon}</span>
                        : <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                            <span className={cn("w-1.5 h-1.5 rounded-full", isActive ? "bg-[#C8922A]" : "bg-gray-300")} />
                          </span>
                      }
                      {label}
                      {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C8922A]" />}
                    </Link>
                  );
                })}
                <button
                  onClick={() => { setMobileOpen(false); setEnquireOpen(true); }}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-white bg-[#1B3F72] hover:bg-[#142f55] rounded-lg transition-colors duration-150 w-full mt-1"
                >
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8922A] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C8922A]" />
                  </span>
                  Enquire Now
                </button>

                {isAuthenticated && (
                  <>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mt-4 mb-1">
                      Account
                    </p>
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[#1B3F72] hover:bg-[#EEF3FB] rounded-lg transition-colors">
                      <LayoutDashboard className="w-4 h-4 text-[#1B3F72]" />
                      Dashboard
                    </Link>
                    <Link href="/saved" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[#1B3F72] hover:bg-[#EEF3FB] rounded-lg transition-colors">
                      <Heart className="w-4 h-4 text-[#1B3F72]" />
                      Saved Properties
                    </Link>
                    <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[#1B3F72] hover:bg-[#EEF3FB] rounded-lg transition-colors">
                      <User className="w-4 h-4 text-[#1B3F72]" />
                      Profile
                    </Link>
                  </>
                )}

                {/* Action buttons */}
                <div className="mt-4 flex flex-col gap-2">
                  {canPost && (
                    <Link
                      href="/dashboard/add-property"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-[#C8922A] to-[#dfa030] hover:from-[#b07822] hover:to-[#c8922a] transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Post Property
                    </Link>
                  )}
                  {isAuthenticated ? (
                    <button
                      onClick={() => { handleLogout(); setMobileOpen(false); }}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-500 rounded-lg border border-red-100 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center px-4 py-2.5 text-sm font-medium text-[#1B3F72] rounded-lg border border-[#ADC8EE] hover:bg-[#EEF3FB] transition-colors"
                      >
                        Login
                      </Link>
                      <Link
                        href="/auth/register"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white rounded-lg bg-[#1B3F72] hover:bg-[#142f55] transition-colors"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

        </div>
      </div>
    </nav>

    <EnquiryModal
      isOpen={enquireOpen}
      onClose={() => setEnquireOpen(false)}
      initialName={user?.name || ""}
      initialEmail={user?.email || ""}
    />
    </>
  );
}
