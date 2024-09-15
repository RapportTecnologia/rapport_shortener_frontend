import React, { useState, useEffect } from 'react';
import UrlStatsChart from './UrlStatsChart';

interface ShortenedUrl {
  id: number;
  site_id: number;
  original_url: string;
  hash: string;
  created_at: string;
}

const UrlList: React.FC = () => {
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<ShortenedUrl | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/urls`);
        if (!response.ok) {
          throw new Error('Erro ao buscar URLs encurtadas.');
        }
        const data = await response.json();
        setUrls(data);
      } catch (err) {
        setError('Erro ao buscar URLs encurtadas.');
      }
    };

    fetchUrls();
  }, []);

  const handleUrlClick = (url: ShortenedUrl) => {
    setSelectedUrl(url);
  };

  return (
    <div>
      <h2>Lista de URLs Encurtadas</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
        <ul>
          {urls.map((url) => (
            <li key={url.id}>
              <button onClick={() => handleUrlClick(url)}>
                {url.hash} - {url.original_url}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selectedUrl && (
        <div>
          <h3>Estatísticas para: {selectedUrl.hash}</h3>
          <UrlStatsChart shortId={selectedUrl.hash} />
        </div>
      )}
    </div>
  );
};

export default UrlList;
