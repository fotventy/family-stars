"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  role: string;
  displayName: string;
  emoji: string;
  color: string;
}

export default function Login() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/login-users');
      const data = await response.json();
      
      // Преобразуем пользователей из БД в формат для страницы логина
      const formattedUsers = data.map((user: any) => ({
        id: user.id,
        name: user.name,
        role: user.role,
        displayName: user.name,
        emoji: getUserEmoji(user.role, user.name),
        color: getUserColor(user.role, user.name)
      }));
      
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    }
  };

  const getUserEmoji = (role: string, name: string) => {
    if (role === 'PARENT') {
      return name === 'Папа' ? '👨' : '👩';
    }
    // Для детей используем разные эмодзи
    const childEmojis = ['😊', '😎', '😄', '🤗', '😋'];
    const index = name.length % childEmojis.length;
    return childEmojis[index];
  };

  const getUserColor = (role: string, name: string) => {
    if (role === 'PARENT') {
      return name === 'Папа' ? 'from-orange-400 to-red-500' : 'from-pink-400 to-purple-500';
    }
    // Для детей используем разные цвета
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

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setPassword("");
    setError("");
  };

  const handleModalClose = () => {
    setSelectedUser(null);
    setPassword("");
    setError("");
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
      password
    });

    if (result?.error) {
        setError("Неверный пароль");
      } else {
        router.push("/");
      }
    } catch (error) {
      setError("Произошла ошибка при входе");
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (user: User) => {
    setLoading(true);
    setError("");

    // Используем стандартные пароли для быстрого входа
    const defaultPasswords: { [key: string]: string } = {
      'Папа': 'papa2024',
      'Мама': 'mama2024',
      'Назар': 'nazar2024',
      'Влад': 'vlad2024',
      'Никита': 'nikita2024'
    };

    try {
      const result = await signIn("credentials", {
        redirect: false,
        name: user.name,
        password: defaultPasswords[user.name] || 'default2024'
      });

      if (result?.error) {
        setError("Ошибка быстрого входа");
    } else {
      router.push("/");
      }
    } catch (error) {
      setError("Произошла ошибка при входе");
    } finally {
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

        .premium-login-container {
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
        .premium-login-container::before {
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

        /* 💎 ГЛАВНАЯ КАРТОЧКА */
        .login-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border: none;
          border-radius: 0;
          padding: 48px;
          max-width: 600px;
          width: 100%;
          position: relative;
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        }

        .login-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
          opacity: 1;
        }

        /* 🎮 ЗАГОЛОВОК */
        .login-header {
          text-align: center;
          margin-bottom: 40px;
          position: relative;
          z-index: 1;
        }

        .login-emoji {
          font-size: 80px;
          margin-bottom: 20px;
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        .login-title {
          color: white;
          font-size: 36px;
          font-weight: 800;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
          margin-bottom: 12px;
        }

        .login-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 18px;
          font-weight: 500;
        }

        /* 👥 ПОЛЬЗОВАТЕЛИ */
        .users-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 20px;
          position: relative;
          z-index: 1;
          margin-bottom: 32px;
        }

        .user-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: none;
          border-radius: 0;
          padding: 24px 16px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .user-card:hover {
          transform: translateY(-8px) scale(1.05);
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .user-card:active {
          transform: translateY(-4px) scale(1.02);
        }

        .user-emoji {
          font-size: 48px;
          margin-bottom: 12px;
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
        }

        .user-name {
          color: white;
          font-size: 16px;
          font-weight: 700;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
          margin-bottom: 4px;
        }

        .user-role {
          color: rgba(255, 255, 255, 0.7);
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* 🔐 МОДАЛЬНОЕ ОКНО */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border: none;
          border-radius: 0;
          padding: 40px;
          max-width: 400px;
          width: 100%;
          position: relative;
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.4s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          text-align: center;
          margin-bottom: 32px;
          position: relative;
          z-index: 1;
        }

        .modal-user-emoji {
          font-size: 64px;
          margin-bottom: 16px;
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
        }

        .modal-user-name {
          color: white;
          font-size: 24px;
          font-weight: 800;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
          margin-bottom: 8px;
        }

        .modal-user-role {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .close-button {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(255, 69, 58, 0.9);
          color: white;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 12px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button:hover {
          background: rgba(255, 69, 58, 1);
          transform: scale(1.1);
        }

        .password-form {
          position: relative;
          z-index: 1;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          display: block;
          color: white;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .form-input {
          width: 100%;
          padding: 16px 20px;
          border: none;
          border-radius: 0;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          color: white;
          font-size: 16px;
          font-weight: 500;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .form-input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .error-message {
          background: rgba(255, 69, 58, 0.9);
          color: white;
          padding: 12px 16px;
          border-radius: 0;
          text-align: center;
          font-weight: 600;
          margin-bottom: 20px;
          border: none;
          backdrop-filter: blur(10px);
          font-size: 14px;
        }

        .login-button {
          width: 100%;
          background: linear-gradient(135deg, #28A745 0%, #1E7E34 100%);
          color: white;
          border: none;
          border-radius: 0;
          padding: 16px 40px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 16px;
          min-height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Fortnite Battlefest', 'Inter', sans-serif !important;
          text-transform: uppercase;
          letter-spacing: 1px;
          
          /* Fortnite скошенные углы */
          clip-path: polygon(
            8px 0%, 
            100% 0%, 
            calc(100% - 8px) 100%, 
            0% 100%
          );
          
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-1px);
          background: linear-gradient(135deg, #34CE57 0%, #28A745 100%);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        .quick-login-button {
          width: 100%;
          background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
          color: white;
          border: none;
          border-radius: 0;
          padding: 16px 24px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
          min-height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Fortnite Battlefest', 'Inter', sans-serif !important;
          text-transform: uppercase;
          letter-spacing: 1px;
          
          /* Fortnite скошенные углы */
          clip-path: polygon(
            8px 0%, 
            100% 0%, 
            calc(100% - 8px) 100%, 
            0% 100%
          );
          
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .quick-login-button:hover {
          transform: translateY(-1px);
          background: linear-gradient(135deg, #5BA3F5 0%, #4A90E2 100%);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        /* 📱 МОБИЛЬНАЯ АДАПТАЦИЯ */
        @media (max-width: 768px) {
          .login-card {
            padding: 32px 24px;
            margin: 16px;
          }

          .login-title {
            font-size: 28px;
          }

          .login-subtitle {
            font-size: 16px;
          }

          .users-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .user-card {
            padding: 20px 12px;
          }

          .user-emoji {
            font-size: 40px;
          }

          .user-name {
            font-size: 14px;
          }

          .modal-content {
            padding: 32px 24px;
            margin: 16px;
          }
        }

        @media (max-width: 480px) {
          .users-grid {
            grid-template-columns: 1fr;
            max-width: 200px;
            margin: 0 auto 32px auto;
          }
        }
      `}</style>

      <div className="premium-login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-emoji">⭐</div>
            <h1 className="login-title fortnite-title">Семейные Звёзды</h1>
            <p className="login-subtitle">
              Выберите пользователя для входа
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
                  {user.role === "PARENT" ? "Родитель" : "Ребёнок"}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', marginBottom: '8px' }}>
              ✨ Родители управляют заданиями и подарками
            </p>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
              🌟 Дети выполняют задания и зарабатывают звёзды
            </p>
          </div>
        </div>

        {/* МОДАЛЬНОЕ ОКНО ВХОДА */}
        {selectedUser && (
          <div className="modal-overlay" onClick={handleModalClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-button" onClick={handleModalClose}>
                ✕
              </button>

              <div className="modal-header">
                <div className="modal-user-emoji">{selectedUser.emoji}</div>
                <div className="modal-user-name fortnite-text">{selectedUser.displayName}</div>
                <div className="modal-user-role">
                  {selectedUser.role === "PARENT" ? "Родитель" : "Ребёнок"}
                </div>
              </div>

              <form onSubmit={handleLogin} className="password-form">
                {error && (
                  <div className="error-message">
                    ❌ {error}
            </div>
                )}

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    🔑 Пароль
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    placeholder="Введите пароль"
                    required
                    autoFocus
              />
            </div>

            <button
              type="submit"
                  disabled={loading}
                  className="login-button game-button"
                >
                  {loading ? '⏳ Вход...' : '🚀 Войти в систему'}
                </button>

                <button
                  type="button"
                  onClick={() => quickLogin(selectedUser)}
                  className="quick-login-button fortnite-text"
                  disabled={loading}
                >
                  ⚡ Быстрый вход (тест)
            </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 