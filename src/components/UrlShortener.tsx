import React, { useState, useEffect } from 'react';
import { UserType } from '../types/user';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Link2, User, Mail, Phone, Copy, CheckCircle, Scissors } from 'lucide-react';

/**
 * Componente UrlShortener - Formulário para encurtar URLs
 * @param user - Dados do usuário autenticado
 */
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
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    console.log(`[UrlShortener/init] 🔄 Atualizando dados do usuário: ${JSON.stringify(user)}`);
    
    // Atualizar os campos com os dados do usuário quando o `user` for atualizado
    setOwnerName(user.name || '');
    setOwnerEmail(user.email || '');
    setOwnerWhatsapp(user.contact || '');
    
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setCopied(false);

    try {
      console.log('[UrlShortener/submit] 📤 Enviando requisição para encurtar URL...');
      
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
      console.log('[UrlShortener/submit] ✅ URL encurtada com sucesso:', data.shortUrl);
      setShortUrl(data.shortUrl);
      setError('');
    } catch (err) {
      console.error('[UrlShortener/submit] ❌ Erro ao encurtar URL:', err);
      setError('Erro ao encurtar a URL. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      console.log('[UrlShortener/copy] 📋 URL copiada para a área de transferência');
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('[UrlShortener/copy] ❌ Erro ao copiar URL:', err);
    }
  };

  const handleNewUrl = () => {
    setOriginalUrl('');
    setShortUrl('');
    setError('');
    setCopied(false);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary-100 rounded-lg">
            <Scissors className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <CardTitle>Encurtar URL</CardTitle>
            <p className="text-gray-600 text-sm mt-1">
              Transforme URLs longas em links curtos e rastreáveis
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {!shortUrl ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* URL Original */}
            <div>
              <Input
                type="url"
                label="URL Original"
                placeholder="https://exemplo.com/sua-url-muito-longa"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                icon={<Link2 className="w-5 h-5" />}
                required
                disabled={isLoading}
              />
            </div>

            {/* Informações do proprietário */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Informações do Proprietário
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  type="text"
                  label="Nome"
                  value={ownerName}
                  icon={<User className="w-5 h-5" />}
                  readOnly
                />

                <Input
                  type="email"
                  label="E-mail"
                  value={ownerEmail}
                  icon={<Mail className="w-5 h-5" />}
                  readOnly
                />

                <Input
                  type="text"
                  label="WhatsApp"
                  value={ownerWhatsapp}
                  icon={<Phone className="w-5 h-5" />}
                  readOnly
                />
              </div>
            </div>

            {/* Mensagem de erro */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                <span className="text-red-500 mt-0.5">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Botão de submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              icon={<Scissors className="w-5 h-5" />}
              disabled={isLoading}
            >
              {isLoading ? 'Encurtando...' : 'Encurtar URL'}
            </Button>
          </form>
        ) : (
          /* Resultado - URL Encurtada */
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">
                  URL Encurtada com Sucesso!
                </h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Original:
                  </label>
                  <p className="text-sm text-gray-600 break-all bg-white p-3 rounded border border-gray-200">
                    {originalUrl}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Encurtada:
                  </label>
                  <div className="flex gap-2">
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-primary-600 hover:text-primary-700 font-medium bg-white p-3 rounded border border-gray-200 break-all"
                    >
                      {shortUrl}
                    </a>
                    <Button
                      onClick={handleCopyUrl}
                      variant={copied ? 'success' : 'secondary'}
                      size="md"
                      icon={copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    >
                      {copied ? 'Copiado!' : 'Copiar'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={handleNewUrl}
              variant="primary"
              size="lg"
              className="w-full"
              icon={<Link2 className="w-5 h-5" />}
            >
              Encurtar Nova URL
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UrlShortener;
