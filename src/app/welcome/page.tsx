"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslation } from "@/contexts/LanguageContext";
import "@/app/login/login.css";

export default function Welcome() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  const handleSkip = () => {
    if (session?.user?.role === "PARENT" || session?.user?.role === "FAMILY_ADMIN") {
      router.push("/parent");
    } else {
      router.push("/child");
    }
  };

  const handleEnable2FA = () => {
    router.push("/settings/security");
  };

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="login-page-root premium-login-container min-h-screen flex items-center justify-center">
        <div className="text-white text-lg" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
          {t("common.loading")}
        </div>
      </div>
    );
  }

  return (
    <div className="login-page-root premium-login-container min-h-screen flex flex-col items-center justify-center p-6">
      <div className="login-card max-w-md w-full mx-auto relative overflow-hidden">
        <div className="login-header">
          <div className="login-emoji">✨</div>
          <h1 className="login-title">{t("welcome.title")}</h1>
          <p className="login-subtitle">{t("welcome.subtitle")}</p>
        </div>

        <div className="rounded-xl p-5 mb-6 text-left" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
          <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>
            <span aria-hidden>🔐</span> {t("welcome.twoFaTitle")}
          </h2>
          <p className="text-white/90 text-sm leading-relaxed mb-4" style={{ opacity: 0.95 }}>
            {t("welcome.twoFaDesc")}
          </p>
          <button
            type="button"
            onClick={handleEnable2FA}
            className="w-full py-3 px-4 rounded-xl font-semibold transition text-purple-700 bg-white hover:bg-white/95 shadow-lg"
          >
            {t("welcome.enable2fa")}
          </button>
        </div>

        <button
          type="button"
          onClick={handleSkip}
          className="w-full py-3 px-4 rounded-xl font-medium transition text-white border-2 border-white/40 bg-white/15 hover:bg-white/25"
        >
          {t("welcome.skip")}
        </button>

        <p className="text-white/80 text-xs text-center mt-6" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}>
          {t("welcome.twoFaLater")}
        </p>
      </div>
    </div>
  );
}
