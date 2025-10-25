import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { User, Lock, LogIn, Link as LinkIcon } from 'lucide-react';

/**
 * Componente de Login - Tela de autenticação do usuário
 * @param onLogin - Função callback para autenticação
 */
interface LoginProps {
  onLogin: (username: string, password: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    
    if (username && password) {
      setIsLoading(true);
      try {
        await onLogin(username, password);
      } catch (err) {
        setError('Erro ao fazer login. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('Por favor, preencha todos os campos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo e título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <LinkIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Rapport Shortener</h1>
          <p className="text-gray-600">Faça login para acessar o painel</p>
        </div>

        {/* Card de login */}
        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center">Entrar na sua conta</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                label="Usuário"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                icon={<User className="w-5 h-5" />}
                disabled={isLoading}
              />

              <Input
                type="password"
                label="Senha"
                placeholder="Digite sua senha"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                icon={<Lock className="w-5 h-5" />}
                disabled={isLoading}
              />

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                icon={<LogIn className="w-5 h-5" />}
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">
          © {new Date().getFullYear()} Rapport Shortener
        </p>
      </div>
    </div>
  );
};

export default Login;
