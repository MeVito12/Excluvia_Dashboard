
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/UserAvatar';
import { useAuth } from '@/contexts/AuthContext';
import { useCategory } from '@/contexts/CategoryContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import ModernIcon from '@/components/ui/modern-icon';
import { 
  BarChart3, 
  Database, 
  Activity, 
  Calendar,
  Package,
  MessageCircle,
  Settings,
  LogOut,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Building2,
  UserPlus
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
}

const Sidebar = ({ activeSection, onSectionChange, isCollapsed: externalCollapsed, onToggleCollapse }: SidebarProps) => {
  const { user, logout } = useAuth();
  const { selectedCategory } = useCategory();
  const { canAccessSection, isMasterUser } = usePermissions();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  
  const handleToggle = () => {
    const newCollapsed = !isCollapsed;
    if (onToggleCollapse) {
      onToggleCollapse(newCollapsed);
    } else {
      setInternalCollapsed(newCollapsed);
    }
  };

  const allMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Database,
      description: 'Visão geral do sistema'
    },
    {
      id: 'graficos',
      label: 'Gráficos',
      icon: BarChart3,
      description: 'Análises e relatórios'
    },
    {
      id: 'atividade',
      label: 'Atividade',
      icon: Activity,
      description: 'Log de atividades'
    },
    {
      id: 'agendamentos',
      label: 'Agendamentos',
      icon: Calendar,
      description: 'Agendamentos e lembretes'
    },
    {
      id: 'estoque',
      label: 'Estoque',
      icon: Package,
      description: 'Estoque, vendas e clientes'
    },
    {
      id: 'atendimento',
      label: 'Atendimento',
      icon: MessageCircle,
      description: 'Mensagens e assistente'
    },
    {
      id: 'financeiro',
      label: 'Financeiro',
      icon: CreditCard,
      description: 'Entradas e saídas financeiras'
    },
    {
      id: 'controle',
      label: 'Controle',
      icon: Settings,
      description: 'Configuração de permissões'
    },
    {
      id: 'cadastro',
      label: 'Cadastro',
      icon: UserPlus,
      description: 'Cadastro de empresas e usuários'
    }
  ];

  // Filtra itens baseado em permissões e categoria
  const menuItems = allMenuItems.filter(item => {
    // Controle só para usuários master
    if (item.id === 'controle') {
      return isMasterUser;
    }

    // Cadastro só para CEO
    if (item.id === 'cadastro') {
      return (user as any)?.role === 'ceo';
    }
    
    // Estoque não aparece para design e sites
    if (item.id === 'estoque' && (selectedCategory === 'design' || selectedCategory === 'sites')) {
      return false;
    }
    
    // Verifica permissões do usuário
    return canAccessSection(item.id);
  });

  const handleMenuClick = (itemId: string) => {
    onSectionChange(itemId);
  };

  return (
    <>
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-40 h-full bg-[hsl(220_100%_12%)] border-r border-[hsl(220_100%_8%)] transition-all duration-300 shadow-xl",
        "w-64",
        isCollapsed ? "-translate-x-full" : "translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-[hsl(220_100%_8%)]">
            <div className="mb-4">
              <UserAvatar username={user?.name || 'Usuário'} size="medium" />
            </div>
            <h2 className="text-lg font-bold text-white">Controle de Dados</h2>
            <p className="text-xs text-blue-200 mt-1">Sistema de Gerenciamento</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 md:p-4 overflow-y-auto custom-scroll">
            <ul className="space-y-2">
              {menuItems
                .filter(item => {
                  // Remover estoque das categorias design e sites
                  if (item.id === 'estoque' && (selectedCategory === 'design' || selectedCategory === 'sites')) {
                    return false;
                  }
                  return true;
                })
                .map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <li key={item.id}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-left h-auto p-3 text-white transition-all duration-300 min-h-[50px] md:min-h-[60px]",
                        "hover:text-white",
                        isActive && "bg-primary text-primary-foreground"
                      )}
                      style={{
                        background: isActive ? 'hsl(var(--brand-primary))' : 'transparent',
                        border: 'none',
                        boxShadow: 'none',
                        outline: 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'hsl(var(--brand-secondary))';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                      onClick={() => handleMenuClick(item.id)}
                    >
                      <ModernIcon 
                        icon={Icon}
                        variant="default"
                        size="md"
                        animated={true}
                        className="mr-3 flex-shrink-0 !text-white"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm leading-tight">{item.label}</div>
                        <div className={cn(
                          "text-xs mt-1 leading-tight break-words hidden md:block",
                          isActive ? "text-blue-100" : "text-blue-200"
                        )}>
                          {item.description}
                        </div>
                      </div>
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer - Logout */}
          <div className="p-3 md:p-4 border-t border-[hsl(220_100%_8%)]">
            <button
              onClick={logout}
              className="w-full justify-start text-red-400 hover:text-red-600 transition-all duration-300 p-3 flex items-center border border-white/20 rounded-md hover:border-white/30"
              style={{
                background: 'transparent',
                boxShadow: 'none',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <ModernIcon 
                icon={LogOut}
                variant="danger"
                size="md"
                animated={true}
                className="mr-3 flex-shrink-0 !text-red-400"
              />
              <span className="font-medium text-sm">Sair do Sistema</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <div className={cn(
        "fixed top-1/2 -translate-y-1/2 z-50 transition-all duration-300",
        isCollapsed ? "left-0" : "left-64"
      )}>
        <button
          onClick={handleToggle}
          className="h-20 w-8 p-0 text-white hover:text-white rounded-r-lg rounded-l-none transition-all duration-300 flex items-center justify-center border border-white/10 hover:border-white/20"
          style={{
            background: 'hsl(220, 100%, 12%)',
            boxShadow: '2px 0 10px rgba(0, 0, 0, 0.3)',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <ModernIcon 
            icon={isCollapsed ? ChevronRight : ChevronLeft}
            variant="default"
            size="md"
            animated={true}
            className="!text-white"
          />
        </button>
      </div>
    </>
  );
};

export default Sidebar;