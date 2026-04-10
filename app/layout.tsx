import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import ConditionalNavbar from "@/components/layout/ConditionalNavbar";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import { Toaster } from "@/components/ui/sonner";
import GoogleProvider from "@/components/auth/GoogleProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Gaejraaj Properties — Find Your Dream Home",
  description: "Buy, sell, or rent properties across India. Post free property ads.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F5F7FA]">
        <GoogleProvider>
          <AuthProvider>
            <ConditionalNavbar />
            <main className="flex-1">{children}</main>
            <ConditionalFooter />
            <Toaster position="top-center" toastOptions={{ style: { background: "#fff", color: "#111827", border: "1px solid #e5e7eb" } }} />
          </AuthProvider>
        </GoogleProvider>
      </body>
    </html>
  );
}
