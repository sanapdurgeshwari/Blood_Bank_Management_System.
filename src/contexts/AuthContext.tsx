import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// User types
export type UserRole = 'admin' | 'donor' | 'patient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bloodGroup?: string;
  disease?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// API base URL - Using Vite's environment variables format
const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000/api';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for token and load user
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('bloodConnectToken');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        // Set token in headers
        axios.defaults.headers.common['x-auth-token'] = token;
        
        // Get user from API
        const res = await axios.get(`${API_URL}/users/me`);
        
        setUser({
          id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
          bloodGroup: res.data.bloodGroup,
          disease: res.data.disease
        });
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem('bloodConnectToken');
        delete axios.defaults.headers.common['x-auth-token'];
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
        role
      });
      
      const { token, user: userData } = res.data;
      
      // Set token to localStorage
      localStorage.setItem('bloodConnectToken', token);
      
      // Set token in headers
      axios.defaults.headers.common['x-auth-token'] = token;
      
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Partial<User>, password: string) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/users/register`, {
        name: userData.name,
        email: userData.email,
        password,
        role: userData.role,
        bloodGroup: userData.bloodGroup,
        disease: userData.disease
      });
      
      const { token, user: newUser } = res.data;
      
      // Set token to localStorage
      localStorage.setItem('bloodConnectToken', token);
      
      // Set token in headers
      axios.defaults.headers.common['x-auth-token'] = token;
      
      setUser(newUser);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('bloodConnectToken');
    
    // Remove token from headers
    delete axios.defaults.headers.common['x-auth-token'];
    
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        register, 
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
