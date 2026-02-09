"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/contexts/LanguageContext";
import "../login/login.css";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError(t("forgot.emailRequired"));
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("forgot.error"));
        return;
      }
      setSent(true);
    } catch {
      setError(t("forgot.error"));
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="login-page-root premium-login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-emoji">✉️</div>
            <h1 className="login-title fortnite-title">{t("forgot.checkEmail")}</h1>
            <p className="login-subtitle">{t("forgot.checkEmailHint")}</p>
          </div>
          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="login-button"
            >
              {t("forgot.backToLogin")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page-root premium-login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-emoji">🔐</div>
          <h1 className="login-title fortnite-title">{t("forgot.title")}</h1>
          <p className="login-subtitle">{t("forgot.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">❌ {error}</div>
          )}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              📧 {t("forgot.email")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder={t("forgot.emailPlaceholder")}
              required
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? t("forgot.sending") : t("forgot.sendLink")}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <button
            type="button"
            onClick={() => router.push("/login")}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.85)",
              fontSize: "14px",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            ← {t("forgot.backToLogin")}
          </button>
        </div>
      </div>
    </div>
  );
}
