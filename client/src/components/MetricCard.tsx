
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  gradient?: boolean;
}

const MetricCard = ({ title, value, change, changeType = 'neutral', icon: Icon, gradient }: MetricCardProps) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`metric-card ${gradient ? 'gradient-brand text-white' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${gradient ? 'text-white/80' : 'text-gray-600'}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold mt-1 ${gradient ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </p>
          {change && (
            <p className={`text-xs mt-1 ${gradient ? 'text-white/70' : getChangeColor()}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${gradient ? 'bg-white/20' : 'bg-gray-100'}`}>
          <Icon className={`h-6 w-6 ${gradient ? 'text-white' : 'text-gray-600'}`} />
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
