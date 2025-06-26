"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function FirstLogin() {
  const [token, setToken] = useState("");
  const [userName, setUserName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const userParam = searchParams.get("user");
    
    if (tokenParam && userParam) {
      setToken(tokenParam);
      setUserName(decodeURIComponent(userParam));
    } else {
      setError("Неверная ссылка. Токен или имя пользователя не найдены.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (newPassword.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Отправляем запрос на смену пароля
      const response = await fetch("/api/change-password-by-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          userName,
          newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка смены пароля");
      }

      setSuccess("Пароль успешно изменён! Выполняется вход...");
      
      // Автоматически входим в систему с новым паролем
      const signInResult = await signIn("credentials", {
        name: userName,
        password: newPassword,
        redirect: false
      });

      if (signInResult?.error) {
        setError("Ошибка автоматического входа. Попробуйте войти вручную на странице входа.");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        // Перенаправляем на соответствующую страницу
        router.push("/parent");
      }
      
    } catch (error) {
      setError(error instanceof Error ? error.message : "Ошибка смены пароля");
    } finally {
      setLoading(false);
    }
  };

  if (!token || !userName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">❌ Ошибка</h1>
          <p className="text-gray-700 mb-6">{error || "Неверная ссылка для первого входа"}</p>
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Перейти к странице входа
          </button>
        </div>
      </div>
    );
  }

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

        .welcome-text {
          color: rgba(255, 255, 255, 0.9);
          font-size: 18px;
          text-align: center;
          margin-bottom: 32px;
          text-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 24px;
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
      `}</style>

      <div className="premium-container">
        <div className="premium-card">
          <div>
            <h1 className="premium-title">
              🔐 Первый вход
            </h1>
            <p className="welcome-text">
              Добро пожаловать, <strong>{userName}</strong>!<br/>
              Создайте новый пароль для входа в систему
            </p>
          </div>

          {error && (
            <div className="alert error">
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="alert success">
              <p>{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
                minLength={6}
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
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="premium-button primary"
            >
              {loading ? "Смена пароля..." : "Сменить пароль и войти"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
} 