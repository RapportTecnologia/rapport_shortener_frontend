import React, { useState, useEffect } from 'react';
import UrlStatsChart from './UrlStatsChart';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { BarChart3, ExternalLink, Calendar, Hash } from 'lucide-react';

/**
 * Interface para URLs encurtadas
 */
interface ShortenedUrl {
  id: number;
  site_id: number;
  originalUrl: string;
  hash: string;
  createdAt: string;
}

/**
 * Componente UrlList - Lista e estatísticas de URLs encurtadas
 */
const UrlList: React.FC = () => {
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<ShortenedUrl | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUrls = async () => {
      setIsLoading(true);
      try {
        console.log('[UrlList/fetch] 📊 Buscando lista de URLs encurtadas...');
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/urls`);
        if (!response.ok) {
          throw new Error('Erro ao buscar URLs encurtadas.');
        }
        const data = await response.json();
        console.log(`[UrlList/fetch] ✅ ${data.length} URLs carregadas`);
        setUrls(data);
        setError('');
      } catch (err) {
        console.error('[UrlList/fetch] ❌ Erro ao buscar URLs:', err);
        setError('Erro ao buscar URLs encurtadas.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUrls();
  }, []);

  const handleUrlClick = (url: ShortenedUrl) => {
    console.log('[UrlList/select] 🔍 URL selecionada:', url.hash);
    setSelectedUrl(url);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <CardTitle>Painel de Estatísticas</CardTitle>
              <p className="text-gray-600 text-sm mt-1">
                Visualize e analise suas URLs encurtadas
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Mensagem de erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          {/* Loading */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse text-gray-500">
                Carregando URLs...
              </div>
            </div>
          ) : urls.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma URL encurtada ainda.</p>
              <p className="text-gray-400 text-sm mt-2">
                Comece encurtando sua primeira URL acima!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  Total: <span className="font-semibold">{urls.length}</span> URLs
                </p>
              </div>

              {/* Tabela de URLs */}
              <div className="overflow-x-auto">
                <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hash
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          URL Original
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Criado em
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {urls.map((url) => (
                        <tr 
                          key={url.id}
                          className={`hover:bg-gray-50 transition-colors ${
                            selectedUrl?.id === url.id ? 'bg-primary-50' : ''
                          }`}
                        >
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Hash className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-mono font-medium text-gray-900">
                                {url.hash}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <a
                                href={url.originalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary-600 hover:text-primary-700 truncate max-w-md"
                                title={url.originalUrl}
                              >
                                {url.originalUrl}
                              </a>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {formatDate(url.createdAt)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <Button
                              onClick={() => handleUrlClick(url)}
                              variant={selectedUrl?.id === url.id ? 'primary' : 'secondary'}
                              size="sm"
                              icon={<BarChart3 className="w-4 h-4" />}
                            >
                              {selectedUrl?.id === url.id ? 'Selecionado' : 'Ver Stats'}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de estatísticas */}
      {selectedUrl && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Estatísticas Detalhadas</CardTitle>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Hash:</span> {selectedUrl.hash}
              </p>
              <p className="text-sm text-gray-600 break-all">
                <span className="font-medium">URL:</span> {selectedUrl.originalUrl}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <UrlStatsChart shortId={selectedUrl.hash} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UrlList;
