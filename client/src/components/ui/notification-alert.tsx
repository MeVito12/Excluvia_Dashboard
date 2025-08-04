import React from 'react';
import { AlertTriangle, Bell, CheckCircle, Info, X } from 'lucide-react';

interface NotificationAlertProps {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp?: string;
  onDismiss?: (id: string) => void;
  autoHide?: boolean;
}

export const NotificationAlert: React.FC<NotificationAlertProps> = ({
  id,
  type,
  title,
  message,
  timestamp,
  onDismiss,
  autoHide = false
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-green-50 border-green-200',
          icon: 'text-green-500',
          title: 'text-green-800',
          message: 'text-green-700',
          IconComponent: CheckCircle
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200',
          icon: 'text-yellow-500',
          title: 'text-yellow-800',
          message: 'text-yellow-700',
          IconComponent: AlertTriangle
        };
      case 'error':
        return {
          container: 'bg-red-50 border-red-200',
          icon: 'text-red-500',
          title: 'text-red-800',
          message: 'text-red-700',
          IconComponent: AlertTriangle
        };
      default:
        return {
          container: 'bg-blue-50 border-blue-200',
          icon: 'text-blue-500',
          title: 'text-blue-800',
          message: 'text-blue-700',
          IconComponent: Info
        };
    }
  };

  const styles = getTypeStyles();
  const IconComponent = styles.IconComponent;

  React.useEffect(() => {
    if (autoHide && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss(id);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [autoHide, onDismiss, id]);

  return (
    <div className={`border rounded-lg p-4 mb-3 ${styles.container} animate-fade-in`}>
      <div className="flex items-start gap-3">
        <IconComponent className={`w-5 h-5 mt-0.5 ${styles.icon}`} />
        <div className="flex-1">
          <h4 className={`font-medium text-sm ${styles.title}`}>{title}</h4>
          <p className={`text-sm ${styles.message} mt-1`}>{message}</p>
          {timestamp && (
            <p className="text-xs text-gray-500 mt-2">{timestamp}</p>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={() => onDismiss(id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

interface NotificationCenterProps {
  notifications: NotificationAlertProps[];
  onDismiss: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onDismiss,
  onClearAll
}) => {
  if (notifications.length === 0) {
    return (
      <div className="main-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Notificações</h3>
        </div>
        <div className="text-center py-8">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhuma notificação no momento</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Notificações</h3>
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {notifications.length}
          </span>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Limpar todas
          </button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.map(notification => (
          <NotificationAlert
            key={notification.id}
            {...notification}
            onDismiss={onDismiss}
          />
        ))}
      </div>
    </div>
  );
};