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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🌟 Первый вход
          </h1>
          <p className="text-gray-600">
            {step === 1 
              ? `Добро пожаловать, ${username}! Введите временный пароль`
              : "Установите новый пароль для входа"
            }
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleTempPasswordSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Имя пользователя
              </label>
              <input
                type="text"
                id="username"
                value={username}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label htmlFor="tempPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Временный пароль
              </label>
              <input
                type="password"
                id="tempPassword"
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Введите временный пароль"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              {loading ? "Проверка..." : "Войти"}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Новый пароль
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Введите новый пароль"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Подтвердите пароль
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Повторите новый пароль"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              {loading ? "Сохранение..." : "Установить пароль"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 