"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Eye, EyeOff, ShieldCheck, MapPin, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
const GoogleAuthButton = dynamic(() => import("@/components/auth/GoogleAuthButton"), { ssr: false });
import { cn } from "@/lib/utils";

const FEATURES = [
  { icon: <ShieldCheck className="w-4 h-4" />, text: "Verified listings across 6 cities" },
  { icon: <MapPin className="w-4 h-4" />,      text: "Haridwar, Dehradun, Roorkee & more" },
  { icon: <TrendingUp className="w-4 h-4" />,  text: "Expert guidance for buyers & sellers" },
];

type FormFields = "email" | "password";
type Errors = Partial<Record<FormFields, string>>;
type Touched = Partial<Record<FormFields, boolean>>;

function validateLogin(form: { email: string; password: string }): Errors {
  const errors: Errors = {};
  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Enter a valid email address";
  }
  if (!form.password) {
    errors.password = "Password is required";
  } else if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }
  return errors;
}

function LoginPageInner() {
  const { login, loginWithGoogle, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) router.replace(from);
  }, [isAuthenticated, authLoading, router, from]);

  const touch = (field: FormFields) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validateLogin({ ...form }));
  };

  const handleChange = (field: FormFields, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (touched[field]) setErrors(validateLogin(updated));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched: Touched = { email: true, password: true };
    setTouched(allTouched);
    const errs = validateLogin(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      router.push(from);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Invalid credentials";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (field: FormFields) =>
    cn("h-11 text-sm", touched[field] && errors[field] && "border-red-400 focus-visible:ring-red-200");

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
            Your Trusted<br />
            <span className="text-[#C8922A]">Real Estate Partner</span>
          </h2>
          <p className="text-blue-200/80 text-sm leading-relaxed mb-8 max-w-xs">
            Helping clients buy, sell, and invest in property across Uttarakhand &amp; Uttar Pradesh since day one.
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
        <div className="w-full max-w-[400px] animate-fade-up">
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
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Welcome back</h1>
            <p className="text-gray-500 text-sm">Sign in to continue to your account</p>
          </div>

          {/* Google sign-in */}
          <div className="mb-3">
            <GoogleAuthButton
              label="Continue with Google"
              onSuccess={(token, user) => {
                loginWithGoogle(token as string, user as import("@/lib/types").User);
                toast.success("Welcome!");
                router.push(from);
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
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => touch("email")}
                  autoComplete="email"
                  className={fieldClass("email")}
                />
                {touched.email && errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Your password"
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    onBlur={() => touch("password")}
                    autoComplete="current-password"
                    className={cn(fieldClass("password"), "pr-10")}
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
                className="w-full h-11 bg-[#1B3F72] hover:bg-[#142f55] text-white border-0 font-semibold text-sm mt-2 hover:shadow-md transition-all duration-200 hover:-translate-y-px active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : "Sign In"}
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-[#C8922A] font-bold hover:text-[#a6781e] transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  );
}
