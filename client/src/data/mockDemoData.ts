// Sistema de dados mock para demonstrações - específico por categoria de negócio

export interface MockUser {
  id: number;
  name: string;
  email: string;
  role: string;
  businessCategory: string;
  permissions: string[];
}

export interface MockProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  minStock: number;
  expiryDate?: string;
  manufacturingDate: string;
  isPerishable: boolean;
}

export interface MockSale {
  id: number;
  productId: number;
  clientId: number;
  quantity: number;
  totalAmount: string;
  paymentMethod: string;
  saleDate: string;
  status: string;
}

export interface MockClient {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalSpent: string;
  lastPurchase: string;
}

export interface MockAppointment {
  id: number;
  title: string;
  clientName: string;
  date: string;
  time: string;
  type: string;
  status: string;
  notes: string;
}

export interface MockFinancialEntry {
  id: number;
  type: string;
  amount: string;
  description: string;
  date: string;
  status: string;
  category: string;
}

export interface MockTransfer {
  id: number;
  productId: number;
  fromBranchId: number;
  toBranchId: number;
  quantity: number;
  status: string;
  requestDate: string;
  notes: string;
}

// Dados mock por categoria
export const mockDemoData = {
  farmacia: {
    user: {
      id: 9001,
      name: 'Dr. Fernando Farmacêutico',
      email: 'demo.farmaceutico@farmaciacentral.com',
      role: 'regular',
      businessCategory: 'farmacia',
      permissions: ['dashboard', 'graficos', 'atividade', 'estoque', 'financeiro', 'agendamentos', 'atendimento']
    },
    products: [
      { id: 1, name: 'Dipirona 500mg', description: 'Analgésico e antitérmico', price: '12.50', stock: 150, minStock: 20, manufacturingDate: '2024-06-15', expiryDate: '2026-06-15', isPerishable: true },
      { id: 2, name: 'Paracetamol 750mg', description: 'Analgésico e antitérmico', price: '8.90', stock: 200, minStock: 30, manufacturingDate: '2024-07-10', expiryDate: '2026-07-10', isPerishable: true },
      { id: 3, name: 'Omeprazol 20mg', description: 'Protetor gástrico', price: '15.80', stock: 80, minStock: 15, manufacturingDate: '2024-05-20', expiryDate: '2026-05-20', isPerishable: true },
      { id: 4, name: 'Vitamina C 1g', description: 'Suplemento vitamínico', price: '25.00', stock: 5, minStock: 10, manufacturingDate: '2024-08-01', expiryDate: '2025-08-01', isPerishable: true },
      { id: 5, name: 'Termômetro Digital', description: 'Medição de temperatura', price: '45.00', stock: 25, minStock: 5, manufacturingDate: '2024-01-15', isPerishable: false },
      { id: 6, name: 'Álcool 70%', description: 'Antisséptico', price: '6.50', stock: 100, minStock: 20, manufacturingDate: '2024-07-25', expiryDate: '2025-01-25', isPerishable: true }
    ],
    sales: [
      { id: 1, productId: 1, clientId: 1, quantity: 2, totalAmount: '25.00', paymentMethod: 'PIX', saleDate: '2025-07-30', status: 'completed' },
      { id: 2, productId: 2, clientId: 2, quantity: 1, totalAmount: '8.90', paymentMethod: 'Cartão', saleDate: '2025-07-30', status: 'completed' },
      { id: 3, productId: 3, clientId: 3, quantity: 3, totalAmount: '47.40', paymentMethod: 'Dinheiro', saleDate: '2025-07-29', status: 'completed' },
      { id: 4, productId: 5, clientId: 1, quantity: 1, totalAmount: '45.00', paymentMethod: 'PIX', saleDate: '2025-07-29', status: 'completed' },
      { id: 5, productId: 4, clientId: 4, quantity: 2, totalAmount: '50.00', paymentMethod: 'Cartão', saleDate: '2025-07-28', status: 'completed' }
    ],
    clients: [
      { id: 1, name: 'Maria Silva', email: 'maria.silva@email.com', phone: '(11) 99999-1111', address: 'Rua das Flores, 123', totalSpent: '70.00', lastPurchase: '2025-07-30' },
      { id: 2, name: 'João Santos', email: 'joao.santos@email.com', phone: '(11) 99999-2222', address: 'Av. Central, 456', totalSpent: '8.90', lastPurchase: '2025-07-30' },
      { id: 3, name: 'Ana Costa', email: 'ana.costa@email.com', phone: '(11) 99999-3333', address: 'Rua do Comércio, 789', totalSpent: '47.40', lastPurchase: '2025-07-29' },
      { id: 4, name: 'Pedro Oliveira', email: 'pedro.oliveira@email.com', phone: '(11) 99999-4444', address: 'Rua da Saúde, 321', totalSpent: '50.00', lastPurchase: '2025-07-28' }
    ],
    appointments: [
      { id: 1, title: 'Consulta Farmacêutica', clientName: 'Maria Silva', date: '2025-07-31', time: '14:00', type: 'consulta', status: 'scheduled', notes: 'Orientação sobre medicamentos' },
      { id: 2, title: 'Aplicação de Vacina', clientName: 'João Santos', date: '2025-08-01', time: '09:30', type: 'vacina', status: 'scheduled', notes: 'Vacina da gripe' },
      { id: 3, title: 'Medição de Pressão', clientName: 'Ana Costa', date: '2025-08-02', time: '16:00', type: 'exame', status: 'scheduled', notes: 'Acompanhamento mensal' }
    ],
    financial: [
      { id: 1, type: 'income', amount: '25.00', description: 'Venda Dipirona', date: '2025-07-30', status: 'paid', category: 'vendas' },
      { id: 2, type: 'income', amount: '8.90', description: 'Venda Paracetamol', date: '2025-07-30', status: 'paid', category: 'vendas' },
      { id: 3, type: 'expense', amount: '500.00', description: 'Fornecedor Medicamentos', date: '2025-07-28', status: 'pending', category: 'compras' },
      { id: 4, type: 'expense', amount: '150.00', description: 'Aluguel', date: '2025-07-01', status: 'paid', category: 'fixos' }
    ],
    transfers: []
  },

  pet: {
    user: {
      id: 9002,
      name: 'Dr. Carlos Veterinário',
      email: 'demo.veterinario@petclinic.com',
      role: 'regular',
      businessCategory: 'pet',
      permissions: ['dashboard', 'graficos', 'atividade', 'estoque', 'financeiro', 'agendamentos', 'atendimento']
    },
    products: [
      { id: 1, name: 'Ração Premium Cães', description: 'Ração super premium 15kg', price: '120.00', stock: 50, minStock: 10, manufacturingDate: '2024-06-01', expiryDate: '2025-06-01', isPerishable: true },
      { id: 2, name: 'Antipulgas', description: 'Coleira antipulgas', price: '35.00', stock: 25, minStock: 5, manufacturingDate: '2024-05-15', expiryDate: '2026-05-15', isPerishable: true },
      { id: 3, name: 'Vacina V10', description: 'Vacina múltipla canina', price: '80.00', stock: 8, minStock: 15, manufacturingDate: '2024-07-01', expiryDate: '2025-07-01', isPerishable: true },
      { id: 4, name: 'Shampoo Pet', description: 'Shampoo neutro para pets', price: '28.00', stock: 40, minStock: 10, manufacturingDate: '2024-03-20', isPerishable: false },
      { id: 5, name: 'Brinquedo Corda', description: 'Brinquedo interativo', price: '15.00', stock: 60, minStock: 15, manufacturingDate: '2024-07-10', isPerishable: false }
    ],
    sales: [
      { id: 1, productId: 1, clientId: 1, quantity: 1, totalAmount: '120.00', paymentMethod: 'PIX', saleDate: '2025-07-30', status: 'completed' },
      { id: 2, productId: 2, clientId: 2, quantity: 2, totalAmount: '70.00', paymentMethod: 'Cartão', saleDate: '2025-07-29', status: 'completed' },
      { id: 3, productId: 4, clientId: 3, quantity: 1, totalAmount: '28.00', paymentMethod: 'Dinheiro', saleDate: '2025-07-29', status: 'completed' }
    ],
    clients: [
      { id: 1, name: 'Carlos com Rex', email: 'carlos.rex@email.com', phone: '(11) 98888-1111', address: 'Rua Pet, 100', totalSpent: '120.00', lastPurchase: '2025-07-30' },
      { id: 2, name: 'Julia com Bella', email: 'julia.bella@email.com', phone: '(11) 98888-2222', address: 'Av. Animal, 200', totalSpent: '70.00', lastPurchase: '2025-07-29' },
      { id: 3, name: 'Roberto com Max', email: 'roberto.max@email.com', phone: '(11) 98888-3333', address: 'Rua Cão, 300', totalSpent: '28.00', lastPurchase: '2025-07-29' }
    ],
    appointments: [
      { id: 1, title: 'Consulta Veterinária', clientName: 'Carlos com Rex', date: '2025-07-31', time: '10:00', type: 'consulta', status: 'scheduled', notes: 'Check-up geral' },
      { id: 2, title: 'Vacinação', clientName: 'Julia com Bella', date: '2025-08-01', time: '14:30', type: 'vacina', status: 'scheduled', notes: 'Vacina antirrábica' },
      { id: 3, title: 'Banho e Tosa', clientName: 'Roberto com Max', date: '2025-08-02', time: '11:00', type: 'estetica', status: 'scheduled', notes: 'Tosa higiênica' }
    ],
    financial: [
      { id: 1, type: 'income', amount: '120.00', description: 'Venda Ração Premium', date: '2025-07-30', status: 'paid', category: 'vendas' },
      { id: 2, type: 'income', amount: '70.00', description: 'Venda Antipulgas', date: '2025-07-29', status: 'paid', category: 'vendas' },
      { id: 3, type: 'expense', amount: '800.00', description: 'Fornecedor Rações', date: '2025-07-25', status: 'paid', category: 'compras' }
    ],
    transfers: []
  },

  medico: {
    user: {
      id: 9003,
      name: 'Dra. Ana Médica',
      email: 'demo.medica@clinicasaude.com',
      role: 'regular',
      businessCategory: 'medico',
      permissions: ['dashboard', 'graficos', 'atividade', 'estoque', 'financeiro', 'agendamentos', 'atendimento']
    },
    products: [
      { id: 1, name: 'Estetoscópio', description: 'Estetoscópio profissional', price: '250.00', stock: 5, minStock: 2, manufacturingDate: '2024-01-15', isPerishable: false },
      { id: 2, name: 'Termômetro Infravermelho', description: 'Medição sem contato', price: '180.00', stock: 8, minStock: 3, manufacturingDate: '2024-03-10', isPerishable: false },
      { id: 3, name: 'Luvas Cirúrgicas', description: 'Caixa com 100 unidades', price: '25.00', stock: 3, minStock: 10, manufacturingDate: '2024-06-20', expiryDate: '2026-06-20', isPerishable: true },
      { id: 4, name: 'Álcool em Gel', description: 'Antisséptico 500ml', price: '12.00', stock: 50, minStock: 15, manufacturingDate: '2024-07-15', expiryDate: '2025-07-15', isPerishable: true }
    ],
    sales: [
      { id: 1, productId: 2, clientId: 1, quantity: 1, totalAmount: '180.00', paymentMethod: 'PIX', saleDate: '2025-07-30', status: 'completed' },
      { id: 2, productId: 4, clientId: 2, quantity: 3, totalAmount: '36.00', paymentMethod: 'Cartão', saleDate: '2025-07-29', status: 'completed' }
    ],
    clients: [
      { id: 1, name: 'Hospital São Lucas', email: 'compras@saolucas.com', phone: '(11) 97777-1111', address: 'Av. Saúde, 1000', totalSpent: '180.00', lastPurchase: '2025-07-30' },
      { id: 2, name: 'Clínica Vida', email: 'suprimentos@vida.com', phone: '(11) 97777-2222', address: 'Rua Medicina, 500', totalSpent: '36.00', lastPurchase: '2025-07-29' }
    ],
    appointments: [
      { id: 1, title: 'Entrega Equipamentos', clientName: 'Hospital São Lucas', date: '2025-07-31', time: '09:00', type: 'entrega', status: 'scheduled', notes: 'Entrega termômetros' },
      { id: 2, title: 'Demonstração Produtos', clientName: 'Clínica Vida', date: '2025-08-01', time: '15:00', type: 'demo', status: 'scheduled', notes: 'Apresentar novos equipamentos' }
    ],
    financial: [
      { id: 1, type: 'income', amount: '180.00', description: 'Venda Termômetro', date: '2025-07-30', status: 'paid', category: 'vendas' },
      { id: 2, type: 'income', amount: '36.00', description: 'Venda Álcool Gel', date: '2025-07-29', status: 'paid', category: 'vendas' },
      { id: 3, type: 'expense', amount: '1200.00', description: 'Fornecedor Equipamentos', date: '2025-07-20', status: 'pending', category: 'compras' }
    ],
    transfers: []
  },

  vendas: {
    user: {
      id: 9004,
      name: 'João Vendedor',
      email: 'demo.vendedor@comercial.com',
      role: 'regular',
      businessCategory: 'vendas',
      permissions: ['dashboard', 'graficos', 'atividade', 'estoque', 'financeiro', 'agendamentos', 'atendimento']
    },
    products: [
      { id: 1, name: 'Notebook Dell', description: 'Notebook i5 8GB 256GB SSD', price: '2500.00', stock: 15, minStock: 5, manufacturingDate: '2024-06-01', isPerishable: false },
      { id: 2, name: 'Mouse Wireless', description: 'Mouse sem fio ergonômico', price: '80.00', stock: 45, minStock: 10, manufacturingDate: '2024-07-01', isPerishable: false },
      { id: 3, name: 'Teclado Mecânico', description: 'Teclado gamer RGB', price: '350.00', stock: 8, minStock: 15, manufacturingDate: '2024-05-15', isPerishable: false },
      { id: 4, name: 'Monitor 24"', description: 'Monitor Full HD IPS', price: '650.00', stock: 20, minStock: 8, manufacturingDate: '2024-07-10', isPerishable: false }
    ],
    sales: [
      { id: 1, productId: 1, clientId: 1, quantity: 2, totalAmount: '5000.00', paymentMethod: 'Cartão Corporativo', saleDate: '2025-07-30', status: 'completed' },
      { id: 2, productId: 2, clientId: 2, quantity: 10, totalAmount: '800.00', paymentMethod: 'PIX', saleDate: '2025-07-29', status: 'completed' },
      { id: 3, productId: 4, clientId: 1, quantity: 1, totalAmount: '650.00', paymentMethod: 'Boleto', saleDate: '2025-07-28', status: 'completed' }
    ],
    clients: [
      { id: 1, name: 'Empresa Tech Solutions', email: 'compras@techsolutions.com', phone: '(11) 96666-1111', address: 'Av. Tecnologia, 2000', totalSpent: '5650.00', lastPurchase: '2025-07-30' },
      { id: 2, name: 'Escritório Advocacia Lima', email: 'ti@lima.adv.br', phone: '(11) 96666-2222', address: 'Rua Jurídica, 150', totalSpent: '800.00', lastPurchase: '2025-07-29' }
    ],
    appointments: [
      { id: 1, title: 'Reunião Proposta', clientName: 'Empresa Tech Solutions', date: '2025-07-31', time: '10:00', type: 'reuniao', status: 'scheduled', notes: 'Apresentar novos produtos' },
      { id: 2, title: 'Entrega Equipamentos', clientName: 'Escritório Advocacia Lima', date: '2025-08-01', time: '14:00', type: 'entrega', status: 'scheduled', notes: 'Entrega de mouses' }
    ],
    financial: [
      { id: 1, type: 'income', amount: '5000.00', description: 'Venda Notebooks', date: '2025-07-30', status: 'paid', category: 'vendas' },
      { id: 2, type: 'income', amount: '800.00', description: 'Venda Mouses', date: '2025-07-29', status: 'paid', category: 'vendas' },
      { id: 3, type: 'expense', amount: '15000.00', description: 'Fornecedor Eletrônicos', date: '2025-07-25', status: 'paid', category: 'compras' }
    ],
    transfers: []
  },

  design: {
    user: {
      id: 9005,
      name: 'Maria Designer',
      email: 'demo.designer@agencia.com',
      role: 'regular',
      businessCategory: 'design',
      permissions: ['dashboard', 'graficos', 'atividade', 'agendamentos', 'atendimento']
    },
    products: [],
    sales: [
      { id: 1, productId: 0, clientId: 1, quantity: 1, totalAmount: '2500.00', paymentMethod: 'PIX', saleDate: '2025-07-30', status: 'completed' },
      { id: 2, productId: 0, clientId: 2, quantity: 1, totalAmount: '1800.00', paymentMethod: 'Cartão', saleDate: '2025-07-29', status: 'completed' }
    ],
    clients: [
      { id: 1, name: 'Restaurante Bella Vista', email: 'marketing@bellavista.com', phone: '(11) 95555-1111', address: 'Rua Gourmet, 500', totalSpent: '2500.00', lastPurchase: '2025-07-30' },
      { id: 2, name: 'Loja Fashion Style', email: 'contato@fashionstyle.com', phone: '(11) 95555-2222', address: 'Av. Moda, 300', totalSpent: '1800.00', lastPurchase: '2025-07-29' }
    ],
    appointments: [
      { id: 1, title: 'Briefing Campanha', clientName: 'Restaurante Bella Vista', date: '2025-07-31', time: '15:00', type: 'briefing', status: 'scheduled', notes: 'Campanha verão 2025' },
      { id: 2, title: 'Apresentação Logo', clientName: 'Loja Fashion Style', date: '2025-08-01', time: '11:00', type: 'apresentacao', status: 'scheduled', notes: 'Proposta identidade visual' }
    ],
    financial: [
      { id: 1, type: 'income', amount: '2500.00', description: 'Projeto Bella Vista', date: '2025-07-30', status: 'paid', category: 'projetos' },
      { id: 2, type: 'income', amount: '1800.00', description: 'Logo Fashion Style', date: '2025-07-29', status: 'paid', category: 'projetos' },
      { id: 3, type: 'expense', amount: '300.00', description: 'Adobe Creative Cloud', date: '2025-07-01', status: 'paid', category: 'software' }
    ],
    transfers: []
  },

  sites: {
    user: {
      id: 9006,
      name: 'Pedro Desenvolvedor',
      email: 'demo.dev@webagency.com',
      role: 'regular',
      businessCategory: 'sites',
      permissions: ['dashboard', 'graficos', 'atividade', 'agendamentos', 'atendimento']
    },
    products: [],
    sales: [
      { id: 1, productId: 0, clientId: 1, quantity: 1, totalAmount: '5000.00', paymentMethod: 'PIX', saleDate: '2025-07-30', status: 'completed' },
      { id: 2, productId: 0, clientId: 2, quantity: 1, totalAmount: '3500.00', paymentMethod: 'Cartão', saleDate: '2025-07-29', status: 'completed' }
    ],
    clients: [
      { id: 1, name: 'Clínica Dr. Saúde', email: 'admin@drsaude.com', phone: '(11) 94444-1111', address: 'Av. Medicina, 800', totalSpent: '5000.00', lastPurchase: '2025-07-30' },
      { id: 2, name: 'Loja Virtual Plus', email: 'dev@lojavirtual.com', phone: '(11) 94444-2222', address: 'Rua E-commerce, 150', totalSpent: '3500.00', lastPurchase: '2025-07-29' }
    ],
    appointments: [
      { id: 1, title: 'Deploy Site Clínica', clientName: 'Clínica Dr. Saúde', date: '2025-07-31', time: '09:00', type: 'deploy', status: 'scheduled', notes: 'Publicação site institucional' },
      { id: 2, title: 'Treinamento Sistema', clientName: 'Loja Virtual Plus', date: '2025-08-01', time: '16:00', type: 'treinamento', status: 'scheduled', notes: 'Treinamento painel admin' }
    ],
    financial: [
      { id: 1, type: 'income', amount: '5000.00', description: 'Site Clínica Dr. Saúde', date: '2025-07-30', status: 'paid', category: 'desenvolvimento' },
      { id: 2, type: 'income', amount: '3500.00', description: 'E-commerce Loja Plus', date: '2025-07-29', status: 'paid', category: 'desenvolvimento' },
      { id: 3, type: 'expense', amount: '150.00', description: 'Hospedagem Servidores', date: '2025-07-01', status: 'paid', category: 'hospedagem' }
    ],
    transfers: []
  }
};

// Função para obter dados mock por categoria
export const getMockDataByCategory = (category: string) => {
  return mockDemoData[category as keyof typeof mockDemoData] || null;
};