import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModernIconProps {
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'category' | 'purple' | 'blue' | 'green' | 'creative';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  background?: boolean;
  rounded?: boolean;
  animated?: boolean;
  gradient?: boolean;
  glow?: boolean;
  category?: 'pet' | 'saude' | 'vendas' | 'design' | 'sites';
  contextual?: boolean;
  className?: string;
}

const ModernIcon: React.FC<ModernIconProps> = ({ 
  icon: Icon, 
  variant = 'default', 
  size = 'md', 
  background = false,
  rounded = false,
  animated = true,
  gradient = false,
  glow = false,
  category,
  contextual = false,
  className
}) => {
  const variants = {
    default: 'text-gray-600',
    primary: 'text-primary',
    accent: 'text-accent',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    category: category ? getCategoryColor(category) : 'text-gray-600',
    purple: 'text-[#9333ea]',
    blue: 'text-[#1e3a8a]',
    green: 'text-[#00ff88]',
    creative: 'text-white'
  };

  const sizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
    '2xl': 'h-10 w-10'
  };

  const backgroundSizes = {
    xs: 'p-1',
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
    xl: 'p-3',
    '2xl': 'p-4'
  };

  function getCategoryColor(cat: string): string {
    const categoryColors = {
      'pet': 'text-purple-600',
      'saude': 'text-blue-600',

      'vendas': 'text-purple-700',
      'design': 'text-teal-600',
      'sites': 'text-indigo-600'
    };
    return categoryColors[cat as keyof typeof categoryColors] || 'text-gray-600';
  }

  function getCategoryBackground(cat: string): string {
    const categoryBackgrounds = {
      'pet': 'bg-gradient-to-br from-[#9333ea] to-[#7c3aed]', // Roxo vibrante da imagem
      'saude': 'bg-gradient-to-br from-[#1e3a8a] to-[#1e40af]', // Azul escuro da imagem

      'vendas': 'bg-gradient-to-br from-[#9333ea] to-[#7c3aed]', // Roxo vibrante
      'design': 'bg-gradient-to-br from-[#00ff88] to-[#00e57a]', // Verde neon
      'sites': 'bg-gradient-to-br from-[#1e3a8a] to-[#1e40af]' // Azul escuro
    };
    return categoryBackgrounds[cat as keyof typeof categoryBackgrounds] || 'bg-gradient-to-br from-[#9333ea] to-[#7c3aed]';
  }

  function getCategoryGlow(cat: string): string {
    const categoryGlows = {
      'pet': 'shadow-[#9333ea]/30 hover:shadow-[#9333ea]/50',
      'saude': 'shadow-[#1e3a8a]/30 hover:shadow-[#1e3a8a]/50',

      'vendas': 'shadow-[#9333ea]/30 hover:shadow-[#9333ea]/50',
      'design': 'shadow-[#00ff88]/30 hover:shadow-[#00ff88]/50',
      'sites': 'shadow-[#1e3a8a]/30 hover:shadow-[#1e3a8a]/50'
    };
    return categoryGlows[cat as keyof typeof categoryGlows] || 'shadow-[#9333ea]/30';
  }

  function getCreativeBackground(variant: string): string {
    const creativeBackgrounds = {
      'purple': 'bg-gradient-to-br from-[#9333ea] to-[#7c3aed]',
      'blue': 'bg-gradient-to-br from-[#1e3a8a] to-[#1e40af]', 
      'green': 'bg-gradient-to-br from-[#00ff88] to-[#00e57a]',
      'creative': getRandomCreativeBackground()
    };
    return creativeBackgrounds[variant as keyof typeof creativeBackgrounds] || 'bg-gradient-to-br from-[#9333ea] to-[#7c3aed]';
  }

  function getRandomCreativeBackground(): string {
    const backgrounds = [
      'bg-gradient-to-br from-[#9333ea] to-[#7c3aed]', // Roxo corporativo
      'bg-gradient-to-br from-[#1e3a8a] to-[#1e40af]', // Azul corporativo
      'bg-gradient-to-br from-[#00ff88] to-[#00e57a]', // Verde corporativo
      'bg-gradient-to-br from-[#f59e0b] to-[#d97706]', // Laranja vibrante
      'bg-gradient-to-br from-[#ef4444] to-[#dc2626]', // Vermelho vibrante
      'bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed]', // Roxo suave
      'bg-gradient-to-br from-[#06b6d4] to-[#0891b2]', // Cyan vibrante
      'bg-gradient-to-br from-[#10b981] to-[#059669]', // Verde esmeralda
      'bg-gradient-to-br from-[#f97316] to-[#ea580c]', // Laranja quente
      'bg-gradient-to-br from-[#ec4899] to-[#db2777]'  // Pink vibrante
    ];
    return backgrounds[Math.floor(Math.random() * backgrounds.length)];
  }

  function getContextualBackground(iconName: string): string {
    // Mapeamento inteligente baseado no contexto do ícone
    const contextualMap: { [key: string]: string } = {
      // Financeiro - Verdes e dourados
      'DollarSign': 'bg-gradient-to-br from-[#10b981] to-[#059669]',
      'CreditCard': 'bg-gradient-to-br from-[#f59e0b] to-[#d97706]',
      'TrendingUp': 'bg-gradient-to-br from-[#00ff88] to-[#00e57a]',
      'TrendingDown': 'bg-gradient-to-br from-[#ef4444] to-[#dc2626]',
      
      // Alertas e notificações - Vermelhos e laranjas
      'AlertTriangle': 'bg-gradient-to-br from-[#f97316] to-[#ea580c]',
      'AlertCircle': 'bg-gradient-to-br from-[#ef4444] to-[#dc2626]',
      'Bell': 'bg-gradient-to-br from-[#f59e0b] to-[#d97706]',
      
      // Tempo e calendário - Azuis
      'Clock': 'bg-gradient-to-br from-[#06b6d4] to-[#0891b2]',
      'Calendar': 'bg-gradient-to-br from-[#1e3a8a] to-[#1e40af]',
      
      // Comunicação - Roxos e pinks
      'MessageCircle': 'bg-gradient-to-br from-[#9333ea] to-[#7c3aed]',
      'Phone': 'bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed]',
      'Mail': 'bg-gradient-to-br from-[#ec4899] to-[#db2777]',
      
      // Tecnologia e bots - Cyans e verdes tech
      'Bot': 'bg-gradient-to-br from-[#06b6d4] to-[#0891b2]',
      'Settings': 'bg-gradient-to-br from-[#6b7280] to-[#4b5563]',
      'Zap': 'bg-gradient-to-br from-[#eab308] to-[#ca8a04]',
      
      // Ações positivas - Verdes
      'CheckCircle': 'bg-gradient-to-br from-[#10b981] to-[#059669]',
      'Plus': 'bg-gradient-to-br from-[#00ff88] to-[#00e57a]',
      
      // Downloads e compartilhamento - Azuis
      'Download': 'bg-gradient-to-br from-[#3b82f6] to-[#2563eb]',
      'Share': 'bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed]',
      'Copy': 'bg-gradient-to-br from-[#06b6d4] to-[#0891b2]',
      
      // Busca e filtros - Roxos
      'Search': 'bg-gradient-to-br from-[#9333ea] to-[#7c3aed]',
      'Filter': 'bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed]',
      
      // Pessoas e usuários - Pinks e roxos
      'Users': 'bg-gradient-to-br from-[#ec4899] to-[#db2777]',
      'User': 'bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed]',
      
      // Compras e produtos - Laranjas e verdes
      'ShoppingCart': 'bg-gradient-to-br from-[#f97316] to-[#ea580c]',
      'Package': 'bg-gradient-to-br from-[#10b981] to-[#059669]',
      
      // Estrelas e favoritos - Dourados
      'Star': 'bg-gradient-to-br from-[#eab308] to-[#ca8a04]',
      'Heart': 'bg-gradient-to-br from-[#ef4444] to-[#dc2626]'
    };
    
    return contextualMap[iconName] || getRandomCreativeBackground();
  }

  const iconElement = (
    <Icon 
      className={cn(
        sizes[size],
        variants[variant],
        animated && 'transition-all duration-300 hover:scale-110',
        !background && className
      )}
    />
  );

  if (background) {
    return (
      <div className={cn(
        'flex items-center justify-center shadow-md',
        backgroundSizes[size],
        'rounded-2xl', // Sempre quadrado arredondado
        contextual ? getContextualBackground(Icon.displayName || Icon.name || 'default') :
          gradient ? 'bg-gradient-to-br from-primary to-primary/80' : 
          category ? getCategoryBackground(category) : 
          ['purple', 'blue', 'green', 'creative'].includes(variant) ? getCreativeBackground(variant) :
          'bg-gradient-to-br from-gray-400 to-gray-600',
        glow && 'shadow-lg',
        glow && category && getCategoryGlow(category),
        animated && 'modern-card-hover transition-all duration-300 hover:scale-110',
        className
      )}>
        <Icon 
          className={cn(
            sizes[size],
            'text-white', // Sempre branco quando tem background
            animated && 'transition-all duration-300 hover:scale-110'
          )}
        />
      </div>
    );
  }

  return iconElement;
};

export default ModernIcon;