"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user.role === "PARENT") {
        redirect("/parent");
      } else {
        redirect("/child");
      }
    } else if (status === "unauthenticated") {
      redirect("/login");
    }
  }, [status, session]);

  return (
    <>
      <style jsx>{`
        .premium-loading-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .premium-loading-container::before {
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
      `}</style>

      <div className="premium-loading-container">
        <div className="loading-card">
          <div className="loading-spinner"></div>
          <h2 className="loading-title fortnite-title">Загружаем магию...</h2>
          <p className="loading-subtitle">Определяем твою роль в семье ✨</p>
        </div>
      </div>
    </>
  );
}
