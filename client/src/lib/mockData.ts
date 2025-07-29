// Comprehensive Mock Data System for All Business Categories
// This file contains realistic and varied data for each business category

export interface Product {
  id: number;
  name: string;
  category: string;
  stock?: number;
  minStock?: number;
  price: number;
  description?: string;
  isPerishable?: boolean;
  expiryDate?: string;
  manufacturingDate?: string;
  status?: string;
  available: boolean;
  image?: string;
  unit?: string;
  supplier?: string;
  lastRestock?: string;
}

export interface Sale {
  id: number;
  date: string;
  client: string;
  items: string[];
  total: number;
  status: string;
  category?: string;
  paymentMethod?: string;
  quantity?: number;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  lastOrder: string;
  totalSpent: number;
  status: string;
  category?: string;
  address?: string;
  type?: string;
}

export interface Appointment {
  id: number;
  title: string;
  client: string;
  date: string;
  time: string;
  type: string;
  status: string;
  notes?: string;
  service?: string;
}

export interface Specialist {
  id: number;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  schedule: string;
  description: string;
  available: boolean;
  rating?: number;
  experience?: string;
}

export interface WhatsAppConversation {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: 'online' | 'offline' | 'away';
  category?: string;
  avatar?: string;
}

export interface Activity {
  id: number;
  timestamp: Date;
  type: string;
  action: string;
  description: string;
  category: string;
  status: string;
  user: string;
  details?: any;
}




// Products for each business profile login
export const categoryProducts: Record<string, Product[]> = {
  farmacia: [
    { id: 1, name: 'Dipirona 500mg', category: 'analgesicos', stock: 15, minStock: 80, price: 15.90, description: 'Analgésico e antipirético - caixa com 20 comprimidos', isPerishable: true, expiryDate: '2025-03-15', manufacturingDate: '2024-03-15', status: 'Estoque Baixo', available: true },
    { id: 2, name: 'Paracetamol 750mg', category: 'analgesicos', stock: 0, minStock: 60, price: 18.50, description: 'Analgésico e antitérmico - caixa com 20 comprimidos', isPerishable: true, expiryDate: '2024-11-20', manufacturingDate: '2023-11-20', status: 'Vencido', available: false },
    { id: 3, name: 'Ibuprofeno 600mg', category: 'antiinflamatorios', stock: 120, minStock: 40, price: 24.90, description: 'Anti-inflamatório - caixa com 20 comprimidos', isPerishable: true, expiryDate: '2025-06-20', manufacturingDate: '2024-06-20', status: 'Em Estoque', available: true },
    { id: 4, name: 'Amoxicilina 500mg', category: 'antibioticos', stock: 8, minStock: 30, price: 28.00, description: 'Antibiótico - caixa com 21 cápsulas', isPerishable: true, expiryDate: '2025-01-16', manufacturingDate: '2024-01-16', status: 'Estoque Baixo', available: true },
    { id: 5, name: 'Azitromicina 500mg', category: 'antibioticos', stock: 65, minStock: 20, price: 42.50, description: 'Antibiótico - caixa com 5 comprimidos', isPerishable: true, expiryDate: '2025-01-14', manufacturingDate: '2024-01-14', status: 'Vencimento Próximo', available: true },
    { id: 6, name: 'Omeprazol 20mg', category: 'gastrico', stock: 0, minStock: 45, price: 16.80, description: 'Protetor gástrico - caixa com 28 cápsulas', isPerishable: true, expiryDate: '2025-02-10', manufacturingDate: '2024-02-10', status: 'Sem Estoque', available: false },
    { id: 7, name: 'Losartana 50mg', category: 'cardiovascular', stock: 85, minStock: 25, price: 12.90, description: 'Anti-hipertensivo - caixa com 30 comprimidos', isPerishable: true, expiryDate: '2025-08-15', manufacturingDate: '2024-08-15', status: 'Em Estoque', available: true },
    { id: 8, name: 'Metformina 850mg', category: 'diabetes', stock: 12, minStock: 35, price: 19.50, description: 'Hipoglicemiante - caixa com 30 comprimidos', isPerishable: true, expiryDate: '2025-01-15', manufacturingDate: '2024-01-15', status: 'Vencimento Próximo', available: true },
    { id: 9, name: 'Vitamina D3 2000UI', category: 'suplementos', stock: 8, minStock: 25, price: 35.90, description: 'Suplemento vitamínico - frasco com 60 cápsulas', isPerishable: true, expiryDate: '2025-04-30', manufacturingDate: '2024-04-30', status: 'Estoque Baixo', available: true },
    { id: 10, name: 'Ômega 3 1000mg', category: 'suplementos', stock: 55, minStock: 18, price: 48.00, description: 'Suplemento - frasco com 60 cápsulas', isPerishable: true, expiryDate: '2025-09-15', manufacturingDate: '2024-09-15', status: 'Em Estoque', available: true },
    { id: 11, name: 'Protetor Solar FPS 60', category: 'dermatologicos', stock: 3, minStock: 15, price: 32.50, description: 'Protetor solar facial - tubo 60g', isPerishable: true, expiryDate: '2025-07-20', manufacturingDate: '2024-07-20', status: 'Estoque Baixo', available: true },
    { id: 12, name: 'Termômetro Digital', category: 'equipamentos', stock: 0, minStock: 8, price: 89.90, description: 'Termômetro clínico digital preciso', isPerishable: false, expiryDate: '2026-12-31', manufacturingDate: '2024-01-01', status: 'Sem Estoque', available: false }
  ],

  pet: [
    { id: 1, name: 'Ração Premium Golden Adulto', category: 'racao', stock: 2, minStock: 10, price: 89.90, description: 'Ração premium para cães adultos de grande porte', isPerishable: true, expiryDate: '2025-02-28', manufacturingDate: '2024-08-28', status: 'Estoque Baixo', available: true },
    { id: 2, name: 'Ração Royal Canin Filhote', category: 'racao', stock: 0, minStock: 8, price: 125.00, description: 'Ração específica para filhotes até 12 meses', isPerishable: true, expiryDate: '2024-12-15', manufacturingDate: '2024-06-15', status: 'Vencido', available: false },
    { id: 3, name: 'Ração Whiskas Gatos', category: 'racao', stock: 32, minStock: 15, price: 65.50, description: 'Ração para gatos adultos sabor peixe', isPerishable: true, expiryDate: '2025-04-20', manufacturingDate: '2024-10-20', status: 'Em Estoque', available: true },
    { id: 4, name: 'Antipulgas Frontline Plus', category: 'medicamentos', stock: 3, minStock: 5, price: 45.50, description: 'Proteção contra pulgas e carrapatos por 30 dias', isPerishable: true, expiryDate: '2025-01-16', manufacturingDate: '2024-07-16', status: 'Estoque Baixo', available: true },
    { id: 5, name: 'Vermífugo Drontal Plus', category: 'medicamentos', stock: 8, minStock: 4, price: 28.90, description: 'Vermífugo de amplo espectro para cães', isPerishable: true, expiryDate: '2025-01-14', manufacturingDate: '2024-01-14', status: 'Vencimento Próximo', available: true },
    { id: 6, name: 'Vitamina Pet Tabs', category: 'medicamentos', stock: 0, minStock: 6, price: 35.00, description: 'Complexo vitamínico para pets', isPerishable: true, expiryDate: '2025-03-10', manufacturingDate: '2024-03-10', status: 'Sem Estoque', available: false },
    { id: 7, name: 'Brinquedo Kong Classic', category: 'brinquedos', stock: 20, minStock: 8, price: 32.00, description: 'Brinquedo resistente para cães', isPerishable: false, expiryDate: '2027-01-01', manufacturingDate: '2024-01-01', status: 'Em Estoque', available: true },
    { id: 8, name: 'Bolinha de Tênis', category: 'brinquedos', stock: 5, minStock: 20, price: 8.50, description: 'Bolinha de tênis para cães', isPerishable: false, expiryDate: '2026-01-01', manufacturingDate: '2024-01-01', status: 'Estoque Baixo', available: true },
    { id: 9, name: 'Arranhador para Gatos', category: 'acessorios', stock: 6, minStock: 3, price: 85.00, description: 'Arranhador vertical para gatos', isPerishable: false, expiryDate: '2027-01-01', manufacturingDate: '2024-01-01', status: 'Em Estoque', available: true },
    { id: 10, name: 'Coleira GPS PetTracker', category: 'acessorios', stock: 1, minStock: 2, price: 199.00, description: 'Coleira com GPS para localização em tempo real', isPerishable: false, expiryDate: '2027-01-01', manufacturingDate: '2024-01-01', status: 'Estoque Baixo', available: true },
    { id: 11, name: 'Shampoo Neutro Sanol', category: 'higiene', stock: 22, minStock: 10, price: 18.90, description: 'Shampoo neutro para todos os tipos de pelo', isPerishable: true, expiryDate: '2025-01-15', manufacturingDate: '2024-01-15', status: 'Vencimento Próximo', available: true },
    { id: 12, name: 'Petisco Natural Ossinho', category: 'petiscos', stock: 0, minStock: 15, price: 12.50, description: 'Ossinhos naturais para cães', isPerishable: true, expiryDate: '2024-12-01', manufacturingDate: '2024-06-01', status: 'Vencido', available: false }
  ],

  medico: [
    { id: 1, name: 'Soro Fisiológico 500ml', category: 'medicamentos', stock: 5, minStock: 20, price: 8.90, description: 'Soro fisiológico para uso médico', isPerishable: true, expiryDate: '2025-01-15', manufacturingDate: '2024-01-15', status: 'Estoque Baixo', available: true },
    { id: 2, name: 'Seringa 10ml Descartável', category: 'materiais', stock: 0, minStock: 50, price: 2.50, description: 'Seringa descartável estéril 10ml', isPerishable: false, expiryDate: '2026-12-31', manufacturingDate: '2024-01-01', status: 'Sem Estoque', available: false },
    { id: 3, name: 'Luvas Cirúrgicas P', category: 'materiais', stock: 120, minStock: 100, price: 45.90, description: 'Caixa luvas cirúrgicas estéreis', isPerishable: false, expiryDate: '2027-01-01', manufacturingDate: '2024-01-01', status: 'Em Estoque', available: true },
    { id: 4, name: 'Anestésico Lidocaína', category: 'medicamentos', stock: 8, minStock: 15, price: 28.00, description: 'Anestésico local lidocaína 2%', isPerishable: true, expiryDate: '2025-01-14', manufacturingDate: '2024-01-14', status: 'Vencimento Próximo', available: true },
    { id: 5, name: 'Curativo Estéril 10x10', category: 'materiais', stock: 25, minStock: 30, price: 15.90, description: 'Curativo estéril para ferimentos', isPerishable: false, expiryDate: '2026-06-01', manufacturingDate: '2024-06-01', status: 'Estoque Baixo', available: true },
    { id: 6, name: 'Termômetro Digital', category: 'equipamentos', stock: 3, minStock: 8, price: 89.90, description: 'Termômetro clínico digital preciso', isPerishable: false, expiryDate: '2027-01-01', manufacturingDate: '2024-01-01', status: 'Estoque Baixo', available: true },
    { id: 7, name: 'Estetoscópio Littmann', category: 'equipamentos', stock: 15, minStock: 5, price: 450.00, description: 'Estetoscópio profissional Littmann', isPerishable: false, expiryDate: '2030-01-01', manufacturingDate: '2024-01-01', status: 'Em Estoque', available: true },
    { id: 8, name: 'Antibiótico Amoxicilina', category: 'medicamentos', stock: 0, minStock: 20, price: 25.90, description: 'Antibiótico amoxicilina 500mg', isPerishable: true, expiryDate: '2024-11-30', manufacturingDate: '2023-11-30', status: 'Vencido', available: false },
    { id: 9, name: 'Máscara N95', category: 'materiais', stock: 8, minStock: 50, price: 12.50, description: 'Máscara de proteção N95', isPerishable: false, expiryDate: '2026-01-01', manufacturingDate: '2024-01-01', status: 'Estoque Baixo', available: true },
    { id: 10, name: 'Álcool Gel 70%', category: 'higiene', stock: 45, minStock: 20, price: 8.90, description: 'Álcool gel antisséptico 500ml', isPerishable: true, expiryDate: '2025-06-15', manufacturingDate: '2024-06-15', status: 'Em Estoque', available: true },
    { id: 11, name: 'Gaze Estéril', category: 'materiais', stock: 2, minStock: 25, price: 18.90, description: 'Pacote gaze estéril 7,5x7,5cm', isPerishable: false, expiryDate: '2026-01-01', manufacturingDate: '2024-01-01', status: 'Estoque Baixo', available: true },
    { id: 12, name: 'Dipirona Injetável', category: 'medicamentos', stock: 12, minStock: 10, price: 35.00, description: 'Dipirona para uso injetável', isPerishable: true, expiryDate: '2025-01-16', manufacturingDate: '2024-01-16', status: 'Vencimento Próximo', available: true }
  ],

  vendas: [
    { id: 1, name: 'iPhone 15 Pro 256GB', category: 'eletronicos', stock: 1, minStock: 2, price: 6999.99, description: 'Smartphone Apple iPhone 15 Pro', isPerishable: false, expiryDate: '2027-01-01', manufacturingDate: '2024-01-01', status: 'Estoque Baixo', available: true },
    { id: 2, name: 'Samsung Galaxy S24 Ultra', category: 'eletronicos', stock: 0, minStock: 3, price: 5299.99, description: 'Smartphone Samsung Galaxy S24 Ultra', isPerishable: false, expiryDate: '2027-01-01', manufacturingDate: '2024-01-01', status: 'Sem Estoque', available: false },
    { id: 3, name: 'MacBook Air M3', category: 'eletronicos', stock: 3, minStock: 1, price: 8999.99, description: 'Notebook Apple MacBook Air com chip M3', isPerishable: false, expiryDate: '2027-01-01', manufacturingDate: '2024-01-01', status: 'Em Estoque', available: true },
    { id: 4, name: 'Notebook Dell Inspiron', category: 'eletronicos', stock: 2, minStock: 4, price: 2899.99, description: 'Notebook Dell Inspiron i5 16GB', isPerishable: false, expiryDate: '2027-01-01', manufacturingDate: '2024-01-01', status: 'Estoque Baixo', available: true },
    { id: 5, name: 'Smart TV 65" OLED LG', category: 'eletronicos', stock: 2, minStock: 1, price: 4599.99, description: 'Smart TV OLED 65 polegadas 4K', isPerishable: false, expiryDate: '2027-01-01', manufacturingDate: '2024-01-01', status: 'Em Estoque', available: true },
    { id: 6, name: 'Camiseta Polo Lacoste', category: 'vestuario', stock: 8, minStock: 15, price: 299.99, description: 'Camiseta polo masculina original', isPerishable: false, expiryDate: '2027-01-01', manufacturingDate: '2024-01-01', status: 'Estoque Baixo', available: true },
    { id: 7, name: 'Jeans Premium Diesel', category: 'vestuario', stock: 28, minStock: 12, price: 459.99, description: 'Calça jeans premium masculina', isPerishable: false, expiryDate: '2027-01-01', manufacturingDate: '2024-01-01', status: 'Em Estoque', available: true },
    { id: 8, name: 'Vestido Social Feminino', category: 'vestuario', stock: 5, minStock: 10, price: 189.99, description: 'Vestido social feminino elegante', isPerishable: false, expiryDate: '2027-01-01', manufacturingDate: '2024-01-01', status: 'Estoque Baixo', available: true },
    { id: 9, name: 'Tênis Nike Air Max', category: 'calcados', stock: 15, minStock: 6, price: 599.99, description: 'Tênis Nike Air Max original', isPerishable: false, expiryDate: '2027-01-01', manufacturingDate: '2024-01-01', status: 'Em Estoque', available: true },
    { id: 10, name: 'Sapato Social Couro', category: 'calcados', stock: 4, minStock: 8, price: 389.99, description: 'Sapato social masculino em couro', isPerishable: false, expiryDate: '2027-01-01', manufacturingDate: '2024-01-01', status: 'Estoque Baixo', available: true },
    { id: 11, name: 'Relógio Rolex Submariner', category: 'acessorios', stock: 0, minStock: 1, price: 45999.99, description: 'Relógio de luxo Rolex Submariner', isPerishable: false, expiryDate: '2027-01-01', manufacturingDate: '2024-01-01', status: 'Sem Estoque', available: false },
    { id: 12, name: 'Bolsa Louis Vuitton', category: 'acessorios', stock: 3, minStock: 1, price: 8999.99, description: 'Bolsa feminina Louis Vuitton original', isPerishable: false, expiryDate: '2027-01-01', manufacturingDate: '2024-01-01', status: 'Em Estoque', available: true }
  ],

  // Design e Sites não têm produtos - só portfolios
  design: [],
  sites: []
};

// Sales data for each business profile login
export const categorySales: Record<string, Sale[]> = {
  farmacia: [
    { id: 1, date: '2024-12-26', client: 'Maria Santos', items: ['Dipirona 500mg x2', 'Paracetamol 750mg x1'], total: 50.30, status: 'Concluída', paymentMethod: 'Cartão' },
    { id: 2, date: '2024-12-26', client: 'João Silva', items: ['Amoxicilina 500mg x1', 'Omeprazol 20mg x2'], total: 61.60, status: 'Concluída', paymentMethod: 'PIX' },
    { id: 3, date: '2024-12-25', client: 'Ana Costa', items: ['Vitamina D3 x1', 'Ômega 3 x1'], total: 83.90, status: 'Pendente', paymentMethod: 'Débito' },
    { id: 4, date: '2024-12-25', client: 'Carlos Lima', items: ['Losartana 50mg x3', 'Metformina 850mg x2'], total: 77.70, status: 'Concluída', paymentMethod: 'Dinheiro' },
    { id: 5, date: '2024-12-24', client: 'Fernanda Oliveira', items: ['Ibuprofeno 600mg x2', 'Protetor Solar x1'], total: 82.30, status: 'Concluída', paymentMethod: 'Cartão' }
  ],

  pet: [
    { id: 1, date: '2024-12-26', client: 'Ana Silva', items: ['Ração Premium Golden x1', 'Antipulgas Frontline x1'], total: 135.40, status: 'Concluída', paymentMethod: 'Cartão' },
    { id: 2, date: '2024-12-26', client: 'Carlos Oliveira', items: ['Brinquedo Kong x2', 'Bolinha de Tênis x3'], total: 89.50, status: 'Concluída', paymentMethod: 'PIX' },
    { id: 3, date: '2024-12-25', client: 'Marina Costa', items: ['Ração Royal Canin x1', 'Vitamina Pet Tabs x1'], total: 160.00, status: 'Concluída', paymentMethod: 'Débito' },
    { id: 4, date: '2024-12-25', client: 'Roberto Lima', items: ['Coleira GPS x1'], total: 199.00, status: 'Pendente', paymentMethod: 'Cartão' },
    { id: 5, date: '2024-12-24', client: 'Fernanda Santos', items: ['Shampoo Neutro x2', 'Petisco Ossinho x3'], total: 75.30, status: 'Concluída', paymentMethod: 'Dinheiro' }
  ],

  medico: [
    { id: 1, date: '2024-12-26', client: 'Maria Silva', items: ['Consulta Cardiológica', 'Eletrocardiograma'], total: 340.00, status: 'Concluída', paymentMethod: 'Cartão' },
    { id: 2, date: '2024-12-26', client: 'João Santos', items: ['Exame de Sangue Completo', 'Consulta Clínica Geral'], total: 265.00, status: 'Concluída', paymentMethod: 'PIX' },
    { id: 3, date: '2024-12-25', client: 'Ana Costa', items: ['Ultrassom Abdominal', 'Consulta Ginecológica'], total: 370.00, status: 'Pendente', paymentMethod: 'Convênio' },
    { id: 4, date: '2024-12-25', client: 'Pedro Lima', items: ['Fisioterapia Sessão x3'], total: 285.00, status: 'Concluída', paymentMethod: 'Dinheiro' },
    { id: 5, date: '2024-12-24', client: 'Carlos Oliveira', items: ['Raio-X Tórax', 'Consulta Ortopédica'], total: 295.00, status: 'Concluída', paymentMethod: 'Débito' }
  ],



  vendas: [
    { id: 1, date: '2024-12-26', client: 'Maria Executiva', items: ['iPhone 15 Pro x1', 'Camiseta Polo x2'], total: 7599.97, status: 'Concluída', paymentMethod: 'Cartão' },
    { id: 2, date: '2024-12-26', client: 'Empresa TechCorp', items: ['MacBook Air M3 x5'], total: 44999.95, status: 'Pendente', paymentMethod: 'Transferência' },
    { id: 3, date: '2024-12-25', client: 'Pedro Santos', items: ['Samsung Galaxy S24 x1', 'Tênis Nike x1'], total: 5899.98, status: 'Concluída', paymentMethod: 'PIX' },
    { id: 4, date: '2024-12-25', client: 'Loja Varejo Plus', items: ['Smart TV OLED x2', 'Notebook Dell x3'], total: 17899.95, status: 'Concluída', paymentMethod: 'Boleto' },
    { id: 5, date: '2024-12-24', client: 'Ana Fashion', items: ['Jeans Diesel x3', 'Vestido Social x2'], total: 1759.95, status: 'Concluída', paymentMethod: 'Cartão' }
  ],

  // Design e Sites não têm vendas - só projetos
  design: [],
  sites: []
};

// Clients data for each category
export const categoryClients: Record<string, Client[]> = {
  farmacia: [
    { id: 1, name: 'Maria Santos', email: 'maria.santos@email.com', phone: '(11) 99999-1111', lastOrder: '2024-12-26', totalSpent: 345.80, status: 'Ativo', type: 'Regular', address: 'Rua das Flores, 123' },
    { id: 2, name: 'João Silva', email: 'joao.silva@email.com', phone: '(11) 99999-2222', lastOrder: '2024-12-26', totalSpent: 528.90, status: 'VIP', type: 'Hipertenso', address: 'Av. Central, 456' },
    { id: 3, name: 'Ana Costa', email: 'ana.costa@email.com', phone: '(11) 99999-3333', lastOrder: '2024-12-25', totalSpent: 234.70, status: 'Ativo', type: 'Diabético', address: 'Rua da Saúde, 789' },
    { id: 4, name: 'Carlos Lima', email: 'carlos.lima@email.com', phone: '(11) 99999-4444', lastOrder: '2024-12-25', totalSpent: 456.20, status: 'Ativo', type: 'Cardíaco', address: 'Av. Médica, 321' },
    { id: 5, name: 'Fernanda Oliveira', email: 'fernanda.oliveira@email.com', phone: '(11) 99999-5555', lastOrder: '2024-12-24', totalSpent: 189.50, status: 'Ativo', type: 'Regular', address: 'Rua do Medicamento, 654' }
  ],

  pet: [
    { id: 1, name: 'Ana Silva (Buddy)', email: 'ana.silva@email.com', phone: '(11) 99999-1111', lastOrder: '2024-12-26', totalSpent: 890.50, status: 'Ativo', type: 'Cão', address: 'Rua Pet Friendly, 123' },
    { id: 2, name: 'Carlos Oliveira (Mimi)', email: 'carlos.oliveira@email.com', phone: '(11) 99999-2222', lastOrder: '2024-12-26', totalSpent: 456.80, status: 'Ativo', type: 'Gato', address: 'Av. dos Animais, 456' },
    { id: 3, name: 'Marina Costa (Rex)', email: 'marina.costa@email.com', phone: '(11) 99999-3333', lastOrder: '2024-12-25', totalSpent: 678.90, status: 'VIP', type: 'Cão', address: 'Rua Verde, 789' },
    { id: 4, name: 'Roberto Lima (Bella)', email: 'roberto.lima@email.com', phone: '(11) 99999-4444', lastOrder: '2024-12-25', totalSpent: 234.50, status: 'Ativo', type: 'Cão', address: 'Av. das Palmeiras, 321' },
    { id: 5, name: 'Fernanda Santos (Felix)', email: 'fernanda.santos@email.com', phone: '(11) 99999-5555', lastOrder: '2024-12-24', totalSpent: 345.60, status: 'Ativo', type: 'Gato', address: 'Rua dos Pets, 654' }
  ],

  medico: [
    { id: 1, name: 'Maria Silva', email: 'maria.silva@email.com', phone: '(11) 99999-1111', lastOrder: '2024-12-26', totalSpent: 1680.00, status: 'Ativo', type: 'Paciente', address: 'Rua das Flores, 123' },
    { id: 2, name: 'João Santos', email: 'joao.santos@email.com', phone: '(11) 99999-2222', lastOrder: '2024-12-26', totalSpent: 2450.00, status: 'VIP', type: 'Paciente', address: 'Av. Central, 456' },
    { id: 3, name: 'Ana Costa', email: 'ana.costa@email.com', phone: '(11) 99999-3333', lastOrder: '2024-12-25', totalSpent: 920.00, status: 'Ativo', type: 'Paciente', address: 'Rua da Saúde, 789' },
    { id: 4, name: 'Pedro Lima', email: 'pedro.lima@email.com', phone: '(11) 99999-4444', lastOrder: '2024-12-25', totalSpent: 1340.00, status: 'Ativo', type: 'Paciente', address: 'Av. Médica, 321' },
    { id: 5, name: 'Carlos Oliveira', email: 'carlos.oliveira@email.com', phone: '(11) 99999-5555', lastOrder: '2024-12-24', totalSpent: 1760.00, status: 'VIP', type: 'Paciente', address: 'Rua do Hospital, 654' },
    { id: 6, name: 'Fernanda Santos', email: 'fernanda.santos@email.com', phone: '(11) 99999-6666', lastOrder: '2024-12-23', totalSpent: 580.00, status: 'Ativo', type: 'Paciente', address: 'Av. Bem-Estar, 987' }
  ],



  vendas: [
    { id: 1, name: 'Maria Executiva', email: 'maria.exec@empresa.com', phone: '(11) 99999-8888', lastOrder: '2024-12-26', totalSpent: 45670.00, status: 'VIP', type: 'Executiva', address: 'Av. Empresarial, 1200' },
    { id: 2, name: 'Empresa TechCorp', email: 'compras@techcorp.com', phone: '(11) 5555-1111', lastOrder: '2024-12-26', totalSpent: 156780.00, status: 'VIP', type: 'Corporativo', address: 'Torre Empresarial, 5000' },
    { id: 3, name: 'Pedro Santos', email: 'pedro.santos@email.com', phone: '(11) 99999-9999', lastOrder: '2024-12-25', totalSpent: 12340.00, status: 'Ativo', type: 'Pessoa Física', address: 'Rua Residencial, 678' },
    { id: 4, name: 'Loja Varejo Plus', email: 'vendas@varejoplus.com', phone: '(11) 5555-2222', lastOrder: '2024-12-25', totalSpent: 78950.00, status: 'VIP', type: 'Varejo', address: 'Centro Comercial, 800' },
    { id: 5, name: 'Ana Fashion', email: 'ana.fashion@email.com', phone: '(11) 99999-0000', lastOrder: '2024-12-24', totalSpent: 8760.00, status: 'Ativo', type: 'Pessoa Física', address: 'Av. Moda, 234' }
  ],

  // Design e Sites não têm clientes tradicionais - só contatos de projetos
  design: [],
  sites: []
};

// Appointments for each category
export const categoryAppointments: Record<string, Appointment[]> = {
  farmacia: [
    { id: 1, title: 'Consulta Farmacêutica', client: 'Maria Santos', date: '2024-12-28', time: '09:00', type: 'consulta', status: 'scheduled', service: 'Orientação sobre medicamentos' },
    { id: 2, title: 'Aferição de Pressão', client: 'João Silva', date: '2024-12-29', time: '10:30', type: 'procedimento', status: 'scheduled', service: 'Medição pressão arterial' },
    { id: 3, title: 'Aplicação de Vacina', client: 'Ana Costa', date: '2024-12-30', time: '11:00', type: 'vacina', status: 'confirmed', service: 'Vacina da gripe' },
    { id: 4, title: 'Teste de Glicemia', client: 'Carlos Lima', date: '2025-01-02', time: '08:30', type: 'exame', status: 'scheduled', service: 'Teste rápido glicemia' },
    { id: 5, title: 'Entrega de Medicamentos', client: 'Fernanda Oliveira', date: '2025-01-03', time: '14:00', type: 'entrega', status: 'scheduled', service: 'Entrega domiciliar' }
  ],

  pet: [
    { id: 1, title: 'Consulta Veterinária - Buddy', client: 'Ana Silva', date: '2024-12-28', time: '09:00', type: 'consulta', status: 'scheduled', service: 'Check-up' },
    { id: 2, title: 'Vacinação - Mimi', client: 'Carlos Oliveira', date: '2024-12-29', time: '10:30', type: 'vacina', status: 'scheduled', service: 'Vacina Antirrábica' },
    { id: 3, title: 'Cirurgia - Rex', client: 'Marina Costa', date: '2025-01-02', time: '08:00', type: 'cirurgia', status: 'confirmed', service: 'Castração' },
    { id: 4, title: 'Banho e Tosa - Bella', client: 'Roberto Lima', date: '2025-01-03', time: '14:00', type: 'estetica', status: 'scheduled', service: 'Banho Completo' }
  ],

  medico: [
    { id: 1, title: 'Consulta Cardiológica', client: 'Maria Silva', date: '2024-12-28', time: '08:30', type: 'consulta', status: 'scheduled', service: 'Dr. João Silva - Cardiologia' },
    { id: 2, title: 'Exame de Sangue', client: 'João Santos', date: '2024-12-29', time: '07:00', type: 'exame', status: 'scheduled', service: 'Laboratório - Coleta' },
    { id: 3, title: 'Fisioterapia', client: 'Pedro Lima', date: '2024-12-30', time: '14:00', type: 'terapia', status: 'confirmed', service: 'Sessão de Fisioterapia' },
    { id: 4, title: 'Consulta Pediátrica', client: 'Ana Costa Filho', date: '2025-01-03', time: '15:30', type: 'consulta', status: 'scheduled', service: 'Dra. Maria Santos - Pediatria' },
    { id: 5, title: 'Ultrassom Abdominal', client: 'Carlos Oliveira', date: '2025-01-04', time: '10:00', type: 'exame', status: 'scheduled', service: 'Exame de Imagem' },
    { id: 6, title: 'Psicoterapia', client: 'Fernanda Santos', date: '2025-01-05', time: '16:00', type: 'terapia', status: 'scheduled', service: 'Sessão Individual' }
  ],



  vendas: [
    { id: 1, title: 'Reunião Comercial', client: 'Empresa TechCorp', date: '2024-12-28', time: '10:00', type: 'reuniao', status: 'scheduled', service: 'Proposta Comercial' },
    { id: 2, title: 'Demonstração de Produto', client: 'Maria Executiva', date: '2024-12-30', time: '14:30', type: 'demo', status: 'scheduled', service: 'Apresentação' },
    { id: 3, title: 'Entrega de Mercadoria', client: 'Loja Varejo Plus', date: '2025-01-02', time: '11:00', type: 'entrega', status: 'confirmed', service: 'Logística' },
    { id: 4, title: 'Follow-up de Vendas', client: 'Pedro Santos', date: '2025-01-04', time: '09:30', type: 'followup', status: 'scheduled', service: 'Pós-venda' }
  ],

  // Design e Sites trabalham com briefings e reuniões criativas
  design: [
    { id: 1, title: 'Briefing Logo Empresa', client: 'Startup Tech', date: '2024-12-28', time: '10:00', type: 'briefing', status: 'scheduled', service: 'Criação de Identidade' },
    { id: 2, title: 'Apresentação Campanha', client: 'Loja Fashion', date: '2024-12-30', time: '14:00', type: 'apresentacao', status: 'scheduled', service: 'Material Publicitário' },
    { id: 3, title: 'Revisão de Arte', client: 'Restaurante Gourmet', date: '2025-01-02', time: '09:00', type: 'revisao', status: 'confirmed', service: 'Cardápio e Identidade' },
    { id: 4, title: 'Brainstorming Criativo', client: 'Agência de Eventos', date: '2025-01-04', time: '15:30', type: 'brainstorming', status: 'scheduled', service: 'Conceito Visual' }
  ],
  sites: [
    { id: 1, title: 'Reunião Kickoff Site', client: 'Clínica Médica', date: '2024-12-28', time: '11:00', type: 'kickoff', status: 'scheduled', service: 'Desenvolvimento Web' },
    { id: 2, title: 'Demo Protótipo', client: 'E-commerce Fashion', date: '2024-12-30', time: '16:00', type: 'demo', status: 'scheduled', service: 'Loja Virtual' },
    { id: 3, title: 'Homologação Final', client: 'Consultoria Jurídica', date: '2025-01-02', time: '10:30', type: 'homologacao', status: 'confirmed', service: 'Site Institucional' },
    { id: 4, title: 'Treinamento CMS', client: 'Imobiliária Premium', date: '2025-01-05', time: '14:00', type: 'treinamento', status: 'scheduled', service: 'Portal Imobiliário' }
  ]
};

// Specialists for each category
export const categorySpecialists: Record<string, Specialist[]> = {
  farmacia: [
    { id: 1, name: 'Dr. Fernando Silva', specialty: 'Farmacêutico Clínico', phone: '(11) 99999-0001', email: 'fernando@farmaciacentral.com', schedule: 'Seg-Sex: 8h às 18h', description: 'Especialista em farmácia clínica e atenção farmacêutica', available: true, rating: 4.8, experience: '15 anos' },
    { id: 2, name: 'Dra. Ana Paula', specialty: 'Farmacêutica Hospitalar', phone: '(11) 99999-0002', email: 'ana.paula@farmaciacentral.com', schedule: 'Seg-Sáb: 7h às 19h', description: 'Especialista em medicamentos hospitalares e oncológicos', available: true, rating: 4.9, experience: '12 anos' },
    { id: 3, name: 'Dr. Carlos Medicinal', specialty: 'Fitoterapia', phone: '(11) 99999-0003', email: 'carlos@farmaciacentral.com', schedule: 'Ter-Sáb: 9h às 17h', description: 'Especialista em plantas medicinais e produtos naturais', available: true, rating: 4.7, experience: '10 anos' },
    { id: 4, name: 'Dra. Marina Santos', specialty: 'Cosmetologia', phone: '(11) 99999-0004', email: 'marina@farmaciacentral.com', schedule: 'Qua-Dom: 10h às 18h', description: 'Especialista em dermocosméticos e cuidados com a pele', available: true, rating: 4.6, experience: '8 anos' }
  ],
  medico: [
    { id: 1, name: 'Dr. João Silva', specialty: 'Cardiologia', phone: '(11) 99999-1111', email: 'joao@clinica.com', schedule: 'Seg-Sex: 8h às 18h', description: 'Especialista em cardiologia com 15 anos de experiência', available: true, rating: 4.9, experience: '15 anos' },
    { id: 2, name: 'Dra. Maria Santos', specialty: 'Pediatria', phone: '(11) 99999-2222', email: 'maria@clinica.com', schedule: 'Seg-Sex: 9h às 17h', description: 'Pediatra especializada em desenvolvimento infantil', available: true, rating: 4.8, experience: '12 anos' },
    { id: 3, name: 'Dr. Carlos Oliveira', specialty: 'Ortopedia', phone: '(11) 99999-3333', email: 'carlos@clinica.com', schedule: 'Ter-Sáb: 8h às 16h', description: 'Ortopedista com foco em medicina esportiva', available: true, rating: 4.7, experience: '18 anos' },
    { id: 4, name: 'Dra. Ana Costa', specialty: 'Ginecologia', phone: '(11) 99999-4444', email: 'ana@clinica.com', schedule: 'Seg-Sex: 7h às 15h', description: 'Ginecologista especializada em saúde da mulher', available: true, rating: 4.9, experience: '20 anos' }
  ],

  pet: [
    { id: 1, name: 'Dr. Pedro Costa', specialty: 'Clínica Geral', phone: '(11) 99999-4444', email: 'pedro@vetpet.com', schedule: 'Seg-Sex: 8h às 18h', description: 'Veterinário clínico geral com experiência em felinos', available: true, rating: 4.8, experience: '10 anos' },
    { id: 2, name: 'Dra. Ana Lima', specialty: 'Cirurgia', phone: '(11) 99999-5555', email: 'ana@vetpet.com', schedule: 'Seg-Sex: 7h às 15h', description: 'Especialista em cirurgias de pequenos animais', available: true, rating: 4.9, experience: '14 anos' },
    { id: 3, name: 'Dr. Ricardo Ferreira', specialty: 'Dermatologia', phone: '(11) 99999-6666', email: 'ricardo@vetpet.com', schedule: 'Qua-Dom: 9h às 17h', description: 'Dermatologista veterinário especializado em alergias', available: true, rating: 4.7, experience: '8 anos' },
    { id: 4, name: 'Dra. Carla Mendes', specialty: 'Exóticos', phone: '(11) 99999-7777', email: 'carla@vetpet.com', schedule: 'Ter-Sáb: 10h às 18h', description: 'Especialista em animais silvestres e exóticos', available: true, rating: 4.6, experience: '12 anos' }
  ],

  // Perfis de vendas usam equipe comercial
  vendas: [
    { id: 1, name: 'João Vendedor', specialty: 'Consultor Comercial', phone: '(11) 99999-9001', email: 'joao@comercialtech.com', schedule: 'Seg-Sex: 8h às 18h', description: 'Especialista em eletrônicos e dispositivos móveis', available: true, rating: 4.8, experience: '8 anos' },
    { id: 2, name: 'Maria Consultora', specialty: 'Account Manager', phone: '(11) 99999-9002', email: 'maria@comercialtech.com', schedule: 'Seg-Sex: 9h às 17h', description: 'Gestora de contas corporativas e grandes empresas', available: true, rating: 4.9, experience: '12 anos' },
    { id: 3, name: 'Pedro Técnico', specialty: 'Suporte Técnico', phone: '(11) 99999-9003', email: 'pedro@comercialtech.com', schedule: 'Ter-Sáb: 8h às 16h', description: 'Especialista em suporte e instalação de produtos', available: true, rating: 4.7, experience: '10 anos' },
    { id: 4, name: 'Ana Varejo', specialty: 'Consultora de Moda', phone: '(11) 99999-9004', email: 'ana@comercialtech.com', schedule: 'Qua-Dom: 10h às 18h', description: 'Especialista em moda e acessórios', available: true, rating: 4.6, experience: '6 anos' }
  ],

  // Design e Sites trabalham com freelancers criativos
  design: [
    { id: 1, name: 'Maria Designer', specialty: 'Design Gráfico', phone: '(11) 99999-8001', email: 'maria@agenciacreative.com', schedule: 'Seg-Sex: 9h às 18h', description: 'Especialista em identidade visual e branding', available: true, rating: 4.9, experience: '10 anos' },
    { id: 2, name: 'Carlos Criativo', specialty: 'Direção de Arte', phone: '(11) 99999-8002', email: 'carlos@agenciacreative.com', schedule: 'Ter-Sáb: 10h às 19h', description: 'Diretor de arte especializado em campanhas publicitárias', available: true, rating: 4.8, experience: '15 anos' },
    { id: 3, name: 'Ana Ilustradora', specialty: 'Ilustração', phone: '(11) 99999-8003', email: 'ana@agenciacreative.com', schedule: 'Seg-Sex: 8h às 16h', description: 'Ilustradora digital e tradicional', available: true, rating: 4.7, experience: '8 anos' },
    { id: 4, name: 'Roberto Motion', specialty: 'Motion Graphics', phone: '(11) 99999-8004', email: 'roberto@agenciacreative.com', schedule: 'Qua-Dom: 11h às 20h', description: 'Especialista em animação e motion graphics', available: true, rating: 4.6, experience: '7 anos' }
  ],

  sites: [
    { id: 1, name: 'Pedro Desenvolvedor', specialty: 'Full Stack Developer', phone: '(11) 99999-7001', email: 'pedro@webagency.com', schedule: 'Seg-Sex: 9h às 18h', description: 'Desenvolvedor full-stack especializado em React e Node.js', available: true, rating: 4.9, experience: '12 anos' },
    { id: 2, name: 'Carla Frontend', specialty: 'Frontend Developer', phone: '(11) 99999-7002', email: 'carla@webagency.com', schedule: 'Ter-Sáb: 8h às 17h', description: 'Especialista em interfaces modernas e responsivas', available: true, rating: 4.8, experience: '8 anos' },
    { id: 3, name: 'Lucas Backend', specialty: 'Backend Developer', phone: '(11) 99999-7003', email: 'lucas@webagency.com', schedule: 'Seg-Sex: 10h às 19h', description: 'Especialista em APIs e infraestrutura de backend', available: true, rating: 4.7, experience: '10 anos' },
    { id: 4, name: 'Julia UX/UI', specialty: 'UX/UI Designer', phone: '(11) 99999-7004', email: 'julia@webagency.com', schedule: 'Qua-Dom: 9h às 18h', description: 'Designer de experiência e interface do usuário', available: true, rating: 4.8, experience: '9 anos' }
  ]
};

// WhatsApp conversations for each category
export const categoryWhatsAppConversations: Record<string, WhatsAppConversation[]> = {
  farmacia: [
    { id: 1, name: 'Maria Santos', lastMessage: 'Oi, vocês têm dipirona em estoque?', time: '16:30', unread: 2, status: 'online', category: 'farmacia' },
    { id: 2, name: 'João Silva', lastMessage: 'Preciso renovar minha receita de losartana', time: '15:45', unread: 1, status: 'offline', category: 'farmacia' },
    { id: 3, name: 'Ana Costa', lastMessage: 'Qual o valor da vitamina D3?', time: '14:20', unread: 0, status: 'away', category: 'farmacia' },
    { id: 4, name: 'Carlos Lima', lastMessage: 'Podem entregar os medicamentos em casa?', time: '13:10', unread: 0, status: 'online', category: 'farmacia' },
    { id: 5, name: 'Fernanda Oliveira', lastMessage: 'Obrigada pela orientação sobre o medicamento!', time: '12:30', unread: 0, status: 'offline', category: 'farmacia' }
  ],

  pet: [
    { id: 1, name: 'Ana Silva', lastMessage: 'Meu cachorro está com alergia, podem ajudar?', time: '15:20', unread: 3, status: 'online', category: 'pet' },
    { id: 2, name: 'Carlos Oliveira', lastMessage: 'Preciso agendar banho e tosa', time: '14:10', unread: 1, status: 'offline', category: 'pet' },
    { id: 3, name: 'Marina Costa', lastMessage: 'Vocês têm ração para filhotes?', time: '13:30', unread: 0, status: 'away', category: 'pet' },
    { id: 4, name: 'Roberto Lima', lastMessage: 'Quando sai o resultado do exame?', time: '12:45', unread: 0, status: 'online', category: 'pet' }
  ],

  medico: [
    { id: 1, name: 'Maria Silva', lastMessage: 'Doutor, posso remarcar minha consulta?', time: '16:00', unread: 2, status: 'online', category: 'medico' },
    { id: 2, name: 'João Santos', lastMessage: 'Resultado do exame já saiu?', time: '15:30', unread: 1, status: 'offline', category: 'medico' },
    { id: 3, name: 'Ana Costa', lastMessage: 'Obrigada pelo atendimento, me sinto melhor', time: '14:45', unread: 0, status: 'away', category: 'medico' },
    { id: 4, name: 'Pedro Lima', lastMessage: 'Fisioterapia está me ajudando muito!', time: '13:20', unread: 0, status: 'offline', category: 'medico' },
    { id: 5, name: 'Carlos Oliveira', lastMessage: 'Preciso agendar retorno da cirurgia', time: '12:15', unread: 1, status: 'online', category: 'medico' }
  ],



  vendas: [
    { id: 1, name: 'Maria Executiva', lastMessage: 'Interesse no iPhone 15 Pro, qual o melhor preço?', time: '16:15', unread: 3, status: 'online', category: 'vendas' },
    { id: 2, name: 'Empresa TechCorp', lastMessage: 'Podem enviar proposta para 50 notebooks?', time: '15:40', unread: 2, status: 'offline', category: 'vendas' },
    { id: 3, name: 'Pedro Santos', lastMessage: 'Tênis Nike ainda está disponível?', time: '14:25', unread: 0, status: 'away', category: 'vendas' },
    { id: 4, name: 'Loja Varejo Plus', lastMessage: 'Entrega realizada com sucesso!', time: '13:50', unread: 0, status: 'online', category: 'vendas' }
  ],

  // Design e Sites usam comunicação profissional para projetos
  design: [
    { id: 1, name: 'Startup Tech', lastMessage: 'Logo ficou perfeita! Quando podemos ver o manual?', time: '16:10', unread: 2, status: 'online', category: 'design' },
    { id: 2, name: 'Loja Fashion', lastMessage: 'Precisamos acelerar a campanha de verão', time: '15:25', unread: 1, status: 'offline', category: 'design' },
    { id: 3, name: 'Restaurante Gourmet', lastMessage: 'Cardápio aprovado, vamos imprimir!', time: '14:40', unread: 0, status: 'away', category: 'design' },
    { id: 4, name: 'Agência de Eventos', lastMessage: 'Conceitual visual surpreendeu o cliente', time: '13:55', unread: 0, status: 'online', category: 'design' }
  ],

  sites: [
    { id: 1, name: 'Clínica Médica', lastMessage: 'Site responsivo ficou excelente!', time: '16:05', unread: 3, status: 'online', category: 'sites' },
    { id: 2, name: 'E-commerce Fashion', lastMessage: 'Checkout está funcionando perfeitamente', time: '15:30', unread: 1, status: 'offline', category: 'sites' },
    { id: 3, name: 'Consultoria Jurídica', lastMessage: 'Portal foi ao ar sem problemas', time: '14:15', unread: 0, status: 'away', category: 'sites' },
    { id: 4, name: 'Imobiliária Premium', lastMessage: 'CMS está muito intuitivo, obrigado!', time: '13:45', unread: 0, status: 'online', category: 'sites' }
  ]
};

// Activity logs for each category
export const categoryActivities: Record<string, Activity[]> = {
  farmacia: [
    { id: 1, timestamp: new Date('2024-12-26T16:30:00'), type: 'sale', action: 'Venda Realizada', description: 'Maria Santos - Dipirona e Paracetamol R$ 50,30', category: 'farmacia', status: 'success', user: 'Sistema' },
    { id: 2, timestamp: new Date('2024-12-26T15:45:00'), type: 'consultation', action: 'Consulta Farmacêutica', description: 'João Silva - orientação sobre hipertensão', category: 'farmacia', status: 'success', user: 'Dr. Fernando Farmacêutico' },
    { id: 3, timestamp: new Date('2024-12-26T14:20:00'), type: 'stock', action: 'Reposição de Estoque', description: 'Vitamina D3 - recebimento de 100 unidades', category: 'farmacia', status: 'success', user: 'Sistema' },
    { id: 4, timestamp: new Date('2024-12-26T13:10:00'), type: 'delivery', action: 'Entrega Agendada', description: 'Carlos Lima - medicamentos para entrega domiciliar', category: 'farmacia', status: 'success', user: 'Sistema' },
    { id: 5, timestamp: new Date('2024-12-26T12:30:00'), type: 'prescription', action: 'Receita Validada', description: 'Fernanda Oliveira - receita de antibiótico aprovada', category: 'farmacia', status: 'success', user: 'Dr. Fernando Farmacêutico' }
  ],

  pet: [
    { id: 1, timestamp: new Date('2024-12-26T15:20:00'), type: 'appointment', action: 'Consulta Agendada', description: 'Consulta veterinária para Buddy - 28/12', category: 'pet', status: 'success', user: 'Ana Silva' },
    { id: 2, timestamp: new Date('2024-12-26T14:10:00'), type: 'service', action: 'Banho e Tosa', description: 'Serviço realizado para Mimi', category: 'pet', status: 'success', user: 'Carlos Oliveira' },
    { id: 3, timestamp: new Date('2024-12-26T13:30:00'), type: 'sale', action: 'Venda Realizada', description: 'Ração Premium Golden - R$ 89,90', category: 'pet', status: 'success', user: 'Sistema' },
    { id: 4, timestamp: new Date('2024-12-26T12:45:00'), type: 'exam', action: 'Exame Concluído', description: 'Resultado do exame de sangue disponível', category: 'pet', status: 'success', user: 'Dr. Pedro Costa' }
  ],

  medico: [
    { id: 1, timestamp: new Date('2024-12-26T16:00:00'), type: 'appointment', action: 'Consulta Agendada', description: 'Maria Silva agendou consulta cardiológica para 28/12', category: 'medico', status: 'success', user: 'Maria Silva' },
    { id: 2, timestamp: new Date('2024-12-26T15:30:00'), type: 'exam', action: 'Resultado Liberado', description: 'Exame de sangue de João Santos disponível', category: 'medico', status: 'success', user: 'Laboratório' },
    { id: 3, timestamp: new Date('2024-12-26T14:45:00'), type: 'consultation', action: 'Consulta Realizada', description: 'Ana Costa - consulta ginecológica concluída', category: 'medico', status: 'success', user: 'Dra. Maria Santos' },
    { id: 4, timestamp: new Date('2024-12-26T13:20:00'), type: 'payment', action: 'Pagamento Recebido', description: 'Pedro Lima - fisioterapia R$ 285,00', category: 'medico', status: 'success', user: 'Sistema' },
    { id: 5, timestamp: new Date('2024-12-26T12:15:00'), type: 'prescription', action: 'Receita Emitida', description: 'Receita médica emitida para Carlos Oliveira', category: 'medico', status: 'success', user: 'Dr. João Silva' }
  ],



  vendas: [
    { id: 1, timestamp: new Date('2024-12-26T16:15:00'), type: 'inquiry', action: 'Consulta de Preço', description: 'Maria Executiva interessada em iPhone 15 Pro', category: 'vendas', status: 'success', user: 'Maria Executiva' },
    { id: 2, timestamp: new Date('2024-12-26T15:40:00'), type: 'proposal', action: 'Proposta Solicitada', description: 'TechCorp - 50 notebooks corporativos', category: 'vendas', status: 'warning', user: 'Empresa TechCorp' },
    { id: 3, timestamp: new Date('2024-12-26T14:25:00'), type: 'availability', action: 'Consulta Disponibilidade', description: 'Pedro Santos verificou tênis Nike', category: 'vendas', status: 'info', user: 'Pedro Santos' },
    { id: 4, timestamp: new Date('2024-12-26T13:50:00'), type: 'delivery', action: 'Entrega Confirmada', description: 'Loja Varejo Plus recebeu mercadorias', category: 'vendas', status: 'success', user: 'Loja Varejo Plus' }
  ],

  // Design foca em projetos criativos e aprovações
  design: [
    { id: 1, timestamp: new Date('2024-12-26T16:10:00'), type: 'approval', action: 'Arte Aprovada', description: 'Startup Tech aprovou logo final', category: 'design', status: 'success', user: 'Startup Tech' },
    { id: 2, timestamp: new Date('2024-12-26T15:25:00'), type: 'briefing', action: 'Briefing Recebido', description: 'Loja Fashion solicitou campanha verão', category: 'design', status: 'warning', user: 'Loja Fashion' },
    { id: 3, timestamp: new Date('2024-12-26T14:40:00'), type: 'delivery', action: 'Material Entregue', description: 'Cardápio do Restaurante Gourmet finalizado', category: 'design', status: 'success', user: 'Maria Designer' },
    { id: 4, timestamp: new Date('2024-12-26T13:55:00'), type: 'revision', action: 'Revisão Solicitada', description: 'Agência de Eventos pediu ajustes no conceito', category: 'design', status: 'info', user: 'Agência de Eventos' }
  ],

  // Sites foca em desenvolvimento e lançamentos
  sites: [
    { id: 1, timestamp: new Date('2024-12-26T16:05:00'), type: 'launch', action: 'Site No Ar', description: 'Portal da Clínica Médica foi ao ar', category: 'sites', status: 'success', user: 'Pedro Desenvolvedor' },
    { id: 2, timestamp: new Date('2024-12-26T15:30:00'), type: 'testing', action: 'Teste Aprovado', description: 'E-commerce Fashion passou em homologação', category: 'sites', status: 'success', user: 'Carla Frontend' },
    { id: 3, timestamp: new Date('2024-12-26T14:15:00'), type: 'deployment', action: 'Deploy Realizado', description: 'Site da Consultoria Jurídica atualizado', category: 'sites', status: 'success', user: 'Lucas Backend' },
    { id: 4, timestamp: new Date('2024-12-26T13:45:00'), type: 'training', action: 'Treinamento CMS', description: 'Imobiliária Premium capacitada no sistema', category: 'sites', status: 'success', user: 'Julia UX/UI' }
  ]
};

// Design and Sites portfolio data (special case)
export const designPortfolio = [
  { id: 1, title: 'Identidade Visual - Café Premium', description: 'Desenvolvimento completo da marca para cafeteria de alta qualidade', category: 'branding', imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400', projectUrl: 'https://portfolio.exemplo.com/cafe-premium', available: true },
  { id: 2, title: 'Material Gráfico - Clínica Excellence', description: 'Criação de cartões, folders e banners para clínica médica', category: 'impressos', imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400', projectUrl: 'https://portfolio.exemplo.com/clinica-excellence', available: true },
  { id: 3, title: 'Campanha Digital - Tech Innovations', description: 'Posts e stories para empresa de tecnologia', category: 'digital', imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400', projectUrl: 'https://portfolio.exemplo.com/tech-innovations', available: true },
  { id: 4, title: 'Branding Completo - EcoFashion', description: 'Identidade visual para marca de moda sustentável', category: 'branding', imageUrl: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400', projectUrl: 'https://portfolio.exemplo.com/eco-fashion', available: true }
];

export const sitesPortfolio = [
  { id: 1, title: 'E-commerce Premium - Loja Fashion', description: 'Loja virtual completa com sistema de pagamento integrado', category: 'loja-virtual', imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400', projectUrl: 'https://lojafashion.exemplo.com', available: true },
  { id: 2, title: 'Site Institucional - Advocacia Silva', description: 'Website profissional com blog e formulário de contato', category: 'website', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', projectUrl: 'https://advocaciasilva.exemplo.com', available: true },
  { id: 3, title: 'Landing Page - Curso Marketing', description: 'Página de conversão otimizada para curso online', category: 'conversao', imageUrl: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400', projectUrl: 'https://cursomarketing.exemplo.com', available: true },
  { id: 4, title: 'Sistema Web - Gestão Hospitalar', description: 'Sistema completo para gestão de clínica médica', category: 'sistema', imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400', projectUrl: 'https://gestaohospitalar.exemplo.com', available: true }
];

// Helper functions to get data by category
export const getProductsByCategory = (category: string, userId?: number): Product[] => {
  return categoryProducts[category] || [];
};

export const getSalesByCategory = (category: string, userId?: number): Sale[] => {
  return categorySales[category] || [];
};

export const getClientsByCategory = (category: string, userId?: number): Client[] => {
  return categoryClients[category] || [];
};

export const getAppointmentsByCategory = (category: string): Appointment[] => {
  return categoryAppointments[category] || [];
};

export const getSpecialistsByCategory = (category: string): Specialist[] => {
  return categorySpecialists[category] || [];
};

export const getWhatsAppConversationsByCategory = (category: string, userId?: number): WhatsAppConversation[] => {
  return categoryWhatsAppConversations[category] || [];
};

export const getActivitiesByCategory = (category: string, userId?: number): Activity[] => {
  return categoryActivities[category] || [];
};

// Export default data structure
export default {
  categoryProducts,
  categorySales,
  categoryClients,
  categoryAppointments,
  categorySpecialists,
  categoryWhatsAppConversations,
  categoryActivities,
  designPortfolio,
  sitesPortfolio
};