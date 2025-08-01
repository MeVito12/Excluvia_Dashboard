import React from 'react';
import { formatDateBR } from '@/utils/dateFormat';

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
}

const ThermalPrint: React.FC<ThermalPrintProps> = ({ 
  sale, 
  company, 
  branch, 
  includeClient = false 
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const printContent = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = document.getElementById('thermal-print-content')?.innerHTML || '';
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Comprovante de Venda #${sale.id}</title>
        <style>
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
          body {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.2;
            margin: 0;
            padding: 10px;
            width: 80mm;
            max-width: 300px;
          }
          .header {
            text-align: center;
            border-bottom: 1px dashed #000;
            padding-bottom: 5px;
            margin-bottom: 10px;
          }
          .company-name { font-weight: bold; font-size: 14px; }
          .separator { border-top: 1px dashed #000; margin: 5px 0; }
          .item-line { 
            display: flex; 
            justify-content: space-between; 
            margin: 2px 0;
          }
          .total-line { 
            font-weight: bold; 
            border-top: 1px dashed #000; 
            padding-top: 5px; 
            margin-top: 5px;
          }
          .footer {
            text-align: center;
            border-top: 1px dashed #000;
            padding-top: 5px;
            margin-top: 10px;
            font-size: 10px;
          }
        </style>
      </head>
      <body>
        ${content}
        <script>
          window.onload = function() {
            window.print();
            window.close();
          }
        </script>
      </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  return (
    <div className="thermal-print-container">
      <div id="thermal-print-content" style={{ display: 'none' }}>
        <div className="header">
          <div className="company-name">{company.name}</div>
          <div>{branch.name}</div>
          {company.cnpj && <div>CNPJ: {company.cnpj}</div>}
          {branch.address && <div>{branch.address}</div>}
          {branch.phone && <div>Tel: {branch.phone}</div>}
        </div>

        <div className="separator"></div>
        
        <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
          COMPROVANTE DE VENDA
        </div>
        <div style={{ textAlign: 'center' }}>
          Venda #{sale.id}
        </div>
        <div style={{ textAlign: 'center' }}>
          {formatDateBR(sale.saleDate)} às {new Date(sale.saleDate).toLocaleTimeString('pt-BR')}
        </div>

        <div className="separator"></div>

        <div>
          <div style={{ fontWeight: 'bold' }}>ITENS:</div>
          {sale.products.map((product, index) => (
            <div key={index}>
              <div>{product.name}</div>
              <div className="item-line">
                <span>{product.quantity}x {formatCurrency(product.price)}</span>
                <span>{formatCurrency(product.total)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="separator"></div>

        <div className="item-line total-line">
          <span>TOTAL:</span>
          <span>{formatCurrency(sale.total)}</span>
        </div>

        <div className="separator"></div>

        <div>
          <strong>Pagamento:</strong> {sale.paymentMethod}
        </div>

        {includeClient && sale.client && (
          <>
            <div className="separator"></div>
            <div>
              <div style={{ fontWeight: 'bold' }}>DADOS DO CLIENTE:</div>
              <div>Nome: {sale.client.name}</div>
              {sale.client.cpf && <div>CPF: {sale.client.cpf}</div>}
              {sale.client.cnpj && <div>CNPJ: {sale.client.cnpj}</div>}
              {sale.client.phone && <div>Tel: {sale.client.phone}</div>}
              {sale.client.address && <div>End: {sale.client.address}</div>}
            </div>
          </>
        )}

        <div className="footer">
          <div>Obrigado pela preferência!</div>
          <div>www.sistemagerencial.com</div>
        </div>
      </div>
      
      <button 
        onClick={printContent}
        className="no-print bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
      >
        🖨️ Imprimir Comprovante
      </button>
    </div>
  );
};

export default ThermalPrint;