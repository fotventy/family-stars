"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { UserManagementModal } from "@/components/UserManagementModal";
import { GiftManagementModal } from "@/components/GiftManagementModal";
import { TaskManagementModal } from "@/components/TaskManagementModal";
import { StatisticsChart } from "@/components/StatisticsChart";
import { ProfileModal } from "@/components/ProfileModal";

interface User {
  id: string;
  name: string;
  role: "PARENT" | "CHILD";
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  points: number;
  isActive: boolean;
  emoji?: string;
}

interface Gift {
  id: string;
  title: string;
  description?: string;
  points: number;
  isActive: boolean;
  emoji?: string;
}

interface UserGift {
  id: string;
  userId: string;
  giftId: string;
  status: string;
  createdAt: string;
  gift: Gift;
  user: User;
}

export default function ParentDashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<"tasks" | "gifts" | "statistics" | "users" | "orders">("tasks");
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [userGifts, setUserGifts] = useState<UserGift[]>([]);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }

    if (status === "authenticated" && session?.user.role === "PARENT") {
      fetchUsers();
      fetchTasks();
      fetchGifts();
      fetchUserGifts();
    }
  }, [status]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Ошибка при загрузке пользователей:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Ошибка при загрузке задач:", error);
    }
  };

  const fetchGifts = async () => {
    try {
      const response = await fetch("/api/gifts");
      const data = await response.json();
      setGifts(data);
    } catch (error) {
      console.error("Ошибка при загрузке подарков:", error);
    }
  };

  const fetchUserGifts = async () => {
    try {
      const response = await fetch("/api/user-gifts");
      const data = await response.json();
      setUserGifts(data);
    } catch (error) {
      console.error("Ошибка при загрузке выборов подарков:", error);
    }
  };

  const createUser = async (name: string, password: string, role: string) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          password,
          role
        })
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Ошибка при создании пользователя:", error);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users?id=${userId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error);
    }
  };

  const updateUser = async (userId: string, name: string, password?: string) => {
    try {
      const updateData: any = { id: userId, name };
      if (password) {
        updateData.password = password;
      }

      const response = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Ошибка при обновлении пользователя:", error);
    }
  };

  const createTask = async (title: string, description: string, points: number, emoji?: string) => {
    try {
      console.log("Создание задания:", { title, description, points, emoji });
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          description,
          points,
          emoji
        })
      });

      console.log("Ответ API:", response.status, response.statusText);

      if (response.ok) {
        const newTask = await response.json();
        console.log("Новое задание создано:", newTask);
        fetchTasks();
      } else {
        const error = await response.json();
        console.error("Ошибка API:", error);
      }
    } catch (error) {
      console.error("Ошибка при создании задачи:", error);
    }
  };

  const createGift = async (title: string, description: string, points: number, emoji?: string) => {
    try {
      console.log("Создание подарка:", { title, description, points, emoji });
      const response = await fetch("/api/gifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          description,
          points,
          emoji
        })
      });

      console.log("Ответ API:", response.status, response.statusText);

      if (response.ok) {
        const newGift = await response.json();
        console.log("Новый подарок создан:", newGift);
        fetchGifts();
      } else {
        const error = await response.json();
        console.error("Ошибка API:", error);
      }
    } catch (error) {
      console.error("Ошибка при создании подарка:", error);
    }
  };

  const updateTask = async (taskId: string, title: string, description: string, points: number, emoji?: string) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: taskId, title, description, points, emoji }),
      });
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Ошибка при обновлении задания:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Ошибка при удалении задачи:", error);
    }
  };

  const updateGift = async (giftId: string, title: string, description: string, points: number, emoji?: string) => {
    try {
      const response = await fetch('/api/gifts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: giftId, title, description, points, emoji }),
      });
      if (response.ok) {
        fetchGifts();
      }
    } catch (error) {
      console.error('Ошибка при обновлении подарка:', error);
    }
  };

  const deleteGift = async (giftId: string) => {
    try {
      const response = await fetch(`/api/gifts?id=${giftId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        fetchGifts();
      }
    } catch (error) {
      console.error("Ошибка при удалении подарка:", error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleEditGift = (gift: Gift) => {
    setEditingGift(gift);
    setIsGiftModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const updateUserGiftStatus = async (userGiftId: string, status: string) => {
    try {
      const response = await fetch("/api/user-gifts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userGiftId, status })
      });

      if (response.ok) {
        fetchUserGifts();
      }
    } catch (error) {
      console.error("Ошибка при обновлении статуса выбора:", error);
    }
  };

  const getTaskEmoji = (task: Task) => {
    // Если есть сохраненная иконка, используем её
    if (task.emoji) return task.emoji;
    
    // Иначе генерируем автоматически по названию
    const title = task.title;
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

  const getGiftEmoji = (gift: Gift) => {
    // Если есть сохраненная иконка, используем её
    if (gift.emoji) return gift.emoji;
    
    // Иначе генерируем автоматически по названию
    const title = gift.title;
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

          .admin-emoji {
            font-size: 80px;
            margin-bottom: 20px;
            animation: bounce 2s infinite;
          }

          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }

          .loading-title {
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 16px;
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
          }
        `}</style>

        <div className="premium-loading-container">
          <div className="loading-card">
            <div className="admin-emoji">👨‍💼</div>
            <h2 className="loading-title">Загружаем панель управления...</h2>
          </div>
        </div>
      </>
    );
  }

  if (status === "unauthenticated" || session?.user.role !== "PARENT") {
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

        .premium-parent-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          position: relative;
          overflow-x: hidden;
        }

        /* 🌟 АНИМИРОВАННЫЙ ГРАДИЕНТНЫЙ ФОН */
        .premium-parent-container::before {
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

        .admin-badge {
          background: linear-gradient(135deg, #FF6B35, #F7931E);
          color: white;
          padding: 12px 24px;
          border-radius: 0;
          font-size: 16px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
          border: none;
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
          flex-wrap: wrap;
        }

        .tab-button {
          padding: 16px 32px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 0;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
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

        /* 💎 КОНТЕНТ СЕКЦИИ */
        .content-section {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border: none;
          border-radius: 0;
          padding: 32px;
          margin-bottom: 32px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .section-title {
          color: white;
          font-size: 28px;
          font-weight: 800;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        /* 🔥 FORTNITE КНОПКИ */
        .premium-button {
          padding: 10px 20px;
          border: none;
          border-radius: 0;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          height: 42px;
          white-space: nowrap;
          font-family: 'Fortnite Battlefest', 'Inter', sans-serif !important;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .premium-button.add {
          background: linear-gradient(135deg, #28A745 0%, #1E7E34 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .premium-button.add:hover {
          transform: translateY(-1px);
          background: linear-gradient(135deg, #34CE57 0%, #28A745 100%);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .premium-button.edit {
          background: linear-gradient(135deg, #FFC107 0%, #E0A800 100%);
          color: white !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          padding: 8px 14px;
          font-size: 13px;
          height: 36px;
        }

        .premium-button.edit:hover {
          transform: translateY(-1px);
          background: linear-gradient(135deg, #FFD700 0%, #FFC107 100%);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .premium-button.delete {
          background: linear-gradient(135deg, #DC3545 0%, #C82333 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          padding: 8px 14px;
          font-size: 13px;
          height: 36px;
        }

        .premium-button.delete:hover {
          transform: translateY(-1px);
          background: linear-gradient(135deg, #E74C3C 0%, #DC3545 100%);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        /* 🎯 КНОПКИ УПРАВЛЕНИЯ ВЫБОРАМИ */
        .premium-button.approve {
          color: white !important;
        }

        .premium-button.reject {
          color: white !important;
        }

        .premium-button.redeem {
          color: white !important;
        }

        /* 🎯 СЕТКА КАРТОЧЕК */
        .cards-grid {
          display: grid;
          gap: 20px;
          margin-bottom: 32px;
        }

        .cards-grid.tasks {
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .cards-grid.gifts {
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .cards-grid.users {
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .cards-grid.orders {
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        /* 💎 ПРЕМИУМ КАРТОЧКИ */
        .premium-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border: none;
          border-radius: 0;
          padding: 12px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
          min-height: 160px;
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
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .premium-card:hover::before {
          opacity: 1;
        }

        .card-content {
          position: relative;
          z-index: 1;
        }

        .card-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .card-emoji {
          font-size: 28px;
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
        }

        .card-info {
          width: 100%;
          text-align: center;
        }

        .card-title {
          color: white;
          font-size: 14px;
          font-weight: 700;
          text-shadow: 0 2px 8px rgba(0,0,0,0.3);
          margin-bottom: 6px;
          line-height: 1.2;
        }

        .card-description {
          color: white;
          font-size: 11px;
          line-height: 1.3;
          margin-bottom: 8px;
        }

        .points-badge {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: white;
          padding: 3px 8px;
          border-radius: 0;
          font-size: 11px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 2px;
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
          margin-bottom: 8px;
        }

        /* 🏷️ СТАТУСНЫЕ БЕЙДЖИ */
        .status-badge {
          padding: 8px 12px;
          border-radius: 0;
          font-size: 14px;
          font-weight: 600;
          margin-top: 8px;
          display: inline-block;
        }

        .status-requested {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
        }

        .status-approved {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .status-rejected {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
        }

        .status-redeemed {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
        }

        .card-actions {
          display: flex;
          gap: 8px;
          margin-top: 16px;
        }

        /* 🏆 ПУСТОЕ СОСТОЯНИЕ */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: white;
        }

        .empty-emoji {
          font-size: 80px;
          margin-bottom: 20px;
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
        }

        .empty-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 12px;
          text-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }

        .empty-description {
          font-size: 16px;
          opacity: 0.8;
        }

        /* 📱 ПЛАНШЕТНАЯ АДАПТАЦИЯ */
        @media (max-width: 1024px) and (min-width: 769px) {
          .cards-grid.gifts {
            grid-template-columns: repeat(3, 1fr);
            gap: 18px;
          }
          .cards-grid.orders {
            grid-template-columns: repeat(3, 1fr);
            gap: 18px;
          }
          .cards-grid.tasks {
            grid-template-columns: repeat(3, 1fr);
            gap: 18px;
          }
          .cards-grid.users {
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

          .tab-container {
            flex-direction: column;
            align-items: center;
          }

          .section-header {
            flex-direction: column;
            align-items: stretch;
          }

          .cards-grid.gifts {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }

          .cards-grid.orders {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }

          .cards-grid.tasks {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }

          .cards-grid.users {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }

          .welcome-text {
            font-size: 18px;
          }

          .section-title {
            font-size: 18px;
          }

          .premium-content {
            padding: 0 12px;
          }

          .content-section {
            padding: 16px 12px;
          }

          .premium-button {
            height: 32px;
            font-size: 11px;
            padding: 6px 12px;
          }

          .premium-button.edit {
            height: 28px;
            font-size: 10px;
            padding: 4px 8px;
          }

          .premium-button.delete {
            height: 28px;
            font-size: 10px;
            padding: 4px 8px;
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
            padding: 3px 8px;
            margin-bottom: 8px;
          }

          .tab-button {
            font-size: 12px;
            padding: 8px 12px;
          }

          .header-buttons button {
            font-size: 12px;
            padding: 6px 12px;
          }
        }

        /* ✨ ДОПОЛНИТЕЛЬНЫЕ АНИМАЦИИ */
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
      `}</style>

      <div className="premium-parent-container">
        {/* 🎯 PREMIUM HEADER */}
        <div className="premium-header">
          <div className="header-content">
            <h1 className="welcome-text fortnite-title">
              Привет, {session?.user?.name}! 👨‍💼
            </h1>
            <div className="admin-badge">
              <span>👑</span>
              Панель управления
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
                onClick={() => signOut({ callbackUrl: '/login' })}
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
              className={`tab-button ${activeTab === "tasks" ? "active" : ""} fortnite-text`}
              onClick={() => setActiveTab("tasks")}
            >
              <span>📋</span>
              Задания
            </button>
            <button
              className={`tab-button ${activeTab === "gifts" ? "active" : ""} fortnite-text`}
              onClick={() => setActiveTab("gifts")}
            >
              <span>🎁</span>
              Подарки
            </button>
            <button
              className={`tab-button ${activeTab === "users" ? "active" : ""} fortnite-text`}
              onClick={() => setActiveTab("users")}
            >
              <span>👥</span>
              Дети
            </button>
            <button
              className={`tab-button ${activeTab === "orders" ? "active" : ""} fortnite-text`}
              onClick={() => setActiveTab("orders")}
            >
              <span>🛒</span>
              Выборы
            </button>
            <button
              className={`tab-button ${activeTab === "statistics" ? "active" : ""} fortnite-text`}
              onClick={() => setActiveTab("statistics")}
            >
              <span>📊</span>
              Статистика
            </button>
          </div>

          {/* 🎮 ЗАДАНИЯ */}
          {activeTab === "tasks" && (
            <div className="content-section fade-in-up">
              <div className="section-header">
                <h2 className="section-title fortnite-title">
                  <span>📋</span>
                  Управление заданиями
                </h2>
                <button 
                  onClick={() => setIsTaskModalOpen(true)}
                  className="premium-button add"
                >
                  <span>➕</span>
                  Добавить задание
                </button>
              </div>

              <div className="cards-grid tasks">
                {tasks.map(task => (
                  <div key={task.id} className="premium-card">
                    <div className="card-content">
                      <div style={{textAlign: 'center'}}>
                        <div className="card-emoji" style={{fontSize: '40px', marginBottom: '12px'}}>
                          {getTaskEmoji(task)}
                        </div>
                        <h3 className="card-title fortnite-text">{task.title}</h3>
                        {task.description && (
                          <p className="card-description">{task.description}</p>
                        )}
                        <div className="points-badge" style={{marginBottom: '12px'}}>
                          <span>⭐</span>
                          {task.points} звёзд
                        </div>
                        <div className="card-actions" style={{justifyContent: 'center'}}>
                          <button 
                            onClick={() => handleEditTask(task)}
                            className="premium-button edit"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => deleteTask(task.id)}
                            className="premium-button delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
      ))}
                {tasks.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-emoji">📝</div>
                    <h3 className="empty-title">Пока нет заданий</h3>
                    <p className="empty-description">Создайте первое задание для детей</p>
                  </div>
                )}
              </div>
    </div>
          )}

          {/* 🎁 ПОДАРКИ */}
          {activeTab === "gifts" && (
            <div className="content-section fade-in-up">
              <div className="section-header">
                <h2 className="section-title fortnite-title">
                  <span>🎁</span>
                  Управление подарками
                </h2>
        <button 
          onClick={() => setIsGiftModalOpen(true)}
                  className="premium-button add"
        >
                  <span>➕</span>
                  Добавить подарок
        </button>
      </div>

              <div className="cards-grid gifts">
      {gifts.map(gift => (
                  <div key={gift.id} className="premium-card">
                    <div className="card-content">
                      <div style={{textAlign: 'center'}}>
                        <div className="card-emoji" style={{fontSize: '64px', marginBottom: '16px'}}>
                          {getGiftEmoji(gift)}
                        </div>
                        <h3 className="card-title fortnite-text">{gift.title}</h3>
                        {gift.description && (
                          <p className="card-description">{gift.description}</p>
                        )}
                        <div className="points-badge" style={{marginBottom: '16px'}}>
                          <span>⭐</span>
                          {gift.points} звёзд
                        </div>
                        <div className="card-actions" style={{justifyContent: 'center'}}>
                          <button 
                            onClick={() => handleEditGift(gift)}
                            className="premium-button edit"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => deleteGift(gift.id)}
                            className="premium-button delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {gifts.length === 0 && (
                  <div className="empty-state" style={{gridColumn: '1 / -1'}}>
                    <div className="empty-emoji">🏪</div>
                    <h3 className="empty-title">Магазин подарков пуст</h3>
                    <p className="empty-description">Добавьте первые подарки для мотивации детей</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 👥 ДЕТИ */}
          {activeTab === "users" && (
            <div className="content-section fade-in-up">
              <div className="section-header">
                <h2 className="section-title fortnite-title">
                  <span>👥</span>
                  Управление детьми
                </h2>
                <button 
                  onClick={() => setIsUserModalOpen(true)}
                  className="premium-button add"
                >
                  <span>➕</span>
                  Добавить ребёнка
                </button>
              </div>

              <div className="cards-grid users">
                {users.filter(user => user.role === 'CHILD').map(user => (
                  <div key={user.id} className="premium-card">
                    <div className="card-content">
                      <div style={{textAlign: 'center'}}>
                        <div className="card-emoji" style={{fontSize: '40px', marginBottom: '12px'}}>👦</div>
                        <h3 className="card-title fortnite-text">{user.name}</h3>
                        <p className="card-description">
                          Создан: {new Date(user.createdAt).toLocaleDateString('ru')}
                        </p>
                        <div className="card-actions" style={{justifyContent: 'center', marginTop: '12px'}}>
                          <button 
                            onClick={() => handleEditUser(user)}
                            className="premium-button edit"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => deleteUser(user.id)}
                            className="premium-button delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
      ))}
                {users.filter(user => user.role === 'CHILD').length === 0 && (
                  <div className="empty-state">
                    <div className="empty-emoji">👶</div>
                    <h3 className="empty-title">Пока нет детских аккаунтов</h3>
                    <p className="empty-description">Создайте аккаунты для ваших детей</p>
                  </div>
                )}
              </div>
    </div>
          )}

                        {/* 🛒 ВЫБОРЫ ПОДАРКОВ */}
          {activeTab === "orders" && (
            <div className="content-section fade-in-up">
              <div className="section-header">
                <h2 className="section-title fortnite-title">
                  <span>🛒</span>
                  Выборы подарков
                </h2>
              </div>

              <div className="cards-grid orders">
                {userGifts.map(userGift => (
                  <div key={userGift.id} className="premium-card">
                    <div className="card-content">
                      <div className="card-header">
                        <div className="card-emoji">
                          {getGiftEmoji(userGift.gift)}
                        </div>
                        <div className="card-info">
                                                     <h3 className="card-title fortnite-text">{userGift.gift.title}</h3>
                          <p className="card-description">
                            Выбрал: <strong>{userGift.user.name}</strong>
                          </p>
                          <p className="card-description">
                            {new Date(userGift.createdAt).toLocaleDateString('ru', {
                              day: 'numeric',
                              month: 'long',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          {userGift.status === 'REQUESTED' && (
                            <div className={`status-badge status-${userGift.status.toLowerCase()}`}>
                              ⏳ Ожидает одобрения
                            </div>
                          )}
                          {userGift.status === 'APPROVED' && (
                            <div className={`status-badge status-${userGift.status.toLowerCase()}`}>
                              ✅ Одобрено
                            </div>
                          )}
                          <div className="points-badge">
                            <span>⭐</span>
                            {userGift.gift.points} звёзд
                          </div>

                        </div>
                      </div>
                      
                      {userGift.status === 'REQUESTED' && (
                        <div className="card-actions" style={{marginTop: '16px', display: 'flex', gap: '8px', paddingRight: '16px'}}>
                          <button 
                            onClick={() => updateUserGiftStatus(userGift.id, 'APPROVED')}
                            className="premium-button approve"
                            style={{
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              flex: 1,
                              color: 'white',
                              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                              textTransform: 'none' as const,
                              letterSpacing: 'normal',
                              fontWeight: '500',
                              fontSize: '11px',
                              padding: '10px 6px',
                              minHeight: '36px',
                              border: 'none',
                              borderRadius: '0'
                            }}
                          >
                            ✅ Одобрить
                          </button>
                          <button 
                            onClick={() => updateUserGiftStatus(userGift.id, 'REJECTED')}
                            className="premium-button reject"
                            style={{
                              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                              flex: 1,
                              color: 'white',
                              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                              textTransform: 'none' as const,
                              letterSpacing: 'normal',
                              fontWeight: '500',
                              fontSize: '11px',
                              padding: '10px 6px',
                              minHeight: '36px',
                              border: 'none',
                              borderRadius: '0'
                            }}
                          >
                            ❌ Отклонить
                          </button>
                        </div>
                      )}
                      
                      {userGift.status === 'APPROVED' && (
                        <div className="card-actions" style={{marginTop: '16px', paddingRight: '16px'}}>
                          <button 
                            onClick={() => updateUserGiftStatus(userGift.id, 'REDEEMED')}
                            className="premium-button redeem"
                            style={{
                              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                              width: '100%',
                              color: 'white',
                              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                              textTransform: 'none' as const,
                              letterSpacing: 'normal',
                              fontWeight: '500',
                              fontSize: '13px',
                              padding: '12px 8px',
                              minHeight: '44px'
                            }}
                          >
                            🎉 Отметить как полученный
                          </button>
                        </div>
                      )}
                      
                      {userGift.status === 'REJECTED' && (
                        <div className="status-bottom" style={{marginTop: '16px', textAlign: 'center'}}>
                          <div className={`status-badge status-${userGift.status.toLowerCase()}`}>
                            ❌ Отклонено
                          </div>
                        </div>
                      )}
                      {userGift.status === 'REDEEMED' && (
                        <div className="status-bottom" style={{marginTop: '16px', textAlign: 'center'}}>
                          <div className={`status-badge status-${userGift.status.toLowerCase()}`}>
                            🎉 Получено
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {userGifts.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-emoji">🛒</div>
                    <h3 className="empty-title">Пока нет выборов</h3>
                    <p className="empty-description">Дети ещё не выбирали подарки</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 📊 СТАТИСТИКА */}
          {activeTab === "statistics" && (
            <div className="content-section fade-in-up">
              <h2 className="section-title fortnite-title" style={{textAlign: 'center', marginBottom: '32px'}}>
                <span>📊</span>
                Статистика достижений
              </h2>
      <StatisticsChart />
    </div>
          )}
        </div>

        {/* Модальные окна */}
      <UserManagementModal 
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setEditingUser(null);
        }}
        users={users}
        editingUser={editingUser}
        onCreateUser={createUser}
        onDeleteUser={deleteUser}
        onUpdateUser={updateUser}
      />

      <TaskManagementModal 
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        tasks={tasks}
        editingTask={editingTask}
        onCreateTask={createTask}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
      />

      <GiftManagementModal 
        isOpen={isGiftModalOpen}
        onClose={() => {
          setIsGiftModalOpen(false);
          setEditingGift(null);
        }}
        gifts={gifts}
        editingGift={editingGift}
        onCreateGift={createGift}
        onUpdateGift={updateGift}
        onDeleteGift={deleteGift}
      />

        <ProfileModal 
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
    </>
  );
} 