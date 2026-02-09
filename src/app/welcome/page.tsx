"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslation } from "@/contexts/LanguageContext";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="text-white text-lg">{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
        <h1 className="text-2xl font-bold text-white text-center mb-2">
          {t("welcome.title")}
        </h1>
        <p className="text-white/90 text-center text-sm mb-6">
          {t("welcome.subtitle")}
        </p>

        <div className="bg-white/10 rounded-xl p-5 mb-6">
          <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <span aria-hidden>🔐</span> {t("welcome.twoFaTitle")}
          </h2>
          <p className="text-white/85 text-sm leading-relaxed mb-4">
            {t("welcome.twoFaDesc")}
          </p>
          <button
            type="button"
            onClick={handleEnable2FA}
            className="w-full py-3 px-4 bg-white text-purple-700 font-semibold rounded-xl hover:bg-white/90 transition"
          >
            {t("welcome.enable2fa")}
          </button>
        </div>

        <button
          type="button"
          onClick={handleSkip}
          className="w-full py-3 px-4 bg-white/20 text-white font-medium rounded-xl hover:bg-white/30 transition border border-white/30"
        >
          {t("welcome.skip")}
        </button>

        <p className="text-white/70 text-xs text-center mt-6">
          {t("welcome.twoFaLater")}
        </p>
      </div>
    </div>
  );
}
