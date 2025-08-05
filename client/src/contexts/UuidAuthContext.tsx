import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UuidUser {
  id: string;
  email: string;
  name: string;
  company_id?: string;
  branch_id?: string;
  role: string;
  business_category?: string;
}

interface UuidAuthContextType {
  user: UuidUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const UuidAuthContext = createContext<UuidAuthContextType | undefined>(undefined);

export function UuidAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UuidUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há token salvo no localStorage
    const savedToken = localStorage.getItem('uuid_auth_token');
    const savedUser = localStorage.getItem('uuid_auth_user');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
        localStorage.removeItem('uuid_auth_token');
        localStorage.removeItem('uuid_auth_user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/auth/uuid-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Erro no login:', error);
        return false;
      }

      const data = await response.json();
      
      if (data.success && data.user && data.token) {
        setUser(data.user);
        setToken(data.token);
        
        // Salvar no localStorage
        localStorage.setItem('uuid_auth_token', data.token);
        localStorage.setItem('uuid_auth_user', JSON.stringify(data.user));
        
        console.log('Login UUID realizado com sucesso:', data.user);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erro no login UUID:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('uuid_auth_token');
    localStorage.removeItem('uuid_auth_user');
    console.log('Logout realizado');
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
  };

  return (
    <UuidAuthContext.Provider value={value}>
      {children}
    </UuidAuthContext.Provider>
  );
}

export function useUuidAuth() {
  const context = useContext(UuidAuthContext);
  if (context === undefined) {
    throw new Error('useUuidAuth deve ser usado dentro de um UuidAuthProvider');
  }
  return context;
}

// Hook para fazer requisições autenticadas
export function useUuidApiRequest() {
  const { token } = useUuidAuth();
  
  const apiRequest = async (url: string, options: RequestInit = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  return apiRequest;
}