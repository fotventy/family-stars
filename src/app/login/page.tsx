"use client";

import "./login.css";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/contexts/LanguageContext";

interface User {
  id: string;
  name: string;
  role: string;
  gender?: string;
  displayName: string;
  emoji: string;
  color: string;
}

const DEFAULT_PASSWORDS: Record<string, string> = {
  "Админ": "admin2024",
  "Тест": "test2024",
  "Папа": "papa2024",
  "Мама": "mama2024",
  "Назар": "nazar2024",
  "Влад": "vlad2024",
  "Никита": "nikita2024",
};

export default function Login() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loginMode, setLoginMode] = useState<"email" | "familyCode">("email");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [familyCode, setFamilyCode] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  // Family code from invite link — switch to family code mode and load users
  useEffect(() => {
    const code = searchParams.get("familyCode") ?? searchParams.get("code") ?? searchParams.get("invite");
    if (code?.trim()) {
      setFamilyCode(code.trim());
      setLoginMode("familyCode");
      setError("");
      setLoading(true);
      fetchUsers(code.trim()).finally(() => setLoading(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async (inviteCode: string) => {
    try {
      const response = await fetch(`/api/login-users?familyCode=${encodeURIComponent(inviteCode)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || t("login.errorLoadUsers"));
      }
      
      // Map DB users to login page format
      const formattedUsers = data.users.map((user: any) => ({
        id: user.id,
        name: user.name,
        role: user.role,
        gender: user.gender,
        displayName: user.name,
        emoji: getUserEmoji(user.role, user.name),
        color: getUserColor(user.role, user.name)
      }));
      
      setUsers(formattedUsers);
      setFamilyName(data.familyName);
      setStep(2);
    } catch (error: any) {
      console.error('Failed to load users:', error);
      setError(error.message || t("login.errorLoadUsers"));
    }
  };

  const getUserEmoji = (role: string, name: string) => {
    if (role === 'PARENT') {
      return name === 'Папа' ? '👨' : '👩';
    }
    // Different emojis for children
    const childEmojis = ['😊', '😎', '😄', '🤗', '😋'];
    const index = name.length % childEmojis.length;
    return childEmojis[index];
  };

  const getUserColor = (role: string, name: string) => {
    if (role === 'PARENT') {
      return name === 'Папа' ? 'from-orange-400 to-red-500' : 'from-pink-400 to-purple-500';
    }
    // Different colors for children
    const childColors = [
      'from-blue-400 to-indigo-500',
      'from-green-400 to-blue-500', 
      'from-purple-400 to-pink-500',
      'from-yellow-400 to-orange-500',
      'from-cyan-400 to-blue-500'
    ];
    const index = name.length % childColors.length;
    return childColors[index];
  };

  const handleFamilyCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyCode.trim()) {
      setError(t("login.errorFamilyCode"));
      return;
    }

    setError("");
    setLoading(true);

    try {
      await fetchUsers(familyCode.trim());
    } catch (error) {
      // Error already handled in fetchUsers
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setPassword("");
    setError("");
    setStep(3);
  };

  const handleBack = () => {
    if (step === 3) {
      setStep(2);
      setSelectedUser(null);
      setPassword("");
      setError("");
    } else if (step === 2) {
      setStep(1);
      setUsers([]);
      setFamilyName("");
      setError("");
    }
  };

  const handleModalClose = () => {
    setSelectedUser(null);
    setPassword("");
    setError("");
    setStep(2);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError(t("login.errorFamilyCode")); // reuse or add specific message
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
      });
      if (result?.error) {
        setError(t("login.errorWrongPassword"));
      } else {
        router.push("/");
      }
    } catch {
      setError(t("login.errorLogin"));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        name: selectedUser.name,
        password,
        familyCode: familyCode || undefined,
      });
      if (result?.error) {
        setError(t("login.errorWrongPassword"));
      } else {
        router.push("/");
      }
    } catch (error) {
      setError(t("login.errorLogin"));
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (user: User) => {
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        name: user.name,
        password: DEFAULT_PASSWORDS[user.name] || "default2024",
        familyCode: familyCode || undefined,
      });

      if (result?.error) {
        setError(t("login.errorQuickLogin"));
      } else {
        router.push("/");
      }
    } catch (error) {
      setError(t("login.errorLogin"));
    } finally {
      setLoading(false);
    }
  };

  function getRoleDisplay(role: string, gender: string | undefined) {
    if (role === "PARENT" || role === "FAMILY_ADMIN") {
      return gender === "mom" || gender === "мама" ? t("login.roleMom") : t("login.roleDad");
    }
    return gender === "daughter" || gender === "дочь" ? t("login.roleDaughter") : t("login.roleSon");
  }

  return (
    <div className="login-page-root premium-login-container">
        <div className="login-card">
          {/* STEP 1: Email + Password (default) or Family code */}
          {step === 1 && loginMode === "email" && (
            <>
              <div className="login-header">
                <div className="login-emoji">🏠</div>
                <h1 className="login-title fortnite-title">{t("login.title")}</h1>
                <p className="login-subtitle">
                  {t("login.email")} &amp; {t("login.password")}
                </p>
              </div>

              <form onSubmit={handleEmailLogin}>
                {error && (
                  <div className="error-message">❌ {error}</div>
                )}
                <div className="form-group">
                  <label htmlFor="email" className="form-label">📧 {t("login.email")}</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder={t("login.emailPlaceholder")}
                    required
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="passwordEmail" className="form-label">🔑 {t("login.password")}</label>
                  <input
                    id="passwordEmail"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    placeholder={t("login.passwordPlaceholder")}
                    required
                  />
                </div>
                <button type="submit" disabled={loading} className="login-button">
                  {loading ? `⏳ ${t("login.entering")}` : `🚀 ${t("login.enterSystem")}`}
                </button>
                <div style={{ textAlign: "center", marginTop: "12px" }}>
                  <button
                    type="button"
                    onClick={() => router.push("/forgot-password")}
                    style={{
                      background: "none", border: "none", color: "rgba(255,255,255,0.9)",
                      fontSize: "14px", cursor: "pointer", textDecoration: "underline",
                    }}
                  >
                    {t("login.forgotPassword")}
                  </button>
                </div>
                <div style={{ marginTop: "20px", position: "relative", zIndex: 1 }}>
                  <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px", marginBottom: "10px", textAlign: "center" }}>
                    {t("login.orSignInWith")}
                  </p>
                  <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                    <button type="button" onClick={() => signIn("google", { callbackUrl: "/" })} className="quick-login-button" style={{ maxWidth: "200px" }}>Google</button>
                    <button type="button" onClick={() => signIn("apple", { callbackUrl: "/" })} className="quick-login-button" style={{ maxWidth: "200px" }}>Apple</button>
                  </div>
                </div>
              </form>
              <div style={{ textAlign: "center", marginTop: "24px", position: "relative", zIndex: 1 }}>
                <button type="button" onClick={() => { setLoginMode("familyCode"); setError(""); }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.85)", fontSize: "14px", cursor: "pointer", textDecoration: "underline" }}>
                  {t("login.signInWithFamilyCode")}
                </button>
                <span style={{ color: "rgba(255,255,255,0.5)", margin: "0 6px" }}>|</span>
                <button type="button" onClick={() => router.push("/")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", fontSize: "14px", cursor: "pointer", textDecoration: "underline" }}>
                  ← {t("common.backToHome")}
                </button>
                <span style={{ color: "rgba(255,255,255,0.5)", margin: "0 6px" }}>|</span>
                <button type="button" onClick={() => router.push("/register-family")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.85)", fontSize: "14px", cursor: "pointer", textDecoration: "underline", fontWeight: 600 }}>
                  {t("login.registerFamily")}
                </button>
              </div>
            </>
          )}

          {step === 1 && loginMode === "familyCode" && (
            <>
              <div className="login-header">
                <div className="login-emoji">🏠</div>
                <h1 className="login-title fortnite-title">{t("login.title")}</h1>
                <p className="login-subtitle">{t("login.enterCode")}</p>
              </div>
              <form onSubmit={handleFamilyCodeSubmit}>
                {error && <div className="error-message">❌ {error}</div>}
                <div className="form-group">
                  <label htmlFor="familyCode" className="form-label">🔑 {t("login.familyCode")}</label>
                  <input id="familyCode" type="text" value={familyCode} onChange={(e) => setFamilyCode(e.target.value)} className="form-input" placeholder={t("login.familyCodePlaceholder")} required autoFocus />
                </div>
                <button type="submit" disabled={loading} className="login-button">
                  {loading ? `⏳ ${t("login.entering")}` : `🏠 ${t("login.enterFamily")}`}
                </button>
                <div style={{ marginTop: "20px", position: "relative", zIndex: 1 }}>
                  <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px", marginBottom: "10px", textAlign: "center" }}>{t("login.orSignInWith")}</p>
                  <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                    <button type="button" onClick={() => signIn("google", { callbackUrl: "/" })} className="quick-login-button" style={{ maxWidth: "200px" }}>Google</button>
                    <button type="button" onClick={() => signIn("apple", { callbackUrl: "/" })} className="quick-login-button" style={{ maxWidth: "200px" }}>Apple</button>
                  </div>
                </div>
              </form>
              <div style={{ textAlign: "center", marginTop: "24px", position: "relative", zIndex: 1 }}>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", marginBottom: "8px" }}>💡 {t("login.tipCode")}</p>
                <button type="button" onClick={() => { setLoginMode("email"); setError(""); setStep(1); }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.85)", fontSize: "14px", cursor: "pointer", textDecoration: "underline" }}>
                  {t("login.signInWithEmail")}
                </button>
                <span style={{ color: "rgba(255,255,255,0.5)", margin: "0 6px" }}>|</span>
                <button type="button" onClick={() => router.push("/")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", fontSize: "14px", cursor: "pointer", textDecoration: "underline" }}>← {t("common.backToHome")}</button>
                <span style={{ color: "rgba(255,255,255,0.5)", margin: "0 6px" }}>|</span>
                <button type="button" onClick={() => router.push("/register-family")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.85)", fontSize: "14px", cursor: "pointer", textDecoration: "underline", fontWeight: 600 }}>{t("login.registerFamily")}</button>
              </div>
            </>
          )}

          {/* STEP 2: SELECT USER */}
          {step === 2 && (
            <>
              <div className="login-header">
                <div className="login-emoji">⭐</div>
                <h1 className="login-title fortnite-title">{familyName}</h1>
                <p className="login-subtitle">
                  {t("login.selectUser")}
                </p>
              </div>

              <div className="users-grid">
                {users.map((user) => (
                  <div
                    key={user.name}
                    className="user-card"
                    onClick={() => handleUserClick(user)}
                  >
                    <div className="user-emoji">{user.emoji}</div>
                    <div className="user-name fortnite-text">{user.displayName}</div>
                    <div className="user-role">
                      {getRoleDisplay(user.role, user.gender)}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, marginTop: '24px' }}>
                <button
                  onClick={handleBack}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'rgba(255, 255, 255, 0.7)', 
                    fontSize: '14px', 
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  ← {t("login.changeCode")}
                </button>
              </div>
            </>
          )}

          {/* STEP 3: PASSWORD */}
          {step === 3 && selectedUser && (
          <div className="modal-overlay" onClick={handleModalClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-button" onClick={handleModalClose}>
                ✕
              </button>

              <div className="modal-header">
                <div className="modal-user-emoji">{selectedUser.emoji}</div>
                <div className="modal-user-name fortnite-text">{selectedUser.displayName}</div>
                <div className="modal-user-role">
                  {getRoleDisplay(selectedUser.role, selectedUser.gender)}
                </div>
              </div>

              <form onSubmit={handleLogin} className="password-form">
                {error && (
                  <div className="error-message">
                    ❌ {error}
                  </div>
                )}

                <p className="login-password-hint">
                  {t("login.passwordHint")}
                </p>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    🔑 {t("login.password")}
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    placeholder={t("login.passwordPlaceholder")}
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="login-button game-button"
                >
                  {loading ? `⏳ ${t("login.entering")}` : `🚀 ${t("login.enterSystem")}`}
                </button>

                <button
                  type="button"
                  onClick={() => quickLogin(selectedUser)}
                  className="quick-login-button fortnite-text"
                  disabled={loading}
                >
                  ⚡ {t("login.quickLogin")}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 