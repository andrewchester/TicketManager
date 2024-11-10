import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'

import { AuthProvider } from './contexts/AuthContext';
import Home from './components/Home';
import Login from './components/Login';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;