"use client";

// Ads disabled for now — re-enable when ready (see docs/MOBILE_STORES_AND_ADS_GUIDE.md)

type AdBannerProps = {
  className?: string;
  position?: "top" | "bottom";
};

/**
 * Ad banner for family/kids content.
 * Currently disabled. When re-enabling: show only in native app (Capacitor) when family has no ad-free subscription.
 */
export default function AdBanner(_props: AdBannerProps) {
  return null;
}
