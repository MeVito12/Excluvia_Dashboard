import React, { useState } from 'react';
import { useCategory } from '@/contexts/CategoryContext';
import { useProducts } from '@/hooks/useProducts';
import { 
  MessageCircle, 
  Bot, 
  ShoppingCart, 
  Search,
  Send,
  Share2,
  QrCode,
  Link,
  Copy,
  Plus,
  Users,
  Star
} from 'lucide-react';

const AtendimentoSection = () => {
  const { selectedCategory } = useCategory();
  const { products } = useProducts();
  const [activeTab, setActiveTab] = useState('mensagens');
  const [searchTerm, setSearchTerm] = useState('');

  const categoryData = {
    'farmacia': { name: 'Farmácia', type: 'produtos' },
    'pet': { name: 'Pet', type: 'produtos' },
    'medico': { name: 'Médico', type: 'produtos' },
    'vendas': { name: 'Vendas', type: 'produtos' },
    'design': { name: 'Design', type: 'portfolio' },
    'sites': { name: 'Sites', type: 'portfolio' }
  };

  const currentData = categoryData[selectedCategory as keyof typeof categoryData];
  const isPortfolio = currentData?.type === 'portfolio';

  // Mock conversations for demonstration
  const conversations = [
    {
      id: 1,
      name: 'Cliente Exemplo',
      lastMessage: 'Olá, gostaria de saber sobre os produtos',
      time: '14:30',
      unread: 2,
      status: 'new'
    }
  ];

  // Generate share URL
  const generateShareUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/${isPortfolio ? 'portfolio' : 'catalogo'}/${selectedCategory}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Link copiado!');
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderMessages = () => (
    <div className="main-card">
      <div className="space-y-4">
        {/* Header com busca */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
        </div>

        {/* Lista de conversas */}
        <div className="space-y-2">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="list-card cursor-pointer hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">{conversation.name}</h3>
                    <span className="text-sm text-gray-500">{conversation.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                </div>
                {conversation.unread > 0 && (
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">{conversation.unread}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCatalog = () => (
    <div className="main-card">
      <div className="space-y-4">
        {/* Header com ações */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {isPortfolio ? 'Portfólio' : 'Catálogo de Produtos'}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => copyToClipboard(generateShareUrl())}
              className="btn btn-outline flex items-center gap-2"
            >
              <Link className="h-4 w-4" />
              Copiar Link
            </button>
            <button
              onClick={() => copyToClipboard(generateShareUrl())}
              className="btn btn-outline flex items-center gap-2"
            >
              <QrCode className="h-4 w-4" />
              QR Code
            </button>
          </div>
        </div>

        {/* Grid de produtos/portfolio */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isPortfolio ? (
            // Portfolio items for design/sites
            <div className="list-card">
              <div className="p-4">
                <h3 className="font-medium">Projeto Exemplo</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Descrição do projeto realizado
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Projeto Destacado</span>
                </div>
              </div>
            </div>
          ) : (
            // Products for other categories
            filteredProducts.map((product) => (
              <div key={product.id} className="list-card">
                <div className="p-4">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-green-600 font-semibold mt-2">
                    R$ {product.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Estoque: {product.quantity}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderAutomation = () => (
    <div className="main-card">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Automação de Atendimento</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="list-card">
            <div className="flex items-center gap-3 p-4">
              <Bot className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-medium">IA Assistant</h3>
                <p className="text-sm text-gray-600">Respostas automáticas ativas</p>
              </div>
            </div>
          </div>
          
          <div className="list-card">
            <div className="flex items-center gap-3 p-4">
              <MessageCircle className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-medium">WhatsApp Business</h3>
                <p className="text-sm text-gray-600">Integração ativa</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-section">
      <div className="section-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <MessageCircle className="h-6 w-6 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Atendimento</h1>
        </div>
      </div>

      {/* Navegação por abas */}
      <div className="tab-navigation">
        <button
          onClick={() => setActiveTab('mensagens')}
          className={`tab-button ${activeTab === 'mensagens' ? 'active' : ''}`}
        >
          <MessageCircle className="h-4 w-4" />
          Mensagens
        </button>
        <button
          onClick={() => setActiveTab('catalogo')}
          className={`tab-button ${activeTab === 'catalogo' ? 'active' : ''}`}
        >
          <ShoppingCart className="h-4 w-4" />
          {isPortfolio ? 'Portfólio' : 'Catálogo'}
        </button>
        <button
          onClick={() => setActiveTab('automacao')}
          className={`tab-button ${activeTab === 'automacao' ? 'active' : ''}`}
        >
          <Bot className="h-4 w-4" />
          Automação
        </button>
      </div>

      {/* Conteúdo das abas */}
      {activeTab === 'mensagens' && renderMessages()}
      {activeTab === 'catalogo' && renderCatalog()}
      {activeTab === 'automacao' && renderAutomation()}
    </div>
  );
};

export default AtendimentoSection;