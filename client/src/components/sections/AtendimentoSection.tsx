import React, { useState } from 'react';
import { useCategory, categories } from '@/contexts/CategoryContext';
import { 
  MessageCircle, 
  Bot, 
  ShoppingCart, 
  Settings,
  Search,
  Send,
  Phone,
  Clock,
  Star,
  CheckCircle,
  Zap,
  CreditCard,
  Share2,
  QrCode,
  Link,
  Copy,
  Download,
  Gift,
  Users,
  Target,
  Calendar,
  TrendingUp,
  Mail
} from 'lucide-react';

const AtendimentoSection = () => {
  const { selectedCategory } = useCategory();
  const [activeTab, setActiveTab] = useState('mensagens');
  const [searchTerm, setSearchTerm] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareType, setShareType] = useState('link'); // 'link' ou 'qr'
  const [shareUrl, setShareUrl] = useState('');
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: selectedCategory === 'alimenticio' ? 'pratos' : 'produtos'
  });
  const [qrCodeData, setQrCodeData] = useState('');

  // Função para gerar URL de compartilhamento
  const generateShareUrl = () => {
    const baseUrl = window.location.origin;
    const categorySlug = selectedCategory;
    const menuType = selectedCategory === 'alimenticio' ? 'cardapio' : 'catalogo';
    return `${baseUrl}/${menuType}/${categorySlug}`;
  };

  // Função para buscar produtos do estoque automaticamente
  const getStockProducts = () => {
    if (selectedCategory === 'alimenticio') {
      // Para alimentício, mantém gestão manual
      return [];
    }
    
    // Para outras categorias, puxar automaticamente do estoque
    const mockStockProducts = {
      'pet': [
        { id: 1, name: 'Ração Premium Golden', price: 89.90, category: 'racao', stock: 25, description: 'Ração premium para cães adultos' },
        { id: 2, name: 'Antipulgas Frontline', price: 45.50, category: 'medicamentos', stock: 12, description: 'Proteção contra pulgas e carrapatos' },
        { id: 3, name: 'Brinquedo Kong', price: 32.00, category: 'brinquedos', stock: 8, description: 'Brinquedo resistente para cães' }
      ],
      'medico': [
        { id: 1, name: 'Dipirona 500mg', price: 15.90, category: 'analgesicos', stock: 50, description: 'Analgésico e antipirético' },
        { id: 2, name: 'Amoxicilina 500mg', price: 25.00, category: 'antibioticos', stock: 30, description: 'Antibiótico de amplo espectro' },
        { id: 3, name: 'Termômetro Digital', price: 89.90, category: 'equipamentos', stock: 15, description: 'Termômetro clínico digital' }
      ],
      'tecnologia': [
        { id: 1, name: 'Processador Intel i7', price: 1299.00, category: 'componentes', stock: 5, description: 'Processador Intel Core i7 12ª geração' },
        { id: 2, name: 'Monitor 24" Full HD', price: 699.00, category: 'monitores', stock: 8, description: 'Monitor LED 24 polegadas' },
        { id: 3, name: 'SSD 1TB', price: 299.00, category: 'armazenamento', stock: 12, description: 'SSD interno 1TB alta velocidade' }
      ],
      'vendas': [
        { id: 1, name: 'Smartphone Galaxy S24', price: 2899.99, category: 'eletronicos', stock: 6, description: 'Smartphone Samsung Galaxy S24' },
        { id: 2, name: 'Camiseta Polo', price: 89.99, category: 'vestuario', stock: 20, description: 'Camiseta polo masculina' },
        { id: 3, name: 'Tênis Esportivo', price: 199.99, category: 'calcados', stock: 15, description: 'Tênis para corrida' }
      ],
      'design': [
        { id: 1, name: 'Identidade Visual Completa', price: 899.00, category: 'branding', stock: 0, description: 'Criação de logotipo e manual da marca' },
        { id: 2, name: 'Material Gráfico', price: 299.00, category: 'impressos', stock: 0, description: 'Cartões, folders e banners' },
        { id: 3, name: 'Design para Redes Sociais', price: 199.00, category: 'digital', stock: 0, description: 'Posts e stories personalizados' }
      ],
      'sites': [
        { id: 1, name: 'Site Institucional', price: 1299.00, category: 'websites', stock: 0, description: 'Site responsivo com até 5 páginas' },
        { id: 2, name: 'E-commerce Completo', price: 2499.00, category: 'loja-virtual', stock: 0, description: 'Loja virtual com pagamento integrado' },
        { id: 3, name: 'Landing Page', price: 599.00, category: 'conversao', stock: 0, description: 'Página de conversão otimizada' }
      ]
    };
    
    return mockStockProducts[selectedCategory as keyof typeof mockStockProducts] || [];
  };

  // Função para compartilhar
  const handleShare = (type: 'link' | 'qr') => {
    const url = generateShareUrl();
    setShareUrl(url);
    setShareType(type);
    
    if (type === 'qr') {
      // Gerar dados do QR Code
      const qrData = `${url}?utm_source=qr&category=${selectedCategory}`;
      setQrCodeData(qrData);
    }
    
    setShowShareModal(true);
  };

  // Função para copiar link principal
  const copyShareLink = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Link copiado para área de transferência!');
    } catch (err) {
      console.error('Erro ao copiar:', err);
      alert('Erro ao copiar link');
    }
  };

  // Função para adicionar novo item
  const handleAddItem = () => {
    setNewItem({
      name: '',
      description: '',
      price: '',
      category: selectedCategory === 'alimenticio' ? 'pratos' : 'produtos'
    });
    setShowAddItemModal(true);
  };

  // Função para salvar novo item
  const saveNewItem = () => {
    if (newItem.name && newItem.price) {
      // Aqui seria a integração com a API
      console.log('Novo item adicionado:', {
        ...newItem,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        category: selectedCategory
      });
      
      alert(`${selectedCategory === 'alimenticio' ? 'Prato' : 'Produto'} "${newItem.name}" adicionado com sucesso!`);
      setShowAddItemModal(false);
      setNewItem({
        name: '',
        description: '',
        price: '',
        category: selectedCategory === 'alimenticio' ? 'pratos' : 'produtos'
      });
    } else {
      alert('Por favor, preencha ao menos o nome e o preço.');
    }
  };

  // Função para gerar QR Code SVG simples
  const generateQRCodeSVG = (data: string) => {
    // QR Code simples usando SVG - em produção usaria uma biblioteca como qrcode.js
    const size = 200;
    const modules = 21; // QR Code básico 21x21
    const moduleSize = size / modules;
    
    // Padrão simplificado de QR Code (demonstrativo)
    const pattern = Array(modules).fill(null).map(() => 
      Array(modules).fill(null).map(() => Math.random() > 0.5)
    );
    
    // Adicionar padrões de detecção (cantos)
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        pattern[i][j] = (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4));
        pattern[i][modules - 1 - j] = (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4));
        pattern[modules - 1 - i][j] = (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4));
      }
    }
    
    const rects = pattern.map((row, i) =>
      row.map((cell, j) => 
        cell ? `<rect x="${j * moduleSize}" y="${i * moduleSize}" width="${moduleSize}" height="${moduleSize}" fill="black"/>` : ''
      ).join('')
    ).join('');
    
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="white"/>
        ${rects}
      </svg>
    `;
  };



  // Tabs baseadas na categoria
  const getTabs = () => {
    const baseTabs = [
      { id: 'mensagens', label: 'Mensagens', icon: MessageCircle },
      { id: 'cardapios', label: selectedCategory === 'alimenticio' ? 'Cardápios' : 'Catálogos', icon: ShoppingCart },
      { id: 'fidelizacao', label: 'Fidelização', icon: Gift }
    ];
    
    // Adicionar aba de pagamento para categorias alimentícias
    if (selectedCategory === 'alimenticio') {
      baseTabs.push({ id: 'pagamento', label: 'Pagamento', icon: CreditCard });
    }
    
    return baseTabs;
  };

  // Mensagens mockadas por categoria
  const getMessages = () => {
    if (selectedCategory === 'alimenticio') {
      return [
        { id: 1, name: 'João Silva', message: 'Olá! Gostaria de fazer um pedido...', time: '14:30', status: 'pending' },
        { id: 2, name: 'Maria Santos', message: 'Vocês entregam na Zona Sul?', time: '14:15', status: 'responded' },
        { id: 3, name: 'Carlos Oliveira', message: 'Quanto fica uma pizza grande?', time: '13:45', status: 'bot' }
      ];
    } else if (selectedCategory === 'vendas') {
      return [
        { id: 1, name: 'Ana Costa', message: 'Preciso de um orçamento para notebooks...', time: '15:20', status: 'pending' },
        { id: 2, name: 'Pedro Lima', message: 'Têm smartphones Samsung em estoque?', time: '14:50', status: 'responded' },
        { id: 3, name: 'Lucia Ferreira', message: 'Quando chega o novo lote de produtos?', time: '14:30', status: 'bot' }
      ];
    }
    return [
      { id: 1, name: 'Cliente 1', message: 'Olá, preciso de ajuda...', time: '14:30', status: 'pending' },
      { id: 2, name: 'Cliente 2', message: 'Como funciona o atendimento?', time: '14:15', status: 'responded' }
    ];
  };

  // Catálogos/Cardápios por categoria
  const getCatalogs = () => {
    if (selectedCategory === 'alimenticio') {
      // Para alimentício, mantém gestão manual do cardápio
      return [
        { id: 1, name: 'Pizza Margherita', price: 'R$ 35,00', description: 'Molho de tomate, mussarela e manjericão', category: 'Pizzas' },
        { id: 2, name: 'Hambúrguer Artesanal', price: 'R$ 28,00', description: '180g de carne, queijo, alface e tomate', category: 'Hambúrgueres' },
        { id: 3, name: 'Refrigerante 350ml', price: 'R$ 5,00', description: 'Coca-Cola, Pepsi ou Guaraná', category: 'Bebidas' }
      ];
    } else {
      // Para outras categorias, puxar automaticamente do estoque
      const stockProducts = getStockProducts();
      return stockProducts.map((product: any) => ({
        id: product.id,
        name: product.name,
        price: `R$ ${product.price.toFixed(2).replace('.', ',')}`,
        description: product.description,
        category: product.category,
        stock: product.stock,
        isFromStock: true
      }));
    }
  };

  const renderMessages = () => (
    <div className="animate-fade-in">
      <div className="main-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Conversas WhatsApp</h3>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar conversas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="modern-input pl-10 w-64"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Bot Online
            </div>
          </div>
        </div>

        <div className="item-list">
          {getMessages().map((msg) => (
            <div key={msg.id} className="list-item">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-800">{msg.name}</h4>
                    <span className="text-xs text-gray-500">{msg.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{msg.message}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {msg.status === 'pending' && (
                  <span className="badge badge-warning">Pendente</span>
                )}
                {msg.status === 'responded' && (
                  <span className="badge badge-success">Respondido</span>
                )}
                {msg.status === 'bot' && (
                  <span className="badge badge-info">Bot</span>
                )}
                <button className="btn btn-outline p-2">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCatalogs = () => (
    <div className="animate-fade-in">
      <div className="main-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            {selectedCategory === 'alimenticio' ? 'Cardápio Digital' : 'Catálogo de Produtos'}
          </h3>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleShare('link')}
              className="btn btn-outline flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Compartilhar Link
            </button>
            <button 
              onClick={() => handleShare('qr')}
              className="btn btn-outline flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              QR Code
            </button>
            {selectedCategory === 'alimenticio' && (
              <button 
                onClick={handleAddItem}
                className="btn btn-primary"
              >
                <ShoppingCart className="w-4 h-4" />
                Adicionar Item
              </button>
            )}
          </div>
        </div>

        {/* Aviso de integração automática */}
        {selectedCategory !== 'alimenticio' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-blue-700">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Sincronização Automática com Estoque</span>
            </div>
            <p className="text-sm text-blue-600 mt-1">
              Os produtos abaixo são carregados automaticamente do seu estoque. 
              Para gerenciar produtos, vá para a seção Estoque.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getCatalogs().map((item: any) => (
            <div key={item.id} className="content-card hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-start mb-3">
                <span className="badge badge-primary">{item.category}</span>
                <div className="text-right">
                  <span className="text-lg font-bold text-green-600">{item.price}</span>
                  {item.isFromStock && (
                    <p className="text-xs text-gray-500 mt-1">
                      Estoque: {item.stock} unidades
                    </p>
                  )}
                </div>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">{item.name}</h4>
              <p className="text-sm text-gray-600 mb-4">{item.description}</p>
              {item.isFromStock && item.stock <= 5 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-3">
                  <p className="text-xs text-yellow-700">⚠️ Estoque baixo - apenas {item.stock} unidades</p>
                </div>
              )}
              <div className="flex gap-2">
                {selectedCategory === 'alimenticio' ? (
                  <>
                    <button className="btn btn-outline flex-1">
                      Editar
                    </button>
                    <button className="btn btn-secondary">
                      <Send className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button className="btn btn-secondary flex-1">
                    <Send className="w-4 h-4" />
                    Enviar para Cliente
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Renderizar aba de pagamento
  const renderPayment = () => (
    <div className="animate-fade-in">
      <div className="main-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-8 h-8 text-green-600" />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Sistema de Pagamentos</h3>
            <p className="text-sm text-gray-600">Pagamentos automáticos via PIX e Cartão</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="content-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">PIX Automático</h4>
                <p className="text-sm text-gray-600">Pagamento instantâneo</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Taxa</span>
                <span className="font-medium text-green-600">Grátis</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Tempo de processamento</span>
                <span className="font-medium">Instantâneo</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Status</span>
                <span className="badge badge-success">Ativo</span>
              </div>
            </div>
          </div>

          <div className="content-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Cartão de Crédito</h4>
                <p className="text-sm text-gray-600">Parcelamento disponível</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Taxa</span>
                <span className="font-medium text-blue-600">2.9%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Parcelamento</span>
                <span className="font-medium">Até 12x</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Status</span>
                <span className="badge badge-success">Ativo</span>
              </div>
            </div>
          </div>
        </div>

        <div className="content-card">
          <h4 className="font-medium text-gray-800 mb-4">Transações Recentes</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Pedido #1234 - João Silva</p>
                  <p className="text-xs text-gray-600">PIX • Hoje às 14:30</p>
                </div>
              </div>
              <span className="font-medium text-green-600">R$ 45,90</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Pedido #1233 - Maria Santos</p>
                  <p className="text-xs text-gray-600">Cartão 3x • Hoje às 13:15</p>
                </div>
              </div>
              <span className="font-medium text-blue-600">R$ 89,70</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Modal de compartilhamento
  const renderShareModal = () => {
    if (!showShareModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 99999 }}>
        <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {shareType === 'qr' ? 'QR Code para Compartilhar' : 'Link de Compartilhamento'}
            </h3>
            <button 
              onClick={() => setShowShareModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {shareType === 'qr' ? (
            <div className="text-center">
              <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-32 h-32 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Escaneie o QR Code para acessar o {selectedCategory === 'alimenticio' ? 'cardápio' : 'catálogo'}
              </p>
              <button className="btn btn-outline w-full flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Baixar QR Code
              </button>
            </div>
          ) : (
            <div>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2">
                  <Link className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 break-all">{shareUrl}</span>
                </div>
              </div>
              <button 
                onClick={() => copyShareLink(shareUrl)}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copiar Link
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Renderizar aba de fidelização
  const renderLoyalty = () => (
    <div className="animate-fade-in">
      <div className="main-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Gift className="w-8 h-8 text-purple-600" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Programa de Fidelização</h3>
              <p className="text-sm text-gray-600">Campanhas e promoções para retenção de clientes</p>
            </div>
          </div>
          <button className="btn btn-primary flex items-center gap-2">
            <Gift className="w-4 h-4" />
            Nova Campanha
          </button>
        </div>

        {/* Métricas de Fidelização */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="content-card text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-medium text-gray-800">Clientes Ativos</h4>
            <p className="text-2xl font-bold text-purple-600 mt-1">1,247</p>
            <p className="text-xs text-green-600 mt-1">+15% este mês</p>
          </div>

          <div className="content-card text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-medium text-gray-800">Taxa de Conversão</h4>
            <p className="text-2xl font-bold text-green-600 mt-1">23.5%</p>
            <p className="text-xs text-blue-600 mt-1">Campanhas ativas</p>
          </div>

          <div className="content-card text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-800">Retenção</h4>
            <p className="text-2xl font-bold text-blue-600 mt-1">78%</p>
            <p className="text-xs text-purple-600 mt-1">90 dias</p>
          </div>

          <div className="content-card text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-yellow-600" />
            </div>
            <h4 className="font-medium text-gray-800">Mensagens Enviadas</h4>
            <p className="text-2xl font-bold text-yellow-600 mt-1">3,892</p>
            <p className="text-xs text-gray-600 mt-1">Este mês</p>
          </div>
        </div>

        {/* Campanhas Ativas */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-800 mb-4">Campanhas Ativas</h4>
          <div className="space-y-4">
            <div className="content-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Gift className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800">
                      {selectedCategory === 'alimenticio' ? 'Desconto 20% - Pizza Margherita' : 'Black Friday - Eletrônicos'}
                    </h5>
                    <p className="text-sm text-gray-600">
                      {selectedCategory === 'alimenticio' 
                        ? 'Promoção especial para novos clientes' 
                        : 'Descontos em smartphones e notebooks'
                      }
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">Enviado para 856 clientes</span>
                      <span className="text-xs text-green-600">142 conversões</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="badge badge-success">Ativa</span>
                  <p className="text-sm text-gray-600 mt-1">Expira em 5 dias</p>
                </div>
              </div>
            </div>

            <div className="content-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800">
                      {selectedCategory === 'alimenticio' ? 'Cliente VIP - Frete Grátis' : 'Programa VIP - Desconto Progressivo'}
                    </h5>
                    <p className="text-sm text-gray-600">
                      {selectedCategory === 'alimenticio' 
                        ? 'Entrega gratuita para pedidos acima de R$ 50' 
                        : 'Descontos crescentes baseados em compras'
                      }
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">Enviado para 234 clientes VIP</span>
                      <span className="text-xs text-blue-600">78 utilizações</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="badge badge-info">Permanente</span>
                  <p className="text-sm text-gray-600 mt-1">Sempre ativa</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tipos de Campanha */}
        <div>
          <h4 className="font-medium text-gray-800 mb-4">Criar Nova Campanha</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="content-card hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-purple-600" />
                </div>
                <h5 className="font-medium text-gray-800 mb-2">Desconto por Categoria</h5>
                <p className="text-sm text-gray-600 mb-4">
                  {selectedCategory === 'alimenticio' 
                    ? 'Promoções em pizzas, bebidas e sobremesas' 
                    : 'Descontos em eletrônicos, roupas e casa'
                  }
                </p>
                <button className="btn btn-outline w-full">Criar Campanha</button>
              </div>
            </div>

            <div className="content-card hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
                <h5 className="font-medium text-gray-800 mb-2">Promoção Sazonal</h5>
                <p className="text-sm text-gray-600 mb-4">Campanhas para datas especiais e feriados</p>
                <button className="btn btn-outline w-full">Criar Campanha</button>
              </div>
            </div>

            <div className="content-card hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h5 className="font-medium text-gray-800 mb-2">Reativação de Clientes</h5>
                <p className="text-sm text-gray-600 mb-4">Ofertas especiais para clientes inativos</p>
                <button className="btn btn-outline w-full">Criar Campanha</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'mensagens':
        return renderMessages();
      case 'cardapios':
        return renderCatalogs();
      case 'fidelizacao':
        return renderLoyalty();
      case 'pagamento':
        return renderPayment();
      default:
        return renderMessages();
    }
  };

  return (
    <div className="app-section">
      <div className="section-header">
        <h1 className="section-title">Atendimento ao Cliente</h1>
        <p className="section-subtitle">
          {categories.find(c => c.value === selectedCategory)?.label || 'Categoria Selecionada'} - 
          Sistema completo de atendimento WhatsApp com IA
        </p>
      </div>

      {/* Métricas de Atendimento */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversas Ativas</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">24</p>
              <p className="text-xs text-green-600 mt-1">+12% hoje</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bot Ativo</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">89%</p>
              <p className="text-xs text-blue-600 mt-1">Taxa de resolução</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Bot className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pedidos Hoje</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">47</p>
              <p className="text-xs text-purple-600 mt-1">+23% semana</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <ShoppingCart className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">2min</p>
              <p className="text-xs text-yellow-600 mt-1">Resposta IA</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Navegação por Tabs */}
      <div className="tab-navigation">
        {getTabs().map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              console.log('Tab clicked:', tab.id);
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
      
      {/* Modal de Compartilhamento */}
      {renderShareModal()}
      
      {/* Modal de Adicionar Item */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 99999 }}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Adicionar {selectedCategory === 'alimenticio' ? 'Prato' : 'Produto'}
              </h3>
              <button 
                onClick={() => setShowAddItemModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={selectedCategory === 'alimenticio' ? 'Ex: Pizza Margherita' : 'Ex: Smartphone XYZ'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={selectedCategory === 'alimenticio' ? 'Molho especial, queijo mussarela...' : 'Características e especificações...'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço *
                </label>
                <input
                  type="text"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="R$ 0,00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {selectedCategory === 'alimenticio' ? (
                    <>
                      <option value="pratos">Pratos Principais</option>
                      <option value="bebidas">Bebidas</option>
                      <option value="sobremesas">Sobremesas</option>
                      <option value="entradas">Entradas</option>
                    </>
                  ) : (
                    <>
                      <option value="produtos">Produtos Gerais</option>
                      <option value="promocoes">Promoções</option>
                      <option value="lancamentos">Lançamentos</option>
                      <option value="destaque">Em Destaque</option>
                    </>
                  )}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddItemModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={saveNewItem}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AtendimentoSection;