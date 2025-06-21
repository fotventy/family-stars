"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { ProfileModal } from "@/components/ProfileModal";

interface Task {
  id: string;
  title: string;
  description?: string;
  points: number;
  isActive: boolean;
}

interface Gift {
  id: string;
  title: string;
  description?: string;
  points: number;
  isActive: boolean;
}

interface UserTask {
  id: string;
  taskId: string;
  status: string;
  createdAt: string;
}

export default function ChildDashboard() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [userTasks, setUserTasks] = useState<UserTask[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [selectedTab, setSelectedTab] = useState<"tasks" | "gifts">("tasks");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  // Состояние для popup уведомлений
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // Функция для показа уведомлений
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 1000); // Уведомление исчезает через 1 секунду
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }

    if (status === "authenticated" && session?.user.role === "CHILD") {
      fetchTasks();
      fetchGifts();
      fetchUserTasks();
      fetchUserPoints();
    }
  }, [status]);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      const data = await response.json();
      setTasks(data.filter((task: Task) => task.isActive));
    } catch (error) {
      console.error("Ошибка при загрузке задач:", error);
    }
  };

  const fetchGifts = async () => {
    try {
      const response = await fetch("/api/gifts");
      const data = await response.json();
      setGifts(data.filter((gift: Gift) => gift.isActive));
    } catch (error) {
      console.error("Ошибка при загрузке подарков:", error);
    }
  };

  const fetchUserTasks = async () => {
    try {
      const response = await fetch("/api/user-tasks");
      const data = await response.json();
      setUserTasks(data);
    } catch (error) {
      console.error("Ошибка при загрузке пользовательских задач:", error);
    }
  };

  const fetchUserPoints = async () => {
    try {
      const response = await fetch("/api/user-points");
      const data = await response.json();
      setUserPoints(data.points || 0);
    } catch (error) {
      console.error("Ошибка при загрузке баллов:", error);
    }
  };

  const handleTaskComplete = async (taskId: string) => {
    try {
      const response = await fetch("/api/user-tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ taskId })
      });

      if (response.ok) {
        await fetchUserTasks();
        await fetchUserPoints();
        // Найдем задание чтобы показать его название в уведомлении
        const task = tasks.find(t => t.id === taskId);
        const taskName = task?.title || "Задание";
        showNotification(`${taskName} выполнено! +${task?.points || 0} звёзд ⭐`, "success");
      } else {
        const error = await response.json();
        showNotification(error.error || "Ошибка при выполнении задания", "error");
      }
    } catch (error) {
      console.error("Ошибка при выполнении задачи:", error);
      showNotification("Произошла ошибка при выполнении задания", "error");
    }
  };

  const handleGiftRequest = async (giftId: string) => {
    try {
      const response = await fetch("/api/user-gifts", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ giftId })
      });

      if (response.ok) {
        await fetchUserPoints();
        showNotification("Подарок выбран! Ждите одобрения от родителей 🎁", "success");
      } else {
        const error = await response.json();
        showNotification(error.error || "Ошибка при выборе подарка", "error");
      }
    } catch (error) {
      console.error("Ошибка при выборе подарка:", error);
      showNotification("Произошла ошибка при выборе подарка", "error");
    }
  };

  const isTaskCompletedToday = (taskId: string) => {
    const today = new Date().toDateString();
    return userTasks.some(userTask => 
      userTask.taskId === taskId && 
      userTask.status === "COMPLETED" &&
      new Date(userTask.createdAt).toDateString() === today
    );
  };

  const getTaskEmoji = (title: string) => {
    if (title.includes('зарядк')) return '💪';
    if (title.includes('уборк') || title.includes('убрать')) return '🧹';
    if (title.includes('посуд')) return '🍽️';
    if (title.includes('урок') || title.includes('задан')) return '📚';
    if (title.includes('зуб')) return '🦷';
    if (title.includes('кровать')) return '🛏️';
    if (title.includes('мусор')) return '🗑️';
    if (title.includes('готовк')) return '👩‍🍳';
    if (title.includes('цвет')) return '🌱';
    if (title.includes('книг')) return '📖';
    return '✨';
  };

  const getGiftEmoji = (title: string) => {
    if (title.includes('игра') || title.includes('Fortnite') || title.includes('Minecraft')) return '🎮';
    if (title.includes('YouTube')) return '📺';
    if (title.includes('чупа')) return '🍭';
    if (title.includes('кола')) return '🥤';
    if (title.includes('пицца')) return '🍕';
    if (title.includes('кино')) return '🎬';
    if (title.includes('телефон')) return '📱';
    if (title.includes('лего')) return '🧱';
    if (title.includes('отбой')) return '😴';
    if (title.includes('фильм')) return '🎥';
    if (title.includes('макдоналдс')) return '🍟';
    if (title.includes('наушники')) return '🎧';
    if (title.includes('мышк')) return '🖱️';
    if (title.includes('аквапарк')) return '🏊‍♂️';
    return '🎁';
  };

  if (status === "loading") {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          textAlign: 'center', 
          color: 'white',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '0',
          padding: '40px',
          border: 'none'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            border: 'none',
            borderTop: '6px solid #FFD700',
            borderRadius: '0',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 30px'
          }}></div>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>Загрузка магии...</h2>
          <p style={{ fontSize: '18px', opacity: 0.8 }}>Готовим для тебя крутые задания!</p>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user.role !== "CHILD") {
    return null;
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
          overflow-x: hidden;
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

        /* 🎯 STICKY HEADER С РАЗМЫТИЕМ */
        .premium-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding: 20px 0;
          margin-bottom: 30px;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        .welcome-text {
          color: white;
          font-size: 28px;
          font-weight: 800;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }

        /* ⭐ ЗВЁЗДНЫЙ СЧЁТЧИК */
        .star-counter {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: white;
          padding: 16px 32px;
          border-radius: 0;
          font-size: 24px;
          font-weight: 800;
          box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
          border: none;
          display: flex;
          align-items: center;
          gap: 12px;
          transform: translateY(0);
          transition: all 0.3s ease;
        }

        .star-counter:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(255, 215, 0, 0.6);
        }

        .header-buttons {
          display: flex;
          gap: 12px;
        }

        .profile-btn {
          background: rgba(102, 126, 234, 0.9);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 0;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .profile-btn:hover {
          background: rgba(102, 126, 234, 1);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        .logout-btn {
          background: rgba(255, 69, 58, 0.9);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 0;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .logout-btn:hover {
          background: rgba(255, 69, 58, 1);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 69, 58, 0.4);
        }

        /* 🎮 КОНТЕЙНЕР КОНТЕНТА */
        .premium-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* 📱 ТАБЫ */
        .tab-container {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
          justify-content: center;
        }

        .tab-button {
          padding: 16px 32px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border: none;
          border-radius: 0;
          color: white;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .tab-button.active {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .tab-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        /* 🎯 СЕТКА КАРТОЧЕК */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }

        /* 💎 ПРЕМИУМ КАРТОЧКИ */
        .premium-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border: none;
          border-radius: 0;
          padding: 20px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
          min-height: 320px;
          display: flex;
          flex-direction: column;
        }

        .premium-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .premium-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .premium-card:hover::before {
          opacity: 1;
        }

        .card-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .card-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .card-emoji {
          font-size: 40px;
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
        }

        .card-title {
          color: white;
          font-size: 18px;
          font-weight: 700;
          text-shadow: 0 2px 8px rgba(0,0,0,0.3);
          line-height: 1.2;
          margin-bottom: 8px;
        }

        .card-description {
          color: white;
          font-size: 14px;
          line-height: 1.4;
          margin-bottom: 16px;
          text-align: center;
          flex-grow: 1;
        }

        .card-actions {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }



        /* 🏆 НАГРАДЫ */
        .points-badge {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: white;
          padding: 6px 12px;
          border-radius: 0;
          font-size: 14px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
          margin-bottom: 16px;
        }

        /* 📱 ПЛАНШЕТНАЯ АДАПТАЦИЯ */
        @media (max-width: 1024px) and (min-width: 769px) {
          .cards-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 18px;
          }
        }

        /* 📱 МОБИЛЬНАЯ АДАПТАЦИЯ */
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }

          .header-buttons {
            flex-direction: row;
            justify-content: center;
          }

          .cards-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            padding: 0 12px;
          }

          .tab-container {
            flex-direction: column;
            align-items: center;
          }

          .welcome-text {
            font-size: 18px;
          }

          .star-counter {
            font-size: 16px;
            padding: 10px 20px;
          }

          .tab-button {
            font-size: 12px;
            padding: 8px 12px;
          }

          .header-buttons button {
            font-size: 12px;
            padding: 6px 12px;
          }



          .premium-card {
            min-height: 180px;
            padding: 12px;
          }

          .card-header {
            gap: 8px;
            margin-bottom: 10px;
          }

          .card-emoji {
            font-size: 24px;
          }

          .card-title {
            font-size: 13px;
            margin-bottom: 6px;
          }

          .card-description {
            font-size: 11px;
            margin-bottom: 10px;
          }

          .points-badge {
            font-size: 10px;
            padding: 4px 8px;
            margin-bottom: 10px;
          }
        }

        /* ✨ ДОПОЛНИТЕЛЬНЫЕ АНИМАЦИИ */
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in-up {
          animation: fadeInUp 0.6s ease forwards;
        }

        /* 🔔 POPUP УВЕДОМЛЕНИЯ */
        .notification-popup {
          position: fixed;
          top: 30px;
          right: 30px;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border: none;
          border-radius: 0;
          padding: 20px 24px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          transform: translateX(100%);
          animation: slideInNotification 0.4s ease forwards;
          max-width: 400px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .notification-popup.success {
          border-left: 4px solid #4ade80;
        }

        .notification-popup.error {
          border-left: 4px solid #ef4444;
        }

        @keyframes slideInNotification {
          to {
            transform: translateX(0);
          }
        }

        @keyframes slideOutNotification {
          to {
            transform: translateX(100%);
          }
        }

        .notification-popup.hide {
          animation: slideOutNotification 0.4s ease forwards;
        }

        /* Мобильная адаптация для уведомлений */
        @media (max-width: 768px) {
          .notification-popup {
            top: 20px;
            right: 20px;
            left: 20px;
            max-width: none;
            font-size: 14px;
            padding: 16px 20px;
          }
        }
      `}</style>

      <div className="premium-container">
        {/* 🎯 PREMIUM HEADER */}
        <div className="premium-header">
          <div className="header-content">
            <h1 className="welcome-text fortnite-title">
              Привет, {session?.user?.name}! 👋
            </h1>
            <div className="star-counter">
              <span style={{fontSize: '32px'}}>⭐</span>
              {userPoints} звёзд
            </div>
            <div className="header-buttons">
              <button 
                className="profile-btn fortnite-text"
                onClick={() => setIsProfileModalOpen(true)}
              >
                👤 Профиль
              </button>
              <button 
                className="logout-btn fortnite-text"
                onClick={() => signOut()}
              >
                🚪 Выйти
              </button>
            </div>
          </div>
    </div>

        <div className="premium-content">
          {/* 📱 ТАБЫ */}
          <div className="tab-container">
      <button 
                className={`tab-button ${selectedTab === "tasks" ? "active" : ""} fortnite-text`}
                onClick={() => setSelectedTab("tasks")}
      >
                <span style={{fontSize: '24px'}}>✨</span>
                Задания
      </button>
      <button 
                className={`tab-button ${selectedTab === "gifts" ? "active" : ""} fortnite-text`}
                onClick={() => setSelectedTab("gifts")}
              >
                <span style={{fontSize: '24px'}}>🎁</span>
                Магазин призов
              </button>
          </div>

          {/* 🎮 ЗАДАНИЯ */}
          {selectedTab === "tasks" && (
            <div className="cards-grid fade-in-up">
              {tasks.map((task) => {
                const isCompleted = isTaskCompletedToday(task.id);
                return (
                  <div key={task.id} className="premium-card">
                    <div className="card-content">
                      <div className="card-header">
                        <div className="card-emoji">{getTaskEmoji(task.title)}</div>
                        <h3 className="card-title fortnite-text">{task.title}</h3>
                        <div className="points-badge">
                          <span>⭐</span>
                          +{task.points} звёзд
                        </div>
                      </div>
                      
                      {task.description && (
                        <p className="card-description">{task.description}</p>
                      )}
                      
                      <div className="card-actions">
                        <button
                          className={`game-button ${isCompleted ? "completed" : "complete"}`}
                          onClick={() => handleTaskComplete(task.id)}
                          disabled={isCompleted}
                        >
                          {isCompleted ? "✅ Выполнено сегодня!" : "🚀 Выполнить задание"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 🎁 ПОДАРКИ */}
          {selectedTab === "gifts" && (
            <div className="cards-grid fade-in-up">
              {gifts.map((gift) => {
                const canOrder = userPoints >= gift.points;
                return (
                  <div key={gift.id} className="premium-card">
                    <div className="card-content">
                      <div className="card-header">
                        <div className="card-emoji">{getGiftEmoji(gift.title)}</div>
                        <h3 className="card-title fortnite-text">{gift.title}</h3>
                        <div className="points-badge">
                          <span>⭐</span>
                          {gift.points} звёзд
                        </div>
                      </div>

                      {gift.description && (
                        <p className="card-description">{gift.description}</p>
                      )}
                      
                      <div className="card-actions">
                        <button
                          className={`game-button ${canOrder ? "order" : "order"}`}
                          onClick={() => handleGiftRequest(gift.id)}
                          disabled={!canOrder}
                          style={{
                            opacity: canOrder ? 1 : 0.6,
                            cursor: canOrder ? 'pointer' : 'not-allowed'
                          }}
                        >
                          {canOrder ? "🛒 Выбрать подарок!" : "❌ Недостаточно звёзд"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Модальное окно профиля */}
        <ProfileModal 
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />

        {/* 🔔 POPUP УВЕДОМЛЕНИЯ */}
        {notification && (
          <div className={`notification-popup ${notification.type}`}>
            <span style={{ fontSize: '24px' }}>
              {notification.type === 'success' ? '🎉' : '⚠️'}
            </span>
            <span>{notification.message}</span>
          </div>
        )}
      </div>
    </>
  );
} 