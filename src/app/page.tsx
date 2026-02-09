"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/contexts/LanguageContext";
import { LOCALES } from "@/lib/i18n";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showOptions, setShowOptions] = useState(false);
  const [langPopupOpen, setLangPopupOpen] = useState(false);
  const { t, locale, setLocale } = useTranslation();

  // Invite link (code / invite) — redirect to family login
  useEffect(() => {
    const code = searchParams.get("code") ?? searchParams.get("invite") ?? searchParams.get("familyCode");
    if (code && status === "unauthenticated") {
      router.replace(`/login?familyCode=${encodeURIComponent(code.trim())}`);
      return;
    }
  }, [searchParams, status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user.role === "PARENT" || session?.user.role === "FAMILY_ADMIN") {
        redirect("/parent");
      } else {
        redirect("/child");
      }
    } else if (status === "unauthenticated") {
      setShowOptions(true);
    }
  }, [status, session]);

  const handleCreateFamily = () => {
    router.push("/register-family");
  };

  const handleJoinFamily = () => {
    router.push("/login");
  };

  return (
    <>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .premium-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .premium-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #fef9e7);
          background-size: 400% 400%;
          animation: gradientAnimation 15s ease infinite;
          opacity: 0.8;
          z-index: -1;
        }

        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .welcome-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border: none;
          border-radius: 0;
          padding: 60px;
          text-align: center;
          color: white;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
          max-width: 600px;
          width: 100%;
        }

        .loading-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border: none;
          border-radius: 0;
          padding: 60px;
          text-align: center;
          color: white;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        }

        .loading-spinner {
          width: 80px;
          height: 80px;
          border: none;
          border-top: 6px solid #FFD700;
          border-radius: 0;
          animation: spin 1s linear infinite;
          margin: 0 auto 30px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .main-title {
          font-size: 48px;
          font-weight: 800;
          margin-bottom: 20px;
          text-shadow: 0 4px 15px rgba(0,0,0,0.3);
          font-family: 'Fortnite Battlefest', 'Inter', sans-serif !important;
        }

        .main-subtitle {
          font-size: 24px;
          margin-bottom: 40px;
          opacity: 0.9;
          text-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .options-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin-top: 40px;
        }

        .option-button {
          padding: 20px 40px;
          border: none;
          border-radius: 0;
          font-size: 20px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-family: 'Fortnite Battlefest', 'Inter', sans-serif !important;
          position: relative;
          overflow: hidden;
          min-height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }

        .option-button.primary {
          background: linear-gradient(135deg, #FF6B35, #F7931E);
          color: white;
          box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
          clip-path: polygon(20px 0%, 100% 0%, calc(100% - 20px) 100%, 0% 100%);
        }

        .option-button.primary:hover {
          background: linear-gradient(135deg, #FF8A65, #FFB74D);
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(255, 107, 53, 0.6);
        }

        .option-button.secondary {
          background: linear-gradient(135deg, #4CAF50, #45a049);
          color: white;
          box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
          clip-path: polygon(0% 0%, calc(100% - 20px) 0%, 100% 100%, 20px 100%);
        }

        .option-button.secondary:hover {
          background: linear-gradient(135deg, #66BB6A, #4CAF50);
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(76, 175, 80, 0.6);
        }

        .option-icon {
          font-size: 32px;
        }

        .option-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .option-title {
          font-size: 20px;
        }

        .option-description {
          font-size: 14px;
          opacity: 0.9;
          font-weight: normal;
          text-transform: none;
          letter-spacing: normal;
        }

        .loading-title {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 16px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }

        .loading-subtitle {
          font-size: 18px;
          opacity: 0.8;
          font-weight: 500;
        }

        /* Mobile adaptation */
        @media (max-width: 768px) {
          .premium-container {
            padding: 16px;
          }

          .welcome-card {
            padding: 40px 24px;
          }

          .main-title {
            font-size: 36px;
          }

          .main-subtitle {
            font-size: 20px;
          }

          .option-button {
            padding: 16px 24px;
            font-size: 16px;
            min-height: 70px;
          }

          .option-icon {
            font-size: 24px;
          }

          .option-title {
            font-size: 16px;
          }

          .option-description {
            font-size: 12px;
          }
        }
      `}</style>

      <div className="premium-container">
{showOptions ? (
          <div className="welcome-card" style={{ position: "relative" }}>
            <h1 className="main-title">
              ⭐ {t("home.title")}
            </h1>
            <p className="main-subtitle">
              {t("home.subtitle")}
            </p>
            <div className="options-container">
              <button
                type="button"
                onClick={handleCreateFamily}
                className="option-button primary"
                title={t("home.tooltipCreate")}
              >
                <span className="option-icon">🏠</span>
                <div className="option-text">
                  <span className="option-title">{t("home.createFamily")}</span>
                  <span className="option-description">{t("home.createFamilyDesc")}</span>
                </div>
              </button>
              <button
                type="button"
                onClick={handleJoinFamily}
                className="option-button secondary"
                title={t("home.tooltipJoin")}
              >
                <span className="option-icon">🚪</span>
                <div className="option-text">
                  <span className="option-title">{t("home.joinFamily")}</span>
                  <span className="option-description">{t("home.joinFamilyDesc")}</span>
                </div>
              </button>
            </div>
            <div style={{ marginTop: "32px", textAlign: "center", position: "relative", zIndex: 1 }}>
              <button
                type="button"
                onClick={() => setLangPopupOpen(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.85)",
                  fontSize: "14px",
                  cursor: "pointer",
                  textDecoration: "underline",
                  padding: "4px 8px",
                }}
              >
                🌐 {t("home.langSwitcher")}
              </button>
            </div>
            {langPopupOpen && (
              <>
                <div
                  role="presentation"
                  style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.5)",
                    zIndex: 1000,
                  }}
                  onClick={() => setLangPopupOpen(false)}
                />
                <div
                  style={{
                    position: "fixed",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "linear-gradient(135deg, #4a5568 0%, #2d3748 100%)",
                    borderRadius: "12px",
                    padding: "20px 24px",
                    boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
                    zIndex: 1001,
                    minWidth: "260px",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ color: "white", fontWeight: 700, marginBottom: "16px", fontSize: "16px" }}>
                    {t("home.langSwitcher")}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {LOCALES.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          setLocale(loc);
                          setLangPopupOpen(false);
                        }}
                        style={{
                          padding: "10px 14px",
                          borderRadius: "8px",
                          border: "none",
                          background: locale === loc ? "rgba(99, 102, 241, 0.9)" : "rgba(255,255,255,0.15)",
                          color: "white",
                          fontSize: "14px",
                          fontWeight: locale === loc ? 700 : 500,
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        {loc.toUpperCase()} — {t(`settings.lang_${loc}`)}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setLangPopupOpen(false)}
                    style={{
                      marginTop: "12px",
                      width: "100%",
                      padding: "8px",
                      borderRadius: "8px",
                      border: "none",
                      background: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    {t("common.back")}
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="loading-card">
            <div className="loading-spinner"></div>
            <h2 className="loading-title fortnite-title">{t("home.loadingTitle")}</h2>
            <p className="loading-subtitle">{t("home.loadingSubtitle")}</p>
          </div>
        )}
      </div>
    </>
  );
}
