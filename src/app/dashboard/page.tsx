"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

interface Task {
  id: string;
  title: string;
  points: number;
}

interface UserTask {
  id: string;
  task: Task;
  completed: boolean;
  date: string;
}

interface Gift {
  id: string;
  title: string;
  points: number;
}

interface UserGift {
  id: string;
  gift: Gift;
  redeemed: boolean;
  approvedByParent: boolean;
  date: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [userTasks, setUserTasks] = useState<UserTask[]>([]);
  const [userGifts, setUserGifts] = useState<UserGift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }

    if (status === "authenticated") {
      fetchUserData();
    }
  }, [status]);

  const fetchUserData = async () => {
    try {
      const [tasksResponse, giftsResponse] = await Promise.all([
        fetch("/api/user-tasks"),
        fetch("/api/user-gifts")
      ]);

      if (!tasksResponse.ok || !giftsResponse.ok) {
        throw new Error("Не удалось загрузить данные");
      }

      const tasksData = await tasksResponse.json();
      const giftsData = await giftsResponse.json();

      setUserTasks(tasksData);
      setUserGifts(giftsData);
      setLoading(false);
    } catch (err) {
      setError("Ошибка при загрузке данных");
      setLoading(false);
    }
  };

  const calculateTotalPoints = () => {
    return userTasks
      .filter(userTask => userTask.completed)
      .reduce((sum, userTask) => sum + userTask.task.points, 0);
  };

  const renderParentDashboard = () => {
    const completedTasks = userTasks.filter(task => task.completed);
    const pendingGifts = userGifts.filter(gift => !gift.approvedByParent);

    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Статистика детей</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Выполненные задачи</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Задача</th>
                  <th className="p-2 text-right">Баллы</th>
                  <th className="p-2 text-right">Дата</th>
                </tr>
              </thead>
              <tbody>
                {completedTasks.map(userTask => (
                  <tr key={userTask.id} className="border-b">
                    <td className="p-2">{userTask.task.title}</td>
                    <td className="p-2 text-right">{userTask.task.points}</td>
                    <td className="p-2 text-right">
                      {new Date(userTask.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Запросы на подарки</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Подарок</th>
                  <th className="p-2 text-right">Баллы</th>
                  <th className="p-2 text-right">Дата</th>
                </tr>
              </thead>
              <tbody>
                {pendingGifts.map(userGift => (
                  <tr key={userGift.id} className="border-b">
                    <td className="p-2">{userGift.gift.title}</td>
                    <td className="p-2 text-right">{userGift.gift.points}</td>
                    <td className="p-2 text-right">
                      {new Date(userGift.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderChildDashboard = () => {
    const totalPoints = calculateTotalPoints();
    const completedTasks = userTasks.filter(task => task.completed);
    const redeemedGifts = userGifts.filter(gift => gift.approvedByParent);

    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Мои достижения</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Мои баллы</h2>
            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-blue-600">{totalPoints}</p>
              <p className="text-gray-600">Всего баллов</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Выполненные задачи</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Задача</th>
                  <th className="p-2 text-right">Баллы</th>
                  <th className="p-2 text-right">Дата</th>
                </tr>
              </thead>
              <tbody>
                {completedTasks.map(userTask => (
                  <tr key={userTask.id} className="border-b">
                    <td className="p-2">{userTask.task.title}</td>
                    <td className="p-2 text-right">{userTask.task.points}</td>
                    <td className="p-2 text-right">
                      {new Date(userTask.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Полученные подарки</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Подарок</th>
                  <th className="p-2 text-right">Баллы</th>
                  <th className="p-2 text-right">Дата</th>
                </tr>
              </thead>
              <tbody>
                {redeemedGifts.map(userGift => (
                  <tr key={userGift.id} className="border-b">
                    <td className="p-2">{userGift.gift.title}</td>
                    <td className="p-2 text-right">{userGift.gift.points}</td>
                    <td className="p-2 text-right">
                      {new Date(userGift.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {session?.user.role === "PARENT" 
        ? renderParentDashboard() 
        : renderChildDashboard()}
    </div>
  );
} 