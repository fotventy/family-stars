import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StatisticsData {
  userId: string;
  userName: string;
  tasksCompleted: number;
  pointsEarned: number;
  giftsRedeemed: number;
}

export const StatisticsChart: React.FC = () => {
  const [statisticsData, setStatisticsData] = useState<StatisticsData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

  useEffect(() => {
    fetchStatistics();
  }, [selectedPeriod]);

  const fetchStatistics = async () => {
    try {
      const response = await fetch(`/api/statistics?period=${selectedPeriod}`);
      const data = await response.json();
      setStatisticsData(data);
    } catch (error) {
      console.error("Ошибка при загрузке статистики:", error);
    }
  };

  const chartData = {
    labels: statisticsData.map(stat => stat.userName),
    datasets: [
      {
        label: 'Выполненные задачи',
        data: statisticsData.map(stat => stat.tasksCompleted),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'Заработанные очки',
        data: statisticsData.map(stat => stat.pointsEarned),
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1
      },
      {
        label: 'Полученные призы',
        data: statisticsData.map(stat => stat.giftsRedeemed),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Статистика за ${selectedPeriod === 'week' ? 'неделю' : 'месяц'}`
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="bg-fortnite-accent p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-fortnite text-white">Статистика</h2>
        <div>
          <button 
            onClick={() => setSelectedPeriod('week')}
            className={`
              mr-2 px-4 py-2 rounded-lg transition-colors
              ${selectedPeriod === 'week' 
                ? 'bg-fortnite-primary text-white' 
                : 'text-gray-400 hover:bg-fortnite-background'}
            `}
          >
            Неделя
          </button>
          <button 
            onClick={() => setSelectedPeriod('month')}
            className={`
              px-4 py-2 rounded-lg transition-colors
              ${selectedPeriod === 'month' 
                ? 'bg-fortnite-primary text-white' 
                : 'text-gray-400 hover:bg-fortnite-background'}
            `}
          >
            Месяц
          </button>
        </div>
      </div>
      
      {statisticsData.length > 0 ? (
        <Bar data={chartData} options={chartOptions} />
      ) : (
        <div className="text-center text-gray-400">
          Нет данных для отображения
        </div>
      )}
    </div>
  );
}; 