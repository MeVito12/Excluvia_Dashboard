import React, { useState } from 'react';
import { useCategory } from '@/contexts/CategoryContext';
import { 
  getProductsByCategory, 
  getSalesByCategory, 
  getClientsByCategory,
  categoryProducts,
  categorySales,
  categoryClients,
  type Product,
  type Sale,
  type Client
} from '@/lib/mockData';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Calendar
} from 'lucide-react';

// Função para obter status do produto baseado no estoque e validade
const getProductStatus = (stock: number, minStock: number, expiryDate?: string) => {
  if (stock === 0) return 'Sem Estoque';
  if (expiryDate) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Vencido';
    if (diffDays <= 3) return 'Próximo ao Vencimento';
  }
  if (stock <= minStock) return 'Estoque Baixo';
  return 'Em Estoque';
};

const EstoqueSection = () => {
  const { selectedCategory } = useCategory();
  const [activeTab, setActiveTab] = useState('produtos');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [products, setProducts] = useState(() => getProductsByCategory(selectedCategory));
  
  // Atualizar produtos quando a categoria mudar
  React.useEffect(() => {
    setProducts(getProductsByCategory(selectedCategory));
  }, [selectedCategory]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    currentStock: '',
    manufacturingDate: '',
    expiryDate: '',
    isPerishable: false,
    category: 'Geral',
    price: '',
    minStock: '10'
  });
  const [sales, setSales] = useState(() => getSalesByCategory(selectedCategory));
  
  // Atualizar vendas quando a categoria mudar
  React.useEffect(() => {
    setSales(getSalesByCategory(selectedCategory));
  }, [selectedCategory]);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockProduct, setStockProduct] = useState<any>(null);
  const [stockAdjustment, setStockAdjustment] = useState({ quantity: '', operation: 'add', reason: '' });

  // Categorias que não têm sistema de estoque
  const categoriesWithoutStock = ['design', 'sites'];

  // Verificar se a categoria atual tem sistema de estoque
  const hasStockSystem = !categoriesWithoutStock.includes(selectedCategory);

  // Função para adicionar novo produto
  const addProduct = () => {
    if (!newProduct.name || !newProduct.currentStock) {
      alert('Por favor, preencha nome e estoque atual.');
      return;
    }

    // Validação para produtos perecíveis
    if (newProduct.isPerishable && (!newProduct.manufacturingDate || !newProduct.expiryDate)) {
      alert('Para produtos perecíveis, preencha a data de fabricação e validade.');
      return;
    }

    const product = {
      id: Date.now(),
      name: newProduct.name,
      stock: parseInt(newProduct.currentStock),
      minStock: parseInt(newProduct.minStock),
      price: parseFloat(newProduct.price) || 0,
      category: newProduct.category,
      isPerishable: newProduct.isPerishable,
      manufacturingDate: newProduct.isPerishable ? newProduct.manufacturingDate : null,
      expiryDate: newProduct.isPerishable ? newProduct.expiryDate : null,
      createdAt: new Date().toISOString()
    };

    setProducts(prev => [...prev, product]);
    setNewProduct({
      name: '',
      currentStock: '',
      manufacturingDate: '',
      expiryDate: '',
      isPerishable: false,
      category: 'Geral',
      price: '',
      minStock: '10'
    });
    setShowAddProductModal(false);
    alert(`✅ Produto "${product.name}" adicionado ao estoque com ${product.stock} unidades!`);
  };

  // Função para ajustar estoque manualmente
  const adjustStock = () => {
    if (!stockAdjustment.quantity || !stockProduct) {
      alert('Por favor, preencha a quantidade.');
      return;
    }

    const quantity = parseInt(stockAdjustment.quantity);
    const newStock = stockAdjustment.operation === 'add' 
      ? stockProduct.stock + quantity 
      : stockProduct.stock - quantity;

    if (newStock < 0) {
      alert('Estoque não pode ficar negativo.');
      return;
    }

    setProducts(prev => prev.map(p => 
      p.id === stockProduct.id 
        ? { ...p, stock: newStock }
        : p
    ));

    const operation = stockAdjustment.operation === 'add' ? 'adicionadas' : 'removidas';
    alert(`✅ ${quantity} unidades ${operation} do estoque de "${stockProduct.name}"`);
    
    setShowStockModal(false);
    setStockAdjustment({ quantity: '', operation: 'add', reason: '' });
  };

  // Função para processar venda e deduzir do estoque
  const processSale = (productId: number, quantitySold: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (product.stock < quantitySold) {
      alert(`Estoque insuficiente! Disponível: ${product.stock} unidades`);
      return;
    }

    setProducts(prev => prev.map(p => 
      p.id === productId 
        ? { ...p, stock: p.stock - quantitySold }
        : p
    ));

    // Registrar venda
    const sale = {
      id: Date.now(),
      productId,
      productName: product.name,
      quantity: quantitySold,
      unitPrice: product.price,
      total: product.price * quantitySold,
      date: new Date().toISOString()
    };

    setSales(prev => [...prev, sale]);
    alert(`✅ Venda processada: ${quantitySold} un. de "${product.name}"`);
  };

  // Função para calcular uso de ingredientes no cardápio
  const deductIngredients = (recipeId: number, portions: number = 1) => {
    // Mapeamento de receitas e ingredientes (exemplo para categoria alimentício)
    const recipes: any = {
      1: { // Pizza Margherita
        ingredients: [
          { productId: 1, quantity: 0.3 }, // Massa: 300g por pizza
          { productId: 2, quantity: 0.2 }, // Molho: 200g por pizza
          { productId: 3, quantity: 0.15 } // Queijo: 150g por pizza
        ]
      },
      2: { // Hambúrguer
        ingredients: [
          { productId: 4, quantity: 0.2 }, // Pão: 200g por hambúrguer
          { productId: 5, quantity: 0.15 }, // Carne: 150g por hambúrguer
          { productId: 6, quantity: 0.05 } // Verduras: 50g por hambúrguer
        ]
      }
    };

    const recipe = recipes[recipeId];
    if (!recipe) return;

    recipe.ingredients.forEach((ingredient: any) => {
      const quantityNeeded = ingredient.quantity * portions;
      const product = products.find(p => p.id === ingredient.productId);
      
      if (product && product.stock >= quantityNeeded) {
        setProducts(prev => prev.map(p => 
          p.id === ingredient.productId 
            ? { ...p, stock: p.stock - quantityNeeded }
            : p
        ));
      }
    });
  };

  // Funções operacionais para produtos
  const replenishStock = (productId: number) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, stock: product.stock + 50 }
          : product
      )
    );
    alert('✅ Estoque reposto com sucesso!\n\n+50 unidades adicionadas ao produto.');
  };

  const markAsExpired = (productId: number) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, stock: 0, status: 'Vencido' }
          : product
      )
    );
    alert('⚠️ Produto marcado como vencido!\n\nEstoque zerado automaticamente.');
  };

  // Função para editar produto
  const editProduct = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setEditingProduct(product);
      setShowEditModal(true);
    }
  };

  // Função para salvar produto editado
  const saveEditedProduct = (editedProduct: any) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === editedProduct.id ? editedProduct : product
      )
    );
    setShowEditModal(false);
    setEditingProduct(null);
    alert('✅ Produto atualizado com sucesso!');
  };

  // Função para excluir produto
  const deleteProduct = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product && confirm(`⚠️ Confirma a exclusão do produto "${product.name}"?\n\nEsta ação não pode ser desfeita.`)) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      alert('🗑️ Produto excluído com sucesso!');
    }
  };

  const addNewProduct = () => {
    const newId = Math.max(...products.map(p => p.id)) + 1;
    const newProduct = {
      id: newId,
      name: 'Novo Produto',
      category: 'Geral',
      stock: 0,
      minStock: 5,
      price: 10.00,
      isPerishable: false,
      status: 'Sem Estoque'
    };
    
    setProducts(prev => [...prev, newProduct]);
    alert('✅ Novo produto adicionado com sucesso!\n\nVocê pode editar os detalhes clicando no botão de edição.');
  };



  // Apenas aba de produtos
  const tabs = [
    { id: 'produtos', label: 'Produtos', icon: Package }
  ];

  // Função para calcular dias até o vencimento
  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Função para determinar status do produto
  const getProductStatus = (stock: number, minStock: number, expiryDate?: string) => {
    if (expiryDate) {
      const daysLeft = getDaysUntilExpiry(expiryDate);
      if (daysLeft <= 0) return 'Vencido';
      if (daysLeft <= 3) return 'Vencimento Próximo';
    }
    if (stock <= 0) return 'Sem Estoque';
    if (stock <= minStock) return 'Estoque Baixo';
    return 'Em Estoque';
  };

  // Usar dados específicos do mockData.ts e atualizar para uso automático
  const getProductData = () => {
    // Usar dados centralizados do mockData.ts automaticamente
    return getProductsByCategory(selectedCategory);
  };

  // Função mockada original como fallback (remover depois)
  const getProductDataOld = () => {
    if (selectedCategory === 'alimenticio') {
      return [
        { 
          id: 1, 
          name: 'Pizza Margherita', 
          category: 'Pizzas', 
          stock: 50, 
          minStock: 10, 
          price: 35.00, 
          isPerishable: true,
          expiryDate: '2025-02-15',
          status: getProductStatus(50, 10, '2025-02-15')
        },
        { 
          id: 2, 
          name: 'Hambúrguer Artesanal', 
          category: 'Hambúrgueres', 
          stock: 25, 
          minStock: 8, 
          price: 28.00,
          isPerishable: true,
          expiryDate: '2025-01-14',
          status: getProductStatus(25, 8, '2025-01-14')
        },
        { 
          id: 3, 
          name: 'Refrigerante 350ml', 
          category: 'Bebidas', 
          stock: 3, 
          minStock: 20, 
          price: 5.00,
          isPerishable: true,
          expiryDate: '2025-06-15',
          status: getProductStatus(3, 20, '2025-06-15')
        },
        { 
          id: 4, 
          name: 'Sorvete Chocolate', 
          category: 'Sobremesas', 
          stock: 0, 
          minStock: 5, 
          price: 12.00,
          isPerishable: true,
          expiryDate: '2025-03-20',
          status: getProductStatus(0, 5, '2025-03-20')
        },
        { 
          id: 5, 
          name: 'Leite Integral 1L', 
          category: 'Bebidas', 
          stock: 15, 
          minStock: 10, 
          price: 4.50,
          isPerishable: true,
          expiryDate: '2025-01-25',
          status: getProductStatus(15, 10, '2025-01-25')
        },
        { 
          id: 6, 
          name: 'Pão Francês', 
          category: 'Padaria', 
          stock: 80, 
          minStock: 20, 
          price: 0.75,
          isPerishable: true,
          expiryDate: '2025-07-10',
          status: getProductStatus(80, 20, '2025-07-10')
        },
        { 
          id: 7, 
          name: 'Queijo Mussarela', 
          category: 'Laticínios', 
          stock: 12, 
          minStock: 8, 
          price: 22.90,
          isPerishable: true,
          expiryDate: '2025-02-10',
          status: getProductStatus(12, 8, '2025-02-10')
        },
        { 
          id: 8, 
          name: 'Suco Natural Laranja', 
          category: 'Bebidas', 
          stock: 30, 
          minStock: 15, 
          price: 8.50,
          isPerishable: true,
          expiryDate: '2025-01-15',
          status: getProductStatus(30, 15, '2025-01-15')
        },
        { 
          id: 9, 
          name: 'Lasanha Bolonhesa', 
          category: 'Massas', 
          stock: 18, 
          minStock: 5, 
          price: 32.50,
          isPerishable: true,
          expiryDate: '2025-01-16',
          status: getProductStatus(18, 5, '2025-01-16')
        },
        { 
          id: 10, 
          name: 'Brownie Chocolate', 
          category: 'Sobremesas', 
          stock: 15, 
          minStock: 5, 
          price: 12.90,
          isPerishable: true,
          expiryDate: '2025-01-22',
          status: getProductStatus(15, 5, '2025-01-22')
        }
      ];
    } else if (selectedCategory === 'vendas') {
      return [
        { 
          id: 1, 
          name: 'Smartphone Galaxy S24', 
          category: 'Eletrônicos', 
          stock: 15, 
          minStock: 5, 
          price: 2899.99,
          isPerishable: false,
          expiryDate: undefined,
          status: getProductStatus(15, 5)
        },
        { 
          id: 2, 
          name: 'Notebook Dell Inspiron', 
          category: 'Eletrônicos', 
          stock: 8, 
          minStock: 3, 
          price: 2499.99,
          isPerishable: false,
          expiryDate: undefined,
          status: getProductStatus(8, 3)
        },
        { 
          id: 3, 
          name: 'Camiseta Polo Ralph Lauren', 
          category: 'Vestuário', 
          stock: 2, 
          minStock: 10, 
          price: 189.99,
          isPerishable: false,
          expiryDate: undefined,
          status: getProductStatus(2, 10)
        },
        { 
          id: 4, 
          name: 'Fone Bluetooth Sony', 
          category: 'Eletrônicos', 
          stock: 25, 
          minStock: 8, 
          price: 349.99,
          isPerishable: false,
          expiryDate: undefined,
          status: getProductStatus(25, 8)
        },
        { 
          id: 5, 
          name: 'Tênis Nike Air Max', 
          category: 'Calçados', 
          stock: 0, 
          minStock: 5, 
          price: 599.99,
          isPerishable: false,
          expiryDate: undefined,
          status: getProductStatus(0, 5)
        },
        { 
          id: 6, 
          name: 'Relógio Smartwatch', 
          category: 'Eletrônicos', 
          stock: 12, 
          minStock: 4, 
          price: 899.99,
          isPerishable: false,
          expiryDate: undefined,
          status: getProductStatus(12, 4)
        },
        { 
          id: 7, 
          name: 'Jaqueta Jeans', 
          category: 'Vestuário', 
          stock: 18, 
          minStock: 6, 
          price: 159.99,
          isPerishable: false,
          expiryDate: undefined,
          status: getProductStatus(18, 6)
        },
        { 
          id: 8, 
          name: 'Mouse Gamer RGB', 
          category: 'Eletrônicos', 
          stock: 3, 
          minStock: 15, 
          price: 129.99,
          isPerishable: false,
          expiryDate: undefined,
          status: getProductStatus(3, 15)
        }
      ];
    }
    // Dados específicos para outras categorias
    if (selectedCategory === 'pet') {
      return [
        { 
          id: 1, 
          name: 'Ração Premium Golden', 
          category: 'Ração', 
          stock: 45, 
          minStock: 15, 
          price: 89.90,
          isPerishable: true,
          expiryDate: '2025-08-15',
          status: getProductStatus(45, 15, '2025-08-15')
        },
        { 
          id: 2, 
          name: 'Vacina V10 Cães', 
          category: 'Medicamentos', 
          stock: 8, 
          minStock: 5, 
          price: 85.00,
          isPerishable: true,
          expiryDate: '2025-03-20',
          status: getProductStatus(8, 5, '2025-03-20')
        },
        { 
          id: 3, 
          name: 'Coleira Antipulgas', 
          category: 'Acessórios', 
          stock: 2, 
          minStock: 10, 
          price: 35.50,
          isPerishable: false,
          expiryDate: undefined,
          status: getProductStatus(2, 10)
        },
        { 
          id: 4, 
          name: 'Shampoo para Cães', 
          category: 'Higiene', 
          stock: 22, 
          minStock: 8, 
          price: 24.90,
          isPerishable: false,
          expiryDate: undefined,
          status: getProductStatus(22, 8)
        },
        { 
          id: 5, 
          name: 'Brinquedo Kong Classic', 
          category: 'Brinquedos', 
          stock: 0, 
          minStock: 6, 
          price: 45.00,
          isPerishable: false,
          expiryDate: undefined,
          status: getProductStatus(0, 6)
        }
      ];
    } else if (selectedCategory === 'farmacia') {
      return [
        { 
          id: 1, 
          name: 'Dipirona 500mg', 
          category: 'Analgésicos', 
          stock: 250, 
          minStock: 80, 
          price: 15.90,
          isPerishable: true,
          expiryDate: '2025-11-20',
          status: getProductStatus(250, 80, '2025-11-20')
        },
        { 
          id: 2, 
          name: 'Amoxicilina 500mg', 
          category: 'Antibióticos', 
          stock: 95, 
          minStock: 30, 
          price: 28.00,
          isPerishable: true,
          expiryDate: '2025-08-15',
          status: getProductStatus(95, 30, '2025-08-15')
        },
        { 
          id: 3, 
          name: 'Omeprazol 20mg', 
          category: 'Gástrico', 
          stock: 140, 
          minStock: 45, 
          price: 16.80,
          isPerishable: true,
          expiryDate: '2025-10-10',
          status: getProductStatus(140, 45, '2025-10-10')
        },
        { 
          id: 4, 
          name: 'Losartana 50mg', 
          category: 'Cardiovascular', 
          stock: 85, 
          minStock: 25, 
          price: 12.90,
          isPerishable: true,
          expiryDate: '2025-09-20',
          status: getProductStatus(85, 25, '2025-09-20')
        },
        { 
          id: 5, 
          name: 'Vitamina D3 2000UI', 
          category: 'Suplementos', 
          stock: 75, 
          minStock: 25, 
          price: 35.90,
          isPerishable: false,
          expiryDate: '2026-02-15',
          status: getProductStatus(75, 25, '2026-02-15')
        }
      ];
    } else if (selectedCategory === 'medico') {
      return [
        { 
          id: 1, 
          name: 'Consulta Cardiológica', 
          category: 'Consultas', 
          stock: 12, 
          minStock: 5, 
          price: 280.00,
          isPerishable: false,
          expiryDate: undefined,
          status: getProductStatus(12, 5)
        },
        { 
          id: 2, 
          name: 'Soro Fisiológico 500ml', 
          category: 'Soros', 
          stock: 25, 
          minStock: 20, 
          price: 8.90,
          isPerishable: true,
          expiryDate: '2026-01-15',
          status: getProductStatus(25, 20, '2026-01-15')
        },
        { 
          id: 3, 
          name: 'Termômetro Digital', 
          category: 'Equipamentos', 
          stock: 5, 
          minStock: 3, 
          price: 35.00,
          isPerishable: false,
          expiryDate: undefined,
          status: getProductStatus(5, 3)
        },
        { 
          id: 4, 
          name: 'Antibiótico Amoxicilina', 
          category: 'Antibióticos', 
          stock: 0, 
          minStock: 15, 
          price: 28.90,
          isPerishable: true,
          expiryDate: '2025-04-10',
          status: getProductStatus(0, 15, '2025-04-10')
        },
        { 
          id: 5, 
          name: 'Máscara Cirúrgica', 
          category: 'EPI', 
          stock: 500, 
          minStock: 100, 
          price: 0.85,
          isPerishable: false,
          expiryDate: undefined,
          status: getProductStatus(500, 100)
        },
        { 
          id: 6, 
          name: 'Seringa 10ml', 
          category: 'Descartáveis', 
          stock: 3, 
          minStock: 50, 
          price: 1.20,
          isPerishable: true,
          expiryDate: '2027-12-31',
          status: getProductStatus(3, 50, '2027-12-31')
        }
      ];
    } else if (selectedCategory === 'tecnologia') {
      return [
        { 
          id: 1, 
          name: 'Processador Intel i7', 
          category: 'Componentes', 
          stock: 12, 
          minStock: 5, 
          price: 1899.99,
          isPerishable: false,
          expiryDate: undefined,
          status: getProductStatus(12, 5)
        },
        { 
          id: 2, 
          name: 'Placa de Vídeo RTX 4060', 
          category: 'Componentes', 
          stock: 3, 
          minStock: 8, 
          price: 2499.99,
          isPerishable: false,
          expiryDate: undefined,
          status: getProductStatus(3, 8)
        },
        { 
          id: 3, 
          name: 'SSD 1TB Samsung', 
          category: 'Armazenamento', 
          stock: 25, 
          minStock: 10, 
          price: 459.99,
          isPerishable: false,
          expiryDate: undefined,
          status: getProductStatus(25, 10)
        },
        { 
          id: 4, 
          name: 'Monitor 27" 144Hz', 
          category: 'Monitores', 
          stock: 0, 
          minStock: 4, 
          price: 1299.99,
          isPerishable: false,
          expiryDate: undefined,
          status: getProductStatus(0, 4)
        },
        { 
          id: 5, 
          name: 'Cabo HDMI 2.1', 
          category: 'Cabos', 
          stock: 45, 
          minStock: 20, 
          price: 35.90,
          isPerishable: false,
          expiryDate: undefined,
          status: getProductStatus(45, 20)
        }
      ];
    } else if (selectedCategory === 'educacao') {
      return [
        { 
          id: 1, 
          name: 'Livro Matemática Básica', 
          category: 'Livros', 
          stock: 80, 
          minStock: 25, 
          price: 45.90,
          isPerishable: false,
          expiryDate: undefined,
          status: getProductStatus(80, 25)
        },
        { 
          id: 2, 
          name: 'Kit Laboratório Química', 
          category: 'Material Didático', 
          stock: 6, 
          minStock: 3, 
          price: 189.90,
          isPerishable: false,
          expiryDate: undefined,
          status: getProductStatus(6, 3)
        },
        { 
          id: 3, 
          name: 'Caneta Esferográfica Azul', 
          category: 'Material Escolar', 
          stock: 2, 
          minStock: 100, 
          price: 1.50,
          isPerishable: false,
          expiryDate: undefined,
          status: getProductStatus(2, 100)
        },
        { 
          id: 4, 
          name: 'Projetor Multimídia', 
          category: 'Equipamentos', 
          stock: 5, 
          minStock: 2, 
          price: 1899.99,
          isPerishable: false,
          expiryDate: undefined,
          status: getProductStatus(5, 2)
        },
        { 
          id: 5, 
          name: 'Papel A4 500 folhas', 
          category: 'Papelaria', 
          stock: 0, 
          minStock: 20, 
          price: 25.90,
          isPerishable: false,
          expiryDate: undefined,
          status: getProductStatus(0, 20)
        }
      ];
    } else if (selectedCategory === 'beleza') {
      return [
        { 
          id: 1, 
          name: 'Shampoo Hidratante L\'Oréal', 
          category: 'Cabelos', 
          stock: 35, 
          minStock: 15, 
          price: 32.90,
          isPerishable: true,
          expiryDate: '2026-03-15',
          status: getProductStatus(35, 15, '2026-03-15')
        },
        { 
          id: 2, 
          name: 'Base Líquida Ruby Rose', 
          category: 'Maquiagem', 
          stock: 18, 
          minStock: 8, 
          price: 24.90,
          isPerishable: true,
          expiryDate: '2025-09-20',
          status: getProductStatus(18, 8, '2025-09-20')
        },
        { 
          id: 3, 
          name: 'Perfume Boticário 100ml', 
          category: 'Perfumaria', 
          stock: 3, 
          minStock: 12, 
          price: 89.90,
          isPerishable: true,
          expiryDate: '2027-01-10',
          status: getProductStatus(3, 12, '2027-01-10')
        },
        { 
          id: 4, 
          name: 'Esmalte Colorama', 
          category: 'Unhas', 
          stock: 0, 
          minStock: 20, 
          price: 8.90,
          isPerishable: true,
          expiryDate: '2025-12-31',
          status: getProductStatus(0, 20, '2025-12-31')
        },
        { 
          id: 5, 
          name: 'Creme Anti-idade Nivea', 
          category: 'Cuidados', 
          stock: 25, 
          minStock: 10, 
          price: 45.50,
          isPerishable: true,
          expiryDate: '2025-08-15',
          status: getProductStatus(25, 10, '2025-08-15')
        },
        { 
          id: 6, 
          name: 'Protetor Solar FPS 60', 
          category: 'Cuidados', 
          stock: 12, 
          minStock: 8, 
          price: 35.90,
          isPerishable: true,
          expiryDate: '2025-06-30',
          status: getProductStatus(12, 8, '2025-06-30')
        }
      ];
    } else if (selectedCategory === 'estetica') {
      return [
        { 
          id: 1, 
          name: 'Ácido Hialurônico Restylane', 
          category: 'Injetáveis', 
          stock: 15, 
          minStock: 5, 
          price: 320.00,
          isPerishable: true,
          expiryDate: '2025-12-30',
          status: getProductStatus(15, 5, '2025-12-30')
        },
        { 
          id: 2, 
          name: 'Botox Allergan 100U', 
          category: 'Injetáveis', 
          stock: 8, 
          minStock: 3, 
          price: 480.00,
          isPerishable: true,
          expiryDate: '2025-08-15',
          status: getProductStatus(8, 3, '2025-08-15')
        },
        { 
          id: 3, 
          name: 'Peeling Químico TCA', 
          category: 'Tratamentos', 
          stock: 25, 
          minStock: 10, 
          price: 180.00,
          isPerishable: true,
          expiryDate: '2026-05-20',
          status: getProductStatus(25, 10, '2026-05-20')
        },
        { 
          id: 4, 
          name: 'Fios de PDO', 
          category: 'Lifting', 
          stock: 3, 
          minStock: 15, 
          price: 45.00,
          isPerishable: false,
          expiryDate: '2027-01-10',
          status: getProductStatus(3, 15, '2027-01-10')
        },
        { 
          id: 5, 
          name: 'Microagulhas Dermapen', 
          category: 'Equipamentos', 
          stock: 200, 
          minStock: 50, 
          price: 2.50,
          isPerishable: false,
          expiryDate: undefined,
          status: getProductStatus(200, 50)
        },
        { 
          id: 6, 
          name: 'Sérum Vitamina C', 
          category: 'Cosméticos', 
          stock: 0, 
          minStock: 20, 
          price: 89.90,
          isPerishable: true,
          expiryDate: '2025-09-30',
          status: getProductStatus(0, 20, '2025-09-30')
        }
      ];
    }
    
    return [
      { 
        id: 1, 
        name: 'Produto Geral', 
        category: 'Geral', 
        stock: 10, 
        minStock: 5, 
        price: 50.00,
        isPerishable: false,
        expiryDate: undefined,
        status: getProductStatus(10, 5)
      }
    ];
  };

  const getSalesData = () => {
    if (selectedCategory === 'alimenticio') {
      return [
        { id: 1, date: '2024-12-25', client: 'João Silva', items: ['Pizza Margherita x2'], total: 70.00, status: 'Concluída' },
        { id: 2, date: '2024-12-24', client: 'Maria Santos', items: ['Hambúrguer x1', 'Refrigerante x2'], total: 38.00, status: 'Concluída' },
        { id: 3, date: '2024-12-23', client: 'Carlos Oliveira', items: ['Pizza Margherita x1'], total: 35.00, status: 'Pendente' }
      ];
    } else if (selectedCategory === 'vendas') {
      return [
        { id: 1, date: '2024-12-25', client: 'Ana Costa', items: ['Smartphone Galaxy S24'], total: 2899.99, status: 'Concluída' },
        { id: 2, date: '2024-12-24', client: 'Pedro Lima', items: ['Notebook Dell', 'Camiseta Polo'], total: 2689.98, status: 'Concluída' },
        { id: 3, date: '2024-12-23', client: 'Lucia Ferreira', items: ['Camiseta Polo x2'], total: 379.98, status: 'Pendente' }
      ];
    } else if (selectedCategory === 'estetica') {
      return [
        { id: 1, date: '2024-12-25', client: 'Fernanda Reis', items: ['Ácido Hialurônico x2'], total: 640.00, status: 'Concluída' },
        { id: 2, date: '2024-12-24', client: 'Juliana Santos', items: ['Botox x1', 'Peeling Químico x1'], total: 660.00, status: 'Concluída' },
        { id: 3, date: '2024-12-23', client: 'Patricia Lima', items: ['Fios de PDO x10'], total: 450.00, status: 'Concluída' },
        { id: 4, date: '2024-12-22', client: 'Carolina Souza', items: ['Sérum Vitamina C x2'], total: 179.80, status: 'Pendente' }
      ];
    }
    return [
      { id: 1, date: '2024-12-25', client: 'Cliente', items: ['Produto'], total: 50.00, status: 'Concluída' }
    ];
  };

  const getClientData = () => {
    if (selectedCategory === 'alimenticio') {
      return [
        { id: 1, name: 'João Silva', email: 'joao@email.com', phone: '(11) 99999-9999', lastOrder: '2024-12-25', totalSpent: 450.00, status: 'Ativo' },
        { id: 2, name: 'Maria Santos', email: 'maria@email.com', phone: '(11) 88888-8888', lastOrder: '2024-12-24', totalSpent: 280.00, status: 'Ativo' },
        { id: 3, name: 'Carlos Oliveira', email: 'carlos@email.com', phone: '(11) 77777-7777', lastOrder: '2024-12-20', totalSpent: 120.00, status: 'Inativo' }
      ];
    } else if (selectedCategory === 'vendas') {
      return [
        { id: 1, name: 'Ana Costa', email: 'ana@email.com', phone: '(11) 99999-9999', lastOrder: '2024-12-25', totalSpent: 8500.00, status: 'Ativo' },
        { id: 2, name: 'Pedro Lima', email: 'pedro@email.com', phone: '(11) 88888-8888', lastOrder: '2024-12-24', totalSpent: 3200.00, status: 'Ativo' },
        { id: 3, name: 'Lucia Ferreira', email: 'lucia@email.com', phone: '(11) 77777-7777', lastOrder: '2024-12-20', totalSpent: 750.00, status: 'Ativo' }
      ];
    } else if (selectedCategory === 'estetica') {
      return [
        { id: 1, name: 'Fernanda Reis', email: 'fernanda@email.com', phone: '(11) 99999-1111', lastOrder: '2024-12-25', totalSpent: 1820.00, status: 'Ativo' },
        { id: 2, name: 'Juliana Santos', email: 'juliana@email.com', phone: '(11) 99999-2222', lastOrder: '2024-12-24', totalSpent: 980.00, status: 'Ativo' },
        { id: 3, name: 'Patricia Lima', email: 'patricia@email.com', phone: '(11) 99999-3333', lastOrder: '2024-12-23', totalSpent: 1350.00, status: 'Ativo' },
        { id: 4, name: 'Carolina Souza', email: 'carolina@email.com', phone: '(11) 99999-4444', lastOrder: '2024-12-22', totalSpent: 560.00, status: 'Ativo' },
        { id: 5, name: 'Beatriz Oliveira', email: 'beatriz@email.com', phone: '(11) 99999-5555', lastOrder: '2024-12-15', totalSpent: 2100.00, status: 'Inativo' }
      ];
    }
    return [
      { id: 1, name: 'Cliente Geral', email: 'cliente@email.com', phone: '(11) 99999-9999', lastOrder: '2024-12-25', totalSpent: 100.00, status: 'Ativo' }
    ];
  };

  const renderProducts = () => (
    <div className="animate-fade-in">
      <div className="main-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Gestão de Produtos</h3>
          <button 
            onClick={() => setShowAddProductModal(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4" />
            Adicionar Produto
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="modern-input pl-10"
            />
          </div>
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="modern-input w-48"
          >
            <option value="all">Todas as categorias</option>
            {selectedCategory === 'alimenticio' && (
              <>
                <option value="pizzas">Pizzas</option>
                <option value="hamburgueres">Hambúrgueres</option>
                <option value="bebidas">Bebidas</option>
                <option value="sobremesas">Sobremesas</option>
                <option value="padaria">Padaria</option>
                <option value="laticinios">Laticínios</option>
              </>
            )}
            {selectedCategory === 'vendas' && (
              <>
                <option value="eletronicos">Eletrônicos</option>
                <option value="vestuario">Vestuário</option>
                <option value="calcados">Calçados</option>
              </>
            )}
            {selectedCategory === 'pet' && (
              <>
                <option value="racao">Ração</option>
                <option value="medicamentos">Medicamentos</option>
                <option value="acessorios">Acessórios</option>
                <option value="higiene">Higiene</option>
                <option value="brinquedos">Brinquedos</option>
              </>
            )}
            {selectedCategory === 'medico' && (
              <>
                <option value="analgesicos">Analgésicos</option>
                <option value="antibioticos">Antibióticos</option>
                <option value="equipamentos">Equipamentos</option>
                <option value="descartaveis">Descartáveis</option>
                <option value="epi">EPI</option>
              </>
            )}
            {selectedCategory === 'tecnologia' && (
              <>
                <option value="componentes">Componentes</option>
                <option value="monitores">Monitores</option>
                <option value="armazenamento">Armazenamento</option>
                <option value="cabos">Cabos</option>
              </>
            )}
            {selectedCategory === 'educacao' && (
              <>
                <option value="livros">Livros</option>
                <option value="material-didatico">Material Didático</option>
                <option value="material-escolar">Material Escolar</option>
                <option value="equipamentos">Equipamentos</option>
                <option value="papelaria">Papelaria</option>
              </>
            )}
            {selectedCategory === 'beleza' && (
              <>
                <option value="cabelos">Cabelos</option>
                <option value="maquiagem">Maquiagem</option>
                <option value="perfumaria">Perfumaria</option>
                <option value="unhas">Unhas</option>
                <option value="cuidados">Cuidados</option>
              </>
            )}
          </select>
        </div>

        <div className="item-list">
          {getProductData().map((product) => (
            <div key={product.id} className="list-item">
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  product.status === 'Vencido' ? 'bg-red-100' :
                  product.status === 'Vencimento Próximo' ? 'bg-yellow-100' :
                  product.status === 'Estoque Baixo' ? 'bg-orange-100' : 'bg-gray-100'
                }`}>
                  {product.status === 'Vencido' || product.status === 'Vencimento Próximo' ? (
                    <AlertTriangle className={`w-6 h-6 ${
                      product.status === 'Vencido' ? 'text-red-600' : 'text-yellow-600'
                    }`} />
                  ) : (
                    <Package className="w-6 h-6 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-800">{product.name}</h4>
                    {product.isPerishable && (
                      <Clock className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Categoria: {product.category}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-sm text-gray-600">
                      Estoque: <span className={`font-medium ${
                        product.stock <= product.minStock ? 'text-red-600' : 'text-green-600'
                      }`}>{product.stock}</span> / Mín: {product.minStock}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">R$ {product.price.toFixed(2)}</p>
                  <span className={`badge ${
                    product.status === 'Em Estoque' ? 'badge-success' : 
                    product.status === 'Estoque Baixo' ? 'badge-warning' : 
                    product.status === 'Vencimento Próximo' ? 'badge-warning' :
                    product.status === 'Sem Estoque' ? 'badge-error' :
                    'badge-error'
                  }`}>
                    {product.status}
                  </span>
                  <div className="mt-1 flex justify-center">
                    {product.status === 'Vencido' && (
                      <AlertTriangle className="w-4 h-4 text-red-500" title="Produto vencido" />
                    )}
                    {product.status === 'Vencimento Próximo' && (
                      <Clock className="w-4 h-4 text-yellow-500" title="Vencimento próximo" />
                    )}
                    {product.status === 'Estoque Baixo' && (
                      <Package className="w-4 h-4 text-orange-500" title="Estoque baixo" />
                    )}
                    {product.status === 'Sem Estoque' && (
                      <XCircle className="w-4 h-4 text-red-600" title="Sem estoque" />
                    )}
                    {product.status === 'Em Estoque' && (
                      <CheckCircle className="w-4 h-4 text-green-500" title="Em estoque" />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setStockProduct(product);
                    setShowStockModal(true);
                  }}
                  className="btn btn-outline p-2" 
                  title="Controlar estoque"
                >
                  <Package className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    const quantity = parseInt(prompt(`Quantas unidades de "${product.name}" foram vendidas?`) || '0');
                    if (quantity > 0) {
                      processSale(product.id, quantity);
                    }
                  }}
                  className="btn btn-outline p-2" 
                  title="Processar venda"
                >
                  <DollarSign className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => editProduct(product.id)}
                  className="btn btn-outline p-2" 
                  title="Editar produto"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => deleteProduct(product.id)}
                  className="btn btn-outline p-2 text-red-600 hover:text-red-700 hover:bg-red-50" 
                  title="Excluir produto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {product.stock <= product.minStock && (
                  <button 
                    onClick={() => replenishStock(product.id)}
                    className="btn btn-primary p-2" 
                    title="Reabastecer estoque"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSales = () => (
    <div className="animate-fade-in">
      <div className="main-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Histórico de Vendas</h3>
          <button className="btn btn-primary">
            <Plus className="w-4 h-4" />
            Nova Venda
          </button>
        </div>

        <div className="item-list">
          {getSalesData().map((sale) => (
            <div key={sale.id} className="list-item">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">Venda #{sale.id}</h4>
                  <p className="text-sm text-gray-600">Cliente: {sale.client}</p>
                  <p className="text-sm text-gray-600">Data: {sale.date}</p>
                  <p className="text-sm text-gray-600">Items: {sale.items.join(', ')}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">R$ {sale.total.toFixed(2)}</p>
                  <span className={`badge ${
                    sale.status === 'Concluída' ? 'badge-success' : 
                    sale.status === 'Pendente' ? 'badge-warning' : 'badge-error'
                  }`}>
                    {sale.status}
                  </span>
                </div>
              </div>
              <button className="btn btn-outline p-2">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="animate-fade-in">
      <div className="main-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Base de Clientes</h3>
          <button className="btn btn-primary">
            <Plus className="w-4 h-4" />
            Adicionar Cliente
          </button>
        </div>

        <div className="item-list">
          {getClientData().map((client) => (
            <div key={client.id} className="list-item">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{client.name}</h4>
                  <p className="text-sm text-gray-600">Email: {client.email}</p>
                  <p className="text-sm text-gray-600">Telefone: {client.phone}</p>
                  <p className="text-sm text-gray-600">Último pedido: {client.lastOrder}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">R$ {client.totalSpent.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mb-1">Total gasto</p>
                  <span className={`badge ${client.status === 'Ativo' ? 'badge-success' : 'badge-warning'}`}>
                    {client.status}
                  </span>
                </div>
              </div>
              <button className="btn btn-outline p-2">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="animate-fade-in">
      <div className="content-grid">
        <div className="main-card p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Relatórios de Vendas</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Vendas Hoje</span>
              <span className="font-medium text-gray-900">R$ 6.499,97</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Vendas Esta Semana</span>
              <span className="font-medium text-gray-900">R$ 15.299,95</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Meta Mensal</span>
              <span className="font-medium text-gray-900">R$ 50.000,00</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
            <p className="text-xs text-gray-500">30% da meta atingida</p>
          </div>
        </div>

        <div className="main-card p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Produtos Mais Vendidos</h3>
          <div className="space-y-3">
            {getProductData().slice(0, 3).map((product, index) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                  <span className="text-sm text-gray-600">{product.name}</span>
                </div>
                <span className="font-medium text-gray-900">{Math.floor(Math.random() * 20) + 5} unidades</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="main-card p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h4 className="font-medium text-gray-800">Exportar Relatórios</h4>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button 
            onClick={() => {
              const csvContent = `"Relatório","Relatório Diário"\n"Período","${new Date().toLocaleDateString('pt-BR')}"\n"Total de Vendas","R$ 6.499,97"\n"Transações","45 vendas"`;
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = `daily_report_${new Date().toISOString().split('T')[0]}.csv`;
              link.click();
              alert('📊 Relatório Diário exportado!\n\nArquivo CSV baixado com dados de hoje.');
            }}
            className="btn btn-primary"
          >
            <Calendar className="w-4 h-4" />
            Relatório Diário
          </button>
          <button 
            onClick={() => {
              const csvContent = `"Relatório","Relatório Semanal"\n"Período","Última semana"\n"Total de Vendas","R$ 15.299,95"\n"Transações","127 vendas"`;
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = `weekly_report_${new Date().toISOString().split('T')[0]}.csv`;
              link.click();
              alert('📊 Relatório Semanal exportado!\n\nArquivo CSV baixado com dados da semana.');
            }}
            className="btn btn-secondary"
          >
            <Calendar className="w-4 h-4" />
            Relatório Semanal
          </button>
          <button 
            onClick={() => {
              const csvContent = `"Relatório","Relatório Mensal"\n"Período","Este mês"\n"Total de Vendas","R$ 45.899,20"\n"Transações","389 vendas"`;
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = `monthly_report_${new Date().toISOString().split('T')[0]}.csv`;
              link.click();
              alert('📊 Relatório Mensal exportado!\n\nArquivo CSV baixado com dados do mês.');
            }}
            className="btn btn-outline"
          >
            <Calendar className="w-4 h-4" />
            Relatório Mensal
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-blue-600" />
          <h4 className="font-medium text-gray-800">Notificações Instantâneas</h4>
        </div>
        <p className="text-sm text-gray-600">
          Você receberá alertas automáticos para: estoque baixo, produtos vencendo, novas vendas e clientes inativos.
        </p>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'produtos':
        return renderProducts();

      default:
        return renderProducts();
    }
  };

  // Se a categoria não tem sistema de estoque, mostrar mensagem
  if (!hasStockSystem) {
    return (
      <div className="app-section">
        <div className="section-header">
          <h1 className="section-title">Gestão de Portfólio</h1>
          <p className="section-subtitle">
            Esta categoria utiliza portfólio de serviços - sem controle de estoque físico
          </p>
        </div>

        <div className="main-card p-8 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Categoria de Serviços
          </h3>
          <p className="text-gray-600 mb-4">
            {selectedCategory === 'design' ? 'Design Gráfico' : 'Criação de Sites'} trabalha com 
            portfólio de serviços. O catálogo é gerenciado diretamente na seção Atendimento.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Gestão automatizada:</strong> Seus serviços do portfólio aparecem automaticamente 
              no catálogo da seção Atendimento para compartilhamento com clientes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-section">
      <div className="section-header">
        <h1 className="section-title">Gestão de Estoque</h1>
        <p className="section-subtitle">
          Controle de produtos e inventário
        </p>
      </div>

      {/* Métricas de Estoque */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Produtos</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">126</p>
              <p className="text-xs text-green-600 mt-1">+5 esta semana</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">R$ 18.240</p>
              <p className="text-xs text-green-600 mt-1">+8% este mês</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Produtos Ativos</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">119</p>
              <p className="text-xs text-blue-600 mt-1">94% disponível</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Estoque Baixo</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">7</p>
              <p className="text-xs text-yellow-600 mt-1">Requer atenção</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo direto dos produtos (sem tabs) */}
      {renderProducts()}

      {/* Modal de Edição */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Editar Produto</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  className="modern-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <input
                  type="text"
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                  className="modern-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                  className="modern-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estoque Atual</label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                  className="modern-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estoque Mínimo</label>
                <input
                  type="number"
                  value={editingProduct.minStock}
                  onChange={(e) => setEditingProduct({...editingProduct, minStock: parseInt(e.target.value)})}
                  className="modern-input w-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingProduct.isPerishable}
                  onChange={(e) => setEditingProduct({...editingProduct, isPerishable: e.target.checked})}
                  className="rounded"
                />
                <label className="text-sm text-gray-700">Produto perecível</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => saveEditedProduct(editingProduct)}
                className="btn btn-primary flex-1"
              >
                Salvar Alterações
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingProduct(null);
                }}
                className="btn btn-outline flex-1"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Adicionar Produto */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 99999 }}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Adicionar Produto</h3>
              <button 
                onClick={() => {
                  setShowAddProductModal(false);
                  setNewProduct({
                    name: '',
                    currentStock: '',
                    manufacturingDate: '',
                    expiryDate: '',
                    isPerishable: false,
                    category: 'Geral',
                    price: '',
                    minStock: '10'
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Digite o nome do produto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estoque Atual *
                </label>
                <input
                  type="number"
                  value={newProduct.currentStock}
                  onChange={(e) => setNewProduct({ ...newProduct, currentStock: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Quantidade em estoque"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço Unitário
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="R$ 0,00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estoque Mínimo
                </label>
                <input
                  type="number"
                  value={newProduct.minStock}
                  onChange={(e) => setNewProduct({ ...newProduct, minStock: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="10"
                  min="0"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newProduct.isPerishable}
                    onChange={(e) => setNewProduct({ ...newProduct, isPerishable: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">Produto Perecível</span>
                </label>
              </div>

              {newProduct.isPerishable && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Fabricação *
                    </label>
                    <input
                      type="date"
                      value={newProduct.manufacturingDate}
                      onChange={(e) => setNewProduct({ ...newProduct, manufacturingDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Validade *
                    </label>
                    <input
                      type="date"
                      value={newProduct.expiryDate}
                      onChange={(e) => setNewProduct({ ...newProduct, expiryDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddProductModal(false);
                  setNewProduct({
                    name: '',
                    currentStock: '',
                    manufacturingDate: '',
                    expiryDate: '',
                    isPerishable: false,
                    category: 'Geral',
                    price: '',
                    minStock: '10'
                  });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={addProduct}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Adicionar Produto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Controle de Estoque */}
      {showStockModal && stockProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 99999 }}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Controle de Estoque</h3>
              <button 
                onClick={() => {
                  setShowStockModal(false);
                  setStockAdjustment({ quantity: '', operation: 'add', reason: '' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800">{stockProduct.name}</h4>
              <p className="text-sm text-gray-600">Estoque atual: {stockProduct.stock} unidades</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Operação
                </label>
                <select
                  value={stockAdjustment.operation}
                  onChange={(e) => setStockAdjustment({ ...stockAdjustment, operation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="add">Adicionar ao Estoque</option>
                  <option value="remove">Remover do Estoque</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade *
                </label>
                <input
                  type="number"
                  value={stockAdjustment.quantity}
                  onChange={(e) => setStockAdjustment({ ...stockAdjustment, quantity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Digite a quantidade"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo
                </label>
                <input
                  type="text"
                  value={stockAdjustment.reason}
                  onChange={(e) => setStockAdjustment({ ...stockAdjustment, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Motivo do ajuste (opcional)"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowStockModal(false);
                  setStockAdjustment({ quantity: '', operation: 'add', reason: '' });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={adjustStock}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                {stockAdjustment.operation === 'add' ? 'Adicionar' : 'Remover'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstoqueSection;