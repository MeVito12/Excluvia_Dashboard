import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  MessageCircle, 
  Bot, 
  CreditCard, 
  Gift, 
  Phone,
  Clock,
  Users,
  Zap,
  CheckCircle,
  AlertCircle,
  Star,
  Heart,
  Send,
  Settings,
  QrCode,
  Smartphone,
  ShoppingCart,
  TrendingUp,
  Eye,
  Edit,
  Play,
  Pause
} from 'lucide-react';

const AtendimentoSection = () => {
  const [activeTab, setActiveTab] = useState('mensagens');
  const [botEnabled, setBotEnabled] = useState(true);
  const [autoPayment, setAutoPayment] = useState(true);
  const [humanSupport, setHumanSupport] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Categorias de negócio
  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'pet', label: 'Pet & Veterinário' },
    { value: 'saude', label: 'Saúde & Medicamentos' },
    { value: 'alimenticio', label: 'Alimentício' },
    { value: 'tecnologia', label: 'Tecnologia' },
    { value: 'design', label: 'Design Gráfico' },
    { value: 'sites', label: 'Criação de Sites' }
  ];

  // Mock data para conversas de mensagens categorizadas
  const messageChats = [
    {
      id: 1,
      clientName: 'João Silva',
      lastMessage: 'Preciso de ração para meu gato',
      timestamp: '14:32',
      status: 'bot',
      unread: 2,
      category: 'pet'
    },
    {
      id: 2,
      clientName: 'Maria Santos',
      lastMessage: 'Preciso de vitamina D urgente',
      timestamp: '14:15',
      status: 'human',
      unread: 1,
      category: 'saude'
    },
    {
      id: 3,
      clientName: 'Pedro Costa',
      lastMessage: 'Obrigado pelo hambúrguer!',
      timestamp: '13:45',
      status: 'completed',
      unread: 0,
      category: 'alimenticio'
    },
    {
      id: 4,
      clientName: 'Ana Silva',
      lastMessage: 'Qual o melhor smartphone?',
      timestamp: '13:20',
      status: 'bot',
      unread: 3,
      category: 'tecnologia'
    },
    {
      id: 5,
      clientName: 'Carlos Lima',
      lastMessage: 'Vacina para cão disponível?',
      timestamp: '12:30',
      status: 'human',
      unread: 0,
      category: 'pet'
    },
    {
      id: 6,
      clientName: 'Lucia Rocha',
      lastMessage: 'Pizza margherita pronta?',
      timestamp: '12:15',
      status: 'completed',
      unread: 0,
      category: 'alimenticio'
    },
    {
      id: 7,
      clientName: 'Design Studio Pro',
      lastMessage: 'Preciso de um logo para startup',
      timestamp: '11:45',
      status: 'bot',
      unread: 2,
      category: 'design'
    },
    {
      id: 8,
      clientName: 'WebDev Client',
      lastMessage: 'Site do e-commerce está pronto?',
      timestamp: '11:20',
      status: 'human',
      unread: 1,
      category: 'sites'
    },
    {
      id: 9,
      clientName: 'Agência Visual',
      lastMessage: 'Material gráfico aprovado!',
      timestamp: '10:30',
      status: 'completed',
      unread: 0,
      category: 'design'
    }
  ];

  // Mock data para cardápios e catálogos categorizados
  const menuCatalogs = [
    {
      id: 1,
      name: 'Cardápio Pet Shop',
      category: 'pet',
      items: ['Ração Premium', 'Brinquedos', 'Medicamentos Vet', 'Acessórios'],
      description: 'Produtos completos para pets',
      active: true
    },
    {
      id: 2,
      name: 'Catálogo Farmácia',
      category: 'saude',
      items: ['Medicamentos', 'Vitaminas', 'Suplementos', 'Primeiros Socorros'],
      description: 'Medicamentos e produtos de saúde',
      active: true
    },
    {
      id: 3,
      name: 'Menu Restaurante',
      category: 'alimenticio',
      items: ['Hambúrguers', 'Pizzas', 'Bebidas', 'Sobremesas'],
      description: 'Cardápio completo do restaurante',
      active: true
    },
    {
      id: 4,
      name: 'Catálogo Tech',
      category: 'tecnologia',
      items: ['Smartphones', 'Notebooks', 'Acessórios', 'Games'],
      description: 'Produtos de tecnologia',
      active: true
    },
    {
      id: 5,
      name: 'Serviços Veterinários',
      category: 'pet',
      items: ['Consultas', 'Cirurgias', 'Vacinas', 'Exames'],
      description: 'Serviços veterinários completos',
      active: false
    },
    {
      id: 6,
      name: 'Portfólio Design Gráfico',
      category: 'design',
      items: ['Logos', 'Identidade Visual', 'Material Gráfico', 'UI/UX'],
      description: 'Serviços completos de design e branding',
      active: true
    },
    {
      id: 7,
      name: 'Catálogo Desenvolvimento Web',
      category: 'sites',
      items: ['Sites Institucionais', 'E-commerce', 'Landing Pages', 'Sistemas Web'],
      description: 'Desenvolvimento completo de websites',
      active: true
    },
    {
      id: 8,
      name: 'Pacotes Design Premium',
      category: 'design',
      items: ['Branding Completo', 'Apresentações', 'Social Media', 'Impressos'],
      description: 'Pacotes premium de design',
      active: true
    }
  ];

  // Mock data para campanhas de fidelização
  const loyaltyCampaigns = [
    {
      id: 1,
      name: 'Desconto 10% - Clientes VIP',
      type: 'discount',
      status: 'active',
      reach: 245,
      conversions: 38
    },
    {
      id: 2,
      name: 'Cupom Aniversário',
      type: 'birthday',
      status: 'scheduled',
      reach: 125,
      conversions: 0
    },
    {
      id: 3,
      name: 'Cashback 5%',
      type: 'cashback',
      status: 'active',
      reach: 890,
      conversions: 156
    }
  ];

  // Mock data para pedidos automáticos
  const automaticOrders = [
    {
      id: 1,
      clientName: 'Ana Costa',
      product: 'Combo Executivo',
      amount: 'R$ 45,90',
      status: 'confirmed',
      timestamp: '14:25'
    },
    {
      id: 2,
      clientName: 'Carlos Lima',
      product: 'Pizza Margherita',
      amount: 'R$ 32,50',
      status: 'preparing',
      timestamp: '14:20'
    },
    {
      id: 3,
      clientName: 'Lucia Martins',
      product: 'Hambúrguer Artesanal',
      amount: 'R$ 28,90',
      status: 'delivered',
      timestamp: '13:55'
    }
  ];

  // Funções de filtro
  const filteredChats = selectedCategory === 'all' 
    ? messageChats 
    : messageChats.filter(chat => chat.category === selectedCategory);

  const filteredCatalogs = selectedCategory === 'all' 
    ? menuCatalogs 
    : menuCatalogs.filter(catalog => catalog.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'pet': return 'bg-purple-100 text-purple-800';
      case 'saude': return 'bg-blue-100 text-blue-800';
      case 'alimenticio': return 'bg-green-100 text-green-800';
      case 'tecnologia': return 'bg-orange-100 text-orange-800';
      case 'design': return 'bg-pink-100 text-pink-800';
      case 'sites': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'bot': return 'bg-blue-500';
      case 'human': return 'bg-orange-500';
      case 'completed': return 'bg-green-500';
      case 'active': return 'bg-green-500';
      case 'scheduled': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'preparing': return 'bg-orange-500';
      case 'delivered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'bot': return 'Bot';
      case 'human': return 'Humano';
      case 'completed': return 'Finalizado';
      case 'active': return 'Ativa';
      case 'scheduled': return 'Agendada';
      case 'confirmed': return 'Confirmado';
      case 'preparing': return 'Preparando';
      case 'delivered': return 'Entregue';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Central de Atendimento</h2>
        <p className="text-gray-300">Mensagens, assistente virtual, pedidos automáticos e fidelização</p>
      </div>

      {/* Cards de Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversas Ativas</p>
                <p className="text-2xl font-bold text-blue-600">23</p>
              </div>
              <MessageCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bot Automático</p>
                <p className="text-2xl font-bold text-green-600">95%</p>
              </div>
              <Bot className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pedidos Hoje</p>
                <p className="text-2xl font-bold text-purple-600">47</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Satisfação</p>
                <p className="text-2xl font-bold text-orange-600">4.8★</p>
              </div>
              <Star className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principais */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white">
          <TabsTrigger value="mensagens" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
            <MessageCircle className="w-4 h-4 mr-2" />
            Mensagens
          </TabsTrigger>
          <TabsTrigger value="bot" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Bot className="w-4 h-4 mr-2" />
            Assistente IA
          </TabsTrigger>
          <TabsTrigger value="pedidos" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            <CreditCard className="w-4 h-4 mr-2" />
            Pedidos Auto
          </TabsTrigger>
          <TabsTrigger value="fidelizacao" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
            <Gift className="w-4 h-4 mr-2" />
            Fidelização
          </TabsTrigger>
          <TabsTrigger value="suporte" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            <Phone className="w-4 h-4 mr-2" />
            Suporte
          </TabsTrigger>
        </TabsList>

        {/* Tab Mensagens */}
        <TabsContent value="mensagens" className="space-y-4">
          {/* Filtros de Categoria */}
          <Card className="bg-white border border-border/50">
            <CardHeader>
              <CardTitle className="text-black text-lg">Filtrar por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.value)}
                    className={`${
                      selectedCategory === category.value 
                        ? "bg-blue-500 text-white" 
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border border-border/50">
              <CardHeader>
                <CardTitle className="text-black flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                  Cardápios e Catálogos
                  <Badge className="ml-2 bg-blue-100 text-blue-800">
                    {filteredCatalogs.length} item{filteredCatalogs.length !== 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredCatalogs.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Nenhum cardápio encontrado para esta categoria</p>
                    </div>
                  ) : (
                    filteredCatalogs.map((catalog) => (
                      <div key={catalog.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">{catalog.name}</h4>
                            <Badge className={getCategoryColor(catalog.category)}>
                              {categories.find(c => c.value === catalog.category)?.label}
                            </Badge>
                            <Badge className={catalog.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {catalog.active ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </div>
                          <Button variant="outline" size="sm" className="bg-white text-gray-900">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{catalog.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {catalog.items.slice(0, 3).map((item, idx) => (
                            <span key={idx} className="text-xs bg-white px-2 py-1 rounded border">
                              {item}
                            </span>
                          ))}
                          {catalog.items.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{catalog.items.length - 3} mais
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-border/50">
              <CardHeader>
                <CardTitle className="text-black flex items-center gap-2">
                  Conversas Recentes
                  <Badge className="ml-2 bg-blue-100 text-blue-800">
                    {filteredChats.length} conversa{filteredChats.length !== 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredChats.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Nenhuma conversa encontrada para esta categoria</p>
                    </div>
                  ) : (
                    filteredChats.map((chat) => (
                    <div key={chat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => window.open(`https://wa.me/5511999999999?text=Olá ${chat.clientName}, como posso ajudar?`, '_blank')}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900">{chat.clientName}</p>
                          <Badge className={getCategoryColor(chat.category)}>
                            {categories.find(c => c.value === chat.category)?.label}
                          </Badge>
                          <Badge className={`${getStatusColor(chat.status)} text-white text-xs`}>
                            {getStatusLabel(chat.status)}
                          </Badge>
                          {chat.unread > 0 && (
                            <Badge className="bg-red-500 text-white text-xs">
                              {chat.unread}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{chat.lastMessage}</p>
                        <p className="text-xs text-gray-500">{chat.timestamp}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-white text-gray-900"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://wa.me/5511999999999?text=Olá ${chat.clientName}, como posso ajudar?`, '_blank');
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                  )}
                </div>
                
                <Button 
                  className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => window.open('https://web.whatsapp.com/', '_blank')}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Abrir Mensagens Web
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Assistente IA */}
        <TabsContent value="bot" className="space-y-4">
          <Card className="bg-white border border-border/50">
            <CardHeader>
              <CardTitle className="text-black flex items-center gap-2">
                <Bot className="h-5 w-5 text-blue-600" />
                Atendimento Inteligente 24/7
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="bot-enabled" className="text-gray-900">Assistente Virtual Ativo</Label>
                    <Switch
                      id="bot-enabled"
                      checked={botEnabled}
                      onCheckedChange={setBotEnabled}
                    />
                  </div>
                  
                  <Alert className="bg-blue-50 border-blue-200">
                    <Bot className="h-4 w-4" />
                    <AlertDescription className="text-gray-700">
                      <strong>Configuração Atual:</strong> O bot responde automaticamente perguntas frequentes, sugere produtos e processa pedidos básicos.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Estatísticas do Bot</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">95%</div>
                        <div className="text-sm text-blue-700">Taxa de Resolução</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">1.2s</div>
                        <div className="text-sm text-green-700">Tempo de Resposta</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Respostas Automáticas</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">Horário de Funcionamento</p>
                      <p className="text-xs text-gray-600">Segunda a Sábado: 08h às 22h</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">Cardápio</p>
                      <p className="text-xs text-gray-600">Envia cardápio completo automaticamente</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">Status do Pedido</p>
                      <p className="text-xs text-gray-600">Consulta automática por número do pedido</p>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                    <Settings className="w-4 h-4 mr-2" />
                    Configurar Respostas
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Pedidos Automáticos */}
        <TabsContent value="pedidos" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border border-border/50">
              <CardHeader>
                <CardTitle className="text-black flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                  Pedidos e Pagamentos Automáticos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-payment" className="text-gray-900">Pagamento Automático</Label>
                    <Switch
                      id="auto-payment"
                      checked={autoPayment}
                      onCheckedChange={setAutoPayment}
                    />
                  </div>
                  
                  <Alert className="bg-purple-50 border-purple-200">
                    <Zap className="h-4 w-4" />
                    <AlertDescription className="text-gray-700">
                      <strong>Sistema Ativo:</strong> Compra rápida, pagamento seguro via PIX/Cartão e pedido direto para a cozinha, sem erros.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Métodos de Pagamento</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-900">PIX</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-900">Cartão de Crédito</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-900">Cartão de Débito</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-border/50">
              <CardHeader>
                <CardTitle className="text-black">Pedidos Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {automaticOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900">{order.clientName}</p>
                          <Badge className={`${getStatusColor(order.status)} text-white text-xs`}>
                            {getStatusLabel(order.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{order.product}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{order.amount}</span>
                          <span>•</span>
                          <span>{order.timestamp}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="bg-white text-gray-900">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full mt-4 bg-purple-500 hover:bg-purple-600 text-white">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Ver Todos os Pedidos
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Fidelização */}
        <TabsContent value="fidelizacao" className="space-y-4">
          <Card className="bg-white border border-border/50">
            <CardHeader>
              <CardTitle className="text-black flex items-center gap-2">
                <Gift className="h-5 w-5 text-pink-600" />
                Fidelize Clientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="bg-pink-50 border-pink-200 mb-4">
                <Heart className="h-4 w-4" />
                <AlertDescription className="text-gray-700">
                  <strong>Sistema Ativo:</strong> Tenha acesso aos dados, crie promoções personalizadas e mantenha o cliente sempre perto.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Campanhas Ativas</h4>
                  <div className="space-y-3">
                    {loyaltyCampaigns.map((campaign) => (
                      <div key={campaign.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-gray-900">{campaign.name}</p>
                          <Badge className={`${getStatusColor(campaign.status)} text-white text-xs`}>
                            {getStatusLabel(campaign.status)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <span>Alcance: {campaign.reach}</span>
                          <span>Conversões: {campaign.conversions}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Nova Campanha</h4>
                  <div className="space-y-3">
                    <Input 
                      placeholder="Nome da campanha"
                      className="bg-white text-gray-900"
                    />
                    <Textarea 
                      placeholder="Descrição da promoção"
                      className="bg-white text-gray-900"
                    />
                    <Input 
                      placeholder="Desconto (%)"
                      type="number"
                      className="bg-white text-gray-900"
                    />
                    <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                      <Send className="w-4 h-4 mr-2" />
                      Criar Campanha
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Suporte Humano */}
        <TabsContent value="suporte" className="space-y-4">
          <Card className="bg-white border border-border/50">
            <CardHeader>
              <CardTitle className="text-black flex items-center gap-2">
                <Phone className="h-5 w-5 text-orange-600" />
                Suporte Humano quando necessário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="human-support" className="text-gray-900">Escalação Automática</Label>
                    <Switch
                      id="human-support"
                      checked={humanSupport}
                      onCheckedChange={setHumanSupport}
                    />
                  </div>
                  
                  <Alert className="bg-orange-50 border-orange-200">
                    <Users className="h-4 w-4" />
                    <AlertDescription className="text-gray-700">
                      <strong>Sistema Inteligente:</strong> Automação que atende rápido, mas sempre com atendimento humano disponível para casos complexos.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Critérios de Escalação</h4>
                    <div className="space-y-2">
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="text-sm text-gray-900">• Reclamações ou problemas</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="text-sm text-gray-900">• Pedidos personalizados</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="text-sm text-gray-900">• Valores altos (acima de R$ 100)</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="text-sm text-gray-900">• Clientes VIP</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Atendentes Online</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900">Ana Silva</p>
                          <p className="text-sm text-gray-600">Atendendo 3 clientes</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500 text-white">Online</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900">Carlos Santos</p>
                          <p className="text-sm text-gray-600">Pausa - Volta em 5min</p>
                        </div>
                      </div>
                      <Badge className="bg-yellow-500 text-white">Pausa</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900">Maria Costa</p>
                          <p className="text-sm text-gray-600">Offline</p>
                        </div>
                      </div>
                      <Badge className="bg-gray-500 text-white">Offline</Badge>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    <Phone className="w-4 h-4 mr-2" />
                    Entrar em Atendimento
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AtendimentoSection;