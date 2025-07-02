
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
    positive: 'text-green-400',
    negative: 'text-red-400',
    neutral: 'text-purple-300'
  };

  const gradientClasses = gradient 
    ? 'bg-gradient-to-br from-purple-600 via-blue-600 to-green-500' 
    : 'bg-gradient-to-br from-gray-800/80 via-blue-900/80 to-purple-800/80';

  return (
    <Card className={`p-6 ${gradientClasses} border-purple-400/30 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 backdrop-blur-sm border-2`}>
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-bold text-purple-200 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold text-white bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
            {value}
          </p>
          {change && (
            <p className={`text-sm font-semibold ${changeColors[changeType]}`}>
              {change}
            </p>
          )}
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-white/20 to-green-400/20 border border-white/30 shadow-lg">
          <Icon className="h-7 w-7 text-white" />
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;
