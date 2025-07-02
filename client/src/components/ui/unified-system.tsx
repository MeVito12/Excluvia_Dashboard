import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Sistema de Design Unificado - Cores Fixas por Funcionalidade
export const DESIGN_SYSTEM = {
  colors: {
    // Cores fixas por categoria funcional
    financial: 'bg-emerald-500',      // Verde para vendas, dinheiro
    time: 'bg-blue-500',              // Azul para agenda, tempo
    communication: 'bg-purple-500',   // Roxo para chat, mensagens
    inventory: 'bg-orange-500',       // Laranja para estoque, produtos
    reports: 'bg-indigo-500',         // Índigo para relatórios, gráficos
    settings: 'bg-gray-500',          // Cinza para configurações
    alerts: 'bg-red-500',             // Vermelho para alertas
    users: 'bg-cyan-500',             // Ciano para usuários, clientes
    general: 'bg-slate-500',          // Padrão para outros
  },
  
  // Mapeamento de ícones específicos para cores
  iconMap: {
    // Financeiro
    'DollarSign': 'financial',
    'CreditCard': 'financial', 
    'TrendingUp': 'financial',
    'Banknote': 'financial',
    'Coins': 'financial',
    
    // Tempo
    'Calendar': 'time',
    'Clock': 'time',
    'CalendarDays': 'time',
    'Timer': 'time',
    
    // Comunicação
    'MessageCircle': 'communication',
    'Phone': 'communication',
    'Mail': 'communication',
    'Send': 'communication',
    'Bot': 'communication',
    
    // Inventário
    'Package': 'inventory',
    'ShoppingCart': 'inventory',
    'Warehouse': 'inventory',
    'Boxes': 'inventory',
    'Package2': 'inventory',
    
    // Relatórios
    'BarChart3': 'reports',
    'PieChart': 'reports',
    'TrendingDown': 'reports',
    'FileText': 'reports',
    'ChartBar': 'reports',
    
    // Configurações
    'Settings': 'settings',
    'Cog': 'settings',
    'Wrench': 'settings',
    'Tool': 'settings',
    
    // Alertas
    'AlertTriangle': 'alerts',
    'AlertCircle': 'alerts',
    'Bell': 'alerts',
    'Zap': 'alerts',
    
    // Usuários
    'Users': 'users',
    'User': 'users',
    'UserPlus': 'users',
    'Contact': 'users',
  }
};

// Componente de Ícone Unificado
interface UnifiedIconProps {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  forceColor?: keyof typeof DESIGN_SYSTEM.colors;
}

export function UnifiedIcon({ 
  icon: Icon, 
  size = 'md',
  className,
  forceColor
}: UnifiedIconProps) {
  const iconName = Icon.displayName || Icon.name || 'general';
  const mappedColor = DESIGN_SYSTEM.iconMap[iconName as keyof typeof DESIGN_SYSTEM.iconMap];
  const colorType = forceColor || mappedColor || 'general';
  const bgColor = DESIGN_SYSTEM.colors[colorType as keyof typeof DESIGN_SYSTEM.colors] || DESIGN_SYSTEM.colors.general;
  
  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-2.5'
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5', 
    lg: 'w-6 h-6'
  };
  
  return (
    <div className={cn(
      'flex items-center justify-center rounded-lg shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105',
      sizeClasses[size],
      bgColor,
      className
    )}>
      <Icon className={cn(iconSizes[size], 'text-white')} />
    </div>
  );
}

// Componente de Tab Unificado
interface UnifiedTabsProps {
  tabs: Array<{
    id: string;
    label: string;
    icon: LucideIcon;
    colorType?: keyof typeof DESIGN_SYSTEM.colors;
  }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function UnifiedTabs({ tabs, activeTab, onTabChange, className }: UnifiedTabsProps) {
  return (
    <div className={cn(
      'flex gap-2 p-2 bg-white rounded-lg border border-gray-200 overflow-x-auto scrollbar-hide',
      className
    )}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const iconName = tab.icon.displayName || tab.icon.name || 'general';
        const mappedColor = DESIGN_SYSTEM.iconMap[iconName as keyof typeof DESIGN_SYSTEM.iconMap];
        const finalColorType = tab.colorType || mappedColor || 'general';
        const bgColor = DESIGN_SYSTEM.colors[finalColorType as keyof typeof DESIGN_SYSTEM.colors] || DESIGN_SYSTEM.colors.general;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap',
              'hover:shadow-sm hover:scale-105',
              isActive 
                ? `${bgColor} text-white shadow-md` 
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            )}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Componente de Card Unificado
interface UnifiedCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'elevated';
}

export function UnifiedCard({ 
  children, 
  className, 
  padding = 'md',
  variant = 'default'
}: UnifiedCardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const variantClasses = {
    default: 'bg-white border border-gray-200',
    glass: 'bg-white/80 backdrop-blur-sm border border-white/20',
    elevated: 'bg-white shadow-lg border-0'
  };
  
  return (
    <div className={cn(
      'rounded-lg transition-all duration-200',
      paddingClasses[padding],
      variantClasses[variant],
      className
    )}>
      {children}
    </div>
  );
}

// Componente de Métrica Unificado
interface UnifiedMetricProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  colorType?: keyof typeof DESIGN_SYSTEM.colors;
}

export function UnifiedMetric({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue,
  colorType
}: UnifiedMetricProps) {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600', 
    neutral: 'text-gray-600'
  };
  
  return (
    <UnifiedCard variant="elevated" className="hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && trendValue && (
            <p className={cn('text-xs mt-1', trendColors[trend])}>
              {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {trendValue}
            </p>
          )}
        </div>
        <UnifiedIcon icon={icon} size="lg" forceColor={colorType} />
      </div>
    </UnifiedCard>
  );
}

// CSS personalizado para scrollbar invisível
export const scrollbarHideCSS = `
  .scrollbar-hide {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;