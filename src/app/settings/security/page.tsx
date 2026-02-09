"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SecuritySettingsRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }
    if (status === "authenticated") {
      const href = session?.user?.role === "CHILD" ? "/child" : "/parent";
      router.replace(href);
    }
  }, [status, session?.user?.role, router]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#1a1a2e", color: "#fff" }}>
      Redirecting…
    </div>
  );
}
