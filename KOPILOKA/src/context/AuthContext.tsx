import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: 'buyer' | 'seller') => Promise<boolean>;
  register: (email: string, password: string, name: string, role: 'buyer' | 'seller') => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing
const demoUsers: Record<string, { password: string; user: User }> = {
  'buyer@kopiloka.com': {
    password: 'buyer123',
    user: {
      id: 'buyer-1',
      email: 'buyer@kopiloka.com',
      name: 'Ahmad Buyer',
      role: 'buyer',
      phone: '081234567890',
      address: 'Jl. Kopi No. 1, Jakarta'
    }
  },
  'seller@kopiloka.com': {
    password: 'seller123',
    user: {
      id: 'seller-1',
      email: 'seller@kopiloka.com',
      name: 'Budi Petani Kopi',
      role: 'seller',
      phone: '089876543210',
      address: 'Jl. Perkebunan No. 5, Toraja'
    }
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('kopiloka_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email: string, password: string, role: 'buyer' | 'seller'): Promise<boolean> => {
    // Check demo users
    const demoUser = demoUsers[email];
    if (demoUser && demoUser.password === password && demoUser.user.role === role) {
      setUser(demoUser.user);
      localStorage.setItem('kopiloka_user', JSON.stringify(demoUser.user));
      return true;
    }

    // Check localStorage for registered users
    const registeredUsers = JSON.parse(localStorage.getItem('kopiloka_registered_users') || '[]');
    const foundUser = registeredUsers.find(
      (u: User & { password: string }) => u.email === email && u.password === password && u.role === role
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('kopiloka_user', JSON.stringify(userWithoutPassword));
      return true;
    }

    return false;
  };

  const register = async (email: string, password: string, name: string, role: 'buyer' | 'seller'): Promise<boolean> => {
    const registeredUsers = JSON.parse(localStorage.getItem('kopiloka_registered_users') || '[]');
    
    // Check if email already exists
    if (registeredUsers.some((u: User) => u.email === email) || demoUsers[email]) {
      return false;
    }

    const newUser: User = {
      id: `${role}-${Date.now()}`,
      email,
      name,
      role
    };

    registeredUsers.push({ ...newUser, password });
    localStorage.setItem('kopiloka_registered_users', JSON.stringify(registeredUsers));
    
    setUser(newUser);
    localStorage.setItem('kopiloka_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kopiloka_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
