import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModernIconProps {
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'category';
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
    category: category ? getCategoryColor(category) : 'text-gray-600'
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
      'pet': 'bg-gradient-to-br from-purple-500 to-purple-700',
      'saude': 'bg-gradient-to-br from-blue-500 to-blue-700',
      'alimenticio': 'bg-gradient-to-br from-green-500 to-green-700',
      'vendas': 'bg-gradient-to-br from-purple-600 to-indigo-700',
      'design': 'bg-gradient-to-br from-teal-500 to-green-600',
      'sites': 'bg-gradient-to-br from-indigo-600 to-blue-700'
    };
    return categoryBackgrounds[cat as keyof typeof categoryBackgrounds] || 'bg-gradient-to-br from-gray-500 to-gray-700';
  }

  function getCategoryGlow(cat: string): string {
    const categoryGlows = {
      'pet': 'shadow-purple-200/50 hover:shadow-purple-300/70',
      'saude': 'shadow-blue-200/50 hover:shadow-blue-300/70',
      'alimenticio': 'shadow-green-200/50 hover:shadow-green-300/70',
      'vendas': 'shadow-purple-200/50 hover:shadow-indigo-300/70',
      'design': 'shadow-teal-200/50 hover:shadow-green-300/70',
      'sites': 'shadow-indigo-200/50 hover:shadow-blue-300/70'
    };
    return categoryGlows[cat as keyof typeof categoryGlows] || 'shadow-gray-200/50';
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
        <div className="text-white">
          {iconElement}
        </div>
      </div>
    );
  }

  return iconElement;
};

export default ModernIcon;