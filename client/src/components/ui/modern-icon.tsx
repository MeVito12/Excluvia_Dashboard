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
  category?: 'pet' | 'saude' | 'alimenticio' | 'vendas' | 'design' | 'sites';
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
      'alimenticio': 'text-green-600',
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
      'alimenticio': 'bg-gradient-to-br from-[#00ff88] to-[#00e57a]', // Verde neon da imagem
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
      'alimenticio': 'shadow-[#00ff88]/30 hover:shadow-[#00ff88]/50',
      'vendas': 'shadow-[#9333ea]/30 hover:shadow-[#9333ea]/50',
      'design': 'shadow-[#00ff88]/30 hover:shadow-[#00ff88]/50',
      'sites': 'shadow-[#1e3a8a]/30 hover:shadow-[#1e3a8a]/50'
    };
    return categoryGlows[cat as keyof typeof categoryGlows] || 'shadow-[#9333ea]/30';
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
        gradient ? 'bg-gradient-to-br from-primary to-primary/80' : 
          category ? getCategoryBackground(category) : 'bg-gradient-to-br from-gray-400 to-gray-600',
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