"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Eye, EyeOff, ShieldCheck, MapPin, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import { cn } from "@/lib/utils";

const FEATURES = [
  { icon: <ShieldCheck className="w-4 h-4" />, text: "Post properties for free" },
  { icon: <MapPin className="w-4 h-4" />,      text: "Reach buyers across 6 cities" },
  { icon: <TrendingUp className="w-4 h-4" />,  text: "Save & track your favourite listings" },
];

type FormFields = "name" | "email" | "phone" | "password";
type Errors  = Partial<Record<FormFields, string>>;
type Touched = Partial<Record<FormFields, boolean>>;

function validateRegister(form: { name: string; email: string; phone: string; password: string }): Errors {
  const errors: Errors = {};

  if (!form.name.trim()) {
    errors.name = "Name is required";
  } else if (form.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  } else if (form.name.trim().length > 100) {
    errors.name = "Name cannot exceed 100 characters";
  }

  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Enter a valid email address";
  }

  if (form.phone && !/^[+]?[\d\s\-()\u200e]{7,15}$/.test(form.phone)) {
    errors.phone = "Enter a valid phone number";
  }

  if (!form.password) {
    errors.password = "Password is required";
  } else if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
}

export default function RegisterPage() {
  const { register, loginWithGoogle, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "buyer" });
  const [errors,  setErrors]  = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) router.replace("/");
  }, [isAuthenticated, authLoading, router]);

  const touch = (field: FormFields) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validateRegister(form));
  };

  const handleChange = (field: FormFields, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (touched[field]) setErrors(validateRegister(updated));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched: Touched = { name: true, email: true, phone: true, password: true };
    setTouched(allTouched);
    const errs = validateRegister(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      await register(form);
      toast.success("Account created successfully!");
      router.push("/");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Registration failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (field: FormFields, extra = "") =>
    cn("h-11 text-sm", extra, touched[field] && errors[field] && "border-red-400 focus-visible:ring-red-200");

  return (
    <div className="min-h-screen flex">
      {/* ── Left brand panel ──────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[44%] bg-gradient-to-br from-[#1B3F72] via-[#16305a] to-[#0f2044] text-white flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#C8922A]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "36px 36px" }} />

        <div className="flex items-center gap-2.5 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-extrabold text-lg leading-none">
              <span className="text-white">Gaejraaj </span><span className="text-[#C8922A]">Properties</span>
            </p>
            <p className="text-blue-300/70 text-[9px] font-semibold tracking-[0.2em] uppercase mt-0.5">Real Estate</p>
          </div>
        </div>

        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold mb-4 leading-tight">
            Join Gaejraaj<br />
            <span className="text-[#C8922A]">Properties Today</span>
          </h2>
          <p className="text-blue-200/80 text-sm leading-relaxed mb-8 max-w-xs">
            Whether you&apos;re buying, renting, or selling — create a free account and get started in minutes.
          </p>
          <div className="flex flex-col gap-3">
            {FEATURES.map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3 bg-white/8 border border-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
                <span className="text-[#C8922A] shrink-0">{icon}</span>
                <span className="text-sm text-blue-100">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-blue-200/40 text-xs italic relative z-10 max-w-xs">
          &ldquo;Honest guidance, strong market understanding, and long-term value creation.&rdquo;
        </p>
      </div>

      {/* ── Right form panel ──────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#F5F7FA]">
        <div className="w-full max-w-[420px] animate-fade-up">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1B3F72] to-[#2d5fa0] rounded-xl flex items-center justify-center shadow">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-extrabold text-lg leading-none">
                <span className="text-[#1B3F72]">Gaejraaj </span><span className="text-[#C8922A]">Properties</span>
              </p>
              <p className="text-gray-400 text-[9px] font-semibold tracking-[0.2em] uppercase mt-0.5">Real Estate</p>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Create your account</h1>
            <p className="text-gray-500 text-sm">Free forever — no credit card required</p>
          </div>

          {/* Google sign-up */}
          <div className="mb-3">
            <GoogleAuthButton
              label="Sign up with Google"
              onSuccess={(token, user) => {
                loginWithGoogle(token as string, user as import("@/lib/types").User);
                toast.success("Account created!");
                router.push("/");
              }}
              onError={(msg) => toast.error(msg)}
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>

              {/* Name + Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Full Name</label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onBlur={() => touch("name")}
                    className={fieldClass("name")}
                  />
                  {touched.name && errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Phone <span className="normal-case font-normal text-gray-400">(optional)</span>
                  </label>
                  <Input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    onBlur={() => touch("phone")}
                    className={fieldClass("phone")}
                  />
                  {touched.phone && errors.phone && (
                    <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => touch("email")}
                  className={fieldClass("email")}
                />
                {touched.email && errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">I am a</label>
                <Select value={form.role} onValueChange={(val) => setForm((f) => ({ ...f, role: val ?? f.role }))}>
                  <SelectTrigger className="h-11 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buyer">Buyer / Tenant</SelectItem>
                    <SelectItem value="seller">Property Owner / Seller</SelectItem>
                    <SelectItem value="agent">Real Estate Agent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    onBlur={() => touch("password")}
                    className={fieldClass("password", "pr-10")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#1B3F72] hover:bg-[#142f55] text-white border-0 font-semibold text-sm mt-1 hover:shadow-md transition-all duration-200 hover:-translate-y-px active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account…
                  </span>
                ) : "Create Account"}
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#C8922A] font-bold hover:text-[#a6781e] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
