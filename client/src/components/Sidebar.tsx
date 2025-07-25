
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
  ChevronRight
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
    }
  ];

  // Filtra itens baseado em permissões e categoria
  const menuItems = allMenuItems.filter(item => {
    // Controle só para usuários master
    if (item.id === 'controle') {
      return isMasterUser;
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
        "fixed left-0 top-0 z-40 h-full bg-[hsl(var(--dashboard-dark))] border-r border-[hsl(var(--dashboard-darker))] transition-all duration-300 shadow-xl",
        isCollapsed ? "w-16" : "w-64",
        "translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={cn(
            "p-4 md:p-6 border-b border-[hsl(var(--dashboard-darker))]",
            isCollapsed && "p-2 md:p-3"
          )}>
            {!isCollapsed && (
              <>
                <div className="mb-4">
                  <UserAvatar username={user?.name || 'Usuário'} size="medium" />
                </div>
                <h2 className="text-lg font-bold text-white">Controle de Dados</h2>
                <p className="text-xs text-blue-200 mt-1">Sistema de Gerenciamento</p>
              </>
            )}
            {isCollapsed && (
              <div className="flex justify-center">
                <UserAvatar username={user?.name || 'Usuário'} size="small" />
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className={cn(
            "flex-1 p-3 md:p-4 overflow-y-auto custom-scroll",
            isCollapsed && "p-1 md:p-2"
          )}>
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
                        "w-full text-white transition-all duration-300 modern-card-hover hover:text-white modern-shine",
                        isCollapsed ? "justify-center p-2 h-12" : "justify-start text-left h-auto p-3 min-h-[50px] md:min-h-[60px]",
                        isActive && "bg-primary text-primary-foreground modern-glow"
                      )}
                      style={{
                        '--hover-bg': 'hsl(158 89% 53%)'
                      } as React.CSSProperties}
                      onClick={() => handleMenuClick(item.id)}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <ModernIcon 
                        icon={Icon}
                        variant="default"
                        size="md"
                        animated={true}
                        className={cn(
                          "flex-shrink-0 !text-white",
                          isCollapsed ? "" : "mr-3"
                        )}
                      />
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm leading-tight">{item.label}</div>
                          <div className={cn(
                            "text-xs mt-1 leading-tight break-words hidden md:block",
                            isActive ? "text-blue-100" : "text-blue-200"
                          )}>
                            {item.description}
                          </div>
                        </div>
                      )}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer - Logout */}
          <div className={cn(
            "p-3 md:p-4 border-t border-[hsl(var(--dashboard-darker))]",
            isCollapsed && "p-1 md:p-2"
          )}>
            <Button
              variant="ghost"
              onClick={logout}
              className={cn(
                "w-full text-white hover:text-white hover:bg-red-600/20 transition-all duration-300",
                isCollapsed ? "justify-center p-2 h-12" : "justify-start p-3"
              )}
              title={isCollapsed ? "Sair do Sistema" : undefined}
            >
              <ModernIcon 
                icon={LogOut}
                variant="danger"
                size="md"
                animated={true}
                className={cn(
                  "flex-shrink-0 !text-red-400",
                  isCollapsed ? "" : "mr-3"
                )}
              />
              {!isCollapsed && (
                <span className="font-medium text-sm">Sair do Sistema</span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <div className={cn(
        "fixed top-1/2 -translate-y-1/2 z-50 transition-all duration-300",
        isCollapsed ? "left-16" : "left-64"
      )}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggle}
          className="h-12 w-6 p-0 bg-[hsl(var(--dashboard-dark))] border border-[hsl(var(--dashboard-darker))] hover:bg-[hsl(var(--dashboard-darker))] text-white shadow-lg rounded-r-md rounded-l-none"
        >
          <ModernIcon 
            icon={isCollapsed ? ChevronRight : ChevronLeft}
            variant="default"
            size="sm"
            animated={true}
            className="!text-white"
          />
        </Button>
      </div>
    </>
  );
};

export default Sidebar;