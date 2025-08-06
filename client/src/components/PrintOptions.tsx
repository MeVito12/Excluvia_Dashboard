import React, { useState } from 'react';
import { Printer, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Printer className="w-4 h-4 text-primary" />
        <h4 className="text-base font-medium text-foreground">Opções de Impressão</h4>
      </div>

      {/* Printer Type Selection */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Escolha o tipo de impressora:
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={selectedPrinterType === 'thermal' ? 'default' : 'outline'}
            onClick={() => setSelectedPrinterType('thermal')}
            className={`h-auto p-2 justify-start text-left ${
              selectedPrinterType === 'thermal' 
                ? 'text-white hover:text-white' 
                : 'text-gray-700 hover:text-gray-800'
            }`}
            size="sm"
          >
            <div className="flex items-center gap-2">
              <Printer className="w-3 h-3" />
              <div>
                <div className="font-medium text-xs">Térmica (80mm)</div>
                <div className={`text-xs ${
                  selectedPrinterType === 'thermal' ? 'text-white/70' : 'opacity-70'
                }`}>Cupom fiscal</div>
              </div>
            </div>
          </Button>
          
          <Button
            variant={selectedPrinterType === 'conventional' ? 'default' : 'outline'}
            onClick={() => setSelectedPrinterType('conventional')}
            className={`h-auto p-2 justify-start text-left ${
              selectedPrinterType === 'conventional' 
                ? 'text-white hover:text-white' 
                : 'text-gray-700 hover:text-gray-800'
            }`}
            size="sm"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-3 h-3" />
              <div>
                <div className="font-medium text-xs">Convencional (A4)</div>
                <div className={`text-xs ${
                  selectedPrinterType === 'conventional' ? 'text-white/70' : 'opacity-70'
                }`}>Papel A4</div>
              </div>
            </div>
          </Button>
        </div>
      </div>

      {/* Print Component */}
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