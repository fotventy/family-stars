"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

interface Task {
  id: string;
  title: string;
  description?: string;
  points: number;
}

export default function TasksPage() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }

    if (status === "authenticated") {
      fetchTasks();
    }
  }, [status]);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Ошибка при загрузке задач:", error);
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
        const updatedSelectedTasks = [...selectedTasks, taskId];
        setSelectedTasks(updatedSelectedTasks);
        
        const completedTask = tasks.find(task => task.id === taskId);
        if (completedTask) {
          setTotalPoints(prev => prev + completedTask.points);
        }
      }
    } catch (error) {
      console.error("Ошибка при выполнении задачи:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl bg-fortnite-background min-h-screen text-white">
      <h1 className="text-3xl font-fortnite font-bold mb-6 text-center fortnite-title">
        Мои задачи 🎮
      </h1>

      <div className="bg-fortnite-accent p-4 rounded-lg text-center mb-6">
        <h2 className="text-2xl font-fortnite fortnite-text">Мои очки</h2>
        <div className="text-4xl font-bold text-fortnite-secondary">{totalPoints}</div>
      </div>

      <div className="space-y-4">
        {tasks.map(task => (
          <div 
            key={task.id} 
            className={`
              p-4 rounded-lg transition-all duration-300 
              ${selectedTasks.includes(task.id) 
                ? 'bg-green-700 border-2 border-green-500' 
                : 'bg-fortnite-accent hover:bg-fortnite-primary'}
              flex justify-between items-center
            `}
          >
            <div>
              <h3 className="text-lg font-fortnite font-bold fortnite-text">{task.title}</h3>
              {task.description && (
                <p className="text-white text-sm">{task.description}</p>
              )}
              <span className="text-yellow-500 font-semibold">
                {task.points} очков
              </span>
            </div>
            {!selectedTasks.includes(task.id) && (
              <button 
                onClick={() => handleTaskComplete(task.id)}
                className="
                  bg-green-500 text-white px-4 py-2 rounded-full 
                  hover:bg-green-600 transition-colors
                "
              >
                Выполнить
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 