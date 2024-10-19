import React, { useState, useEffect } from 'react';
import { UserType } from '../types/user';

interface UrlShortenerProps {
  user: UserType;
}

const UrlShortener: React.FC<UrlShortenerProps> = ({ user }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [ownerName, setOwnerName] = useState(user.name || '');
  const [ownerEmail, setOwnerEmail] = useState(user.email || '');
  const [ownerWhatsapp, setOwnerWhatsapp] = useState(user.contact || '');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    console.log(`useEffect ${JSON.stringify(user)}`);
    
    // Atualizar os campos com os dados do usuário quando o `user` for atualizado
    setOwnerName(user.name || '');
    setOwnerEmail(user.email || '');
    setOwnerWhatsapp(user.contact || '');
    
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Enviando a URL original para o backend
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: originalUrl, name: ownerName, email: ownerEmail, contact: ownerWhatsapp }),
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
        <label>
          URL Original:
          <input
            type="url"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            placeholder="Insira a URL para encurtar"
            required
          />
        </label>
        <br />
        <label>
          Seu nome:
          <input
            type="text"
            value={ownerName}
            readOnly
          />
        </label>
        <br />
        <label>
          Seu e-mail:
          <input
            type="email"
            value={ownerEmail}
            readOnly
          />
        </label>
        <br />
        <label>
          Seu WhatsApp:
          <input
            type="text"
            value={ownerWhatsapp}
            readOnly
          />
        </label>
        <br />
      
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
