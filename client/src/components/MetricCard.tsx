
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { UnifiedMetric, DESIGN_SYSTEM } from '@/components/ui/unified-system';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  gradient?: boolean;
}

const MetricCard = ({ title, value, change, changeType = 'neutral', icon }: MetricCardProps) => {
  // Mapear mudanças para trend
  const trend = changeType === 'positive' ? 'up' : 
               changeType === 'negative' ? 'down' : 'neutral';
  
  // Determinar cor baseada no ícone
  const iconName = icon.displayName || icon.name || 'general';
  const mappedColor = DESIGN_SYSTEM.iconMap[iconName as keyof typeof DESIGN_SYSTEM.iconMap];
  const colorType = (mappedColor as keyof typeof DESIGN_SYSTEM.colors) || 'general';

  return (
    <UnifiedMetric
      title={title}
      value={value}
      icon={icon}
      trend={trend}
      trendValue={change}
      colorType={colorType}
    />
  );
};

export default MetricCard;
