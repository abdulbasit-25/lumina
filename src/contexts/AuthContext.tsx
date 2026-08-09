import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  justLoggedIn: boolean;
  clearJustLoggedIn: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

async function safeJsonParse(response: Response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    // Server returned non-JSON (e.g. HTML 404/500 page)
    throw new Error(
      response.ok
        ? 'Unexpected server response'
        : `Server error ${response.status}: ${text.slice(0, 120)}`
    );
  }
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [justLoggedIn, setJustLoggedIn] = useState(false);

 useEffect(() => {
  const token = localStorage.getItem('authToken');
  const storedUser = localStorage.getItem('user');

  if (token && storedUser) {
    try {
      setUser(JSON.parse(storedUser));
    } catch (err) {
      console.error("Failed to parse user:", err);
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
    }
  }

  setIsLoading(false);
}, []);

  const login = async (email: string, password: string): Promise<void> => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await safeJsonParse(response);

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Login failed');
    }

    localStorage.setItem('authToken', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    setUser(data.data.user);
    setJustLoggedIn(true);
  };

  const register = async (email: string, password: string, name: string): Promise<void> => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await safeJsonParse(response);

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Registration failed');
    }

    localStorage.setItem('authToken', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    setUser(data.data.user);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setJustLoggedIn(false);
  };

  const clearJustLoggedIn = () => {
    setJustLoggedIn(false);
  };

 const value: AuthContextType = {
  user,
  login,
  register,
  logout,
  isLoading,
  justLoggedIn,
  clearJustLoggedIn,
};
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};