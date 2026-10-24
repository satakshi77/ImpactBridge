import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ib_token') || null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      if (!localStorage.getItem('ib_token')) {
        setUser(null);
        setOrganization(null);
        setLoading(false);
        return;
      }
      const data = await apiFetch('/auth/me');
      if (data.success) {
        setUser(data.user);
        setOrganization(data.organization);
      }
    } catch (err) {
      console.error('Failed to restore session:', err.message);
      localStorage.removeItem('ib_token');
      setUser(null);
      setOrganization(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.success) {
      localStorage.setItem('ib_token', data.token);
      setToken(data.token);
      setUser(data.user);
      setOrganization(data.organization);
      return data;
    }
    throw new Error(data.message || 'Login failed');
  };

  const register = async (formData) => {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    if (data.success) {
      localStorage.setItem('ib_token', data.token);
      setToken(data.token);
      setUser(data.user);
      setOrganization(data.organization);
      return data;
    }
    throw new Error(data.message || 'Registration failed');
  };

  const demoSwitch = async (role) => {
    setLoading(true);
    try {
      const data = await apiFetch('/auth/demo-switch', {
        method: 'POST',
        body: JSON.stringify({ role }),
      });
      if (data.success) {
        localStorage.setItem('ib_token', data.token);
        setToken(data.token);
        setUser(data.user);
        setOrganization(data.organization);
        return data;
      }
    } catch (err) {
      console.error('Demo switch error:', err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('ib_token');
    setToken(null);
    setUser(null);
    setOrganization(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        token,
        loading,
        login,
        register,
        demoSwitch,
        logout,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
