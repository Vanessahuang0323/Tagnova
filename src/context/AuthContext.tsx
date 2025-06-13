import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudentProfile, CompanyProfile, UserType } from '../types/user';

interface AuthContextType {
  user: StudentProfile | CompanyProfile | null;
  userType: UserType | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, type: UserType) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<StudentProfile | CompanyProfile>, type: UserType) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<StudentProfile | CompanyProfile | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored auth data on mount
    const storedUser = localStorage.getItem('user');
    const storedUserType = localStorage.getItem('userType');
    
    if (storedUser && storedUserType) {
      setUser(JSON.parse(storedUser));
      setUserType(storedUserType as UserType);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string, type: UserType) => {
    try {
      // TODO: Implement actual API call
      const response = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, type }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const userData = await response.json();
      setUser(userData);
      setUserType(type);
      setIsAuthenticated(true);

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userType', type);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  };

  const register = async (userData: Partial<StudentProfile | CompanyProfile>, type: UserType) => {
    try {
      // TODO: Implement actual API call
      const response = await fetch(`/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, type }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const newUser = await response.json();
      setUser(newUser);
      setUserType(type);
      setIsAuthenticated(true);

      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('userType', type);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, userType, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 