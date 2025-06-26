"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function FirstLogin() {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1 - ввод временного пароля, 2 - смена пароля
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    const userParam = searchParams.get('user');
    
    if (tokenParam) setToken(tokenParam);
    if (userParam) setUsername(decodeURIComponent(userParam));
  }, [searchParams]);

  const handleTempPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tempPassword) {
      setError("Введите временный пароль");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Сначала проверяем временный пароль
      const result = await signIn("credentials", {
        username,
        password: tempPassword,
        redirect: false
      });

      if (result?.error) {
        setError("Неверный временный пароль");
        setLoading(false);
        return;
      }

      // Если временный пароль правильный, переходим к смене пароля
      setStep(2);
      setLoading(false);
      
    } catch (error) {
      console.error("Ошибка входа:", error);
      setError("Ошибка при входе");
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      setError("Заполните все поля");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (newPassword.length < 4) {
      setError("Пароль должен содержать минимум 4 символа");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Обновляем пароль пользователя
      const response = await fetch("/api/change-password-by-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка смены пароля");
      }

      // Автоматически логинимся с новым паролем
      const signInResult = await signIn("credentials", {
        username,
        password: newPassword,
        redirect: false
      });

      if (signInResult?.error) {
        setError("Ошибка входа с новым паролем");
        setLoading(false);
        return;
      }

      // Перенаправляем на dashboard
      router.push("/dashboard");
      
    } catch (error) {
      console.error("Ошибка смены пароля:", error);
      setError(error instanceof Error ? error.message : "Ошибка смены пароля");
      setLoading(false);
    }
  };

  return (
    <>
      {/* 💫 ПРЕМИУМ СТИЛИ */}
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

        /* 🌟 АНИМИРОВАННЫЙ ГРАДИЕНТНЫЙ ФОН */
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
          font-family: 'Fortnite Battlefest', 'Inter', sans-serif !important;
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

        .form-input:disabled {
          background: rgba(255, 255, 255, 0.6);
          color: rgba(0, 0, 0, 0.6);
          cursor: not-allowed;
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
          font-family: 'Fortnite Battlefest', 'Inter', sans-serif !important;
          position: relative;
          overflow: hidden;
          width: 100%;
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

        .premium-button.success:hover:not(:disabled) {
          background: linear-gradient(135deg, #66BB6A, #4CAF50);
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(76, 175, 80, 0.6);
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

        .step-indicator {
          display: flex;
          justify-content: center;
          margin-bottom: 32px;
          gap: 16px;
        }

        .step {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 18px;
          transition: all 0.3s ease;
        }

        .step.active {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: white;
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
        }

        .step.completed {
          background: linear-gradient(135deg, #4CAF50, #45a049);
          color: white;
          box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
        }

        .step.inactive {
          background: rgba(255, 255, 255, 0.3);
          color: rgba(255, 255, 255, 0.7);
        }

        /* 📱 МОБИЛЬНАЯ АДАПТАЦИЯ */
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
              🌟 Первый вход
            </h1>
            
            <div className="step-indicator">
              <div className={`step ${step === 1 ? 'active' : step > 1 ? 'completed' : 'inactive'}`}>
                1
              </div>
              <div className={`step ${step === 2 ? 'active' : step > 2 ? 'completed' : 'inactive'}`}>
                2
              </div>
            </div>
            
            <p className="premium-subtitle">
              {step === 1 
                ? `Добро пожаловать, ${username}! Введите временный пароль`
                : "Установите новый пароль для входа"
              }
            </p>
          </div>

          {error && (
            <div className="alert error">
              <p>{error}</p>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleTempPasswordSubmit} className="premium-form">
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Имя пользователя
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  disabled
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="tempPassword" className="form-label">
                  Временный пароль
                </label>
                <input
                  type="password"
                  id="tempPassword"
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  className="form-input"
                  placeholder="Введите временный пароль"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="premium-button primary"
              >
                {loading ? "Проверка..." : "Продолжить"}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordChange} className="premium-form">
              <div className="form-group">
                <label htmlFor="newPassword" className="form-label">
                  Новый пароль
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-input"
                  placeholder="Введите новый пароль"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Подтвердите пароль
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input"
                  placeholder="Повторите новый пароль"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="premium-button success"
              >
                {loading ? "Сохранение..." : "Установить пароль"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
} 