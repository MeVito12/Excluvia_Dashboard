import { useState } from 'react';

interface ConfirmData {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

export const useCustomConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmData, setConfirmData] = useState<ConfirmData>({
    title: '',
    description: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar'
  });
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | null>(null);

  const showConfirm = (data: ConfirmData, onConfirm: () => void) => {
    setConfirmData(data);
    setOnConfirmCallback(() => onConfirm);
    setIsOpen(true);
  };

  const closeConfirm = () => {
    setIsOpen(false);
    setOnConfirmCallback(null);
  };

  const handleConfirm = () => {
    if (onConfirmCallback) {
      onConfirmCallback();
    }
    closeConfirm();
  };

  return {
    isOpen,
    confirmData,
    showConfirm,
    closeConfirm,
    handleConfirm
  };
};