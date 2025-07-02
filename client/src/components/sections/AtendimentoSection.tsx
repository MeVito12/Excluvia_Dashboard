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
import { useCategory, categories } from '@/contexts/CategoryContext';
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
  Filter,
  Search,
  ExternalLink,
  Share,
  Copy,
  Download
} from 'lucide-react';

const AtendimentoSection = () => {
  const { selectedCategory } = useCategory();
  const [activeTab, setActiveTab] = useState('mensagens');
  const [botEnabled, setBotEnabled] = useState(true);
  const [autoPayment, setAutoPayment] = useState(true);
  const [humanSupport, setHumanSupport] = useState(true);
  const [showQRCode, setShowQRCode] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Função para obter dados específicos por categoria
  const getCategorySpecificData = () => {
    switch (selectedCategory) {
      case 'pet':
        return {
          catalogName: 'Prateleira',
          chats: [
            { id: 1, clientName: 'Ana Oliveira', lastMessage: 'Quando é a próxima vacina do Max?', timestamp: '14:30', status: 'unread', unread: 2, category: 'pet' },
            { id: 2, clientName: 'Carlos Silva', lastMessage: 'Obrigado pelo atendimento!', timestamp: '14:15', status: 'read', unread: 0, category: 'pet' }
          ],
          catalogs: [
            { id: 1, name: 'Prateleira Pet Shop Premium', category: 'pet', items: ['Ração Golden Premium 15kg', 'Brinquedo Kong Classic', 'Medicamento Antiparasitário', 'Coleira Antipulgas'], description: 'Produtos premium para cães e gatos', active: true, qrCode: 'QR_PET_001' },
            { id: 2, name: 'Prateleira Veterinário', category: 'pet', items: ['Vacina V10', 'Exame de Sangue', 'Consulta Veterinária', 'Cirurgia Castração'], description: 'Serviços veterinários completos', active: true, qrCode: 'QR_PET_002' }
          ]
        };
      case 'saude':
        return {
          catalogName: 'Prateleira',
          chats: [
            { id: 1, clientName: 'Maria Santos', lastMessage: 'Preciso renovar minha receita', timestamp: '15:20', status: 'unread', unread: 1, category: 'saude' },
            { id: 2, clientName: 'João Costa', lastMessage: 'Medicamento chegou, obrigado!', timestamp: '14:45', status: 'read', unread: 0, category: 'saude' }
          ],
          catalogs: [
            { id: 1, name: 'Prateleira Farmácia Central', category: 'saude', items: ['Dipirona 500mg', 'Vitamina D3', 'Suplemento Ômega 3', 'Kit Primeiros Socorros'], description: 'Medicamentos e produtos de saúde', active: true, qrCode: 'QR_SAUDE_001' },
            { id: 2, name: 'Prateleira Clínica Médica', category: 'saude', items: ['Consulta Clínico Geral', 'Exame Cardiológico', 'Fisioterapia', 'Check-up Completo'], description: 'Serviços médicos especializados', active: true, qrCode: 'QR_SAUDE_002' }
          ]
        };
      case 'alimenticio':
        return {
          catalogName: 'Cardápio e Menu',
          chats: [
            { id: 1, clientName: 'Maria Silva', lastMessage: '🤖 Bot: Perfeito! Seu Combo Família (2 pizzas grandes + refrigerante 2L + sobremesa) ficou R$ 89,90. Link de pagamento: pay.link/combo-familia-001', timestamp: '18:45', status: 'unread', unread: 2, category: 'alimenticio', isBot: true, orderValue: 89.90 },
            { id: 2, clientName: 'João Carlos', lastMessage: 'Quais ingredientes vêm no Burger Vegano?', timestamp: '18:30', status: 'unread', unread: 1, category: 'alimenticio', isBot: false },
            { id: 3, clientName: 'Ana Costa', lastMessage: '🤖 Bot: Pagamento confirmado! ✅ Pedido #2847 enviado para cozinha. Tempo estimado: 25 minutos. Acompanhe: track.link/2847', timestamp: '18:15', status: 'read', unread: 0, category: 'alimenticio', isBot: true, orderConfirmed: true },
            { id: 4, clientName: 'Roberto Almeida', lastMessage: 'Vocês têm alguma opção sem glúten?', timestamp: '18:00', status: 'unread', unread: 1, category: 'alimenticio', isBot: false },
            { id: 5, clientName: 'Família Santos', lastMessage: '🤖 Bot: Encontrei 5 opções sem glúten no cardápio! Pizza Margherita (massa sem glúten), Salada Caesar, Suco Natural, Brownie sem glúten e Frango Grelhado. Qual te interessa?', timestamp: '17:45', status: 'read', unread: 0, category: 'alimenticio', isBot: true },
            { id: 6, clientName: 'Pedro Lima', lastMessage: 'Qual o valor da taxa de entrega para Vila Madalena?', timestamp: '17:30', status: 'unread', unread: 1, category: 'alimenticio', isBot: false },
            { id: 7, clientName: 'Carla Fernandes', lastMessage: '🤖 Bot: Taxa de entrega para Vila Madalena: R$ 8,90. Pedidos acima de R$ 60,00 têm frete grátis! 🚚 Tempo estimado: 30-40 min.', timestamp: '17:15', status: 'read', unread: 0, category: 'alimenticio', isBot: true },
            { id: 8, clientName: 'Lucas Mendes', lastMessage: 'Qual o horário de funcionamento hoje?', timestamp: '17:00', status: 'unread', unread: 1, category: 'alimenticio', isBot: false },
            { id: 9, clientName: 'Fernanda Oliveira', lastMessage: '🤖 Bot: Hoje funcionamos das 11h às 23h! 🕐 Delivery até 22h30. Final de semana até 00h. Está pronto para fazer seu pedido?', timestamp: '16:45', status: 'read', unread: 0, category: 'alimenticio', isBot: true },
            { id: 10, clientName: 'Gabriel Torres', lastMessage: 'Quero um "Combo Família", o que ele inclui?', timestamp: '16:30', status: 'unread', unread: 1, category: 'alimenticio', isBot: false }
          ],
          catalogs: [
            { 
              id: 1, 
              name: 'Cardápio WhatsApp Inteligente', 
              category: 'alimenticio', 
              items: [
                'Pizza Margherita R$ 32,90',
                'Burger Vegano R$ 28,50', 
                'Combo Família R$ 89,90',
                'Opções sem Glúten (5 pratos)',
                'Sobremesas Artesanais',
                'Bebidas e Sucos Naturais'
              ], 
              description: 'Cardápio completo com atendimento 24/7 via WhatsApp. Bot inteligente responde dúvidas, sugere pratos e processa pedidos automaticamente.', 
              active: true, 
              qrCode: 'QR_CARDAPIO_SMART_001',
              features: [
                'Atendimento 24/7 com IA',
                'Pedidos automáticos',
                'Pagamento integrado',
                'Rastreamento de entrega',
                'Sugestões personalizadas'
              ]
            },
            { 
              id: 2, 
              name: 'Menu Delivery Premium', 
              category: 'alimenticio', 
              items: [
                'Pratos Executivos R$ 24,90', 
                'Pizzas Gourmet (8 sabores)', 
                'Hambúrguers Artesanais', 
                'Saladas Premium',
                'Açaí e Smoothies',
                'Combos Promocionais'
              ], 
              description: 'Menu premium com entrega rápida. Sistema automatizado de pedidos com confirmação instantânea para a cozinha.', 
              active: true, 
              qrCode: 'QR_MENU_PREMIUM_002',
              features: [
                'Entrega expressa',
                'Pagamento seguro',
                'Notificação automática',
                'Combo inteligente',
                'Frete grátis acima R$ 60'
              ]
            }
          ],
          botFeatures: [
            {
              title: 'Atendimento Inteligente 24/7',
              description: 'Assistente virtual responde dúvidas sobre ingredientes, alergênicos, horários e preços instantaneamente.',
              icon: Bot,
              examples: [
                'Quais ingredientes vêm no Burger Vegano?',
                'Vocês têm opção sem glúten?',
                'Qual o horário de funcionamento hoje?'
              ]
            },
            {
              title: 'Pedidos Automáticos',
              description: 'Cliente escolhe pratos na conversa, sistema calcula total e gera link de pagamento personalizado.',
              icon: ShoppingCart,
              examples: [
                'Combo calculado automaticamente',
                'Link de pagamento instantâneo',
                'Confirmação em tempo real'
              ]
            },
            {
              title: 'Pagamento Simplificado',
              description: 'Pagamento aprovado é enviado automaticamente para cozinha com todos os detalhes do pedido.',
              icon: CreditCard,
              examples: [
                'Pagamento seguro via PIX/Cartão',
                'Pedido enviado para cozinha',
                'Rastreamento automático'
              ]
            }
          ]
        };
      case 'vendas':
        return {
          catalogName: 'Catálogo',
          chats: [
            { id: 1, clientName: 'Digital Solutions Corp', lastMessage: 'Orçamento aprovado! Podem enviar os 3 MacBook Air M3. Quando fica pronta a entrega?', timestamp: '17:45', status: 'unread', unread: 2, category: 'vendas' },
            { id: 2, clientName: 'MegaTech Distribuidora', lastMessage: 'Perfeito! Fechamos 50 Samsung Galaxy S24 Ultra. Preciso da nota fiscal até amanhã.', timestamp: '17:30', status: 'unread', unread: 1, category: 'vendas' },
            { id: 3, clientName: 'GameZone Loja de Games', lastMessage: 'Os 10 PlayStation 5 chegaram hoje! Qualidade excelente como sempre. Próximo pedido: 15 Xbox Series X.', timestamp: '17:15', status: 'read', unread: 0, category: 'vendas' },
            { id: 4, clientName: 'Hotel Presidente', lastMessage: 'Instalação das 8 Smart TVs Samsung foi um sucesso! Hóspedes adoraram. Vamos conversar sobre ar condicionados agora.', timestamp: '16:50', status: 'unread', unread: 3, category: 'vendas' },
            { id: 5, clientName: 'Escola Técnica Moderna', lastMessage: 'Configuração dos 15 iPads Pro está perfeita! Alunos já estão usando. Agradecemos o suporte técnico impecável.', timestamp: '16:35', status: 'read', unread: 0, category: 'vendas' },
            { id: 6, clientName: 'Pedro Santos Silva', lastMessage: 'iPhone 15 Pro Max funcionando perfeitamente! Migração de dados foi rápida. Recomendo vocês para meus colegas.', timestamp: '16:20', status: 'read', unread: 0, category: 'vendas' },
            { id: 7, clientName: 'SportMax Artigos Esportivos', lastMessage: 'Linha Adidas chegou hoje! 20 Tênis Ultraboost vendidos em 2 horas. Podem enviar mais 30 unidades?', timestamp: '16:05', status: 'unread', unread: 2, category: 'vendas' },
            { id: 8, clientName: 'Café Central Escritórios', lastMessage: 'As 12 Cafeteiras Nespresso estão instaladas em todos os andares. Funcionários adoraram! Precisamos de mais cápsulas.', timestamp: '15:45', status: 'read', unread: 0, category: 'vendas' },
            { id: 9, clientName: 'Agência Publicidade Criativa', lastMessage: 'Monitores LG UltraWide aumentaram nossa produtividade em 40%! Designers estão muito satisfeitos. Vamos ampliar a compra.', timestamp: '15:30', status: 'unread', unread: 1, category: 'vendas' },
            { id: 10, clientName: 'TechFix Informática Ltda', lastMessage: 'Notebooks Dell Inspiron com desconto corporativo aprovado! Enviem os 5 notebooks esta semana.', timestamp: '15:15', status: 'read', unread: 0, category: 'vendas' },
            { id: 11, clientName: 'Construtora Moderna', lastMessage: 'Kits Ferramentas Bosch chegaram! Qualidade profissional excelente. Próximo pedido: furadeiras e parafusadeiras.', timestamp: '15:00', status: 'unread', unread: 3, category: 'vendas' },
            { id: 12, clientName: 'Maria Fernanda Costa', lastMessage: 'Dois Galaxy S24 Ultra entregues! Câmera profissional é impressionante. Marido também quer um iPhone agora.', timestamp: '14:45', status: 'read', unread: 0, category: 'vendas' },
            { id: 13, clientName: 'Livraria Conhecimento', lastMessage: '40 exemplares "Pai Rico, Pai Pobre" vendidos em uma semana! Podem enviar mais 60 livros de negócios?', timestamp: '14:30', status: 'unread', unread: 2, category: 'vendas' },
            { id: 14, clientName: 'Universidade TechnoSul', lastMessage: 'Licitação dos 30 Kindles Paperwhite aprovada! Biblioteca digital será revolucionária. Quando podem entregar?', timestamp: '14:15', status: 'unread', unread: 1, category: 'vendas' },
            { id: 15, clientName: 'Casa & Decoração Ltda', lastMessage: '25 Air Fryers Philips voaram das prateleiras! Clientes amaram a qualidade. Precisamos de mais 50 unidades urgente.', timestamp: '14:00', status: 'read', unread: 0, category: 'vendas' },
            { id: 16, clientName: 'Startup InnovaTech', lastMessage: 'Setup completo entregue! Equipe trabalhando com máxima produtividade. Vocês são nossos parceiros oficiais de tecnologia!', timestamp: '13:45', status: 'unread', unread: 4, category: 'vendas' }
          ],
          catalogs: [
            { id: 1, name: 'Catálogo Eletrônicos', category: 'vendas', items: ['iPhone 15 Pro', 'Notebook Dell Inspiron', 'Smart TV Samsung 55"', 'Fone Bluetooth Sony'], description: 'Eletrônicos de última geração', active: true, qrCode: 'QR_VENDAS_001' },
            { id: 2, name: 'Catálogo Geral', category: 'vendas', items: ['Roupas Masculinas', 'Produtos para Casa', 'Artigos Esportivos', 'Livros e Revistas'], description: 'Produtos diversificados para todas as necessidades', active: true, qrCode: 'QR_VENDAS_002' }
          ]
        };
      case 'design':
        return {
          catalogName: 'Catálogo',
          chats: [
            { id: 1, clientName: 'Startup Tech', lastMessage: 'Adorei o logo! Quando fica pronto?', timestamp: '18:15', status: 'unread', unread: 2, category: 'design' },
            { id: 2, clientName: 'Empresa Local', lastMessage: 'Material gráfico aprovado', timestamp: '17:45', status: 'read', unread: 0, category: 'design' }
          ],
          catalogs: [
            { id: 1, name: 'Catálogo Design Gráfico', category: 'design', items: ['Logotipo Profissional', 'Identidade Visual Completa', 'Material Gráfico', 'Design para Redes Sociais'], description: 'Serviços de design profissional', active: true, qrCode: 'QR_DESIGN_001' },
            { id: 2, name: 'Catálogo Branding', category: 'design', items: ['Branding Completo', 'Manual da Marca', 'Apresentação Corporativa', 'Papelaria Personalizada'], description: 'Soluções completas de branding', active: true, qrCode: 'QR_DESIGN_002' }
          ]
        };
      case 'sites':
        return {
          catalogName: 'Catálogo',
          chats: [
            { id: 1, clientName: 'E-commerce Client', lastMessage: 'Site está funcionando perfeitamente!', timestamp: '19:30', status: 'read', unread: 0, category: 'sites' },
            { id: 2, clientName: 'Agência Parceira', lastMessage: 'Preciso de uma landing page urgente', timestamp: '18:50', status: 'unread', unread: 1, category: 'sites' }
          ],
          catalogs: [
            { id: 1, name: 'Catálogo Desenvolvimento Web', category: 'sites', items: ['Site Institucional', 'E-commerce Completo', 'Landing Page', 'Sistema Web Personalizado'], description: 'Desenvolvimento web profissional', active: true, qrCode: 'QR_SITES_001' },
            { id: 2, name: 'Catálogo Marketing Digital', category: 'sites', items: ['SEO Otimização', 'Google Ads', 'Redes Sociais', 'E-mail Marketing'], description: 'Estratégias de marketing digital', active: true, qrCode: 'QR_SITES_002' }
          ]
        };
      default:
        return {
          catalogName: 'Catálogo',
          chats: [],
          catalogs: []
        };
    }
  };

  const { catalogName, chats, catalogs } = getCategorySpecificData();

  // Filtrar dados por busca
  const filteredChats = chats.filter(chat => 
    chat.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredCatalogs = catalogs.filter(catalog => 
    catalog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    catalog.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Atendimento ao Cliente</h1>
        <p className="text-gray-300">
          {categories.find(c => c.value === selectedCategory)?.label || 'Categoria Selecionada'} - Mensagens, {catalogName}s e automação de atendimento
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white border border-border/50 rounded-lg p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar conversas, catálogos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white text-gray-900 border-border/50"
          />
        </div>
      </div>

      {/* Seção Especial: Bot Alimentício Inteligente */}
      {selectedCategory === 'alimenticio' && getCategorySpecificData().botFeatures && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-orange-800 mb-2">
              🍽️ Seu Cardápio ao Alcance de Todos, Pelo WhatsApp!
            </h2>
            <p className="text-orange-700">
              Sistema inteligente de atendimento 24/7 com pedidos automáticos e pagamentos integrados
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {getCategorySpecificData().botFeatures?.map((feature, index) => (
              <Card key={index} className="bg-white border border-orange-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                      <feature.icon className="h-8 w-8 text-orange-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide">
                      Exemplos:
                    </p>
                    {feature.examples.map((example, idx) => (
                      <div key={idx} className="bg-orange-50 rounded p-2">
                        <p className="text-xs text-orange-800">"'{example}'"</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Compra Rápida e Fácil:</strong> Cliente escolhe itens na conversa → Sistema calcula tudo → 
                Gera link de pagamento seguro → Pagamento confirmado → Pedido enviado automaticamente para cozinha!
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}

      {/* Configurações de Automação */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bot className="h-8 w-8 text-blue-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">Bot Inteligente</h3>
                  <p className="text-sm text-gray-500">24/7 atendimento automático</p>
                </div>
              </div>
              <Switch checked={botEnabled} onCheckedChange={setBotEnabled} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-8 w-8 text-green-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">Pagamento Automático</h3>
                  <p className="text-sm text-gray-500">PIX e cartão integrados</p>
                </div>
              </div>
              <Switch checked={autoPayment} onCheckedChange={setAutoPayment} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-purple-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">Suporte Humano</h3>
                  <p className="text-sm text-gray-500">Escalação inteligente</p>
                </div>
              </div>
              <Switch checked={humanSupport} onCheckedChange={setHumanSupport} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Conteúdo */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mensagens" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Mensagens
          </TabsTrigger>
          <TabsTrigger value="catalogos" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            {catalogName}s
          </TabsTrigger>
          <TabsTrigger value="automacao" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Automação
          </TabsTrigger>
        </TabsList>

        {/* Tab Mensagens */}
        <TabsContent value="mensagens">
          <Card className="bg-white border border-border/50">
            <CardHeader>
              <CardTitle className="text-black flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-600" />
                Conversas Ativas
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
                    <div key={chat.id} className={`p-3 rounded-lg border ${
                      selectedCategory === 'alimenticio' && (chat as any).isBot 
                        ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            selectedCategory === 'alimenticio' && (chat as any).isBot 
                              ? 'bg-green-100' 
                              : 'bg-blue-100'
                          }`}>
                            {selectedCategory === 'alimenticio' && (chat as any).isBot ? (
                              <Bot className="w-5 h-5 text-green-600" />
                            ) : (
                              <Users className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {chat.clientName}
                              {selectedCategory === 'alimenticio' && (chat as any).isBot && (
                                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                  🤖 Atendimento Automático
                                </span>
                              )}
                            </h4>
                            <p className="text-sm text-gray-500">{chat.timestamp}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedCategory === 'alimenticio' && (chat as any).orderValue && (
                            <Badge className="bg-orange-100 text-orange-800">
                              R$ {(chat as any).orderValue.toFixed(2)}
                            </Badge>
                          )}
                          {selectedCategory === 'alimenticio' && (chat as any).orderConfirmed && (
                            <Badge className="bg-green-100 text-green-800">
                              ✅ Pedido Confirmado
                            </Badge>
                          )}
                          {chat.unread > 0 && (
                            <Badge className="bg-red-100 text-red-800">
                              {chat.unread} nova{chat.unread !== 1 ? 's' : ''}
                            </Badge>
                          )}
                          <Badge className={chat.status === 'unread' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                            {chat.status === 'unread' ? 'Não lida' : 'Lida'}
                          </Badge>
                        </div>
                      </div>
                      <p className={`text-sm ${
                        selectedCategory === 'alimenticio' && (chat as any).isBot 
                          ? 'text-green-800 font-medium' 
                          : 'text-gray-700'
                      }`}>
                        {chat.lastMessage}
                      </p>
                      
                      {selectedCategory === 'alimenticio' && (chat as any).isBot && (chat as any).orderValue && (
                        <div className="mt-2 p-2 bg-white rounded border border-green-200">
                          <p className="text-xs text-green-700">
                            💳 Sistema processou pedido automaticamente - Link de pagamento gerado
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Catálogos/Cardápios */}
        <TabsContent value="catalogos">
          <Card className="bg-white border border-border/50">
            <CardHeader>
              <CardTitle className="text-black flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-purple-600" />
                {catalogName}s e Menus
                <Badge className="ml-2 bg-blue-100 text-blue-800">
                  {filteredCatalogs.length} item{filteredCatalogs.length !== 1 ? 's' : ''}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCatalogs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Nenhum {catalogName.toLowerCase()} encontrado para esta categoria</p>
                  </div>
                ) : (
                  filteredCatalogs.map((catalog) => (
                    <div key={catalog.id} className={`p-4 rounded-lg border ${
                      selectedCategory === 'alimenticio' 
                        ? 'bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {catalog.name}
                            {selectedCategory === 'alimenticio' && (
                              <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                                🚀 Sistema Inteligente
                              </span>
                            )}
                          </h4>
                          <p className="text-sm text-gray-500">{catalog.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={catalog.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {catalog.active ? 'Ativo' : 'Inativo'}
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowQRCode(showQRCode === catalog.id ? null : catalog.id)}
                          >
                            <QrCode className="w-4 h-4 mr-1" />
                            QR Code
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share className="w-4 h-4 mr-1" />
                            Compartilhar
                          </Button>
                        </div>
                      </div>
                      
                      {/* Funcionalidades especiais para categoria alimentícia */}
                      {selectedCategory === 'alimenticio' && (catalog as any).features && (
                        <div className="mb-4 p-3 bg-white rounded-lg border border-orange-200">
                          <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-2">
                            🤖 Funcionalidades Automáticas:
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {(catalog as any).features.map((feature: string, idx: number) => (
                              <div key={idx} className="flex items-center gap-1 text-xs text-orange-800">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {catalog.items.map((item, index) => (
                          <div key={index} className={`p-2 rounded border text-sm ${
                            selectedCategory === 'alimenticio' 
                              ? 'bg-white border-orange-200 text-orange-800 font-medium' 
                              : 'bg-white border-gray-200 text-gray-700'
                          }`}>
                            {item}
                          </div>
                        ))}
                      </div>
                      {showQRCode === catalog.id && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-medium text-gray-900">QR Code - {catalog.name}</h5>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setShowQRCode(null)}
                            >
                              ✕
                            </Button>
                          </div>
                          <div className="flex flex-col items-center space-y-3">
                            <div className="w-32 h-32 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                              <div className="w-24 h-24 bg-black rounded" style={{
                                backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                                    <rect width="100" height="100" fill="white"/>
                                    <g fill="black">
                                      <rect x="0" y="0" width="7" height="7"/>
                                      <rect x="8" y="0" width="7" height="7"/>
                                      <rect x="16" y="0" width="7" height="7"/>
                                      <rect x="32" y="0" width="7" height="7"/>
                                      <rect x="48" y="0" width="7" height="7"/>
                                      <rect x="56" y="0" width="7" height="7"/>
                                      <rect x="72" y="0" width="7" height="7"/>
                                      <rect x="80" y="0" width="7" height="7"/>
                                      <rect x="88" y="0" width="7" height="7"/>
                                      <rect x="0" y="8" width="7" height="7"/>
                                      <rect x="16" y="8" width="7" height="7"/>
                                      <rect x="32" y="8" width="7" height="7"/>
                                      <rect x="56" y="8" width="7" height="7"/>
                                      <rect x="72" y="8" width="7" height="7"/>
                                      <rect x="88" y="8" width="7" height="7"/>
                                    </g>
                                  </svg>
                                `)}")`,
                                backgroundSize: 'cover'
                              }}></div>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-600 mb-2">
                                Escaneie para acessar o catálogo
                              </p>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Copy className="w-4 h-4 mr-1" />
                                  Copiar Link
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Download className="w-4 h-4 mr-1" />
                                  Baixar QR
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Automação */}
        <TabsContent value="automacao">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white border border-border/50">
              <CardHeader>
                <CardTitle className="text-black flex items-center gap-2">
                  <Gift className="h-5 w-5 text-orange-500" />
                  Campanhas de Fidelidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-green-900">Desconto 10% - Clientes VIP</h4>
                        <p className="text-sm text-green-600">245 alcançados • 38 conversões</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Ativa</Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-blue-900">Cashback 5%</h4>
                        <p className="text-sm text-blue-600">890 alcançados • 156 conversões</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Ativa</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-border/50">
              <CardHeader>
                <CardTitle className="text-black flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Automações Inteligentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <Bot className="h-4 w-4" />
                    <AlertDescription>
                      <strong>IA 24/7:</strong> Respostas automáticas para {selectedCategory === 'alimenticio' ? 'pedidos' : 'consultas'} 
                      e {selectedCategory === 'vendas' ? 'orçamentos' : selectedCategory === 'pet' ? 'agendamentos' : 'informações'}.
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <CreditCard className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Pagamentos:</strong> PIX e cartão com integração automática 
                      {selectedCategory === 'alimenticio' ? ' para pedidos delivery.' : ' para produtos e serviços.'}
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <Users className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Escalação:</strong> Transfer inteligente para humanos quando necessário.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AtendimentoSection;