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
            { id: 1, clientName: 'Restaurante Sabor', lastMessage: 'Pedido #1234 está pronto para entrega', timestamp: '16:10', status: 'unread', unread: 1, category: 'alimenticio' },
            { id: 2, clientName: 'Cliente VIP', lastMessage: 'Excelente como sempre!', timestamp: '15:30', status: 'read', unread: 0, category: 'alimenticio' }
          ],
          catalogs: [
            { id: 1, name: 'Cardápio Delivery', category: 'alimenticio', items: ['Pizza Margherita', 'Hambúrguer Artesanal', 'Salada Caesar', 'Açaí com Granola'], description: 'Pratos deliciosos para delivery', active: true, qrCode: 'QR_FOOD_001' },
            { id: 2, name: 'Menu Executivo', category: 'alimenticio', items: ['Prato Feito Completo', 'Suco Natural', 'Sobremesa do Dia', 'Café Expresso'], description: 'Almoço executivo completo', active: true, qrCode: 'QR_FOOD_002' }
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
                    <div key={chat.id} className="p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{chat.clientName}</h4>
                            <p className="text-sm text-gray-500">{chat.timestamp}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
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
                      <p className="text-gray-700 text-sm">{chat.lastMessage}</p>
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
                    <div key={catalog.id} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{catalog.name}</h4>
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
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {catalog.items.map((item, index) => (
                          <div key={index} className="p-2 bg-white rounded border text-sm text-gray-700">
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