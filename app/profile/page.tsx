"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Camera, Lock, Mail, Phone, Shield, Eye, EyeOff } from "lucide-react";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
      <span className="w-1 h-4 rounded-full bg-[#C8922A] shrink-0" />
      {children}
    </h2>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1.5">
      {children}
    </label>
  );
}

export default function ProfilePage() {
  const { user, loading: authLoading, updateUser } = useAuth();
  const router = useRouter();

  const [profileForm, setProfileForm] = useState({ name: "", phone: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/auth/login"); return; }
    setProfileForm({ name: user.name || "", phone: user.phone || "" });
    setAvatarPreview(user.fullProfileUrl || user.avatar || "");
  }, [user, authLoading, router]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const formData = new FormData();
      formData.append("name", profileForm.name);
      formData.append("phone", profileForm.phone);
      if (avatarFile) formData.append("avatar", avatarFile);
      const res = await api.put("/auth/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser(res.data.data.user);
      setAvatarFile(null);
      toast.success("Profile updated!");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Update failed";
      toast.error(msg);
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { toast.error("Passwords do not match"); return; }
    if (passwordForm.newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setSavingPassword(true);
    try {
      await api.put("/auth/update-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Password updated!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Update failed";
      toast.error(msg);
    } finally {
      setSavingPassword(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen" style={{ background: "#f4f6fb" }}>
        <div className="bg-white border-b h-20 animate-pulse" style={{ borderColor: "#edf2f7" }} />
        <div className="max-w-[640px] mx-auto px-4 sm:px-6 py-6 space-y-4">
          <div className="h-48 bg-white rounded-2xl animate-pulse border border-gray-100" />
          <div className="h-64 bg-white rounded-2xl animate-pulse border border-gray-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#f4f6fb" }}>

      {/* Page header */}
      <div className="bg-white border-b" style={{ borderColor: "#edf2f7" }}>
        <div className="max-w-[640px] mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
            <Link href="/" className="hover:text-[#1B3F72] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/dashboard" className="hover:text-[#1B3F72] transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-gray-600 font-medium">Profile</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1B3F72]">My Profile</h1>
        </div>
      </div>

      <div className="max-w-[640px] mx-auto px-4 sm:px-6 py-6 space-y-4">

        {/* ── Avatar + basic info ─────────────────────────────────────────── */}
        <div
          className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
        >
          <SectionTitle>Personal Information</SectionTitle>

          {/* Avatar row */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-50">
            <div className="relative shrink-0">
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-[#D6E4F7] flex items-center justify-center">
                {avatarPreview ? (
                  <Image src={avatarPreview} alt="Avatar" fill className="object-cover" sizes="80px" />
                ) : (
                  <span className="text-3xl font-bold text-[#1B3F72]">{user?.name?.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <label
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                style={{ background: "#1B3F72" }}
                title="Change photo"
              >
                <Camera className="w-3.5 h-3.5 text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>
            <div>
              <p className="font-bold text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
              <span
                className="inline-block mt-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide capitalize"
                style={{ background: "#EEF3FB", color: "#1B3F72" }}
              >
                {user?.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <FieldLabel>Full Name</FieldLabel>
              <Input
                value={profileForm.name}
                onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))}
                required
                minLength={2}
                className="h-11 text-sm"
              />
            </div>
            <div>
              <FieldLabel>Email <span className="normal-case text-gray-300 font-normal">(cannot be changed)</span></FieldLabel>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                <Input
                  value={user?.email || ""}
                  disabled
                  className="h-11 text-sm pl-9 bg-gray-50 text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>
            <div>
              <FieldLabel>Phone <span className="normal-case text-gray-300 font-normal">(optional)</span></FieldLabel>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                <Input
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  className="h-11 text-sm pl-9"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="w-full h-11 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #1B3F72, #2d5fa0)" }}
            >
              {savingProfile ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving…
                </span>
              ) : "Save Changes"}
            </button>
          </form>
        </div>

        {/* ── Change password ─────────────────────────────────────────────── */}
        <div
          className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
        >
          <SectionTitle>Change Password</SectionTitle>

          <form onSubmit={handlePasswordSave} className="space-y-4">
            <div>
              <FieldLabel>Current Password</FieldLabel>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                <Input
                  type={showCurrent ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))}
                  required
                  className="h-11 text-sm pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <FieldLabel>New Password</FieldLabel>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                <Input
                  type={showNew ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
                  required
                  minLength={6}
                  placeholder="Min 6 characters"
                  className="h-11 text-sm pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <FieldLabel>Confirm New Password</FieldLabel>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                <Input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                  required
                  minLength={6}
                  placeholder="Repeat new password"
                  className="h-11 text-sm pl-9"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="w-full h-11 rounded-xl font-bold text-sm transition-all hover:opacity-90 hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed border"
              style={{ borderColor: "#ADC8EE", color: "#1B3F72", background: "#EEF3FB" }}
            >
              {savingPassword ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#1B3F72]/30 border-t-[#1B3F72] rounded-full animate-spin" />
                  Updating…
                </span>
              ) : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
