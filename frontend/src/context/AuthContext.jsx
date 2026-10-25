import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load profile on start if token exists
  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('hos_token');
      if (token) {
        try {
          const profile = await api.get('/auth/profile');
          setUser(profile);
        } catch (error) {
          console.error('Failed to load profile on mount:', error);
          localStorage.removeItem('hos_token');
          setUser(null);
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.post('/auth/login', { email, password });
      localStorage.setItem('hos_token', data.token);
      setUser(data);
      return data;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('hos_token', data.token);
      setUser(data);
      return data;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('hos_token');
    setUser(null);
  };

  const updateProfileAddresses = async (addresses) => {
    try {
      const response = await api.put('/auth/addresses', { addresses });
      setUser(prev => prev ? { ...prev, addresses: response.addresses } : null);
      return response.addresses;
    } catch (error) {
      console.error('Failed updating profile addresses:', error);
      throw error;
    }
  };

  const updateProfileSizes = async (savedSizes) => {
    try {
      const response = await api.put('/auth/sizes', { savedSizes });
      setUser(prev => prev ? { ...prev, savedSizes: response.savedSizes } : null);
      return response.savedSizes;
    } catch (error) {
      console.error('Failed updating sizes:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfileAddresses, updateProfileSizes }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
