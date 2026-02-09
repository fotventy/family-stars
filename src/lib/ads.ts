/**
 * Ads for family/kids app:
 * - shown only in native app (Capacitor);
 * - hidden when ad-free subscription is active;
 * - AdMob requests tagged as child-directed (COPPA).
 */

export const AD_BANNER_ID = process.env.NEXT_PUBLIC_ADMOB_BANNER_ID || "ca-app-pub-3940256099942544/6300978111";
export const AD_INTERSTITIAL_ID = process.env.NEXT_PUBLIC_ADMOB_INTERSTITIAL_ID || "ca-app-pub-3940256099942544/1033173712";

/** Ad request options for child-directed content (COPPA / Families policy) */
export const CHILD_DIRECTED_REQUEST_OPTIONS = {
  tagForChildDirectedTreatment: true,
  tagForUnderAgeOfConsent: true,
  maxAdContentRating: "G" as const,
};
