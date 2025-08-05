import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string; // UUID
  name: string;
  email: string;
  role: string;
  businessCategory: string;
  companyId?: string; // UUID
  company?: any;
  permissions?: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Recuperar usuário do localStorage na inicialização
    try {
      const savedUser = localStorage.getItem('currentUser');
      console.log('[AUTH-CONTEXT] 🔄 Initializing with localStorage:', savedUser);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('[AUTH-CONTEXT] ❌ Error parsing localStorage:', error);
      return null;
    }
  });

  const login = (userData: User) => {
    console.log('[AUTH-CONTEXT] 🔐 Login called with:', userData);
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    console.log('[AUTH-CONTEXT] ✅ User set and saved to localStorage');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userBusinessCategory');
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!user,
      user,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}