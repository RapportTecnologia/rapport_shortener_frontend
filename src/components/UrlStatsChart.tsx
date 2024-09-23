import React, { useEffect, useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

interface StatsData {
  totalAccesses: number;
  totalIps: number;
  averageAccessesPerDay: number;
  ipPercentage: { ip: string, percentage: string, count: number }[];
  accessesPerDay: { [key: string]: number };
}

const UrlStatsChart: React.FC<{ shortId: string }> = ({ shortId }) => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/stats/${shortId}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar estatísticas.');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError('Erro ao buscar estatísticas.');
      }
    };

    if (shortId) {
      fetchStats();
    }
  }, [shortId]);

  if (!stats) return <p>Carregando estatísticas...</p>;

  const ipLabels = stats.ipPercentage.map(ip => ip.ip);
  const ipAccesses = stats.ipPercentage.map(ip => ip.count);
  const ipPercentages = stats.ipPercentage.map(ip => ip.percentage);

  const accessesPerDayLabels = Object.keys(stats.accessesPerDay);
  const accessesPerDayData = Object.values(stats.accessesPerDay);

  return (
    <div className="chart-grid">
      <div className="chart-container">
        <Line
          data={{
            labels: accessesPerDayLabels,
            datasets: [
              {
                label: 'Acessos por Dia',
                data: accessesPerDayData,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
              },
            ],
          }}
        />
      </div>

      <div className="chart-container">
        <Pie
          data={{
            labels: ipLabels,
            datasets: [
              {
                label: 'Porcentagem de Acessos por IP',
                data: ipPercentages,
                backgroundColor: [
                  '#FF6384',
                  '#36A2EB',
                  '#FFCE56',
                  '#4BC0C0',
                  '#9966FF',
                ],
                hoverBackgroundColor: [
                  '#FF6384',
                  '#36A2EB',
                  '#FFCE56',
                  '#4BC0C0',
                  '#9966FF',
                ],
              },
            ],
          }}
        />
      </div>

      <div className="chart-container">
        <Bar
          data={{
            labels: ipLabels,
            datasets: [
              {
                label: 'Acessos por IP',
                data: ipAccesses,
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
              },
            ],
          }}
        />
      </div>
    </div>
  );
};

export default UrlStatsChart;
