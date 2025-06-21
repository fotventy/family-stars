"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

interface Gift {
  id: string;
  title: string;
  description?: string;
  points: number;
}

export default function GiftsPage() {
  const { data: session, status } = useSession();
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [selectedGifts, setSelectedGifts] = useState<string[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }

    if (status === "authenticated") {
      fetchGifts();
      fetchUserPoints();
    }
  }, [status]);

  const fetchGifts = async () => {
    try {
      const response = await fetch("/api/gifts");
      const data = await response.json();
      setGifts(data);
    } catch (error) {
      console.error("Ошибка при загрузке призов:", error);
    }
  };

  const fetchUserPoints = async () => {
    try {
      const response = await fetch("/api/user-points");
      const data = await response.json();
      setUserPoints(data.points);
    } catch (error) {
      console.error("Ошибка при загрузке очков:", error);
    }
  };

  const handleGiftRequest = async (giftId: string, giftPoints: number) => {
    if (userPoints < giftPoints) {
      alert("Недостаточно очков для получения приза!");
      return;
    }

    try {
      const response = await fetch("/api/user-gifts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ giftId })
      });

      if (response.ok) {
        const updatedSelectedGifts = [...selectedGifts, giftId];
        setSelectedGifts(updatedSelectedGifts);
        setUserPoints(prev => prev - giftPoints);
      }
    } catch (error) {
      console.error("Ошибка при запросе приза:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl bg-fortnite-background min-h-screen text-white">
      <h1 className="text-3xl font-fortnite font-bold mb-6 text-center fortnite-title">
        Магазин призов 🏆
      </h1>

      <div className="bg-fortnite-accent p-4 rounded-lg text-center mb-6">
        <h2 className="text-2xl font-fortnite fortnite-text">Мои очки</h2>
        <div className="text-4xl font-bold text-fortnite-secondary">{userPoints}</div>
      </div>

      <div className="space-y-4">
        {gifts.map(gift => (
          <div 
            key={gift.id} 
            className={`
              p-4 rounded-lg transition-all duration-300 
              ${selectedGifts.includes(gift.id) 
                ? 'bg-green-700 border-2 border-green-500' 
                : 'bg-fortnite-accent hover:bg-fortnite-primary'}
              flex justify-between items-center
            `}
          >
            <div>
              <h3 className="text-lg font-fortnite font-bold fortnite-text">{gift.title}</h3>
              {gift.description && (
                <p className="text-white text-sm">{gift.description}</p>
              )}
              <span className="text-yellow-500 font-semibold">
                {gift.points} очков
              </span>
            </div>
            {!selectedGifts.includes(gift.id) && (
              <button 
                onClick={() => handleGiftRequest(gift.id, gift.points)}
                className={`
                  text-white px-4 py-2 rounded-full transition-colors
                  ${userPoints >= gift.points 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-gray-500 cursor-not-allowed'}
                `}
                disabled={userPoints < gift.points}
              >
                {userPoints >= gift.points ? 'Получить' : 'Недостаточно очков'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 