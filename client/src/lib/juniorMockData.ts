// Mock Data específico para Junior Silva - Coordenador Multi-Unidades
// Foco em controle de estoque logístico e gestão de 5 unidades de distribuição

export const juniorProfile = {
  name: "Junior Silva - Coordenador",
  role: "master",
  businessCategory: "vendas",
  units: ["Centro", "Norte", "Sul", "Leste", "Oeste"],
  responsibilities: [
    "Controle de Estoque Multi-Unidades",
    "Gestão de Fornecedores",
    "Logística de Distribuição",
    "Reposição Automática",
    "Relatórios Consolidados"
  ]
};

// Produtos com informações de unidade e fornecedor
export const juniorProducts = [
  // Unidade Centro (Hub Principal)
  { id: 1, name: 'Smartphone Galaxy S24', category: 'eletronicos', stock: 25, minStock: 15, price: 1299.00, description: 'Smartphone Android com 128GB', unit: 'Centro', supplier: 'Samsung Brasil Ltda', lastRestock: '2025-01-20', status: 'Em Estoque', available: true },
  { id: 2, name: 'Notebook Dell Inspiron 15', category: 'eletronicos', stock: 12, minStock: 8, price: 2499.00, description: 'Notebook Intel Core i5, 8GB RAM, 512GB SSD', unit: 'Centro', supplier: 'Dell Tecnologia Brasil', lastRestock: '2025-01-18', status: 'Em Estoque', available: true },
  { id: 3, name: 'Monitor Samsung 24" Full HD', category: 'eletronicos', stock: 18, minStock: 10, price: 699.00, description: 'Monitor LED IPS 24 polegadas', unit: 'Centro', supplier: 'Samsung Brasil Ltda', lastRestock: '2025-01-19', status: 'Em Estoque', available: true },
  
  // Unidade Norte
  { id: 4, name: 'Smartphone Galaxy S24', category: 'eletronicos', stock: 8, minStock: 15, price: 1299.00, description: 'Smartphone Android com 128GB', unit: 'Norte', supplier: 'Samsung Brasil Ltda', lastRestock: '2025-01-15', status: 'Estoque Baixo', available: true },
  { id: 5, name: 'Tablet iPad Air 10.9"', category: 'eletronicos', stock: 6, minStock: 5, price: 3299.00, description: 'Tablet Apple com 64GB WiFi', unit: 'Norte', supplier: 'Apple Brasil Distribuição', lastRestock: '2025-01-12', status: 'Em Estoque', available: true },
  { id: 6, name: 'Fone JBL Tune 760NC', category: 'eletronicos', stock: 14, minStock: 12, price: 299.00, description: 'Fone Bluetooth com cancelamento ruído', unit: 'Norte', supplier: 'Harman do Brasil', lastRestock: '2025-01-16', status: 'Em Estoque', available: true },
  
  // Unidade Sul  
  { id: 7, name: 'Smart TV LG 55" 4K', category: 'eletronicos', stock: 4, minStock: 6, price: 2199.00, description: 'Smart TV LED 55 polegadas Ultra HD', unit: 'Sul', supplier: 'LG Electronics Brasil', lastRestock: '2025-01-10', status: 'Estoque Baixo', available: true },
  { id: 8, name: 'Notebook Lenovo IdeaPad', category: 'eletronicos', stock: 9, minStock: 8, price: 1999.00, description: 'Notebook AMD Ryzen 5, 8GB RAM', unit: 'Sul', supplier: 'Lenovo Brasil', lastRestock: '2025-01-14', status: 'Em Estoque', available: true },
  { id: 9, name: 'Mouse Gamer Logitech G502', category: 'eletronicos', stock: 22, minStock: 15, price: 249.00, description: 'Mouse gaming com 11 botões programáveis', unit: 'Sul', supplier: 'Logitech Brasil', lastRestock: '2025-01-17', status: 'Em Estoque', available: true },
  
  // Unidade Leste
  { id: 10, name: 'Impressora HP LaserJet', category: 'eletronicos', stock: 3, minStock: 5, price: 899.00, description: 'Impressora laser monocromática', unit: 'Leste', supplier: 'HP Brasil Ltda', lastRestock: '2025-01-08', status: 'Estoque Baixo', available: true },
  { id: 11, name: 'Webcam Logitech C920', category: 'eletronicos', stock: 16, minStock: 10, price: 399.00, description: 'Webcam Full HD 1080p com microfone', unit: 'Leste', supplier: 'Logitech Brasil', lastRestock: '2025-01-13', status: 'Em Estoque', available: true },
  { id: 12, name: 'Teclado Mecânico Corsair', category: 'eletronicos', stock: 11, minStock: 8, price: 459.00, description: 'Teclado mecânico RGB switches Cherry', unit: 'Leste', supplier: 'Corsair Brasil', lastRestock: '2025-01-11', status: 'Em Estoque', available: true },
  
  // Unidade Oeste
  { id: 13, name: 'Roteador Wi-Fi 6 TP-Link', category: 'eletronicos', stock: 7, minStock: 10, price: 329.00, description: 'Roteador wireless dual band AX1500', unit: 'Oeste', supplier: 'TP-Link Brasil', lastRestock: '2025-01-09', status: 'Estoque Baixo', available: true },
  { id: 14, name: 'SSD Kingston 1TB', category: 'eletronicos', stock: 20, minStock: 12, price: 399.00, description: 'SSD SATA 2.5" 1TB para upgrade', unit: 'Oeste', supplier: 'Kingston Brasil', lastRestock: '2025-01-18', status: 'Em Estoque', available: true },
  { id: 15, name: 'Placa de Vídeo GTX 1650', category: 'eletronicos', stock: 2, minStock: 4, price: 1299.00, description: 'Placa de vídeo NVIDIA 4GB GDDR6', unit: 'Oeste', supplier: 'NVIDIA Partners BR', lastRestock: '2025-01-05', status: 'Estoque Crítico', available: true }
];

// Vendas com rastreamento de unidade
export const juniorSales = [
  { id: 1, date: '2025-01-21', client: 'TechCorp Empresarial', items: ['Notebook Dell x3', 'Monitor Samsung x3'], total: 9597.00, status: 'Concluída', paymentMethod: 'Transferência', unit: 'Centro', salesperson: 'Carlos Vendas' },
  { id: 2, date: '2025-01-21', client: 'Informática Norte Ltda', items: ['Smartphone Galaxy S24 x2'], total: 2598.00, status: 'Concluída', paymentMethod: 'PIX', unit: 'Norte', salesperson: 'Ana Regional' },
  { id: 3, date: '2025-01-20', client: 'Loja Eletrônicos Sul', items: ['Smart TV LG x1', 'Notebook Lenovo x2'], total: 6197.00, status: 'Pendente', paymentMethod: 'Boleto', unit: 'Sul', salesperson: 'Pedro Sul' },
  { id: 4, date: '2025-01-20', client: 'StartUp Inovação', items: ['Webcam Logitech x5', 'Teclado Corsair x5'], total: 4290.00, status: 'Concluída', paymentMethod: 'Cartão', unit: 'Leste', salesperson: 'Maria Tech' },
  { id: 5, date: '2025-01-19', client: 'Cyber Café Oeste', items: ['SSD Kingston x8', 'Mouse Logitech x8'], total: 5184.00, status: 'Concluída', paymentMethod: 'PIX', unit: 'Oeste', salesperson: 'Roberto Oeste' },
  { id: 6, date: '2025-01-19', client: 'Empresa Logística ABC', items: ['Tablet iPad x4', 'Fone JBL x10'], total: 16186.00, status: 'Concluída', paymentMethod: 'Transferência', unit: 'Centro', salesperson: 'Junior Silva' },
  { id: 7, date: '2025-01-18', client: 'Gamer Store Norte', items: ['Placa de Vídeo GTX x2'], total: 2598.00, status: 'Processando', paymentMethod: 'Cartão', unit: 'Oeste', salesperson: 'Roberto Oeste' }
];

// Clientes com perfil empresarial
export const juniorClients = [
  { id: 1, name: 'TechCorp Empresarial', email: 'compras@techcorp.com.br', phone: '(11) 3333-1111', lastOrder: '2025-01-21', totalSpent: 45670.00, status: 'VIP', type: 'Corporativo', address: 'Av. Tecnologia, 1500 - Centro', preferredUnit: 'Centro' },
  { id: 2, name: 'Informática Norte Ltda', email: 'vendas@informatican.com', phone: '(11) 3333-2222', lastOrder: '2025-01-21', totalSpent: 28340.00, status: 'Ativo', type: 'Revendedor', address: 'Rua das Lojas, 890 - Norte', preferredUnit: 'Norte' },
  { id: 3, name: 'Loja Eletrônicos Sul', email: 'compras@eletronicossul.br', phone: '(11) 3333-3333', lastOrder: '2025-01-20', totalSpent: 67890.00, status: 'VIP', type: 'Revendedor', address: 'Shopping Sul Plaza, Loja 45', preferredUnit: 'Sul' },
  { id: 4, name: 'StartUp Inovação', email: 'ti@startupinovacao.com', phone: '(11) 3333-4444', lastOrder: '2025-01-20', totalSpent: 15670.00, status: 'Ativo', type: 'Startup', address: 'Hub Inovação Leste, Sala 301', preferredUnit: 'Leste' },
  { id: 5, name: 'Cyber Café Oeste', email: 'proprietario@cyberoeste.com', phone: '(11) 3333-5555', lastOrder: '2025-01-19', totalSpent: 23450.00, status: 'Ativo', type: 'Estabelecimento', address: 'Av. Games, 777 - Oeste', preferredUnit: 'Oeste' },
  { id: 6, name: 'Empresa Logística ABC', email: 'compras@logisticaabc.com.br', phone: '(11) 3333-6666', lastOrder: '2025-01-19', totalSpent: 89340.00, status: 'VIP', type: 'Corporativo', address: 'Distrito Industrial, 2000', preferredUnit: 'Centro' },
  { id: 7, name: 'Gamer Store Norte', email: 'loja@gamerstorenorte.com', phone: '(11) 3333-7777', lastOrder: '2025-01-18', totalSpent: 34560.00, status: 'Ativo', type: 'Revendedor', address: 'Rua Gamer, 456 - Norte', preferredUnit: 'Norte' }
];

// Compromissos focados em logística e reuniões estratégicas
export const juniorAppointments = [
  { id: 1, title: 'Reunião Fornecedores Samsung', client: 'Samsung Brasil Ltda', date: '2025-01-23', time: '09:00', type: 'reuniao', status: 'scheduled', service: 'Negociação volume Q1' },
  { id: 2, title: 'Auditoria Estoque Unidade Norte', client: 'Equipe Interna', date: '2025-01-23', time: '14:00', type: 'auditoria', status: 'scheduled', service: 'Inventário físico' },
  { id: 3, title: 'Entrega Produtos - TechCorp', client: 'TechCorp Empresarial', date: '2025-01-24', time: '10:30', type: 'entrega', status: 'confirmed', service: 'Logística corporativa' },
  { id: 4, title: 'Análise Performance Vendas', client: 'Diretoria Comercial', date: '2025-01-24', time: '16:00', type: 'reuniao', status: 'scheduled', service: 'Review mensal' },
  { id: 5, title: 'Setup Nova Unidade Shopping', client: 'Administração Shopping', date: '2025-01-25', time: '11:00', type: 'instalacao', status: 'scheduled', service: 'Inauguração filial' },
  { id: 6, title: 'Treinamento Equipe Leste', client: 'Vendedores Unidade Leste', date: '2025-01-26', time: '08:30', type: 'treinamento', status: 'scheduled', service: 'Novos produtos Apple' },
  { id: 7, title: 'Reunião Estratégica Q1', client: 'Board Directors', date: '2025-01-27', time: '15:00', type: 'reuniao', status: 'scheduled', service: 'Planejamento 2025' }
];

// Atividades específicas de controle logístico
export const juniorActivities = [
  { id: 1, time: '2025-01-21 09:15', user: 'Junior Silva', action: 'Reposição Automática Ativada', description: 'Sistema detectou estoque baixo na Unidade Norte para Galaxy S24, solicitação automática enviada ao fornecedor Samsung', category: 'vendas', type: 'estoque', status: 'success' },
  { id: 2, time: '2025-01-21 10:30', user: 'Sistema Logístico', action: 'Transfer Unit-to-Unit Executada', description: 'Transferência de 5 tablets iPad da Unidade Centro para Norte para balanceamento de estoque', category: 'vendas', type: 'transferencia', status: 'success' },
  { id: 3, time: '2025-01-21 11:45', user: 'Junior Silva', action: 'Alerta Estoque Crítico', description: 'Placa de Vídeo GTX na Unidade Oeste atingiu nível crítico (2 unidades). Urgente: contatar fornecedor NVIDIA', category: 'vendas', type: 'alerta', status: 'warning' },
  { id: 4, time: '2025-01-21 14:20', user: 'Ana Regional', action: 'Venda Corporativa Processada', description: 'Venda de R$ 16.186,00 para Empresa Logística ABC processada com sucesso na Unidade Centro', category: 'vendas', type: 'venda', status: 'success' },
  { id: 5, time: '2025-01-20 16:10', user: 'Sistema Integrado', action: 'Relatório Consolidado Gerado', description: 'Relatório de performance de vendas de todas as 5 unidades consolidado automaticamente', category: 'vendas', type: 'relatorio', status: 'info' },
  { id: 6, time: '2025-01-20 08:30', user: 'Junior Silva', action: 'Negociação Fornecedor Concluída', description: 'Acordo comercial com Dell Brasil renovado com desconto de 12% para pedidos acima de 50 unidades', category: 'vendas', type: 'fornecedor', status: 'success' },
  { id: 7, time: '2025-01-19 13:45', user: 'Roberto Oeste', action: 'Auditoria Estoque Realizada', description: 'Inventário da Unidade Oeste concluído com 99.2% de acurácia. Divergência menor identificada e corrigida', category: 'vendas', type: 'auditoria', status: 'success' }
];

// Conversas WhatsApp focadas em B2B e logística
export const juniorWhatsApp = [
  { id: 1, name: 'Samsung Brasil - Rodrigo', lastMessage: 'Junior, confirmando entrega de 50 Galaxy S24 para segunda-feira. Podem receber no Centro?', time: '14:30', unread: 1, status: 'online' as const },
  { id: 2, name: 'TechCorp - Compras', lastMessage: 'Preciso de urgente: 10 notebooks Dell + monitores. Prazo para entrega seria quinta?', time: '13:45', unread: 2, status: 'online' as const },
  { id: 3, name: 'Transportadora Express', lastMessage: 'Rota Centro-Norte-Sul programada para amanhã 08:00. Motorista: João (11) 99999-8888', time: '12:20', unread: 0, status: 'offline' as const },
  { id: 4, name: 'Dell Brasil - Marina', lastMessage: 'Junior, temos promoção especial notebooks Inspiron. Quer agendar apresentação?', time: '11:15', unread: 1, status: 'away' as const },
  { id: 5, name: 'Loja Eletrônicos Sul', lastMessage: 'O pedido de Smart TVs pode ser parcelado em quantas vezes mesmo?', time: '10:30', unread: 0, status: 'online' as const },
  { id: 6, name: 'Equipe Unidade Norte', lastMessage: 'Junior, Ana aqui. Estoque de fones JBL esgotou. Cliente perguntando alternativas.', time: '09:45', unread: 3, status: 'online' as const },
  { id: 7, name: 'Apple Brasil - Carlos', lastMessage: 'Confirmando: treinamento produtos Apple na Unidade Leste dia 26/01 às 08:30', time: '08:20', unread: 0, status: 'offline' as const }
];

export const getJuniorData = () => ({
  profile: juniorProfile,
  products: juniorProducts,
  sales: juniorSales,
  clients: juniorClients,
  appointments: juniorAppointments,
  activities: juniorActivities,
  whatsapp: juniorWhatsApp
});