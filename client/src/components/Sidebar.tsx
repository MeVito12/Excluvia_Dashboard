import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/UserAvatar';
import { useAuth } from '@/contexts/AuthContext';
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
        "fixed left-0 top-0 z-40 h-full bg-gradient-to-b from-purple-600 via-blue-700 to-purple-800 border-r border-purple-500/30 transition-transform duration-300",
        "w-64 shadow-2xl backdrop-blur-xl",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-purple-400/30 bg-gradient-to-r from-purple-500/20 to-blue-500/20">
            <div className="mb-4">
              <UserAvatar username={user?.name || 'Usuário'} size="medium" />
            </div>
            <h2 className="text-xl font-bold text-white bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
              Sistema Inteligente
            </h2>
            <p className="text-xs text-purple-200 mt-1 font-medium">Automação Avançada com IA</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <li key={item.id}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-left h-auto p-4 text-white transition-all duration-300 min-h-[70px] rounded-xl",
                        "hover:bg-gradient-to-r hover:from-green-400/20 hover:via-teal-400/20 hover:to-green-400/20 hover:scale-105 hover:shadow-lg",
                        "border border-transparent hover:border-green-400/50",
                        isActive && "bg-gradient-to-r from-purple-500/40 via-blue-500/40 to-purple-500/40 border-purple-300/50 shadow-lg scale-105"
                      )}
                      onClick={() => onSectionChange(item.id)}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center mr-3 flex-shrink-0 transition-all duration-300",
                        isActive 
                          ? "bg-gradient-to-br from-green-400 to-teal-500 shadow-lg" 
                          : "bg-gradient-to-br from-purple-400/50 to-blue-400/50"
                      )}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-base leading-tight text-white">{item.label}</div>
                        <div className={cn(
                          "text-xs mt-1 leading-tight break-words font-medium",
                          isActive ? "text-green-200" : "text-purple-200"
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
          <div className="p-4 border-t border-purple-400/30 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-purple-200 hover:text-white hover:bg-gradient-to-r hover:from-red-500/30 hover:to-pink-500/30 rounded-xl border border-transparent hover:border-red-400/50 transition-all duration-300"
              onClick={logout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
            <div className="text-xs text-purple-200 text-center mt-2 font-medium">
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