"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user.role === "PARENT" || session?.user.role === "FAMILY_ADMIN") {
        redirect("/parent");
      } else {
        redirect("/child");
      }
    } else if (status === "unauthenticated") {
      // Показываем опции вместо автоматического перенаправления
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

        /* 📱 МОБИЛЬНАЯ АДАПТАЦИЯ */
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
          <div className="welcome-card">
            <h1 className="main-title">
              ⭐ Family Stars
            </h1>
            <p className="main-subtitle">
              Система семейных достижений и наград
            </p>
            
            <div className="options-container">
              <button 
                onClick={handleCreateFamily}
                className="option-button primary"
              >
                <span className="option-icon">🏠</span>
                <div className="option-text">
                  <span className="option-title">Создать семью</span>
                  <span className="option-description">Зарегистрировать новую семью</span>
                </div>
              </button>
              
              <button 
                onClick={handleJoinFamily}
                className="option-button secondary"
              >
                <span className="option-icon">🚪</span>
                <div className="option-text">
                  <span className="option-title">Войти в семью</span>
                  <span className="option-description">У меня уже есть аккаунт</span>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="loading-card">
            <div className="loading-spinner"></div>
            <h2 className="loading-title fortnite-title">Загружаем магию...</h2>
            <p className="loading-subtitle">Определяем твою роль в семье ✨</p>
          </div>
        )}
      </div>
    </>
  );
}
