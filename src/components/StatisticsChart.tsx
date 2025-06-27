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
  const [chartType, setChartType] = useState<'bar' | 'histogram'>('bar');

  useEffect(() => {
    fetchStatistics();
  }, [selectedPeriod]);

  const fetchStatistics = async () => {
    try {
      const response = await fetch(`/api/statistics?period=${selectedPeriod}`);
      const data = await response.json();
      
      if (response.ok && Array.isArray(data)) {
        setStatisticsData(data);
      } else {
        console.error("Ошибка API /api/statistics:", data);
        setStatisticsData([]); // Устанавливаем пустой массив при ошибке
      }
    } catch (error) {
      console.error("Ошибка при загрузке статистики:", error);
      setStatisticsData([]); // Устанавливаем пустой массив при ошибке
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

  // Создаем гистограмму для распределения очков
  const createHistogramData = () => {
    const points = statisticsData.map(stat => stat.pointsEarned);
    const maxPoints = Math.max(...points, 0);
    const binSize = Math.max(10, Math.ceil(maxPoints / 10)); // Размер бина минимум 10
    const numBins = Math.ceil(maxPoints / binSize) || 1;
    
    const bins = Array(numBins).fill(0);
    const binLabels = Array(numBins).fill(0).map((_, i) => 
      `${i * binSize}-${(i + 1) * binSize - 1}`
    );
    
    points.forEach(point => {
      const binIndex = Math.min(Math.floor(point / binSize), numBins - 1);
      bins[binIndex]++;
    });
    
    return {
      labels: binLabels,
      datasets: [{
        label: 'Количество детей',
        data: bins,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: chartType === 'bar' 
          ? `Статистика за ${selectedPeriod === 'week' ? 'неделю' : 'месяц'}`
          : `Распределение очков за ${selectedPeriod === 'week' ? 'неделю' : 'месяц'}`
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: chartType === 'bar' ? 'Значения' : 'Количество детей'
        }
      },
      x: {
        title: {
          display: chartType === 'histogram',
          text: 'Диапазон очков'
        }
      }
    }
  };

  return (
    <div className="bg-fortnite-accent p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-fortnite text-white">Статистика</h2>
        <div className="flex gap-2">
          {/* Переключатель периода */}
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
          
          {/* Переключатель типа графика */}
          <div className="ml-4">
            <button 
              onClick={() => setChartType('bar')}
              className={`
                mr-2 px-4 py-2 rounded-lg transition-colors
                ${chartType === 'bar' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:bg-fortnite-background'}
              `}
            >
              График
            </button>
            <button 
              onClick={() => setChartType('histogram')}
              className={`
                px-4 py-2 rounded-lg transition-colors
                ${chartType === 'histogram' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:bg-fortnite-background'}
              `}
            >
              Гистограмма
            </button>
          </div>
        </div>
      </div>
      
      {statisticsData.length > 0 ? (
        <Bar 
          data={chartType === 'bar' ? chartData : createHistogramData()} 
          options={chartOptions} 
        />
      ) : (
        <div className="text-center text-gray-400">
          Нет данных для отображения
        </div>
      )}
    </div>
  );
}; 