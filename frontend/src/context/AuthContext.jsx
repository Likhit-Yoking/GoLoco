import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

/**
 * AuthProvider wraps the application and supplies the global authentication state.
 * It manages:
 * - Current user details (name, email, role)
 * - JWT token string
 * - Initializing authentication state on app load (avoiding flash redirects)
 * - Login, register, and logout handlers
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize authentication state synchronously from localStorage on application mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        if (authService.isAuthenticated()) {
          const storedUser = authService.getUser();
          const storedToken = localStorage.getItem('token');
          setUser(storedUser);
          setToken(storedToken);
        } else {
          // If the token is expired or corrupt, clear it from localStorage
          authService.logout();
        }
      } catch (err) {
        console.error('Error restoring authentication session:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Listen for global 401 Unauthorized events from apiClient
  useEffect(() => {
    const handleUnauthorized = () => {
      authService.logout();
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  /**
   * Log in user and update auth state
   * @param {string} email 
   * @param {string} password 
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      setUser({
        name: data.name,
        email: data.email,
        role: data.role
      });
      setToken(data.token);
      return data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register user and update auth state (automatically logs in after sign up)
   * @param {Object} userData - { name, email, password, role }
   */
  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await authService.register(userData);
      setUser({
        name: data.name,
        email: data.email,
        role: data.role
      });
      setToken(data.token);
      return data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Log out the current user and clear states
   */
  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    role: user?.role || null
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

