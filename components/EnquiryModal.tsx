"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";
import {
  X, MessageSquare, Phone, Mail, CheckCircle2,
  MapPin, Shield, Zap, User,
} from "lucide-react";

interface PropertySnippet {
  title: string;
  price: number;
  city?: string;
  image?: string;
}

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: PropertySnippet & { _id: string };
  initialName?: string;
  initialEmail?: string;
  ownerPhone?: string;
}

const QUICK_MESSAGES_GENERAL = [
  "I'm looking to buy a property",
  "I need help finding a rental",
  "I want investment advice",
  "Please contact me for a consultation",
];

const QUICK_MESSAGES_PROPERTY = [
  "I'd like to schedule a site visit",
  "Please share more details",
  "I'd like to negotiate the price",
  "Is this property still available?",
];

const INPUT_CLASS =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B3F72]/10 focus:border-[#1B3F72]/40 transition-all bg-gray-50 focus:bg-white";

export default function EnquiryModal({
  isOpen,
  onClose,
  property,
  initialName = "",
  initialEmail = "",
  ownerPhone,
}: EnquiryModalProps) {
  const [form, setForm] = useState({
    senderName: initialName,
    senderEmail: initialEmail,
    senderPhone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent,       setSent]       = useState(false);

  // Sync pre-fill when modal opens
  useEffect(() => {
    if (isOpen) {
      setForm((f) => ({ ...f, senderName: initialName, senderEmail: initialEmail }));
      setSent(false);
    }
  }, [isOpen, initialName, initialEmail]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.senderName || !form.senderEmail || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/inquiries", {
        ...form,
        ...(property ? { propertyId: property._id } : {}),
      });
      setSent(true);
    } catch {
      toast.error("Failed to send enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const quickMessages = property ? QUICK_MESSAGES_PROPERTY : QUICK_MESSAGES_GENERAL;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-up">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="relative bg-gradient-to-br from-[#1B3F72] via-[#16305a] to-[#0f2044] px-6 pt-6 pb-5 overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#C8922A]/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1 mb-3">
                <MessageSquare className="w-3 h-3 text-[#C8922A]" />
                <span className="text-[11px] font-bold text-[#C8922A] uppercase tracking-widest">
                  {property ? "Property Enquiry" : "General Enquiry"}
                </span>
              </div>

              {property ? (
                /* Property snippet */
                <div>
                  <p className="text-white/60 text-xs mb-0.5">Enquiring about</p>
                  <h2 className="text-white font-extrabold text-base leading-snug truncate">{property.title}</h2>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="text-[#C8922A] font-bold text-sm">
                      ₹{property.price >= 10000000
                        ? `${(property.price / 10000000).toFixed(1)} Cr`
                        : property.price >= 100000
                        ? `${(property.price / 100000).toFixed(1)} L`
                        : property.price.toLocaleString("en-IN")}
                    </span>
                    {property.city && (
                      <span className="flex items-center gap-1 text-blue-200/70 text-xs">
                        <MapPin className="w-3 h-3" /> {property.city}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-white font-extrabold text-lg leading-tight">
                    Talk to <span className="text-[#C8922A]">Gaejraaj Properties</span>
                  </h2>
                  <p className="text-blue-200/60 text-xs mt-1">
                    Residential &amp; commercial real estate across Uttarakhand &amp; UP
                  </p>
                </div>
              )}
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors shrink-0 mt-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick contact row */}
          {ownerPhone && (
            <div className="relative z-10 flex gap-2 mt-4">
              <a
                href={`tel:${ownerPhone}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold transition-colors"
              >
                <Phone className="w-3.5 h-3.5" /> Call Owner
              </a>
              <a
                href={`https://wa.me/91${ownerPhone.replace(/\D/g, "")}?text=Hi%2C%20I%20am%20interested%20in%20this%20property`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/30 text-[#4ade80] text-xs font-semibold transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            </div>
          )}
        </div>

        {/* ── Body ───────────────────────────────────────────────────────── */}
        {sent ? (
          /* Success state */
          <div className="px-6 py-10 text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-2">Enquiry Sent!</h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
              Thank you for reaching out. We&apos;ll get back to you within 24 hours.
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Zap className="w-3.5 h-3.5 text-[#C8922A]" /> Fast response
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Shield className="w-3.5 h-3.5 text-emerald-500" /> Your data is safe
              </div>
            </div>
            <Button
              onClick={onClose}
              className="mt-6 bg-[#1B3F72] hover:bg-[#142f55] text-white border-0 px-8"
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

            {/* Quick message chips */}
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Quick Message</p>
              <div className="flex flex-wrap gap-1.5">
                {quickMessages.map((msg) => (
                  <button
                    key={msg}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, message: msg }))}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-150 ${
                      form.message === msg
                        ? "bg-[#1B3F72] text-white border-[#1B3F72]"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#ADC8EE] hover:bg-[#EEF3FB] hover:text-[#1B3F72]"
                    }`}
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  <User className="w-3 h-3 inline mr-1" />Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.senderName}
                  onChange={(e) => setForm((f) => ({ ...f, senderName: e.target.value }))}
                  className={INPUT_CLASS}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  <Phone className="w-3 h-3 inline mr-1" />Phone
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.senderPhone}
                  onChange={(e) => setForm((f) => ({ ...f, senderPhone: e.target.value }))}
                  className={INPUT_CLASS}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                <Mail className="w-3 h-3 inline mr-1" />Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.senderEmail}
                onChange={(e) => setForm((f) => ({ ...f, senderEmail: e.target.value }))}
                className={INPUT_CLASS}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-500">
                  <MessageSquare className="w-3 h-3 inline mr-1" />Message <span className="text-red-400">*</span>
                </label>
                <span className="text-[11px] text-gray-300">{form.message.length}/500</span>
              </div>
              <textarea
                placeholder={property ? "I am interested in this property…" : "How can we help you?"}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value.slice(0, 500) }))}
                rows={3}
                className={`${INPUT_CLASS} resize-none`}
                required
              />
            </div>

            {/* Trust bar */}
            <div className="flex items-center justify-between pt-1 pb-0.5">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[11px] text-gray-400">
                  <Shield className="w-3 h-3 text-emerald-500" /> 100% Confidential
                </span>
                <span className="flex items-center gap-1 text-[11px] text-gray-400">
                  <Zap className="w-3 h-3 text-[#C8922A]" /> 24hr response
                </span>
              </div>
              <span className="text-[11px] text-gray-300 font-medium">Free service</span>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-11 bg-gradient-to-r from-[#C8922A] to-[#dfa030] hover:from-[#b07822] hover:to-[#c8922a] text-white border-0 font-semibold shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-px active:scale-[0.98]"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending Enquiry…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  {property ? "Send Property Enquiry" : "Send Enquiry"}
                </span>
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
