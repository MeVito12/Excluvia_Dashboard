import { useState } from 'react';

interface AlertOptions {
  title: string;
  description: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
}

export const useCustomAlert = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [alertData, setAlertData] = useState<AlertOptions>({
    title: '',
    description: '',
    variant: 'default'
  });

  const showAlert = (options: AlertOptions) => {
    setAlertData(options);
    setIsOpen(true);
  };

  const closeAlert = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    alertData,
    showAlert,
    closeAlert
  };
};