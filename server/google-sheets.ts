import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// Configuração da autenticação com Google Sheets
const createSheetsAuth = () => {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error('Google Sheets credentials not configured');
  }

  return new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
};

// Interface para produto no Google Sheets
interface SheetsProduct {
  nome: string;
  categoria: string;
  quantidade: number;
  preco: number;
  unidade: string;
  dataFabricacao: string;
  dataVencimento?: string;
  fornecedor: string;
  codigoBarras: string;
  localizacao: string;
  estoqueMinimo: number;
  status: string;
}

export class GoogleSheetsManager {
  private doc: GoogleSpreadsheet | null = null;
  private spreadsheetId: string;
  private auth: JWT;

  constructor(spreadsheetId?: string) {
    this.auth = createSheetsAuth();
    this.spreadsheetId = spreadsheetId || process.env.GOOGLE_SHEETS_INVENTORY_ID || '';
  }

  // Conectar à planilha
  async connect(): Promise<void> {
    if (!this.spreadsheetId) {
      throw new Error('Spreadsheet ID não configurado');
    }

    this.doc = new GoogleSpreadsheet(this.spreadsheetId, this.auth);
    await this.doc.loadInfo();
  }

  // Criar planilha base se não existir
  async createBaseSheet(): Promise<string> {
    if (!this.doc) await this.connect();
    
    // Verificar se já existe uma aba de estoque
    let sheet = this.doc!.sheetsByTitle['Estoque_MultiUnidades'];
    
    if (!sheet) {
      // Criar nova aba
      sheet = await this.doc!.addSheet({
        title: 'Estoque_MultiUnidades',
        headerValues: [
          'ID',
          'Nome',
          'Categoria', 
          'Quantidade',
          'Preço',
          'Unidade',
          'Data_Fabricacao',
          'Data_Vencimento',
          'Fornecedor',
          'Codigo_Barras',
          'Localizacao',
          'Estoque_Minimo',
          'Status',
          'Data_Atualizacao',
          'Ultima_Movimentacao'
        ]
      });

      // Adicionar dados iniciais das unidades
      const initialData = [
        {
          ID: 'PROD001',
          Nome: 'Smartphone Samsung Galaxy S24',
          Categoria: 'Eletrônicos',
          Quantidade: 15,
          Preço: 2899.99,
          Unidade: 'Unidade',
          Data_Fabricacao: '2024-01-15',
          Data_Vencimento: '',
          Fornecedor: 'Samsung Brasil',
          Codigo_Barras: '7891234567890',
          Localizacao: 'Centro Hub - A1',
          Estoque_Minimo: 5,
          Status: 'Em Estoque',
          Data_Atualizacao: new Date().toISOString().split('T')[0],
          Ultima_Movimentacao: 'Entrada'
        },
        {
          ID: 'PROD002',
          Nome: 'Tablet iPad Air',
          Categoria: 'Eletrônicos',
          Quantidade: 8,
          Preço: 3299.99,
          Unidade: 'Unidade',
          Data_Fabricacao: '2024-02-10',
          Data_Vencimento: '',
          Fornecedor: 'Apple Brasil',
          Codigo_Barras: '7891234567891',
          Localizacao: 'Norte - B2',
          Estoque_Minimo: 3,
          Status: 'Em Estoque',
          Data_Atualizacao: new Date().toISOString().split('T')[0],
          Ultima_Movimentacao: 'Transferência'
        }
      ];

      await sheet.addRows(initialData);
    }

    return this.spreadsheetId;
  }

  // Sincronizar produto do sistema para Sheets
  async syncProductToSheets(product: any): Promise<void> {
    if (!this.doc) await this.connect();
    
    const sheet = this.doc!.sheetsByTitle['Estoque_MultiUnidades'];
    if (!sheet) {
      await this.createBaseSheet();
      return this.syncProductToSheets(product);
    }

    // Verificar se produto já existe
    const rows = await sheet.getRows();
    const existingRow = rows.find(row => row.get('ID') === product.id);

    const productData = {
      ID: product.id,
      Nome: product.name,
      Categoria: product.category,
      Quantidade: product.quantity,
      Preço: product.price,
      Unidade: product.unit || 'Unidade',
      Data_Fabricacao: product.manufacturingDate || new Date().toISOString().split('T')[0],
      Data_Vencimento: product.expiryDate || '',
      Fornecedor: product.supplier || 'N/A',
      Codigo_Barras: product.barcode || '',
      Localizacao: product.location || 'Centro Hub',
      Estoque_Minimo: product.minimumStock || 5,
      Status: product.quantity > 0 ? 'Em Estoque' : 'Esgotado',
      Data_Atualizacao: new Date().toISOString().split('T')[0],
      Ultima_Movimentacao: 'Sistema'
    };

    if (existingRow) {
      // Atualizar produto existente
      Object.keys(productData).forEach(key => {
        existingRow.set(key, productData[key as keyof typeof productData]);
      });
      await existingRow.save();
    } else {
      // Adicionar novo produto
      await sheet.addRow(productData);
    }
  }

  // Obter todos os produtos da planilha
  async getProductsFromSheets(): Promise<any[]> {
    if (!this.doc) await this.connect();
    
    const sheet = this.doc!.sheetsByTitle['Estoque_MultiUnidades'];
    if (!sheet) {
      await this.createBaseSheet();
      return this.getProductsFromSheets();
    }

    const rows = await sheet.getRows();
    
    return rows.map(row => ({
      id: row.get('ID'),
      name: row.get('Nome'),
      category: row.get('Categoria'),
      quantity: parseInt(row.get('Quantidade')) || 0,
      price: parseFloat(row.get('Preço')) || 0,
      unit: row.get('Unidade'),
      manufacturingDate: row.get('Data_Fabricacao'),
      expiryDate: row.get('Data_Vencimento'),
      supplier: row.get('Fornecedor'),
      barcode: row.get('Codigo_Barras'),
      location: row.get('Localizacao'),
      minimumStock: parseInt(row.get('Estoque_Minimo')) || 0,
      status: row.get('Status'),
      lastUpdated: row.get('Data_Atualizacao'),
      lastMovement: row.get('Ultima_Movimentacao')
    }));
  }

  // Atualizar estoque na planilha
  async updateStock(productId: string, newQuantity: number, movement: string): Promise<void> {
    if (!this.doc) await this.connect();
    
    const sheet = this.doc!.sheetsByTitle['Estoque_MultiUnidades'];
    if (!sheet) return;

    const rows = await sheet.getRows();
    const targetRow = rows.find(row => row.get('ID') === productId);

    if (targetRow) {
      targetRow.set('Quantidade', newQuantity);
      targetRow.set('Status', newQuantity > 0 ? 'Em Estoque' : 'Esgotado');
      targetRow.set('Data_Atualizacao', new Date().toISOString().split('T')[0]);
      targetRow.set('Ultima_Movimentacao', movement);
      await targetRow.save();
    }
  }

  // Obter estatísticas da planilha
  async getSheetStats(): Promise<any> {
    if (!this.doc) await this.connect();
    
    const sheet = this.doc!.sheetsByTitle['Estoque_MultiUnidades'];
    if (!sheet) return { totalProducts: 0, lowStock: 0, outOfStock: 0 };

    const rows = await sheet.getRows();
    
    const totalProducts = rows.length;
    const lowStock = rows.filter(row => {
      const qty = parseInt(row.get('Quantidade')) || 0;
      const min = parseInt(row.get('Estoque_Minimo')) || 0;
      return qty <= min && qty > 0;
    }).length;
    const outOfStock = rows.filter(row => (parseInt(row.get('Quantidade')) || 0) === 0).length;

    return {
      totalProducts,
      lowStock,
      outOfStock,
      inStock: totalProducts - outOfStock
    };
  }
}

export default GoogleSheetsManager;