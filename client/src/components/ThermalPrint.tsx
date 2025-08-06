import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Printer, Download } from 'lucide-react';

interface ThermalPrintProps {
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
  printerType: 'thermal' | 'conventional';
}

const ThermalPrint: React.FC<ThermalPrintProps> = ({ 
  sale, 
  company, 
  branch, 
  includeClient = false,
  printerType 
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Implementar lógica de download se necessário
    console.log('Download iniciado');
  };

  return (
    <Card className="glassmorphism border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Download className="w-5 h-5 text-primary" />
          Preview da Impressão
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preview da impressão */}
        <div className={`bg-white text-black p-4 rounded-lg border-2 border-dashed border-muted ${
          printerType === 'thermal' ? 'max-w-xs mx-auto' : 'max-w-lg mx-auto'
        }`}>
          <div className="text-center space-y-1">
            <h3 className="font-bold text-sm">{company.name}</h3>
            {company.cnpj && <p className="text-xs">CNPJ: {company.cnpj}</p>}
            {company.address && <p className="text-xs">{company.address}</p>}
            {company.phone && <p className="text-xs">Tel: {company.phone}</p>}
          </div>
          
          <Separator className="my-2" />
          
          <div className="text-center space-y-1">
            <p className="text-xs font-medium">{branch.name}</p>
            {branch.address && <p className="text-xs">{branch.address}</p>}
            {branch.phone && <p className="text-xs">Tel: {branch.phone}</p>}
          </div>
          
          <Separator className="my-2" />
          
          {includeClient && sale.client && (
            <>
              <div className="space-y-1">
                <p className="text-xs font-medium">Cliente: {sale.client.name}</p>
                {sale.client.cpf && <p className="text-xs">CPF: {sale.client.cpf}</p>}
                {sale.client.cnpj && <p className="text-xs">CNPJ: {sale.client.cnpj}</p>}
                {sale.client.phone && <p className="text-xs">Tel: {sale.client.phone}</p>}
              </div>
              <Separator className="my-2" />
            </>
          )}
          
          <div className="space-y-1">
            <p className="text-xs font-medium">Venda #{sale.id}</p>
            <p className="text-xs">Data: {new Date(sale.saleDate).toLocaleString('pt-BR')}</p>
            <p className="text-xs">Pagamento: {sale.paymentMethod}</p>
          </div>
          
          <Separator className="my-2" />
          
          <div className="space-y-1">
            {sale.products.map((product, index) => (
              <div key={index} className="flex justify-between text-xs">
                <div className="flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-muted-foreground">
                    {product.quantity}x R$ {product.price.toFixed(2)}
                  </p>
                </div>
                <p className="font-medium">R$ {product.total.toFixed(2)}</p>
              </div>
            ))}
          </div>
          
          <Separator className="my-2" />
          
          <div className="flex justify-between text-sm font-bold">
            <span>TOTAL:</span>
            <span>R$ {sale.total.toFixed(2)}</span>
          </div>
          
          <div className="text-center mt-4 space-y-1">
            <p className="text-xs">Obrigado pela preferência!</p>
            <p className="text-xs">Volte sempre!</p>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex gap-3 justify-center">
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Imprimir {printerType === 'thermal' ? 'Cupom' : 'Recibo'}
          </Button>
          <Button variant="outline" onClick={handleDownload} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Baixar PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThermalPrint;