"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/auth")) return null;
  if (pathname.startsWith("/dashboard/add-property")) return null;
  if (pathname.startsWith("/saved")) return null;
  if (pathname.startsWith("/profile")) return null;
  return <Footer />;
}
