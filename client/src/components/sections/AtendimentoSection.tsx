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
  Download
} from 'lucide-react';

const AtendimentoSection = () => {
  const { selectedCategory } = useCategory();
  const [activeTab, setActiveTab] = useState('mensagens');
  const [searchTerm, setSearchTerm] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareType, setShareType] = useState('link'); // 'link' ou 'qr'
  const [shareUrl, setShareUrl] = useState('');

  // Função para gerar URL de compartilhamento
  const generateShareUrl = () => {
    const baseUrl = window.location.origin;
    const categorySlug = selectedCategory;
    const menuType = selectedCategory === 'alimenticio' ? 'cardapio' : 'catalogo';
    return `${baseUrl}/${menuType}/${categorySlug}`;
  };

  // Função para compartilhar
  const handleShare = (type: 'link' | 'qr') => {
    const url = generateShareUrl();
    setShareUrl(url);
    setShareType(type);
    setShowShareModal(true);
  };

  // Função para copiar link
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Link copiado para a área de transferência!');
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  // Tabs baseadas na categoria
  const getTabs = () => {
    const baseTabs = [
      { id: 'mensagens', label: 'Mensagens', icon: MessageCircle },
      { id: 'cardapios', label: selectedCategory === 'alimenticio' ? 'Cardápios' : 'Catálogos', icon: ShoppingCart },
      { id: 'automacao', label: 'Automação', icon: Bot }
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
      return [
        { id: 1, name: 'Pizza Margherita', price: 'R$ 35,00', description: 'Molho de tomate, mussarela e manjericão', category: 'Pizzas' },
        { id: 2, name: 'Hambúrguer Artesanal', price: 'R$ 28,00', description: '180g de carne, queijo, alface e tomate', category: 'Hambúrgueres' },
        { id: 3, name: 'Refrigerante 350ml', price: 'R$ 5,00', description: 'Coca-Cola, Pepsi ou Guaraná', category: 'Bebidas' }
      ];
    } else if (selectedCategory === 'vendas') {
      return [
        { id: 1, name: 'Smartphone Galaxy S24', price: 'R$ 2.899,00', description: '256GB, 12GB RAM, 5G', category: 'Eletrônicos' },
        { id: 2, name: 'Notebook Dell Inspiron', price: 'R$ 2.499,00', description: 'Intel i7, 16GB RAM, SSD 512GB', category: 'Eletrônicos' },
        { id: 3, name: 'Camiseta Polo', price: 'R$ 89,00', description: '100% algodão, várias cores', category: 'Vestuário' }
      ];
    }
    return [
      { id: 1, name: 'Produto 1', price: 'R$ 50,00', description: 'Descrição do produto', category: 'Geral' }
    ];
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
            <button className="btn btn-primary">
              <ShoppingCart className="w-4 h-4" />
              Adicionar Item
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getCatalogs().map((item) => (
            <div key={item.id} className="content-card hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-start mb-3">
                <span className="badge badge-primary">{item.category}</span>
                <span className="text-lg font-bold text-green-600">{item.price}</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">{item.name}</h4>
              <p className="text-sm text-gray-600 mb-4">{item.description}</p>
              <div className="flex gap-2">
                <button className="btn btn-outline flex-1">
                  Editar
                </button>
                <button className="btn btn-secondary">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAutomation = () => (
    <div className="animate-fade-in">
      <div className="content-grid">
        <div className="main-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bot className="w-8 h-8 text-purple-600" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">IA Assistant 24/7</h3>
              <p className="text-sm text-gray-600">Configurações do bot inteligente</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h4 className="font-medium text-gray-800">Bot Ativo</h4>
                <p className="text-sm text-gray-600">Respostas automáticas habilitadas</p>
              </div>
              <div className="w-12 h-6 bg-green-500 rounded-full flex items-center">
                <div className="w-5 h-5 bg-white rounded-full ml-auto mr-0.5"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h4 className="font-medium text-gray-800">Processamento de Pedidos</h4>
                <p className="text-sm text-gray-600">Pedidos automáticos via PIX/Cartão</p>
              </div>
              <div className="w-12 h-6 bg-green-500 rounded-full flex items-center">
                <div className="w-5 h-5 bg-white rounded-full ml-auto mr-0.5"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h4 className="font-medium text-gray-800">Suporte Humano</h4>
                <p className="text-sm text-gray-600">Escalação inteligente para agentes</p>
              </div>
              <div className="w-12 h-6 bg-blue-500 rounded-full flex items-center">
                <div className="w-5 h-5 bg-white rounded-full ml-auto mr-0.5"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="main-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-8 h-8 text-yellow-500" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Estatísticas em Tempo Real</h3>
              <p className="text-sm text-gray-600">Performance do atendimento</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Mensagens Hoje</span>
              <span className="font-semibold text-gray-800">127</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Bot Resolveu</span>
              <span className="font-semibold text-green-600">89%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tempo Médio</span>
              <span className="font-semibold text-blue-600">2min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Satisfação</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-semibold text-yellow-600">4.8</span>
              </div>
            </div>
          </div>
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                onClick={() => copyToClipboard(shareUrl)}
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'mensagens':
        return renderMessages();
      case 'cardapios':
        return renderCatalogs();
      case 'automacao':
        return renderAutomation();
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
    </div>
  );
};

export default AtendimentoSection;