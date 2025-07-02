import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconWrapperProps {
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

const IconWrapper: React.FC<IconWrapperProps> = ({ 
  icon: Icon, 
  variant = 'default', 
  size = 'md', 
  className,
  animated = false 
}) => {
  const variants = {
    default: 'text-gray-600',
    primary: 'text-primary',
    accent: 'text-accent',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600'
  };

  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8'
  };

  return (
    <Icon 
      className={cn(
        sizes[size],
        variants[variant],
        animated && 'transition-all duration-300 hover:scale-110',
        className
      )}
    />
  );
};

export default IconWrapper;