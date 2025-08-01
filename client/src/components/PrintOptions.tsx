import React, { useState } from 'react';
import { Printer, FileText } from 'lucide-react';
import ThermalPrint from './ThermalPrint';

interface PrintOptionsProps {
  sale: {
    id: number;
    products: Array<{
      name: string;
      quantity: number;
      price: number;
      total: number;
    }>;
    total: number;
    paymentMethod: string;
    saleDate: string;
    client?: {
      name: string;
      cpf?: string;
      cnpj?: string;
      phone?: string;
      address?: string;
    };
  };
  company: {
    name: string;
    cnpj?: string;
    address?: string;
    phone?: string;
  };
  branch: {
    name: string;
    address?: string;
    phone?: string;
  };
  includeClient?: boolean;
}

const PrintOptions: React.FC<PrintOptionsProps> = ({ 
  sale, 
  company, 
  branch, 
  includeClient = false 
}) => {
  const [selectedPrinterType, setSelectedPrinterType] = useState<'thermal' | 'conventional'>('thermal');

  return (
    <div className="print-options-container">
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Escolha o tipo de impressora:</h4>
        <div className="flex gap-3">
          <button
            onClick={() => setSelectedPrinterType('thermal')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
              selectedPrinterType === 'thermal'
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Printer className="w-4 h-4" />
            Térmica (80mm)
          </button>
          
          <button
            onClick={() => setSelectedPrinterType('conventional')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
              selectedPrinterType === 'conventional'
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            Convencional (A4)
          </button>
        </div>
      </div>

      <div className="text-xs text-gray-500 mb-3">
        {selectedPrinterType === 'thermal' 
          ? 'Formato compacto para impressoras térmicas de 80mm (cupom fiscal)'
          : 'Formato padrão para impressoras convencionais em papel A4'
        }
      </div>

      <ThermalPrint
        sale={sale}
        company={company}
        branch={branch}
        includeClient={includeClient}
        printerType={selectedPrinterType}
      />
    </div>
  );
};

export default PrintOptions;