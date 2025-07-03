import React, { useState } from 'react';
import { useCategory } from '@/contexts/CategoryContext';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3,
  Plus,
  Search,
  Eye,
  Edit,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Calendar
} from 'lucide-react';

// Função para dados de produtos (movida para fora do componente)
const getInitialProductData = () => {
  return [
    { 
      id: 1, 
      name: 'Produto Padrão', 
      category: 'Geral', 
      stock: 50, 
      minStock: 10, 
      price: 35.00, 
      isPerishable: false
    }
  ];
};

const EstoqueSection = () => {
  const { selectedCategory } = useCategory();
  const [activeTab, setActiveTab] = useState('produtos');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [products, setProducts] = useState(() => getInitialProductData());

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

  const editProduct = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      alert(`📝 Editando: ${product.name}\n\nFuncionalidade em desenvolvimento.\nEm breve você poderá editar todos os detalhes do produto.`);
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



  // Tabs do sistema
  const tabs = [
    { id: 'produtos', label: 'Produtos', icon: Package },
    { id: 'vendas', label: 'Vendas', icon: ShoppingCart },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 }
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

  // Dados mockados por categoria com controle de validade
  const getProductData = () => {
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
          expiryDate: '2025-01-05',
          status: getProductStatus(25, 8, '2025-01-05')
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
          expiryDate: '2024-12-30',
          status: getProductStatus(15, 10, '2024-12-30')
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
          expiryDate: '2025-01-08',
          status: getProductStatus(12, 8, '2025-01-08')
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
    } else if (selectedCategory === 'medico') {
      return [
        { 
          id: 1, 
          name: 'Dipirona 500mg', 
          category: 'Analgésicos', 
          stock: 120, 
          minStock: 30, 
          price: 12.50,
          isPerishable: true,
          expiryDate: '2025-11-20',
          status: getProductStatus(120, 30, '2025-11-20')
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
          <button className="btn btn-primary">
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
                    {(product as any).expiryDate && (
                      <p className="text-sm text-gray-600">
                        Validade: <span className={`font-medium ${
                          getDaysUntilExpiry((product as any).expiryDate) <= 3 ? 'text-red-600' : 'text-gray-700'
                        }`}>
                          {getDaysUntilExpiry((product as any).expiryDate) > 0 
                            ? `${getDaysUntilExpiry((product as any).expiryDate)} dias`
                            : 'Vencido'
                          }
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">R$ {product.price.toFixed(2)}</p>
                  <span className={`badge ${
                    product.status === 'Em Estoque' ? 'badge-success' : 
                    product.status === 'Estoque Baixo' ? 'badge-warning' : 
                    product.status === 'Vencimento Próximo' ? 'badge-warning' :
                    'badge-error'
                  }`}>
                    {product.status}
                  </span>
                  {(product.status === 'Vencido' || product.status === 'Vencimento Próximo' || product.status === 'Estoque Baixo') && (
                    <div className="mt-1">
                      <AlertTriangle className="w-4 h-4 text-red-500 mx-auto" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => alert(`👁️ Visualizando detalhes do produto:\n\n${product.name}\nPreço: R$ ${product.price.toFixed(2)}\nEstoque: ${product.stock} unidades\nCategoria: ${product.category}`)}
                  className="btn btn-outline p-2" 
                  title="Visualizar detalhes"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => editProduct(product.id)}
                  className="btn btn-outline p-2" 
                  title="Editar produto"
                >
                  <Edit className="w-4 h-4" />
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
      case 'vendas':
        return renderSales();
      case 'clientes':
        return renderClients();
      case 'relatorios':
        return renderReports();
      default:
        return renderProducts();
    }
  };

  return (
    <div className="app-section">
      <div className="section-header">
        <h1 className="section-title">Gestão de Estoque</h1>
        <p className="section-subtitle">
          Controle total dos seus produtos, vendas e clientes
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
              <p className="text-sm font-medium text-gray-600">Vendas Hoje</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">R$ 6.499</p>
              <p className="text-xs text-green-600 mt-1">+18% vs ontem</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clientes Ativos</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">89</p>
              <p className="text-xs text-blue-600 mt-1">+12 este mês</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Users className="h-6 w-6 text-purple-600" />
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

      {/* Navegação por Tabs */}
      <div className="tab-navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              console.log('Estoque tab clicked:', tab.id);
              setActiveTab(tab.id);
            }}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            type="button"
            style={{ 
              cursor: 'pointer',
              pointerEvents: 'auto',
              userSelect: 'none'
            }}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo das Tabs */}
      {renderTabContent()}
    </div>
  );
};

export default EstoqueSection;