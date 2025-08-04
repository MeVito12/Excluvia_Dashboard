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
  printerType?: 'thermal' | 'conventional';
}

const ThermalPrint: React.FC<ThermalPrintProps> = ({ 
  sale, 
  company, 
  branch, 
  includeClient = false,
  printerType = 'thermal'
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStylesForPrinterType = () => {
    if (printerType === 'conventional') {
      return `
        @page {
          size: A4;
          margin: 20mm;
        }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
        body {
          font-family: Arial, sans-serif;
          font-size: 14px;
          line-height: 1.4;
          margin: 0;
          padding: 20px;
          max-width: 210mm;
          color: #000;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #000;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .company-name { 
          font-weight: bold; 
          font-size: 18px; 
          margin-bottom: 5px;
        }
        .separator { 
          border-top: 1px solid #000; 
          margin: 15px 0; 
        }
        .item-line { 
          display: flex; 
          justify-content: space-between; 
          margin: 8px 0;
          padding: 4px 0;
        }
        .total-line { 
          font-weight: bold; 
          border-top: 2px solid #000; 
          padding-top: 10px; 
          margin-top: 15px;
          font-size: 16px;
        }
        .footer {
          text-align: center;
          border-top: 1px solid #000;
          padding-top: 15px;
          margin-top: 20px;
          font-size: 12px;
        }
        .product-item {
          margin-bottom: 10px;
          padding: 5px 0;
        }
        .client-section {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          margin: 15px 0;
        }
      `;
    } else {
      // Thermal printer styles (original)
      return `
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
        .product-item {
          margin-bottom: 5px;
        }
        .client-section {
          margin: 10px 0;
        }
      `;
    }
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
        <meta charset="UTF-8">
        <style>
          ${getStylesForPrinterType()}
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
          <div style={{ fontWeight: 'bold', marginBottom: printerType === 'conventional' ? '10px' : '5px' }}>ITENS:</div>
          {sale.products.map((product, index) => (
            <div key={index} className="product-item">
              <div style={{ fontWeight: printerType === 'conventional' ? 'bold' : 'normal' }}>
                {product.name}
              </div>
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
            <div className="client-section">
              <div style={{ fontWeight: 'bold', marginBottom: printerType === 'conventional' ? '8px' : '3px' }}>
                DADOS DO CLIENTE:
              </div>
              <div style={{ marginBottom: '3px' }}>Nome: {sale.client.name}</div>
              {sale.client.cpf && <div style={{ marginBottom: '3px' }}>CPF: {sale.client.cpf}</div>}
              {sale.client.cnpj && <div style={{ marginBottom: '3px' }}>CNPJ: {sale.client.cnpj}</div>}
              {sale.client.phone && <div style={{ marginBottom: '3px' }}>Tel: {sale.client.phone}</div>}
              {sale.client.address && <div style={{ marginBottom: '3px' }}>End: {sale.client.address}</div>}
            </div>
          </>
        )}

        <div className="footer">
          <div>Obrigado pela preferência!</div>
          <div>www.sistemagerencial.com</div>
        </div>
      </div>
      
      <div className="no-print flex gap-2">
        <button 
          onClick={() => printContent()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
        >
          🖨️ {printerType === 'thermal' ? 'Impressora Térmica' : 'Impressora Convencional'}
        </button>
      </div>
    </div>
  );
};

export default ThermalPrint;