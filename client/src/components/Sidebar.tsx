import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/UserAvatar';
import { useAuth } from '@/contexts/AuthContext';
import ModernIcon from '@/components/ui/modern-icon';
import { 
  BarChart3, 
  Database, 
  Activity, 
  Calendar,
  Package,
  MessageCircle,
  Menu,
  X,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const { user, logout } = useAuth();

  const menuItems = [
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
      description: 'Mensagens e assistente virtual'
    }
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-40 h-full bg-[hsl(var(--dashboard-dark))] border-r border-[hsl(var(--dashboard-darker))] transition-transform duration-300",
        "w-64 shadow-lg",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-[hsl(var(--dashboard-darker))]">
            <div className="mb-4">
              <UserAvatar username={user?.name || 'Usuário'} size="medium" />
            </div>
            <h2 className="text-lg font-bold text-white">Controle de Dados</h2>
            <p className="text-xs text-blue-200 mt-1">Sistema de Gerenciamento</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <li key={item.id}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-left h-auto p-3 text-white transition-all duration-300 min-h-[60px] modern-card-hover",
                        "hover:bg-green-400 hover:text-white modern-shine",
                        isActive && "bg-primary text-primary-foreground modern-glow"
                      )}
                      onClick={() => onSectionChange(item.id)}
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
                          "text-xs mt-1 leading-tight break-words",
                          isActive ? "text-primary-foreground/80" : "text-blue-200"
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

          {/* Footer */}
          <div className="p-4 border-t border-[hsl(var(--dashboard-darker))]">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-blue-200 hover:text-white hover:bg-red-500/20"
              onClick={logout}
            >
              <ModernIcon 
                icon={LogOut}
                variant="default"
                size="sm"
                animated={true}
                className="mr-2 !text-blue-200 hover:!text-white"
              />
              Sair
            </Button>
            <div className="text-xs text-blue-200 text-center mt-2">
              Sistema v1.0
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;