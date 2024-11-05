/*
    Context provides auth variables and functions for updated auth 
*/

import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    authenticated: !!localStorage.getItem('token'), 
    token: localStorage.getItem('token'),
  });

  const login = (token) => {
    localStorage.setItem('token', token);
    setAuth({
      authenticated: true,
      token,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({
      authenticated: false,
      token: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};