"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/contexts/LanguageContext";

export default function RegisterFamily() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentType, setParentType] = useState<"папа" | "мама">("папа");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [result, setResult] = useState<any>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !familyName || !parentName || !password) {
      setError(t("register.allRequired"));
      return;
    }
    if (password.length < 6 || password.length > 128) {
      setError(t("register.passwordLength"));
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/register-family", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          familyName, 
          parentName,
          parentType,
          password 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        const msg = data.error || t("register.error");
        const withDetails = data.details && data.details !== msg ? `${msg} (${data.details})` : msg;
        throw new Error(withDetails);
      }

      setSuccess(data.message);
      setResult(data);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : t("register.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    router.push("/login");
  };

  return (
    <>
      {/* Premium styles */}
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

        /* Animated gradient background */
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

        .premium-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border: none;
          border-radius: 0;
          padding: 40px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
          width: 100%;
          max-width: 500px;
          position: relative;
        }

        .premium-title {
          color: white;
          font-size: 36px;
          font-weight: 800;
          text-shadow: 0 4px 15px rgba(0,0,0,0.3);
          margin-bottom: 16px;
          text-align: center;
          font-family: 'Inter', sans-serif !important;
        }

        .premium-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 18px;
          text-align: center;
          margin-bottom: 32px;
          text-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .premium-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          color: white;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
          text-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }

        .form-input {
          padding: 16px 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 0;
          background: rgba(255, 255, 255, 0.9);
          font-size: 16px;
          font-weight: 500;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .form-input:focus {
          outline: none;
          border-color: #FFD700;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
        }

        .premium-button {
          padding: 18px 32px;
          border: none;
          border-radius: 0;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-family: 'Inter', sans-serif !important;
          position: relative;
          overflow: hidden;
        }

        .premium-button.primary {
          background: linear-gradient(135deg, #FF6B35, #F7931E);
          color: white;
          box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
        }

        .premium-button.primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #FF8A65, #FFB74D);
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(255, 107, 53, 0.6);
        }

        .premium-button.primary:disabled {
          background: linear-gradient(135deg, #ccc, #999);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .premium-button.success {
          background: linear-gradient(135deg, #4CAF50, #45a049);
          color: white;
          box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
        }

        .premium-button.success:hover {
          background: linear-gradient(135deg, #66BB6A, #4CAF50);
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(76, 175, 80, 0.6);
        }

        .premium-button.secondary {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
        }

        .premium-button.secondary:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
        }

        .alert {
          padding: 20px;
          border-radius: 0;
          margin-bottom: 24px;
          backdrop-filter: blur(10px);
          border: none;
        }

        .alert.error {
          background: rgba(244, 67, 54, 0.9);
          color: white;
          box-shadow: 0 8px 25px rgba(244, 67, 54, 0.3);
        }

        .alert.success {
          background: rgba(76, 175, 80, 0.9);
          color: white;
          box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
        }

        .result-card {
          background: rgba(76, 175, 80, 0.15);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(76, 175, 80, 0.3);
          border-radius: 0;
          padding: 32px;
          margin-bottom: 24px;
        }

        .result-title {
          color: white;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 20px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }

        .result-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .result-label {
          color: rgba(255, 255, 255, 0.9);
          font-weight: 600;
        }

        .result-value {
          color: white;
          font-family: 'Monaco', 'Menlo', monospace;
          background: rgba(255, 255, 255, 0.2);
          padding: 8px 12px;
          border-radius: 0;
          font-weight: 600;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .info-box {
          background: rgba(33, 150, 243, 0.2);
          border: 1px solid rgba(33, 150, 243, 0.3);
          border-radius: 0;
          padding: 16px;
          margin-top: 20px;
        }

        .info-text {
          color: white;
          font-size: 14px;
          line-height: 1.5;
        }

        .login-link {
          text-align: center;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .login-text {
          color: rgba(255, 255, 255, 0.8);
          font-size: 16px;
        }

        .login-button {
          color: #FFD700;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .login-button:hover {
          color: #FFF;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
        }

        /* Mobile adaptation */
        @media (max-width: 768px) {
          .premium-container {
            padding: 16px;
          }

          .premium-card {
            padding: 24px;
          }

          .premium-title {
            font-size: 28px;
          }

          .premium-subtitle {
            font-size: 16px;
          }

          .form-input {
            padding: 14px 16px;
            font-size: 16px;
          }

          .premium-button {
            padding: 14px 24px;
            font-size: 16px;
          }
        }
      `}</style>

      <div className="premium-container">
        <div className="premium-card">
          <div>
            <h1 className="premium-title">
              🏠 {t("register.title")}
            </h1>
            <p className="premium-subtitle">
              {t("register.subtitle")}
            </p>
          </div>

          {error && (
            <div className="alert error">
              <p>{error}</p>
            </div>
          )}

          {success && !result && (
            <div className="alert success">
              <p>{success}</p>
            </div>
          )}

          {result ? (
            <div className="result-card">
              <h3 className="result-title">
                🎉 {t("register.successTitle")}
              </h3>
              
              <div>
                <div className="result-item">
                  <span className="result-label">{t("register.family")}:</span>
                  <span className="result-value">{familyName}</span>
                </div>
                
                <div className="result-item">
                  <span className="result-label">{t("register.admin")}:</span>
                  <span className="result-value">
                    {result.parentType === "папа" ? "👨" : "👩"} {result.parentName} ({result.parentType === "папа" ? t("register.dad") : t("register.mom")})
                  </span>
                </div>
                
                <div className="result-item">
                  <span className="result-label">{t("register.familyCode")}:</span>
                  <span className="result-value">{result.familyCode}</span>
                </div>
                
              </div>

              <div className="info-box">
                <p className="info-text">
                  💡 <strong>{t("register.doneTip")}</strong>{" "}
                  {result.firstLoginUrl
                    ? t("register.doneTipWithUrl")
                    : t("register.doneTipNoUrl")}
                </p>
              </div>

              {result.firstLoginUrl ? (
                <button
                  onClick={() => window.location.href = result.firstLoginUrl}
                  className="premium-button success"
                  style={{ width: "100%", marginTop: "24px" }}
                >
                  🔐 {t("register.createPasswordAndLogin")}
                </button>
              ) : (
                <button
                  onClick={() => router.push("/login")}
                  className="premium-button success"
                  style={{ width: "100%", marginTop: "24px" }}
                >
                  🔐 {t("register.goToLoginAndPassword")}
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="premium-form">
              <div className="form-group">
                <label htmlFor="familyName" className="form-label">
                  {t("register.familyName")}
                </label>
                <input
                  type="text"
                  id="familyName"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  className="form-input"
                  placeholder={t("register.familyNamePlaceholder")}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="parentName" className="form-label">
                  {t("register.parentName")}
                </label>
                <input
                  type="text"
                  id="parentName"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="form-input"
                  placeholder={t("register.parentNamePlaceholder")}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  {t("register.whoAdmin")}
                </label>
                <div style={{
                  display: "flex",
                  gap: "16px",
                  justifyContent: "center"
                }}>
                  <button
                    type="button"
                    onClick={() => setParentType("папа")}
                    className={`premium-button ${parentType === "папа" ? "primary" : "secondary"}`}
                    style={{ flex: 1 }}
                  >
                    👨 {t("register.dad")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setParentType("мама")}
                    className={`premium-button ${parentType === "мама" ? "primary" : "secondary"}`}
                    style={{ flex: 1 }}
                  >
                    👩 {t("register.mom")}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  {t("register.passwordLabel")}
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder={t("register.passwordPlaceholder")}
                  required
                  minLength={6}
                  maxLength={128}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  {t("register.emailLabel")}
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder={t("register.emailPlaceholder")}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="premium-button primary"
                style={{ width: '100%' }}
              >
                {loading ? t("register.creating") : t("register.createFamily")}
              </button>
            </form>
          )}

          <div className="login-link">
            <p className="login-text">
              {t("register.alreadyHave")}{" "}
              <span
                onClick={handleGoToLogin}
                className="login-button"
              >
                {t("register.login")}
              </span>
              {" · "}
              <span
                onClick={() => router.push("/")}
                className="login-button"
              >
                {t("register.backToHome")}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
} 