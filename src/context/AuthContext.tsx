
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  const login = async (username: string, password: string) => {
    // In a real app, this would call an API endpoint
    // For demonstration, we'll simulate a successful login
    
    // Mock user data
    const mockUser: User = {
      id: 1,
      username,
      companyName: username === 'admin' ? 'System Admin' : 'Demo Company',
      email: `${username}@example.com`,
      role: username === 'admin' ? 'admin' : 'company',
    };
    
    setUser(mockUser);
  };
  
  const logout = () => {
    setUser(null);
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
