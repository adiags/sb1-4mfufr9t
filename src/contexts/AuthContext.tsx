import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for authenticated user on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const register = async (email: string, username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      // Simulate API call for registration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if email already exists (demo only)
      const existingUsers = localStorage.getItem('users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      if (users.some((u: User) => u.email === email)) {
        return false;
      }
      
      // Create new user
      const newUser = {
        id: Math.random().toString(36).substring(2, 9),
        username,
        email
      };
      
      // Save user to local storage (demo only)
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Auto login after registration
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Demo users - in a real app this would be validated against a backend
      if (email === 'demo@example.com' && password === 'password') {
        const newUser = {
          id: '1',
          username: 'demouser',
          email: 'demo@example.com'
        };
        
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        return true;
      }
      
      // Check registered users
      const existingUsers = localStorage.getItem('users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      const foundUser = users.find((u: User) => u.email === email);
      
      if (foundUser && password.length >= 6) {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};