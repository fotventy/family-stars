"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/contexts/LanguageContext";
import { LOCALES } from "@/lib/i18n";

export default function SecuritySettings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t, locale, setLocale } = useTranslation();

  if (status === "unauthenticated") {
    router.replace("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-lg mx-auto">
        <Link
          href={session?.user?.role === "CHILD" ? "/child" : "/parent"}
          className="text-white/80 hover:text-white text-sm mb-6 inline-block"
        >
          ← {t("common.backToApp")}
        </Link>
        <h1 className="text-2xl font-bold mb-2">{t("settings.securityTitle")}</h1>
        <p className="text-white/70 text-sm mb-8">{t("settings.securitySubtitle")}</p>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <span aria-hidden>🌐</span> {t("settings.languageTitle")}
          </h2>
          <p className="text-white/80 text-sm mb-4">
            {t("common.language")}
          </p>
          <div className="flex flex-wrap gap-2">
            {LOCALES.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setLocale(loc)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition ${
                  locale === loc
                    ? "bg-indigo-600 text-white"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
                title={t(`settings.lang_${loc}`)}
              >
                {loc.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <span aria-hidden>🔐</span> {t("settings.twoFaTitle")}
          </h2>
          <p className="text-white/80 text-sm mb-4">
            {t("settings.twoFaDesc")}
          </p>
          <p className="text-white/60 text-xs">
            {t("settings.twoFaTip")}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mt-6">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <span aria-hidden>🔕</span> {t("settings.noAdsTitle")}
          </h2>
          <p className="text-white/80 text-sm mb-4">
            {t("settings.noAdsDesc")}
          </p>
          <Link
            href="/subscription"
            className="inline-block py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition"
          >
            {t("settings.subscriptionLink")}
          </Link>
        </div>
      </div>
    </div>
  );
}
