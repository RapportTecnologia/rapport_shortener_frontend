// components/Auth.tsx
import React from 'react';
//import { Redirect } from 'react-router-dom';
import Login from './Login';

interface AuthProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  onLogin: (username: string, password: string) => void;
}

const Auth: React.FC<AuthProps> = ({ children, isAuthenticated, onLogin }) => {
  if (!isAuthenticated) {
    console.log('Login required');
    return <Login onLogin={onLogin} />;
  }
  console.log('Logado');
  return <div>{children}</div>;
};

export default Auth;