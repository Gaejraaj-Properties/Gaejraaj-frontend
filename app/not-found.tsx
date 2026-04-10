import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-extrabold text-[#1B3F72] opacity-10 select-none">404</p>
      <div className="-mt-6">
        <h1 className="text-2xl font-bold text-[#1B3F72] mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className={cn(buttonVariants(), "bg-[#1B3F72] hover:bg-[#142f55] text-white border-0")}>
            Go Home
          </Link>
          <Link href="/properties" className={cn(buttonVariants({ variant: "outline" }), "text-[#1B3F72] border-[#ADC8EE]")}>
            Browse Properties
          </Link>
        </div>
      </div>
    </div>
  );
}
