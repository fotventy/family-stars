"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterFamily() {
  const [email, setEmail] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [result, setResult] = useState<any>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !familyName) {
      setError("Email и название семьи обязательны");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/register-family", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, familyName })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка регистрации");
      }

      setSuccess(data.message);
      setResult(data);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏠 Создать семью
          </h1>
          <p className="text-gray-600">
            Зарегистрируйте новую семью в системе Family Stars
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {success && !result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}

        {result ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-green-800 mb-4">
              🎉 Семья успешно создана!
            </h3>
            
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Семья:</span>
                <span className="ml-2 text-gray-900">{familyName}</span>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Код семьи:</span>
                <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded text-gray-900">
                  {result.familyCode}
                </span>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Временный пароль:</span>
                <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded text-gray-900">
                  {result.tempPassword}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-xs">
                💡 <strong>Важно:</strong> Сохраните временный пароль! 
                При первом входе вам нужно будет его сменить.
              </p>
            </div>

            <button
              onClick={handleGoToLogin}
              className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              Перейти к входу
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email администратора
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="familyName" className="block text-sm font-medium text-gray-700 mb-2">
                Название семьи
              </label>
              <input
                type="text"
                id="familyName"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Семья Ивановых"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              {loading ? "Создание..." : "Создать семью"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Уже есть аккаунт?{" "}
            <button
              onClick={handleGoToLogin}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Войти
            </button>
          </p>
        </div>
      </div>
    </div>
  );
} 