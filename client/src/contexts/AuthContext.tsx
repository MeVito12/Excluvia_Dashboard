import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: { name: string; businessCategory: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Quando o usuário confirma email ou faz login, criar/atualizar registro na tabela users
        if (event === 'SIGNED_IN' && session?.user) {
          await ensureUserRecord(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Garantir que o usuário existe na tabela users
  const ensureUserRecord = async (authUser: User) => {
    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', authUser.email)
        .single();

      if (!existingUser) {
        // Criar registro na tabela users
        const userData = authUser.user_metadata;
        await supabase.from('users').insert({
          email: authUser.email!,
          password: '', // Não armazenamos senha pois usa Supabase Auth
          name: userData.name || authUser.email!.split('@')[0],
          business_category: userData.businessCategory || 'farmacia',
          user_type: 'regular',
          allowed_sections: null
        });
      }
    } catch (error) {
      console.error('Erro ao criar registro do usuário:', error);
    }
  };

  const signUp = async (email: string, password: string, userData: { name: string; businessCategory: string }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData // Metadados que serão salvos
      }
    });

    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}