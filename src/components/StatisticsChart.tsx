import React, { useState, useEffect, useMemo } from 'react';
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
import { useTranslation } from '@/contexts/LanguageContext';

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
  const { t } = useTranslation();
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
        setStatisticsData([]);
      }
    } catch (error) {
      setStatisticsData([]);
    }
  };

  const chartData = useMemo(() => ({
    labels: statisticsData.map(stat => stat.userName),
    datasets: [
      {
        label: t('statistics.completedTasks'),
        data: statisticsData.map(stat => stat.tasksCompleted),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: t('statistics.earnedPoints'),
        data: statisticsData.map(stat => stat.pointsEarned),
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1
      },
      {
        label: t('statistics.receivedPrizes'),
        data: statisticsData.map(stat => stat.giftsRedeemed),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  }), [statisticsData, t]);

  const createHistogramData = () => {
    const points = statisticsData.map(stat => stat.pointsEarned);
    const maxPoints = Math.max(...points, 0);
    const binSize = Math.max(10, Math.ceil(maxPoints / 10));
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
        label: t('statistics.childrenCount'),
        data: bins,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    };
  };

  const chartOptions = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: chartType === 'bar' 
          ? (selectedPeriod === 'week' ? t('statistics.forWeek') : t('statistics.forMonth'))
          : (selectedPeriod === 'week' ? t('statistics.pointsDistributionWeek') : t('statistics.pointsDistributionMonth'))
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: chartType === 'bar' ? t('statistics.values') : t('statistics.childrenCount')
        }
      },
      x: {
        title: {
          display: chartType === 'histogram',
          text: t('statistics.pointsRange')
        }
      }
    }
  }), [chartType, selectedPeriod, t]);

  return (
    <div className="bg-fortnite-accent p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-fortnite text-white">{t('statistics.title')}</h2>
        <div className="flex gap-2">
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
              {t('statistics.week')}
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
              {t('statistics.month')}
            </button>
          </div>
          
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
              {t('statistics.graph')}
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
              {t('statistics.histogram')}
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
          {t('statistics.noData')}
        </div>
      )}
    </div>
  );
}; 