import React from 'react';
import { Database, Zap, Link, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  type?: 'awaiting' | 'no-data' | 'error' | 'integration';
  actionButton?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  type = 'no-data',
  actionButton
}) => {
  const getIcon = () => {
    switch (type) {
      case 'awaiting':
        return <Database className="w-16 h-16 text-blue-500" />;
      case 'integration':
        return <Link className="w-16 h-16 text-purple-500" />;
      case 'error':
        return <AlertCircle className="w-16 h-16 text-red-500" />;
      default:
        return <Zap className="w-16 h-16 text-gray-400" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'awaiting':
        return 'bg-blue-50 border-blue-200';
      case 'integration':
        return 'bg-purple-50 border-purple-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'awaiting':
        return 'text-blue-800';
      case 'integration':
        return 'text-purple-800';
      case 'error':
        return 'text-red-800';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={`rounded-xl border-2 border-dashed p-12 text-center ${getBackgroundColor()}`}>
      <div className="flex flex-col items-center space-y-4">
        {getIcon()}
        
        <div>
          <h3 className={`text-lg font-semibold ${getTextColor()}`}>
            {title}
          </h3>
          <p className={`mt-2 text-sm ${getTextColor()} opacity-80 max-w-md mx-auto`}>
            {description}
          </p>
        </div>

        {actionButton && (
          <div className="pt-4">
            {actionButton}
          </div>
        )}

        {type === 'awaiting' && (
          <div className="pt-4">
            <div className="flex items-center gap-2 text-xs text-blue-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              Aguardando integração com sistemas da empresa
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;