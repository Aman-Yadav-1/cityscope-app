'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import * as jwtDecode from 'jwt-decode';

interface User {
  _id: string;
  username: string;
  email: string;
  profileImage?: string;
  bio?: string;
  location?: {
    type: string;
    coordinates: number[];
    name: string;
  };
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUser: () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize axios defaults
  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:5000/api';
  }, []);

  // Load user from localStorage on initial load
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        
        if (storedToken) {
          setToken(storedToken);
          setAuthToken(storedToken);
          
          try {
            // Decode token to get user ID
            const decoded: any = jwtDecode.jwtDecode(storedToken);
            
            // Check if token is expired
            if (decoded.exp * 1000 < Date.now()) {
              localStorage.removeItem('token');
              setToken(null);
              setUser(null);
              setIsAuthenticated(false);
              setLoading(false);
              return;
            }
            
            // Get user data
            const res = await axios.get<User>('/auth/me');
            setUser(res.data as User);
            setIsAuthenticated(true);
          } catch (error) {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  // Set auth token in axios headers
  const setAuthToken = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  };

  // Login user
  const login = async (email: string, password: string) => {
    try {
      interface LoginResponse {
        token: string;
      }
      
      const res = await axios.post<LoginResponse>('/auth/login', { email, password });
      
      // Save token to localStorage and state
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setAuthToken(res.data.token);
      
      // Get user data
      const userRes = await axios.get<User>('/auth/me');
      setUser(userRes.data as User);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  // Register user
  const register = async (username: string, email: string, password: string) => {
    try {
      interface RegisterResponse {
        token: string;
      }
      
      const res = await axios.post<RegisterResponse>('/auth/register', { username, email, password });
      
      // Save token to localStorage and state
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setAuthToken(res.data.token);
      
      // Get user data
      const userRes = await axios.get<User>('/auth/me');
      setUser(userRes.data as User);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user data
  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
