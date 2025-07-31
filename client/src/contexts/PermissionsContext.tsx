import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface SectionPermission {
  id: string;
  label: string;
  description: string;
  icon: string;
  defaultEnabled: boolean;
}

export const availableSections: SectionPermission[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Visão geral e métricas',
    icon: 'Database',
    defaultEnabled: true
  },
  {
    id: 'graficos',
    label: 'Gráficos',
    description: 'Análises e relatórios',
    icon: 'BarChart3',
    defaultEnabled: true
  },
  {
    id: 'atividade',
    label: 'Atividade',
    description: 'Log de atividades',
    icon: 'Activity',
    defaultEnabled: true
  },
  {
    id: 'agendamentos',
    label: 'Agendamentos',
    description: 'Agenda e compromissos',
    icon: 'Calendar',
    defaultEnabled: true
  },
  {
    id: 'estoque',
    label: 'Estoque',
    description: 'Produtos e vendas',
    icon: 'Package',
    defaultEnabled: true
  },
  {
    id: 'atendimento',
    label: 'Atendimento',
    description: 'Chat e assistente',
    icon: 'MessageCircle',
    defaultEnabled: true
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    description: 'Entradas e saídas financeiras',
    icon: 'CreditCard',
    defaultEnabled: true
  },
  {
    id: 'controle',
    label: 'Controle',
    description: 'Gestão de usuários e permissões',
    icon: 'Settings',
    defaultEnabled: false
  }
];

interface PermissionsContextType {
  userPermissions: string[];
  isMasterUser: boolean;
  isCeoUser: boolean;
  isGestaoUser: boolean;
  canAccessSection: (sectionId: string) => boolean;
  updateUserPermissions: (userId: number, permissions: string[]) => void;
  getAllUserPermissions: () => Record<number, string[]>;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [allUserPermissions, setAllUserPermissions] = useState<Record<number, string[]>>({});

  // Verifica se é usuário master ou CEO
  const isMasterUser = (user as any)?.role === 'master';
  const isCeoUser = (user as any)?.email === 'ceo@sistema.com'; // CEO específico
  const isGestaoUser = isCeoUser; // CEO tem acesso universal (gestão)

  // Carrega permissões do localStorage
  useEffect(() => {
    if (user) {
      const savedPermissions = localStorage.getItem(`permissions_${(user as any).id}`);
      const savedAllPermissions = localStorage.getItem('all_user_permissions');
      
      if (isMasterUser || isCeoUser) {
        // Master e CEO têm acesso a tudo, incluindo controle
        setUserPermissions([...availableSections.map(s => s.id), 'controle']);
      } else if (savedPermissions) {
        setUserPermissions(JSON.parse(savedPermissions));
      } else {
        // Usuário regular: usar permissões padrão ou definidas pelo master
        const defaultPermissions = (user as any).allowedSections || availableSections
          .filter(s => s.defaultEnabled)
          .map(s => s.id);
        setUserPermissions(defaultPermissions);
      }

      if (savedAllPermissions) {
        setAllUserPermissions(JSON.parse(savedAllPermissions));
      }
    }
  }, [user, isMasterUser]);

  const canAccessSection = (sectionId: string): boolean => {
    return userPermissions.includes(sectionId);
  };

  const updateUserPermissions = (userId: number, permissions: string[]) => {
    if (!isMasterUser && !isCeoUser) return;

    const newAllPermissions = {
      ...allUserPermissions,
      [userId]: permissions
    };

    setAllUserPermissions(newAllPermissions);
    localStorage.setItem('all_user_permissions', JSON.stringify(newAllPermissions));
    localStorage.setItem(`permissions_${userId}`, JSON.stringify(permissions));

    // Se estiver editando suas próprias permissões (improvável para master)
    if (user && (user as any).id === userId) {
      setUserPermissions(permissions);
    }
  };

  const getAllUserPermissions = (): Record<number, string[]> => {
    return allUserPermissions;
  };

  return (
    <PermissionsContext.Provider
      value={{
        userPermissions,
        isMasterUser,
        isCeoUser,
        isGestaoUser,
        canAccessSection,
        updateUserPermissions,
        getAllUserPermissions
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};