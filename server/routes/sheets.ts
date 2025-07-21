import { Router } from 'express';
import GoogleSheetsManager from '../google-sheets';
import { getJuniorData } from '../../client/src/lib/juniorMockData';

const router = Router();

// Inicializar Google Sheets Manager
let sheetsManager: GoogleSheetsManager | null = null;

const initSheetsManager = () => {
  if (!sheetsManager) {
    sheetsManager = new GoogleSheetsManager();
  }
  return sheetsManager;
};

// Criar planilha base e sincronizar dados existentes
router.post('/init', async (req, res) => {
  try {
    const manager = initSheetsManager();
    const spreadsheetId = await manager.createBaseSheet();
    
    // Sincronizar dados existentes do Junior
    const juniorData = getJuniorData();
    for (const product of juniorData.products) {
      await manager.syncProductToSheets(product);
    }
    
    res.json({
      success: true,
      message: 'Planilha inicializada e dados sincronizados',
      spreadsheetId
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erro ao inicializar planilha',
      error: error.message
    });
  }
});

// Obter produtos da planilha
router.get('/products', async (req, res) => {
  try {
    const manager = initSheetsManager();
    const products = await manager.getProductsFromSheets();
    
    res.json({
      success: true,
      products
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar produtos da planilha',
      error: error.message
    });
  }
});

// Adicionar produto à planilha
router.post('/products', async (req, res) => {
  try {
    const manager = initSheetsManager();
    const product = req.body;
    
    // Gerar ID único se não fornecido
    if (!product.id) {
      product.id = 'PROD' + Date.now().toString().slice(-6);
    }
    
    await manager.syncProductToSheets(product);
    
    res.json({
      success: true,
      message: 'Produto adicionado à planilha',
      product
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erro ao adicionar produto',
      error: error.message
    });
  }
});

// Atualizar estoque na planilha
router.put('/products/:id/stock', async (req, res) => {
  try {
    const manager = initSheetsManager();
    const { id } = req.params;
    const { quantity, movement } = req.body;
    
    await manager.updateStock(id, quantity, movement || 'Ajuste Manual');
    
    res.json({
      success: true,
      message: 'Estoque atualizado na planilha'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar estoque',
      error: error.message
    });
  }
});

// Obter estatísticas da planilha
router.get('/stats', async (req, res) => {
  try {
    const manager = initSheetsManager();
    const stats = await manager.getSheetStats();
    
    res.json({
      success: true,
      stats
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter estatísticas',
      error: error.message
    });
  }
});

// Sincronizar produto específico
router.post('/products/:id/sync', async (req, res) => {
  try {
    const manager = initSheetsManager();
    const { id } = req.params;
    const product = req.body;
    
    await manager.syncProductToSheets({ ...product, id });
    
    res.json({
      success: true,
      message: 'Produto sincronizado com a planilha'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erro na sincronização',
      error: error.message
    });
  }
});

export default router;