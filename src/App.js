import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import Home from './components/Home';
import Login from './components/Login';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/tickets" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;