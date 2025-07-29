import React from 'react';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';

interface CustomAlertProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
}

export const CustomAlert: React.FC<CustomAlertProps> = ({
  isOpen,
  onClose,
  title,
  description,
  variant = 'default'
}) => {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'destructive':
        return {
          bg: 'bg-red-50 border-red-200',
          icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
          titleColor: 'text-red-800',
          descColor: 'text-red-600'
        };
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          icon: <CheckCircle className="h-6 w-6 text-green-600" />,
          titleColor: 'text-green-800',
          descColor: 'text-green-600'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          icon: <AlertCircle className="h-6 w-6 text-yellow-600" />,
          titleColor: 'text-yellow-800',
          descColor: 'text-yellow-600'
        };
      default:
        return {
          bg: 'bg-blue-50 border-blue-200',
          icon: <Info className="h-6 w-6 text-blue-600" />,
          titleColor: 'text-blue-800',
          descColor: 'text-blue-600'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 999999 }}>
      <div className={`max-w-md w-full mx-4 rounded-lg border p-6 ${styles.bg} shadow-xl`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {styles.icon}
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${styles.titleColor} mb-2`}>
              {title}
            </h3>
            <p className={`text-sm ${styles.descColor}`}>
              {description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};