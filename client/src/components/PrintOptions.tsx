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
    <div className="space-y-6">
      {/* Header */}
      <Card className="glassmorphism border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Printer className="w-5 h-5 text-primary" />
            Opções de Impressão
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Escolha o tipo de impressora:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant={selectedPrinterType === 'thermal' ? 'default' : 'outline'}
                onClick={() => setSelectedPrinterType('thermal')}
                className="h-auto p-4 flex-col items-start space-y-2 hover:scale-[1.02] transition-all duration-200"
              >
                <div className="flex items-center gap-2 w-full">
                  <Printer className="w-4 h-4" />
                  <span className="font-medium">Térmica (80mm)</span>
                  {selectedPrinterType === 'thermal' && (
                    <Badge variant="secondary" className="ml-auto">Selecionada</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground text-left w-full">
                  Formato compacto para cupom fiscal
                </p>
              </Button>
              
              <Button
                variant={selectedPrinterType === 'conventional' ? 'default' : 'outline'}
                onClick={() => setSelectedPrinterType('conventional')}
                className="h-auto p-4 flex-col items-start space-y-2 hover:scale-[1.02] transition-all duration-200"
              >
                <div className="flex items-center gap-2 w-full">
                  <FileText className="w-4 h-4" />
                  <span className="font-medium">Convencional (A4)</span>
                  {selectedPrinterType === 'conventional' && (
                    <Badge variant="secondary" className="ml-auto">Selecionada</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground text-left w-full">
                  Formato padrão em papel A4
                </p>
              </Button>
            </div>
          </div>

          <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
            <p className="text-sm text-muted-foreground">
              {selectedPrinterType === 'thermal' 
                ? '📄 Formato compacto otimizado para impressoras térmicas de 80mm (cupom fiscal)'
                : '📋 Formato padrão para impressoras convencionais em papel A4'
              }
            </p>
          </div>
        </CardContent>
      </Card>

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