import React, { useEffect, useState } from 'react';

interface Stat {
  accessed_at: string;
  request_ip: string;
}

const UrlStats: React.FC<{ shortId: string }> = ({ shortId }) => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [totalAccesses, setTotalAccesses] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    // Função para buscar as estatísticas
    const fetchStats = async () => {
      try {
        console.log("Buscando estatísticas para o shortId:", shortId);  // Log para depuração
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/stats/${shortId}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar estatísticas.');
        }
        const data = await response.json();
        console.log("Estatísticas obtidas:", data);  // Log para depuração
        setStats(data.accesses);
        setTotalAccesses(data.totalAccesses);
      } catch (err) {
        console.error("Erro ao buscar estatísticas:", err);  // Log de erro
        setError('Erro ao buscar estatísticas.');
      }
    };

    if (shortId) {
      fetchStats();
    }
  }, [shortId]);

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <p>Total de Acessos: {totalAccesses}</p>
      <table>
        <thead>
          <tr>
            <th>Data de Acesso</th>
            <th>IP de Origem</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat, index) => (
            <tr key={index}>
              <td>{new Date(stat.accessed_at).toLocaleString()}</td>
              <td>{stat.request_ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UrlStats;
