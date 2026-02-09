"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/contexts/LanguageContext";

export default function SubscriptionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t, locale } = useTranslation();
  const [subscription, setSubscription] = useState<{ premium: boolean; premiumUntil: string | null } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }
    if (status !== "authenticated") return;
    fetch("/api/subscription")
      .then((r) => r.json())
      .then(setSubscription)
      .catch(() => setSubscription({ premium: false, premiumUntil: null }));
  }, [status, router]);

  const [isNative, setIsNative] = useState(false);
  useEffect(() => {
    import("@capacitor/core").then(({ Capacitor }) => {
      setIsNative(Capacitor.isNativePlatform());
    }).catch(() => {});
  }, []);

  const handlePurchase = () => {
    if (isNative) {
      // In native app, use a purchases plugin (e.g. @capgo/capacitor-native-purchases);
      // after successful purchase call POST /api/subscription with X-Subscription-Secret header.
      import("@capacitor/core").then(({ Capacitor }) => {
        const Plugins = (Capacitor as any).Plugins;
        if (Plugins?.Purchases?.purchase) {
          Plugins.Purchases.purchase({ productId: "no_ads_monthly" })
            .then(() => fetch("/api/subscription").then((r) => r.json()).then(setSubscription))
            .catch(() => {});
        } else {
          alert(t("subscription.iapNotConfigured"));
        }
      });
      return;
    }
    alert(t("subscription.webOnly"));
  };

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="text-white">{t("common.loading")}</div>
      </div>
    );
  }

  const dateLocaleMap: Record<string, string> = {
    ru: "ru", en: "en", fr: "fr", de: "de", it: "it", es: "es",
    zh: "zh-CN", pt: "pt", ja: "ja", ko: "ko",
  };
  const dateLocale = dateLocaleMap[locale] ?? "en";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-lg mx-auto">
        <Link
          href={session?.user?.role === "CHILD" ? "/child" : "/parent"}
          className="text-white/80 hover:text-white text-sm mb-6 inline-block"
        >
          ← {t("common.back")}
        </Link>

        <h1 className="text-2xl font-bold mb-2">{t("subscription.title")}</h1>
        <p className="text-white/70 text-sm mb-8">
          {t("subscription.subtitle")}
        </p>

        {subscription?.premium ? (
          <div className="bg-green-500/20 border border-green-400/50 rounded-xl p-6">
            <p className="font-semibold text-green-300">✅ {t("subscription.active")}</p>
            <p className="text-white/80 text-sm mt-2">
              {t("subscription.until")} {subscription.premiumUntil ? new Date(subscription.premiumUntil).toLocaleDateString(dateLocale) : "—"}
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
              <ul className="space-y-3 text-sm text-white/90">
                <li>• {t("subscription.bullet1")}</li>
                <li>• {t("subscription.bullet2")}</li>
                <li>• {t("subscription.bullet3")}</li>
              </ul>
            </div>

            <button
              onClick={handlePurchase}
              className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition"
            >
              {isNative ? t("subscription.buy") : t("subscription.inApp")}
            </button>

            {!isNative && (
              <p className="text-white/60 text-xs text-center mt-4">
                {t("subscription.installApp")}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
