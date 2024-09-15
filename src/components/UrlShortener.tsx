import React, { useState } from 'react';

const UrlShortener: React.FC = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Enviando a URL original para o backend
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: originalUrl }),
      });

      if (!response.ok) {
        throw new Error('Erro ao encurtar a URL');
      }

      const data = await response.json();
      setShortUrl(data.shortUrl); // Definir a URL encurtada para exibição
      setError('');
    } catch (err) {
      setError('Erro ao encurtar a URL. Tente novamente.');
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="Insira a URL para encurtar"
          required
        />
        <button type="submit">Encurtar URL</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Exibe o erro, se houver */}

      {shortUrl && (
        <div>
          <p>URL encurtada:</p>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a> {/* Exibe a URL encurtada */}
        </div>
      )}
    </div>
  );
};

export default UrlShortener;
