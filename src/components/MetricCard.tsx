

import React from 'react';
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  gradient?: boolean;
}

const MetricCard = ({ title, value, change, changeType = 'neutral', icon: Icon, gradient = false }: MetricCardProps) => {
  const changeColors = {
    positive: 'text-accent',
    negative: 'text-destructive',
    neutral: 'text-muted-foreground'
  };

  return (
    <Card className={`p-6 border-border/50 backdrop-blur-sm ${
      gradient 
        ? 'gradient-purple-green text-white' 
        : 'bg-gradient-to-br from-card/90 to-card/60 border-primary/20'
    } hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className={`text-sm font-medium ${
            gradient ? 'text-white/80' : 'text-muted-foreground'
          }`}>
            {title}
          </p>
          <p className={`text-3xl font-bold ${
            gradient ? 'text-white' : 'text-foreground'
          }`}>
            {value}
          </p>
          {change && (
            <p className={`text-sm ${
              gradient ? 'text-white/70' : changeColors[changeType]
            }`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${
          gradient 
            ? 'bg-white/20' 
            : 'bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30'
        }`}>
          <Icon className={`h-6 w-6 ${
            gradient ? 'text-white' : 'text-primary'
          }`} />
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;

