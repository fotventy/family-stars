"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/contexts/LanguageContext";
import { LOCALES } from "@/lib/i18n";
import "@/app/login/login.css";

export default function SecuritySettings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t, locale, setLocale } = useTranslation();

  if (status === "unauthenticated") {
    router.replace("/login");
    return null;
  }

  const backHref = session?.user?.role === "CHILD" ? "/child" : "/parent";

  return (
    <div className="login-page-root premium-login-container min-h-screen text-white p-6">
      <div className="max-w-lg mx-auto">
        <Link
          href={backHref}
          className="text-white/90 hover:text-white text-sm mb-6 inline-block font-medium"
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
        >
          ← {t("common.backToApp")}
        </Link>

        <div className="login-card p-8">
          <h1 className="text-2xl font-bold text-white mb-1" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
            {t("settings.securityTitle")}
          </h1>
          <p className="text-white/85 text-sm mb-8">{t("settings.securitySubtitle")}</p>

          <section className="mb-8 rounded-xl p-5" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
            <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>
              <span aria-hidden>🌐</span> {t("settings.languageTitle")}
            </h2>
            <p className="text-white/90 text-sm mb-4">{t("common.language")}</p>
            <div className="flex flex-wrap gap-2">
              {LOCALES.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setLocale(loc)}
                  className={`py-2 px-3 rounded-xl text-sm font-medium transition ${
                    locale === loc
                      ? "bg-white text-purple-700 shadow"
                      : "bg-white/15 text-white hover:bg-white/25 border border-white/20"
                  }`}
                  title={t(`settings.lang_${loc}`)}
                >
                  {loc.toUpperCase()}
                </button>
              ))}
            </div>
          </section>

          <section className="mb-8 rounded-xl p-5" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
            <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>
              <span aria-hidden>🔐</span> {t("settings.twoFaTitle")}
            </h2>
            <p className="text-white/90 text-sm mb-2">{t("settings.twoFaDesc")}</p>
            <p className="text-white/75 text-xs">{t("settings.twoFaTip")}</p>
          </section>

          <section className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
            <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>
              <span aria-hidden>🔕</span> {t("settings.noAdsTitle")}
            </h2>
            <p className="text-white/90 text-sm mb-4">{t("settings.noAdsDesc")}</p>
            <Link
              href="/subscription"
              className="inline-block py-3 px-5 bg-white text-purple-700 font-semibold rounded-xl hover:bg-white/95 transition shadow"
            >
              {t("settings.subscriptionLink")}
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
