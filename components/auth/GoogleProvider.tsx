"use client";

import { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function GoogleProvider({ children }: { children: React.ReactNode }) {
  const [Provider, setProvider] = useState<React.ComponentType<{ clientId: string; children: React.ReactNode }> | null>(null);

  useEffect(() => {
    import("@react-oauth/google").then((mod) => {
      setProvider(() => mod.GoogleOAuthProvider as React.ComponentType<{ clientId: string; children: React.ReactNode }>);
    });
  }, []);

  if (!Provider) return <>{children}</>;

  return (
    <Provider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      {children}
    </Provider>
  );
}
