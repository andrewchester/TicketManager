/*
    Context provides auth variables and functions for updated auth 
*/

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState(null);
    const [auth, setAuth] = useState({
        authenticated: false, 
        token: localStorage.getItem('token') || null,
    });

    useEffect(() => {
        if (auth.token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`;
          axios.defaults.headers.common['user'] = username;
        } else {
          delete axios.defaults.headers.common['Authorization'];
        }
    }, [auth.token]);

    const login = (token, user) => {
        localStorage.setItem('token', token);
        setAuth({
          authenticated: true,
          token,
        });
        setUsername(user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuth({
          authenticated: false,
          token: null,
        });
        setUsername(null);
    };

    return (
        <AuthContext.Provider value={{ auth, username, login, logout }}>
          {children}
        </AuthContext.Provider>
    );
  };

export const useAuth = () => {
  return useContext(AuthContext);
};