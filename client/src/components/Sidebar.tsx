import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Database, 
  Activity, 
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);

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
        "fixed left-0 top-0 z-40 h-full bg-white border-r border-border/50 transition-transform duration-300",
        "w-64 shadow-lg",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border/50">
            <h2 className="text-xl font-bold text-gray-900">Controle de Dados</h2>
            <p className="text-sm text-gray-600 mt-1">Sistema de Gerenciamento</p>
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
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start text-left h-auto p-3",
                        isActive && "bg-primary text-primary-foreground"
                      )}
                      onClick={() => onSectionChange(item.id)}
                    >
                      <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium">{item.label}</div>
                        <div className={cn(
                          "text-xs mt-0.5",
                          isActive ? "text-primary-foreground/80" : "text-gray-500"
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
          <div className="p-4 border-t border-border/50">
            <div className="text-xs text-gray-500 text-center">
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