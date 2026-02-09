"use client";

import { useEffect, useState } from "react";

/** Проверка: приложение запущено в нативной оболочке Capacitor */
function useIsNative() {
  const [isNative, setIsNative] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    import("@capacitor/core").then(({ Capacitor }) => {
      setIsNative(Capacitor.isNativePlatform());
    }).catch(() => {});
  }, []);
  return isNative;
}

/** Статус подписки: true = рекламу не показываем */
function usePremium() {
  const [premium, setPremium] = useState<boolean | null>(null);
  useEffect(() => {
    fetch("/api/subscription")
      .then((r) => r.json())
      .then((d) => setPremium(d.premium === true))
      .catch(() => setPremium(false));
  }, []);
  return premium;
}

type AdBannerProps = {
  className?: string;
  /** Нижний баннер по умолчанию */
  position?: "top" | "bottom";
};

/**
 * Баннер рекламы для детского/семейного контента.
 * Показывается только в нативном приложении (Capacitor) и только если у семьи нет подписки «Без рекламы».
 * В веб-версии и при premium — пустой блок не рендерится (или можно показать заглушку).
 */
export default function AdBanner({ className = "", position = "bottom" }: AdBannerProps) {
  const isNative = useIsNative();
  const premium = usePremium();

  const [adLoaded, setAdLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isNative || premium !== false) return;

    let mounted = true;
    import("@capacitor-community/admob")
      .then((admob) => {
        const AdMob = admob.AdMob;
        const BannerAdSize = admob.BannerAdSize;
        const BannerAdPosition = admob.BannerAdPosition;
        if (!AdMob?.showBanner) return;
        return AdMob.initialize({ requestTrackingAuthorization: false })
          .then(() =>
            AdMob.showBanner({
              adId: process.env.NEXT_PUBLIC_ADMOB_BANNER_ID || "ca-app-pub-3940256099942544/6300978111",
              position: position === "top" ? BannerAdPosition.TOP : BannerAdPosition.BOTTOM,
              size: BannerAdSize.ADAPTIVE_BANNER,
              margin: 0,
              npa: "1",
              requestOptions: {
                tagForChildDirectedTreatment: true,
                tagForUnderAgeOfConsent: true,
                maxAdContentRating: "G",
              },
            })
          )
          .then(() => mounted && setAdLoaded(true));
      })
      .catch((e) => {
        if (mounted) setError(true);
        console.warn("AdMob banner", e);
      });

    return () => {
      mounted = false;
      import("@capacitor-community/admob").then(({ AdMob }) => AdMob?.hideBanner?.().catch(() => {}));
    };
  }, [isNative, premium, position]);

  if (!isNative || premium === true) return null;
  if (error) return null;

  return (
    <div
      className={className}
      style={{
        minHeight: adLoaded ? 50 : 0,
        background: "transparent",
      }}
      aria-hidden="true"
    />
  );
}
