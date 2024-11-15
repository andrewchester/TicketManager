/*
    Context provides auth variables and functions for updated auth 
*/

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState(null);
    const [level, setUserLevel] = useState(1);
    const [auth, setAuth] = useState({
        authenticated: false, 
        token: localStorage.getItem('token') || null,
    });

    const login = (token, user) => {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setAuth({
          authenticated: true,
          token: token,
        });
        
        setUsername(user.username);
        setUserLevel(user.level);
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];

        setAuth({
          authenticated: false,
          token: null,
        });
        
        setUsername(null);
        setUserLevel(1);
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