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
import ModernIcon from '@/components/ui/modern-icon';
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
            { id: 1, clientName: 'Ana Oliveira', lastMessage: '🤖 Bot: Vacina V10 do Max está agendada para 15/07. Lembretes automáticos ativados! 📅', timestamp: '14:30', status: 'unread', unread: 2, category: 'pet', isBot: true, serviceScheduled: true },
            { id: 2, clientName: 'Carlos Silva', lastMessage: 'Meu gato está com tosse, é urgente?', timestamp: '14:15', status: 'unread', unread: 1, category: 'pet', isBot: false },
            { id: 3, clientName: 'Maria Santos', lastMessage: '🤖 Bot: Sintomas indicam consulta veterinária. Agendamento automático disponível para hoje 16h. Confirmar?', timestamp: '14:00', status: 'read', unread: 0, category: 'pet', isBot: true, urgentCase: true },
            { id: 4, clientName: 'Pedro Lima', lastMessage: 'Que ração vocês recomendam para filhote de labrador?', timestamp: '13:45', status: 'unread', unread: 1, category: 'pet', isBot: false },
            { id: 5, clientName: 'Família Costa', lastMessage: '🤖 Bot: Para filhotes de labrador recomendo Royal Canin Puppy Large. Rico em nutrientes essenciais. Entrega hoje mesmo!', timestamp: '13:30', status: 'read', unread: 0, category: 'pet', isBot: true, productRecommended: true }
          ],
          catalogs: [
            { 
              id: 1, 
              name: 'Prateleira Pet Shop Inteligente', 
              category: 'pet', 
              items: ['Ração Royal Canin Premium', 'Brinquedo Kong Interativo', 'Medicamento Antipulgas', 'Coleira GPS Smart'], 
              description: 'Produtos premium com recomendações personalizadas baseadas na raça, idade e necessidades do pet', 
              active: true, 
              qrCode: 'QR_PET_001',
              features: [
                'Recomendação por raça/idade',
                'Lembretes de vacinação',
                'Consulta express online',
                'Entrega emergencial',
                'Histórico médico digital'
              ]
            },
            { 
              id: 2, 
              name: 'Veterinário Automatizado', 
              category: 'pet', 
              items: ['Consulta Online 24h', 'Agendamento Inteligente', 'Diagnóstico Pré-análise', 'Receituário Digital'], 
              description: 'Atendimento veterinário com triagem automática, agendamentos inteligentes e diagnósticos preliminares', 
              active: true, 
              qrCode: 'QR_PET_002',
              features: [
                'Triagem automática 24/7',
                'Agendamento por urgência',
                'Histórico completo',
                'Receitas digitais',
                'Lembretes automáticos'
              ]
            }
          ],
          botFeatures: [
            {
              title: 'Triagem Veterinária 24/7',
              description: 'Sistema analisa sintomas relatados e sugere nível de urgência, agendamentos automáticos ou orientações básicas.',
              icon: Bot,
              examples: [
                'Meu gato está com tosse, é urgente?',
                'Quando é a próxima vacina?',
                'Que ração é melhor para meu cachorro?'
              ]
            },
            {
              title: 'Recomendações Personalizadas',
              description: 'Com base na raça, idade e histórico, sugere produtos específicos e cria lembretes de cuidados.',
              icon: Heart,
              examples: [
                'Ração personalizada por raça',
                'Cronograma de vacinação automático',
                'Produtos recomendados por idade'
              ]
            },
            {
              title: 'Agendamento Inteligente',
              description: 'Identifica emergências e agenda consultas automáticas com base na disponibilidade e urgência.',
              icon: Clock,
              examples: [
                'Agendamento por urgência',
                'Lembretes de consulta',
                'Disponibilidade em tempo real'
              ]
            }
          ]
        };
      case 'saude':
        return {
          catalogName: 'Prateleira',
          chats: [
            { id: 1, clientName: 'Maria Santos', lastMessage: '🤖 Bot: Receita de Losartana renovada automaticamente! Entrega agendada para amanhã 14h. Lembrete de dosagem ativado 💊', timestamp: '15:20', status: 'unread', unread: 1, category: 'saude', isBot: true, prescriptionRenewed: true },
            { id: 2, clientName: 'João Costa', lastMessage: 'Estou sentindo dor no peito, devo me preocupar?', timestamp: '15:10', status: 'unread', unread: 2, category: 'saude', isBot: false },
            { id: 3, clientName: 'Ana Paula', lastMessage: '🤖 Bot: Sintomas indicam avaliação médica urgente. Telemedicina disponível agora ou consulta presencial em 30min. Escolha?', timestamp: '15:00', status: 'read', unread: 0, category: 'saude', isBot: true, urgentConsultation: true },
            { id: 4, clientName: 'Carlos Mendes', lastMessage: 'Minha pressão está 140x90, é normal?', timestamp: '14:45', status: 'unread', unread: 1, category: 'saude', isBot: false },
            { id: 5, clientName: 'Família Silva', lastMessage: '🤖 Bot: Pressão ligeiramente alta. Recomendo monitoramento. Agendamento com cardiologista para esta semana? Kit pressão em promoção.', timestamp: '14:30', status: 'read', unread: 0, category: 'saude', isBot: true, healthMonitoring: true }
          ],
          catalogs: [
            { 
              id: 1, 
              name: 'Farmácia Inteligente 24h', 
              category: 'saude', 
              items: ['Medicamentos Controlados', 'Vitaminas Personalizadas', 'Kit Monitoramento', 'Entrega Express'], 
              description: 'Farmácia com prescrições automáticas, lembretes de dosagem e monitoramento de saúde integrado', 
              active: true, 
              qrCode: 'QR_SAUDE_001',
              features: [
                'Renovação automática receitas',
                'Lembretes de medicação',
                'Interações medicamentosas',
                'Entrega emergencial 24h',
                'Monitoramento de efeitos'
              ]
            },
            { 
              id: 2, 
              name: 'Clínica Telemedicina Avançada', 
              category: 'saude', 
              items: ['Consulta Imediata 24h', 'Diagnóstico AI-Assistido', 'Monitoramento Remoto', 'Prescrição Digital'], 
              description: 'Atendimento médico com triagem inteligente, diagnósticos assistidos por IA e monitoramento contínuo', 
              active: true, 
              qrCode: 'QR_SAUDE_002',
              features: [
                'Triagem por sintomas IA',
                'Consulta imediata 24/7',
                'Diagnóstico assistido',
                'Receitas digitais seguras',
                'Histórico médico completo'
              ]
            }
          ],
          botFeatures: [
            {
              title: 'Triagem Médica Inteligente',
              description: 'Analisa sintomas relatados e determina nível de urgência, direcionando para telemedicina ou atendimento presencial.',
              icon: Bot,
              examples: [
                'Estou com dor no peito, é urgente?',
                'Minha pressão está alta, o que fazer?',
                'Posso renovar minha receita?'
              ]
            },
            {
              title: 'Prescrições Automáticas',
              description: 'Renova receitas automaticamente, verifica interações medicamentosas e cria lembretes de dosagem.',
              icon: Heart,
              examples: [
                'Renovação automática de receitas',
                'Alertas de interação medicamentosa',
                'Lembretes de horário da medicação'
              ]
            },
            {
              title: 'Monitoramento Contínuo',
              description: 'Acompanha sinais vitais e exames, alertando sobre mudanças e sugerindo consultas preventivas.',
              icon: TrendingUp,
              examples: [
                'Monitoramento de pressão arterial',
                'Alertas de exames em atraso',
                'Consultas preventivas sugeridas'
              ]
            }
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
            { id: 1, clientName: 'Digital Solutions Corp', lastMessage: '🤖 Bot: Orçamento de 3 MacBook Air M3 aprovado (R$ 29.997,00)! Entrega expressa disponível para amanhã. Pagamento confirmado?', timestamp: '17:45', status: 'unread', unread: 2, category: 'vendas', isBot: true, orderValue: 29997.00 },
            { id: 2, clientName: 'MegaTech Distribuidora', lastMessage: 'Preciso de um orçamento para 100 smartphones Samsung', timestamp: '17:30', status: 'unread', unread: 1, category: 'vendas', isBot: false },
            { id: 3, clientName: 'Empresa Local', lastMessage: '🤖 Bot: Orçamento para 100 Samsung Galaxy S24 gerado! Total: R$ 89.900,00 com desconto corporativo (10%). Nota fiscal programada.', timestamp: '17:15', status: 'read', unread: 0, category: 'vendas', isBot: true, corporateDiscount: true },
            { id: 4, clientName: 'GameZone Loja', lastMessage: 'Xbox Series X ainda tem estoque?', timestamp: '16:50', status: 'unread', unread: 1, category: 'vendas', isBot: false },
            { id: 5, clientName: 'Hotel Presidente', lastMessage: '🤖 Bot: Xbox Series X em estoque! 25 unidades disponíveis. Desconto para volume: 15% acima de 10 unidades. Interessado?', timestamp: '16:35', status: 'read', unread: 0, category: 'vendas', isBot: true, bulkDiscount: true }
          ],
          catalogs: [
            { 
              id: 1, 
              name: 'Catálogo Inteligente B2B', 
              category: 'vendas', 
              items: ['iPhone 15 Pro Max', 'MacBook Air M3', 'Samsung Galaxy S24 Ultra', 'Notebooks Corporativos'], 
              description: 'Catálogo com preços dinâmicos, descontos automáticos por volume e orçamentos instantâneos para empresas', 
              active: true, 
              qrCode: 'QR_VENDAS_001',
              features: [
                'Orçamento automático por volume',
                'Desconto corporativo instantâneo',
                'Consulta de estoque em tempo real',
                'Nota fiscal automática',
                'Entrega programada'
              ]
            },
            { 
              id: 2, 
              name: 'Marketplace Automatizado', 
              category: 'vendas', 
              items: ['Eletrônicos Premium', 'Artigos Esportivos', 'Casa & Decoração', 'Livros e E-books'], 
              description: 'Sistema automatizado que sugere produtos baseado no histórico de compras e negocia preços automaticamente', 
              active: true, 
              qrCode: 'QR_VENDAS_002',
              features: [
                'Sugestões personalizadas',
                'Negociação automática de preços',
                'Histórico de compras',
                'Alertas de promoção',
                'Frete otimizado'
              ]
            }
          ],
          botFeatures: [
            {
              title: 'Orçamentos Automáticos',
              description: 'Sistema calcula preços, aplica descontos corporativos e gera orçamentos detalhados instantaneamente baseado no volume.',
              icon: Bot,
              examples: [
                'Preciso de 100 smartphones Samsung',
                'Qual o preço para 50 notebooks?',
                'Desconto para pedido empresarial?'
              ]
            },
            {
              title: 'Gestão de Estoque Inteligente',
              description: 'Consulta estoque em tempo real, sugere produtos alternativos e programa entregas automáticas.',
              icon: TrendingUp,
              examples: [
                'Consulta de disponibilidade instantânea',
                'Sugestões de produtos similares',
                'Alertas de reposição automática'
              ]
            },
            {
              title: 'Negociação Automatizada',
              description: 'Aplica descontos por volume, calcula fretes otimizados e processa pedidos com nota fiscal automática.',
              icon: CreditCard,
              examples: [
                'Desconto automático por volume',
                'Frete otimizado por região',
                'Nota fiscal instantânea'
              ]
            }
          ]
        };
      case 'design':
        return {
          catalogName: 'Catálogo',
          chats: [
            { id: 1, clientName: 'Startup Tech', lastMessage: '🤖 Bot: Logo criado automaticamente! 3 variações baseadas no seu briefing. Aprovação em 24h. Preview disponível no link.', timestamp: '18:15', status: 'unread', unread: 2, category: 'design', isBot: true, autoDesign: true },
            { id: 2, clientName: 'Empresa Local', lastMessage: 'Preciso de uma identidade visual completa urgente', timestamp: '17:45', status: 'unread', unread: 1, category: 'design', isBot: false },
            { id: 3, clientName: 'Café Central', lastMessage: '🤖 Bot: Identidade visual para cafeteria criada! Logo, cardápio, uniforme e sinalização. Estilo minimalista moderno aplicado.', timestamp: '17:30', status: 'read', unread: 0, category: 'design', isBot: true, fullBranding: true }
          ],
          catalogs: [
            { 
              id: 1, 
              name: 'Design Automatizado AI', 
              category: 'design', 
              items: ['Logo Generator AI', 'Identidade Visual Express', 'Social Media Automático', 'Material Gráfico Inteligente'], 
              description: 'Sistema de design automatizado que cria logotipos, identidades visuais e materiais baseado em briefing inteligente', 
              active: true, 
              qrCode: 'QR_DESIGN_001',
              features: [
                'Criação automática de logos',
                'Identidade visual completa',
                'Templates personalizados',
                'Revisões ilimitadas',
                'Entrega em 24h'
              ]
            },
            { 
              id: 2, 
              name: 'Branding Intelligence', 
              category: 'design', 
              items: ['Análise de Mercado AI', 'Posicionamento Automático', 'Manual da Marca Digital', 'Estratégia Visual'], 
              description: 'Sistema inteligente que analisa o mercado e cria estratégias de branding personalizadas automaticamente', 
              active: true, 
              qrCode: 'QR_DESIGN_002',
              features: [
                'Análise automática de concorrência',
                'Posicionamento estratégico',
                'Manual da marca digital',
                'Paleta de cores inteligente',
                'Tipografia otimizada'
              ]
            }
          ],
          botFeatures: [
            {
              title: 'Design Automático AI',
              description: 'Sistema cria logos, identidades e materiais gráficos automaticamente baseado no briefing e análise de mercado.',
              icon: Bot,
              examples: [
                'Preciso de um logo para minha startup',
                'Identidade visual para restaurante',
                'Material para redes sociais'
              ]
            },
            {
              title: 'Análise de Mercado',
              description: 'IA analisa concorrentes e tendências para criar designs únicos e posicionamento estratégico diferenciado.',
              icon: TrendingUp,
              examples: [
                'Análise automática de concorrência',
                'Tendências do mercado em tempo real',
                'Posicionamento estratégico sugerido'
              ]
            },
            {
              title: 'Entrega Expressa',
              description: 'Sistema automatizado entrega designs aprovados em até 24h com revisões ilimitadas.',
              icon: Zap,
              examples: [
                'Entrega em 24 horas',
                'Revisões automáticas ilimitadas',
                'Aprovação por WhatsApp'
              ]
            }
          ]
        };
      case 'sites':
        return {
          catalogName: 'Catálogo',
          chats: [
            { id: 1, clientName: 'E-commerce Client', lastMessage: '🤖 Bot: Site e-commerce criado! Integração com pagamentos automática. 150 produtos cadastrados. Vendas já iniciadas!', timestamp: '19:30', status: 'read', unread: 0, category: 'sites', isBot: true, siteDeployed: true },
            { id: 2, clientName: 'Agência Parceira', lastMessage: 'Preciso de uma landing page para campanha que vai ao ar amanhã', timestamp: '18:50', status: 'unread', unread: 1, category: 'sites', isBot: false },
            { id: 3, clientName: 'Startup InnovaTech', lastMessage: '🤖 Bot: Landing page criada e otimizada! SEO configurado, Analytics integrado. Performance 95/100. Online em 2h!', timestamp: '18:30', status: 'read', unread: 0, category: 'sites', isBot: true, fastDelivery: true }
          ],
          catalogs: [
            { 
              id: 1, 
              name: 'Desenvolvimento Web Automático', 
              category: 'sites', 
              items: ['Sites Institucionais AI', 'E-commerce Express', 'Landing Pages Otimizadas', 'PWA Inteligentes'], 
              description: 'Plataforma que cria sites completos automaticamente com SEO, responsividade e integração de pagamentos', 
              active: true, 
              qrCode: 'QR_SITES_001',
              features: [
                'Criação automática de sites',
                'SEO otimizado',
                'Responsividade garantida',
                'Integração de pagamentos',
                'Deploy automático'
              ]
            },
            { 
              id: 2, 
              name: 'Marketing Digital Automatizado', 
              category: 'sites', 
              items: ['Google Ads Auto-Setup', 'Social Media Manager AI', 'Email Marketing Inteligente', 'Analytics Avançado'], 
              description: 'Sistema que configura e gerencia campanhas de marketing digital automaticamente com otimização contínua', 
              active: true, 
              qrCode: 'QR_SITES_002',
              features: [
                'Campanhas Google Ads automáticas',
                'Posts redes sociais IA',
                'Email marketing personalizado',
                'Relatórios automáticos',
                'Otimização contínua'
              ]
            }
          ],
          botFeatures: [
            {
              title: 'Desenvolvimento Automático',
              description: 'IA cria sites completos, responsivos e otimizados em poucas horas com base nos requisitos do cliente.',
              icon: Bot,
              examples: [
                'Preciso de um e-commerce completo',
                'Landing page para campanha',
                'Site institucional profissional'
              ]
            },
            {
              title: 'SEO e Performance',
              description: 'Sistema automatiza otimização SEO, configura Analytics e garante performance superior em todos os dispositivos.',
              icon: TrendingUp,
              examples: [
                'SEO automático otimizado',
                'Performance 95+ garantida',
                'Analytics configurado'
              ]
            },
            {
              title: 'Marketing Integrado',
              description: 'Configura automaticamente Google Ads, redes sociais e email marketing com campanhas otimizadas.',
              icon: Zap,
              examples: [
                'Google Ads configurado automaticamente',
                'Redes sociais integradas',
                'Email marketing personalizado'
              ]
            }
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
          <ModernIcon 
            icon={Search}
            size="sm"
            background={true}
            contextual={true}
            animated={true}
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
          />
          <Input
            placeholder="Buscar conversas, catálogos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white text-gray-900 border-border/50"
          />
        </div>
      </div>

      {/* Seção Especial: Sistemas Inteligentes por Categoria */}
      {getCategorySpecificData().botFeatures && (
        <div className={`relative overflow-hidden rounded-xl p-8 ${
          selectedCategory === 'alimenticio' ? 'bg-gradient-to-br from-green-400 via-green-500 to-green-600' :
          selectedCategory === 'pet' ? 'bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700' :
          selectedCategory === 'saude' ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800' :
          selectedCategory === 'vendas' ? 'bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800' :
          selectedCategory === 'design' ? 'bg-gradient-to-br from-green-400 via-teal-500 to-blue-600' :
          selectedCategory === 'sites' ? 'bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-800' :
          'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800'
        }`}>
          {/* Padrão de fundo decorativo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16"></div>
            <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white rounded-full -translate-x-12 -translate-y-12"></div>
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-3">
                {selectedCategory === 'alimenticio' && '🍽️ Seu Cardápio ao Alcance de Todos!'}
                {selectedCategory === 'pet' && '🐾 Cuidado Veterinário Inteligente 24/7!'}
                {selectedCategory === 'saude' && '🏥 Sua Saúde Monitorada Automaticamente!'}
                {selectedCategory === 'vendas' && '💼 Vendas Automatizadas e Inteligentes!'}
                {selectedCategory === 'design' && '🎨 Design Criativo Gerado por IA!'}
                {selectedCategory === 'sites' && '🚀 Sites e Marketing Digital Automático!'}
              </h2>
              <p className="text-white/90 text-lg">
                Sistema inteligente de atendimento 24/7 com automação completa e IA avançada
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {getCategorySpecificData().botFeatures?.map((feature, index) => (
                <Card key={index} className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                        selectedCategory === 'alimenticio' ? 'bg-gradient-to-br from-green-100 to-green-200' :
                        selectedCategory === 'pet' ? 'bg-gradient-to-br from-purple-100 to-purple-200' :
                        selectedCategory === 'saude' ? 'bg-gradient-to-br from-blue-100 to-blue-200' :
                        selectedCategory === 'vendas' ? 'bg-gradient-to-br from-purple-100 to-indigo-200' :
                        selectedCategory === 'design' ? 'bg-gradient-to-br from-green-100 to-teal-200' :
                        selectedCategory === 'sites' ? 'bg-gradient-to-br from-purple-100 to-blue-200' :
                        'bg-gradient-to-br from-gray-100 to-gray-200'
                      }`}>
                        <ModernIcon 
                          icon={feature.icon}
                          variant="category"
                          category={selectedCategory as any}
                          size="xl"
                          animated={true}
                        />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">{feature.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className={`text-xs font-semibold uppercase tracking-wide ${
                        selectedCategory === 'alimenticio' ? 'text-green-700' :
                        selectedCategory === 'pet' ? 'text-purple-700' :
                        selectedCategory === 'saude' ? 'text-blue-700' :
                        selectedCategory === 'vendas' ? 'text-purple-700' :
                        selectedCategory === 'design' ? 'text-teal-700' :
                        selectedCategory === 'sites' ? 'text-indigo-700' :
                        'text-gray-700'
                      }`}>
                        Exemplos:
                      </p>
                      {feature.examples.map((example, idx) => (
                        <div key={idx} className={`rounded-lg p-3 ${
                          selectedCategory === 'alimenticio' ? 'bg-green-50 border border-green-200' :
                          selectedCategory === 'pet' ? 'bg-purple-50 border border-purple-200' :
                          selectedCategory === 'saude' ? 'bg-blue-50 border border-blue-200' :
                          selectedCategory === 'vendas' ? 'bg-purple-50 border border-purple-200' :
                          selectedCategory === 'design' ? 'bg-teal-50 border border-teal-200' :
                          selectedCategory === 'sites' ? 'bg-indigo-50 border border-indigo-200' :
                          'bg-gray-50 border border-gray-200'
                        }`}>
                          <p className={`text-xs font-medium ${
                            selectedCategory === 'alimenticio' ? 'text-green-800' :
                            selectedCategory === 'pet' ? 'text-purple-800' :
                            selectedCategory === 'saude' ? 'text-blue-800' :
                            selectedCategory === 'vendas' ? 'text-purple-800' :
                            selectedCategory === 'design' ? 'text-teal-800' :
                            selectedCategory === 'sites' ? 'text-indigo-800' :
                            'text-gray-800'
                          }`}>"{example}"</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Alert className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <ModernIcon 
                  icon={CheckCircle}
                  variant="success"
                  size="md"
                  animated={true}
                />
                <AlertDescription className="text-gray-800 font-medium">
                  <strong>Processo Automático:</strong> Cliente faz solicitação → IA analisa e processa → 
                  Sistema executa automaticamente → Confirmação instantânea → Resultado entregue!
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      )}

      {/* Configurações de Automação */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ModernIcon 
                  icon={Bot}
                  size="xl"
                  background={true}
                  contextual={true}
                  animated={true}
                  glow={true}
                />
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
                <ModernIcon 
                  icon={CreditCard}
                  size="xl"
                  background={true}
                  contextual={true}
                  animated={true}
                  glow={true}
                />
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
        <TabsList className="w-full flex overflow-x-auto scroll-smooth gap-1 pb-2" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
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
                    <div key={chat.id} className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                      (chat as any).isBot 
                        ? selectedCategory === 'alimenticio' ? 'bg-gradient-to-r from-green-50 via-green-100 to-emerald-50 border-green-300 shadow-green-100' :
                          selectedCategory === 'pet' ? 'bg-gradient-to-r from-purple-50 via-purple-100 to-violet-50 border-purple-300 shadow-purple-100' :
                          selectedCategory === 'saude' ? 'bg-gradient-to-r from-blue-50 via-blue-100 to-cyan-50 border-blue-300 shadow-blue-100' :
                          selectedCategory === 'vendas' ? 'bg-gradient-to-r from-purple-50 via-indigo-100 to-purple-50 border-purple-300 shadow-purple-100' :
                          selectedCategory === 'design' ? 'bg-gradient-to-r from-teal-50 via-green-100 to-teal-50 border-teal-300 shadow-teal-100' :
                          selectedCategory === 'sites' ? 'bg-gradient-to-r from-indigo-50 via-blue-100 to-indigo-50 border-indigo-300 shadow-indigo-100' :
                          'bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 border-gray-300 shadow-gray-100'
                        : 'bg-white border-gray-200 shadow-sm hover:shadow-md'
                    } shadow-lg`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                            (chat as any).isBot 
                              ? selectedCategory === 'alimenticio' ? 'bg-gradient-to-br from-green-400 to-green-600' :
                                selectedCategory === 'pet' ? 'bg-gradient-to-br from-purple-500 to-purple-700' :
                                selectedCategory === 'saude' ? 'bg-gradient-to-br from-blue-500 to-blue-700' :
                                selectedCategory === 'vendas' ? 'bg-gradient-to-br from-purple-600 to-indigo-700' :
                                selectedCategory === 'design' ? 'bg-gradient-to-br from-teal-500 to-green-600' :
                                selectedCategory === 'sites' ? 'bg-gradient-to-br from-indigo-600 to-blue-700' :
                                'bg-gradient-to-br from-gray-500 to-gray-700'
                              : 'bg-gradient-to-br from-gray-400 to-gray-600'
                          }`}>
                            {(chat as any).isBot ? (
                              <ModernIcon 
                                icon={Bot}
                                variant="primary"
                                size="lg"
                                className="text-white"
                              />
                            ) : (
                              <ModernIcon 
                                icon={Users}
                                variant="default"
                                size="lg"
                                className="text-white"
                              />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-gray-900 text-lg">{chat.clientName}</h4>
                              {(chat as any).isBot && (
                                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                                  selectedCategory === 'alimenticio' ? 'bg-green-500 text-white' :
                                  selectedCategory === 'pet' ? 'bg-purple-500 text-white' :
                                  selectedCategory === 'saude' ? 'bg-blue-500 text-white' :
                                  selectedCategory === 'vendas' ? 'bg-purple-600 text-white' :
                                  selectedCategory === 'design' ? 'bg-teal-500 text-white' :
                                  selectedCategory === 'sites' ? 'bg-indigo-600 text-white' :
                                  'bg-gray-500 text-white'
                                }`}>
                                  🤖 IA
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 font-medium">{chat.timestamp}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {(chat as any).orderValue && (
                            <Badge className={`px-3 py-1 text-sm font-bold ${
                              selectedCategory === 'alimenticio' ? 'bg-green-500 text-white' :
                              selectedCategory === 'vendas' ? 'bg-purple-600 text-white' :
                              'bg-blue-500 text-white'
                            }`}>
                              R$ {(chat as any).orderValue.toFixed(2)}
                            </Badge>
                          )}
                          {(chat as any).orderConfirmed && (
                            <Badge className="bg-green-500 text-white px-3 py-1 text-sm font-bold">
                              ✅ Confirmado
                            </Badge>
                          )}
                          {chat.unread > 0 && (
                            <Badge className="bg-red-500 text-white px-3 py-1 text-sm font-bold animate-pulse">
                              {chat.unread} nova{chat.unread !== 1 ? 's' : ''}
                            </Badge>
                          )}
                          <Badge className={`px-3 py-1 text-sm font-bold ${
                            chat.status === 'unread' 
                              ? 'bg-yellow-500 text-white' 
                              : 'bg-green-500 text-white'
                          }`}>
                            {chat.status === 'unread' ? 'Não lida' : 'Lida'}
                          </Badge>
                        </div>
                      </div>
                      <p className={`text-sm leading-relaxed ${
                        (chat as any).isBot 
                          ? selectedCategory === 'alimenticio' ? 'text-green-800 font-semibold' :
                            selectedCategory === 'pet' ? 'text-purple-800 font-semibold' :
                            selectedCategory === 'saude' ? 'text-blue-800 font-semibold' :
                            selectedCategory === 'vendas' ? 'text-purple-800 font-semibold' :
                            selectedCategory === 'design' ? 'text-teal-800 font-semibold' :
                            selectedCategory === 'sites' ? 'text-indigo-800 font-semibold' :
                            'text-gray-800 font-semibold'
                          : 'text-gray-700'
                      }`}>
                        {chat.lastMessage}
                      </p>
                      
                      {(chat as any).isBot && (chat as any).orderValue && (
                        <div className={`mt-3 p-3 rounded-lg border-2 ${
                          selectedCategory === 'alimenticio' ? 'bg-white border-green-200' :
                          selectedCategory === 'vendas' ? 'bg-white border-purple-200' :
                          'bg-white border-blue-200'
                        }`}>
                          <p className={`text-xs font-semibold ${
                            selectedCategory === 'alimenticio' ? 'text-green-700' :
                            selectedCategory === 'vendas' ? 'text-purple-700' :
                            'text-blue-700'
                          }`}>
                            💳 Sistema processou automaticamente - Pagamento seguro gerado
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
                    <div key={catalog.id} className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] shadow-xl ${
                      selectedCategory === 'alimenticio' ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 border-green-300 shadow-green-200' :
                      selectedCategory === 'pet' ? 'bg-gradient-to-br from-purple-50 via-violet-50 to-purple-100 border-purple-300 shadow-purple-200' :
                      selectedCategory === 'saude' ? 'bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 border-blue-300 shadow-blue-200' :
                      selectedCategory === 'vendas' ? 'bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100 border-purple-300 shadow-purple-200' :
                      selectedCategory === 'design' ? 'bg-gradient-to-br from-teal-50 via-green-50 to-teal-100 border-teal-300 shadow-teal-200' :
                      selectedCategory === 'sites' ? 'bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100 border-indigo-300 shadow-indigo-200' :
                      'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 border-gray-300 shadow-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-bold text-gray-900 text-xl">{catalog.name}</h4>
                            <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                              selectedCategory === 'alimenticio' ? 'bg-green-500 text-white' :
                              selectedCategory === 'pet' ? 'bg-purple-500 text-white' :
                              selectedCategory === 'saude' ? 'bg-blue-500 text-white' :
                              selectedCategory === 'vendas' ? 'bg-purple-600 text-white' :
                              selectedCategory === 'design' ? 'bg-teal-500 text-white' :
                              selectedCategory === 'sites' ? 'bg-indigo-600 text-white' :
                              'bg-gray-500 text-white'
                            }`}>
                              🚀 IA Avançada
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{catalog.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={`px-3 py-1 text-sm font-bold ${
                            catalog.active 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-400 text-white'
                          }`}>
                            {catalog.active ? 'Ativo' : 'Inativo'}
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowQRCode(showQRCode === catalog.id ? null : catalog.id)}
                            className={`border-2 font-semibold ${
                              selectedCategory === 'alimenticio' ? 'border-green-400 text-green-700 hover:bg-green-500 hover:text-white' :
                              selectedCategory === 'pet' ? 'border-purple-400 text-purple-700 hover:bg-purple-500 hover:text-white' :
                              selectedCategory === 'saude' ? 'border-blue-400 text-blue-700 hover:bg-blue-500 hover:text-white' :
                              selectedCategory === 'vendas' ? 'border-purple-400 text-purple-700 hover:bg-purple-600 hover:text-white' :
                              selectedCategory === 'design' ? 'border-teal-400 text-teal-700 hover:bg-teal-500 hover:text-white' :
                              selectedCategory === 'sites' ? 'border-indigo-400 text-indigo-700 hover:bg-indigo-600 hover:text-white' :
                              'border-gray-400 text-gray-700 hover:bg-gray-500 hover:text-white'
                            }`}
                          >
                            <ModernIcon 
                              icon={QrCode}
                              variant="category"
                              category={selectedCategory as any}
                              size="sm"
                              animated={true}
                              className="mr-1"
                            />
                            QR Code
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className={`border-2 font-semibold ${
                              selectedCategory === 'alimenticio' ? 'border-green-400 text-green-700 hover:bg-green-500 hover:text-white' :
                              selectedCategory === 'pet' ? 'border-purple-400 text-purple-700 hover:bg-purple-500 hover:text-white' :
                              selectedCategory === 'saude' ? 'border-blue-400 text-blue-700 hover:bg-blue-500 hover:text-white' :
                              selectedCategory === 'vendas' ? 'border-purple-400 text-purple-700 hover:bg-purple-600 hover:text-white' :
                              selectedCategory === 'design' ? 'border-teal-400 text-teal-700 hover:bg-teal-500 hover:text-white' :
                              selectedCategory === 'sites' ? 'border-indigo-400 text-indigo-700 hover:bg-indigo-600 hover:text-white' :
                              'border-gray-400 text-gray-700 hover:bg-gray-500 hover:text-white'
                            }`}
                          >
                            <ModernIcon 
                              icon={Share}
                              variant="category"
                              category={selectedCategory as any}
                              size="sm"
                              animated={true}
                              className="mr-1"
                            />
                            Compartilhar
                          </Button>
                        </div>
                      </div>
                      
                      {/* Funcionalidades automáticas */}
                      {(catalog as any).features && (
                        <div className="mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-white/50 shadow-lg">
                          <p className={`text-xs font-bold uppercase tracking-wide mb-3 ${
                            selectedCategory === 'alimenticio' ? 'text-green-700' :
                            selectedCategory === 'pet' ? 'text-purple-700' :
                            selectedCategory === 'saude' ? 'text-blue-700' :
                            selectedCategory === 'vendas' ? 'text-purple-700' :
                            selectedCategory === 'design' ? 'text-teal-700' :
                            selectedCategory === 'sites' ? 'text-indigo-700' :
                            'text-gray-700'
                          }`}>
                            🤖 Funcionalidades Automáticas:
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {(catalog as any).features.map((feature: string, idx: number) => (
                              <div key={idx} className={`flex items-center gap-2 text-xs font-semibold p-2 rounded-lg ${
                                selectedCategory === 'alimenticio' ? 'text-green-800 bg-green-50' :
                                selectedCategory === 'pet' ? 'text-purple-800 bg-purple-50' :
                                selectedCategory === 'saude' ? 'text-blue-800 bg-blue-50' :
                                selectedCategory === 'vendas' ? 'text-purple-800 bg-purple-50' :
                                selectedCategory === 'design' ? 'text-teal-800 bg-teal-50' :
                                selectedCategory === 'sites' ? 'text-indigo-800 bg-indigo-50' :
                                'text-gray-800 bg-gray-50'
                              }`}>
                                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {catalog.items.map((item, index) => (
                          <div key={index} className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200 hover:scale-105 ${
                            selectedCategory === 'alimenticio' ? 'bg-white border-green-200 text-green-800 shadow-green-100' :
                            selectedCategory === 'pet' ? 'bg-white border-purple-200 text-purple-800 shadow-purple-100' :
                            selectedCategory === 'saude' ? 'bg-white border-blue-200 text-blue-800 shadow-blue-100' :
                            selectedCategory === 'vendas' ? 'bg-white border-purple-200 text-purple-800 shadow-purple-100' :
                            selectedCategory === 'design' ? 'bg-white border-teal-200 text-teal-800 shadow-teal-100' :
                            selectedCategory === 'sites' ? 'bg-white border-indigo-200 text-indigo-800 shadow-indigo-100' :
                            'bg-white border-gray-200 text-gray-800 shadow-gray-100'
                          } shadow-lg`}>
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