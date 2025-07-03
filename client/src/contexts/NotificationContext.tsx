import React, { createContext, useContext, ReactNode } from 'react';
import { useNotifications } from '@/components/NotificationSystem';

interface NotificationContextType {
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string) => void;
  showWarning: (title: string, message: string) => void;
  showInfo: (title: string, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
  notificationFunctions: NotificationContextType;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ 
  children, 
  notificationFunctions 
}) => {
  return (
    <NotificationContext.Provider value={notificationFunctions}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};