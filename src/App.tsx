import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Auth from './components/Auth';
import React, { useState, useEffect } from 'react';
import './App.css';
import UrlShortener from './components/UrlShortener';
import UrlList from './components/UrlList';
import crypto from 'crypto-js';
import { UserType, LoginType } from './types/user';

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
  const [error, setError] = useState('');

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
    console.log('Login:', username, password);
    // Lógica para autenticar o usuário
    await fetchUserFromDatabase(username, crypto.SHA256(password).toString())
      .then((login: LoginType) => {
        console.log(JSON.stringify(login));
        if (login) {
          setUser(login.user);
          setIsAuthenticated(login.autenticated);
          if (login.autenticated) {
            // Salvar os dados de login no localStorage para persistência
            localStorage.setItem('loginData', JSON.stringify(login));
          } else {
            setError('Login inválido, verifique login e password!');
          }
        }
      })
      .catch((error: Error) => {
        setError(error.message);
      });
  };

  const onLogout = () => {
    // Limpar os dados de login e desautenticar o usuário
    localStorage.removeItem('loginData');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter basename='/admin'>
      <div className="App">
        {/* Barra de ferramentas e menu */}
        <header className="menu-bar">
          <div className="menu-title">Painel de Controle</div>
          {isAuthenticated && (
            <button className="logout-button" onClick={onLogout}>Logout</button>
          )}
        </header>
        <Routes>
          <Route
            path="/"
            element={
              <Auth isAuthenticated={isAuthenticated} onLogin={onLogin}>
                <div>
                  <header className="App-header">
                    <div>
                      {/* Somente renderizar UrlShortener quando o user estiver definido */}
                      {user && isAuthenticated ? (
                        <UrlShortener user={user} />
                      ) : (
                        <p>Carregando dados do usuário...</p>
                      )}
                    </div>
                    <div>
                      <h1>Painel de Estatísticas de URLs Encurtadas</h1>
                      <UrlList />
                    </div>
                  </header>
                </div>
              </Auth>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
