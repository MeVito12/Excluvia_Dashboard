// Componente simplificado para impressão térmica
import React from 'react';

interface ThermalPrintProps {
  data: any;
  onPrint: () => void;
  className?: string;
}

const ThermalPrint = ({ data, onPrint, className }: ThermalPrintProps) => {
  return (
    <div className={className}>
      <button 
        onClick={onPrint}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Imprimir
      </button>
    </div>
  );
};

export default ThermalPrint;