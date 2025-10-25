import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Auth from './components/Auth';
import React, { useState, useEffect } from 'react';
import UrlShortener from './components/UrlShortener';
import UrlList from './components/UrlList';
import crypto from 'crypto-js';
import { UserType, LoginType } from './types/user';
import { LogOut, Link as LinkIcon } from 'lucide-react';

async function fetchUserFromDatabase(username: string, password: string): Promise<LoginType> {
  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/authUser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    throw new Error('Erro ao tentar autenticar o usuário, tente mais tarde!');
  }

  const data = await response.json();
  console.log(`fetchUserFromDatabase ${JSON.stringify(data)}`);
  return data as LoginType;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  // Verificar se há dados de login no localStorage ao iniciar o aplicativo
  useEffect(() => {
    const savedLogin = localStorage.getItem('loginData');
    if (savedLogin) {
      const parsedLogin = JSON.parse(savedLogin) as LoginType;
      setUser(parsedLogin.user);
      setIsAuthenticated(parsedLogin.autenticated);
    }
  }, []);

  const onLogin = async (username: string, password: string) => {
    console.log(`[auth/login] 🧠 Tentativa de login para ${username}`);

    try {
      const login = await fetchUserFromDatabase(
        username,
        crypto.SHA256(password).toString(),
      );

      if (!login?.autenticated) {
        throw new Error('Login inválido, verifique login e password!');
      }

      setUser(login.user);
      setIsAuthenticated(login.autenticated);
      localStorage.setItem('loginData', JSON.stringify(login));
      console.log('[auth/login] ✅ Usuário autenticado com sucesso');
    } catch (loginError) {
      const errorMessage = loginError instanceof Error ? loginError.message : 'Erro inesperado ao autenticar.';
      console.error(`[auth/login] ❌ Falha na autenticação: ${errorMessage}`);
      throw loginError;
    }
  };

  const onLogout = () => {
    // Limpar os dados de login e desautenticar o usuário
    localStorage.removeItem('loginData');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter basename='/admin'>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header moderno com gradiente */}
        <header className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-3">
                <LinkIcon className="w-8 h-8 text-white" />
                <h1 className="text-2xl font-bold text-white">Rapport Shortener</h1>
              </div>
              {isAuthenticated && user && (
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-primary-100 text-sm">{user.email}</p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Sair</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Conteúdo principal */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route
              path="/"
              element={
                <Auth isAuthenticated={isAuthenticated} onLogin={onLogin}>
                  <div className="space-y-8">
                    {/* Seção de encurtamento de URL */}
                    <div>
                      {user && isAuthenticated ? (
                        <UrlShortener user={user} />
                      ) : (
                        <div className="flex items-center justify-center py-12">
                          <div className="animate-pulse text-gray-500">
                            Carregando dados do usuário...
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Seção de estatísticas */}
                    <div>
                      <UrlList />
                    </div>
                  </div>
                </Auth>
              }
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-gray-600 text-sm">
              © {new Date().getFullYear()} Rapport Shortener. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
