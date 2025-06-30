
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
    neutral: 'text-gray-600'
  };

  return (
    <Card className="p-6 bg-white border-border/50 hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">
            {title}
          </p>
          <p className="text-3xl font-bold text-black">
            {value}
          </p>
          {change && (
            <p className={`text-sm ${changeColors[changeType]}`}>
              {change}
            </p>
          )}
        </div>
        <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;
